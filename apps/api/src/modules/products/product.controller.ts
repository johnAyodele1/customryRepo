import { Request, Response } from 'express';
import { productService } from './product.service';
import { sendSuccess } from '../../shared/http/response';

export class ProductController {
  async getProducts(req: Request, res: Response) {
    const result = await productService.getProducts(req.query as any);
    return sendSuccess(res, result.data, 200, result.pagination);
  }

  async getFeaturedProducts(req: Request, res: Response) {
    const products = await productService.getFeaturedProducts(req.query as any);
    return sendSuccess(res, products);
  }

  async setFeatured(req: Request, res: Response) {
    const product = await productService.setFeatured(req.params.id, Boolean(req.body.isFeatured));
    return sendSuccess(res, product);
  }

  async getProductBySlug(req: Request, res: Response) {
    const product = await productService.getProductBySlug(req.params.slug);
    return sendSuccess(res, product);
  }

  async getProductById(req: Request, res: Response) {
    const product = await productService.getProductById(req.params.id);
    return sendSuccess(res, product);
  }

  async createProduct(req: Request, res: Response) {
    const product = await productService.createProduct(req.body);
    return sendSuccess(res, product, 201);
  }

  async updateProduct(req: Request, res: Response) {
    const product = await productService.updateProduct(req.params.id, req.body);
    return sendSuccess(res, product);
  }

  async publishProduct(req: Request, res: Response) {
    const product = await productService.publishProduct(req.params.id);
    return sendSuccess(res, product);
  }

  async archiveProduct(req: Request, res: Response) {
    const product = await productService.archiveProduct(req.params.id);
    return sendSuccess(res, product);
  }
}

export const productController = new ProductController();
