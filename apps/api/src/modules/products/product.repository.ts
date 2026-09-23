import { ProductModel, IProductDocument } from './product.model';
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from '@customry/contracts';

export class ProductRepository {
  async findById(id: string): Promise<IProductDocument | null> {
    return ProductModel.findById(id);
  }

  async findBySlug(slug: string): Promise<IProductDocument | null> {
    return ProductModel.findOne({ slug });
  }

  async findMany(query: ProductQueryInput) {
    const { page, limit, search, categoryCode, status, stockStatus, sort } = query;
    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    } else {
      filter.status = { $ne: 'ARCHIVED' };
    }

    if (categoryCode) {
      filter.categoryCode = categoryCode;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    if (stockStatus === 'IN_STOCK') {
      filter.stock = { $gt: 5 };
    } else if (stockStatus === 'LOW_STOCK') {
      filter.stock = { $gt: 0, $lte: 5 };
    } else if (stockStatus === 'OUT_OF_STOCK') {
      filter.stock = 0;
    }

    const sortOption: Record<string, 1 | -1> = {};
    if (sort === 'price_asc') {
      sortOption.basePrice = 1;
    } else if (sort === 'price_desc') {
      sortOption.basePrice = -1;
    } else if (sort === 'name') {
      sortOption.name = 1;
    } else {
      sortOption.createdAt = -1;
    }

    const total = await ProductModel.countDocuments(filter);
    const data = await ProductModel.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async create(data: CreateProductInput): Promise<IProductDocument> {
    const variantsWithId = data.variants.map((v, i) => ({
      ...v,
      id: `var_${Date.now()}_${i}`,
      options: v.options || {},
    }));

    return ProductModel.create({
      ...data,
      variants: variantsWithId,
    });
  }

  async update(id: string, data: UpdateProductInput): Promise<IProductDocument | null> {
    const updateData: Record<string, unknown> = { ...data };

    if (data.variants) {
      updateData.variants = data.variants.map((v, i) => ({
        ...v,
        id: (v as any).id || `var_${Date.now()}_${i}`,
        options: v.options || {},
      }));
    }

    return ProductModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async updateStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'): Promise<IProductDocument | null> {
    return ProductModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async updateStock(id: string, variantId: string | undefined, delta: number): Promise<IProductDocument | null> {
    if (variantId) {
      return ProductModel.findOneAndUpdate(
        { _id: id, 'variants.id': variantId },
        {
          $inc: {
            stock: delta,
            'variants.$.stock': delta,
          },
        },
        { new: true }
      );
    }

    return ProductModel.findByIdAndUpdate(
      id,
      { $inc: { stock: delta } },
      { new: true }
    );
  }
}

export const productRepository = new ProductRepository();
