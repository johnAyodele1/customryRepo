import { CategoryModel, ICategoryDocument } from './category.model';
import { CreateCategoryInput, UpdateCategoryInput, CategoryCode } from '@customry/contracts';

export class CategoryRepository {
  async findAll(): Promise<ICategoryDocument[]> {
    return CategoryModel.find({ isActive: true }).sort({ order: 1, name: 1 });
  }

  async findAllAdmin(): Promise<ICategoryDocument[]> {
    return CategoryModel.find().sort({ order: 1, name: 1 });
  }

  async findByCode(code: CategoryCode): Promise<ICategoryDocument | null> {
    return CategoryModel.findOne({ code });
  }

  async findBySlug(slug: string): Promise<ICategoryDocument | null> {
    return CategoryModel.findOne({ slug });
  }

  async create(data: CreateCategoryInput): Promise<ICategoryDocument> {
    return CategoryModel.create(data);
  }

  async update(id: string, data: UpdateCategoryInput): Promise<ICategoryDocument | null> {
    return CategoryModel.findByIdAndUpdate(id, data, { new: true });
  }
}

export const categoryRepository = new CategoryRepository();
