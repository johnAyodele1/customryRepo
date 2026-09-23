import { categoryRepository } from './category.repository';
import { CreateCategoryInput, UpdateCategoryInput, CategoryCode } from '@customry/contracts';
import { ConflictError, NotFoundError } from '../../shared/errors';

export class CategoryService {
  async getAllCategories(admin = false) {
    if (admin) {
      return categoryRepository.findAllAdmin();
    }
    return categoryRepository.findAll();
  }

  async getCategoryByCode(code: CategoryCode) {
    const category = await categoryRepository.findByCode(code);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }

  async createCategory(data: CreateCategoryInput) {
    const existing = await categoryRepository.findByCode(data.code);
    if (existing) {
      throw new ConflictError('Category code already exists');
    }
    return categoryRepository.create(data);
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    const category = await categoryRepository.update(id, data);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }
}

export const categoryService = new CategoryService();
