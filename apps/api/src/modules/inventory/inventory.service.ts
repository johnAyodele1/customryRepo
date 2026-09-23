import { productRepository } from '../products/product.repository';
import { InsufficientStockError, NotFoundError } from '../../shared/errors';
import { AdjustInventoryInput } from '@customry/contracts';

export class InventoryService {
  async adjustInventory(input: AdjustInventoryInput) {
    const product = await productRepository.findById(input.productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (input.variantId) {
      const variant = product.variants.find((v) => v.id === input.variantId);
      if (!variant) {
        throw new NotFoundError('Product variant not found');
      }

      if (variant.stock + input.quantityDelta < 0) {
        throw new InsufficientStockError(
          `Cannot reduce stock below zero. Current variant stock is ${variant.stock}`
        );
      }
    } else {
      if (product.stock + input.quantityDelta < 0) {
        throw new InsufficientStockError(
          `Cannot reduce stock below zero. Current product stock is ${product.stock}`
        );
      }
    }

    const updated = await productRepository.updateStock(
      input.productId,
      input.variantId,
      input.quantityDelta
    );

    return updated;
  }

  async verifyAndReserveStock(
    items: { productId: string; variantId?: string; quantity: number }[]
  ) {
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product || product.status !== 'PUBLISHED') {
        throw new NotFoundError(`Product ${item.productId} is unavailable`);
      }

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant || !variant.isActive) {
          throw new NotFoundError(`Selected variant is unavailable`);
        }
        if (variant.stock < item.quantity) {
          throw new InsufficientStockError(
            `Insufficient stock for '${product.name} (${variant.name})'. Available: ${variant.stock}, Requested: ${item.quantity}`
          );
        }
      } else {
        if (product.stock < item.quantity) {
          throw new InsufficientStockError(
            `Insufficient stock for '${product.name}'. Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }
      }
    }
  }

  async decrementStock(
    items: { productId: string; variantId?: string; quantity: number }[]
  ) {
    for (const item of items) {
      await productRepository.updateStock(
        item.productId,
        item.variantId,
        -item.quantity
      );
    }
  }
}

export const inventoryService = new InventoryService();
