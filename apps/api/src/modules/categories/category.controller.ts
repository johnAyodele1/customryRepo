import { Request, Response } from 'express';
import { categoryService } from './category.service';
import { sendSuccess } from '../../shared/http/response';
import { CategoryCode } from '@customry/contracts';

export class CategoryController {
  async getAll(req: Request, res: Response) {
    const admin = req.query.admin === 'true';
    const categories = await categoryService.getAllCategories(admin);
    return sendSuccess(res, categories);
  }

  async getByCode(req: Request, res: Response) {
    const code = req.params.code as CategoryCode;
    const category = await categoryService.getCategoryByCode(code);
    return sendSuccess(res, category);
  }

  async create(req: Request, res: Response) {
    const category = await categoryService.createCategory(req.body);
    return sendSuccess(res, category, 201);
  }

  async update(req: Request, res: Response) {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return sendSuccess(res, category);
  }
}

export const categoryController = new CategoryController();
