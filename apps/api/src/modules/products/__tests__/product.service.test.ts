import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { productService } from '../product.service';
import { inventoryService } from '../../inventory/inventory.service';
import { ProductModel } from '../product.model';

describe('Product & Inventory Services', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await ProductModel.deleteMany({});
  });

  it('should create product with customisation fields and variants', async () => {
    const product = await productService.createProduct({
      name: 'Custom Gold Ring',
      slug: 'custom-gold-ring',
      categoryCode: 'JEWELRY_ACCESSORIES',
      description: 'Handcrafted gold ring',
      status: 'PUBLISHED',
      basePrice: 50000,
      currency: 'NGN',
      stock: 10,
      images: ['https://example.com/ring.jpg'],
      variants: [
        {
          name: '18k Gold / Size 7',
          sku: 'RING-18K-7',
          price: 55000,
          stock: 5,
          options: { size: '7', metal: '18k Gold' },
          images: [],
          isActive: true,
        },
        {
          name: '18k Gold / Size 8',
          sku: 'RING-18K-8',
          price: 55000,
          stock: 5,
          options: { size: '8', metal: '18k Gold' },
          images: [],
          isActive: true,
        },
      ],
      customizationFields: [
        {
          key: 'engraving',
          label: 'Engraving Text',
          type: 'TEXT',
          required: true,
          maxLength: 20,
        },
      ],
      minQuantity: 1,
      maxQuantity: 10,
    });

    expect(product.id).toBeDefined();
    expect(product.slug).toBe('custom-gold-ring');
    expect(product.stock).toBe(10);
    expect(product.variants.length).toBe(2);
  });

  it('should enforce customization field requirements and length constraints', async () => {
    const product = await productService.createProduct({
      name: 'Engraved Water Bottle',
      slug: 'engraved-bottle',
      categoryCode: 'WATER_BOTTLES',
      description: 'Stainless steel bottle',
      status: 'PUBLISHED',
      basePrice: 15000,
      currency: 'NGN',
      stock: 20,
      images: [],
      variants: [],
      customizationFields: [
        {
          key: 'name_engraving',
          label: 'Your Name',
          type: 'TEXT',
          required: true,
          maxLength: 10,
        },
      ],
      minQuantity: 1,
      maxQuantity: 5,
    });

    expect(() =>
      productService.validateCustomization(product, { name_engraving: 'Alexander' })
    ).not.toThrow();

    expect(() =>
      productService.validateCustomization(product, {})
    ).toThrow("Customization field 'Your Name' is required");

    expect(() =>
      productService.validateCustomization(product, {
        name_engraving: 'Alexander Supertramp Long Name',
      })
    ).toThrow("exceeds maximum length of 10 characters");
  });

  it('should adjust inventory atomically and reject negative stock', async () => {
    const product = await productService.createProduct({
      name: 'Bespoke Journal',
      slug: 'bespoke-journal',
      categoryCode: 'JOURNALS_BOOKS',
      description: 'Leather notebook',
      status: 'PUBLISHED',
      basePrice: 20000,
      currency: 'NGN',
      stock: 5,
      images: [],
      variants: [],
      customizationFields: [],
      minQuantity: 1,
      maxQuantity: 10,
    });

    const updated = await inventoryService.adjustInventory({
      productId: product.id,
      quantityDelta: -3,
      reason: 'Manual adjustment',
    });

    expect(updated?.stock).toBe(2);

    await expect(
      inventoryService.adjustInventory({
        productId: product.id,
        quantityDelta: -5,
        reason: 'Over-reduction',
      })
    ).rejects.toThrow('Cannot reduce stock below zero');
  });
});
