import { Request, Response } from 'express';
import { inventoryService } from './inventory.service';
import { sendSuccess } from '../../shared/http/response';

export class InventoryController {
  async adjustInventory(req: Request, res: Response) {
    const updatedProduct = await inventoryService.adjustInventory(req.body);
    return sendSuccess(res, updatedProduct);
  }
}

export const inventoryController = new InventoryController();
