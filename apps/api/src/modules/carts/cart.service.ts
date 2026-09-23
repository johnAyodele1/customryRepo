import { productRepository } from '../products/product.repository';
import { productService } from '../products/product.service';
import { AddToCartInput, OrderItemSnapshot } from '@customry/contracts';
import { NotFoundError, InsufficientStockError, ValidationError } from '../../shared/errors';

export class CartService {
  async validateAndCalculateCartItems(items: AddToCartInput[]): Promise<{
    validatedItems: OrderItemSnapshot[];
    subtotal: number;
  }> {
    if (!items || items.length === 0) {
      throw new ValidationError('Cart cannot be empty');
    }

    const validatedItems: OrderItemSnapshot[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product || product.status !== 'PUBLISHED') {
        throw new NotFoundError(`Product '${item.productId}' is not available`);
      }

      productService.validateCustomization(product, item.customization || {});

      if (item.quantity < product.minQuantity) {
        throw new ValidationError(
          `Minimum quantity for '${product.name}' is ${product.minQuantity}`
        );
      }

      if (item.quantity > product.maxQuantity) {
        throw new ValidationError(
          `Maximum quantity for '${product.name}' is ${product.maxQuantity}`
        );
      }

      let unitPrice = product.basePrice;
      let variantName: string | undefined;
      let selectedOptions: Record<string, string> | undefined;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant || !variant.isActive) {
          throw new NotFoundError(
            `Variant '${item.variantId}' is not available for '${product.name}'`
          );
        }

        if (variant.stock < item.quantity) {
          throw new InsufficientStockError(
            `Insufficient stock for '${product.name} (${variant.name})'. Available: ${variant.stock}`
          );
        }

        if (variant.price !== undefined && variant.price !== null) {
          unitPrice = variant.price;
        }

        variantName = variant.name;
        selectedOptions = variant.options as any;
      } else {
        if (product.stock < item.quantity) {
          throw new InsufficientStockError(
            `Insufficient stock for '${product.name}'. Available: ${product.stock}`
          );
        }
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        variantId: item.variantId,
        productName: product.name,
        variantName,
        selectedOptions,
        customization: item.customization || {},
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
        imageUrl: product.images[0] || '',
      });
    }

    return { validatedItems, subtotal };
  }
}

export const cartService = new CartService();
