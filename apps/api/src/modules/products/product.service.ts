import { productRepository } from './product.repository';
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from '@customry/contracts';
import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors';

export class ProductService {
  async getProducts(query: ProductQueryInput) {
    return productRepository.findMany(query);
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  async createProduct(data: CreateProductInput) {
    const existing = await productRepository.findBySlug(data.slug);
    if (existing) {
      throw new ConflictError('Product with this slug already exists');
    }

    let totalStock = data.stock;
    if (data.variants && data.variants.length > 0) {
      totalStock = data.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
    }

    return productRepository.create({
      ...data,
      stock: totalStock,
    });
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (data.slug && data.slug !== product.slug) {
      const existing = await productRepository.findBySlug(data.slug);
      if (existing) {
        throw new ConflictError('Product with this slug already exists');
      }
    }

    return productRepository.update(id, data);
  }

  async publishProduct(id: string) {
    const product = await productRepository.updateStatus(id, 'PUBLISHED');
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  async archiveProduct(id: string) {
    const product = await productRepository.updateStatus(id, 'ARCHIVED');
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  validateCustomization(
    product: any,
    customization: Record<string, string>
  ) {
    if (!product.customizationFields || product.customizationFields.length === 0) {
      return;
    }

    for (const field of product.customizationFields) {
      const val = customization[field.key];

      if (field.required && (!val || val.trim() === '')) {
        throw new ValidationError(`Customization field '${field.label}' is required`);
      }

      if (val && field.maxLength && val.length > field.maxLength) {
        throw new ValidationError(
          `Customization field '${field.label}' exceeds maximum length of ${field.maxLength} characters`
        );
      }

      if (val && field.options && field.options.length > 0) {
        if (!field.options.includes(val)) {
          throw new ValidationError(
            `Invalid option '${val}' for customization field '${field.label}'`
          );
        }
      }
    }
  }
}

export const productService = new ProductService();
