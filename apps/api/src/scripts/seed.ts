import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { UserModel } from '../modules/auth/auth.model';
import { CategoryModel } from '../modules/categories/category.model';
import { ProductModel } from '../modules/products/product.model';
import { OrderModel } from '../modules/orders/order.model';
import { hashPassword } from '../shared/utils/password';
import { logger } from '../config/logger';

export const seedDatabase = async () => {
  logger.info('Starting database seed...');
  await connectDatabase();

  await UserModel.deleteMany({});
  await CategoryModel.deleteMany({});
  await ProductModel.deleteMany({});
  await OrderModel.deleteMany({});

  const adminPasswordHash = await hashPassword('admin123');
  const admin = await UserModel.create({
    name: 'Customry Master Admin',
    email: 'admin@customry.com',
    passwordHash: adminPasswordHash,
    role: 'ADMIN',
    phone: '+2348000000000',
  });

  logger.info(`Seeded Admin User: ${admin.email}`);

  const categoriesData = [
    {
      code: 'JEWELRY_ACCESSORIES',
      name: 'Jewelry & Accessories',
      slug: 'jewelry-accessories',
      description: 'Handcrafted gold, silver, and gemstone bespoke jewelry.',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      order: 1,
      isActive: true,
    },
    {
      code: 'JOURNALS_BOOKS',
      name: 'Journals & Books',
      slug: 'journals-books',
      description: 'Luxury leather-bound stationery and personalized journals.',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
      order: 2,
      isActive: true,
    },
    {
      code: 'WATER_BOTTLES',
      name: 'Water Bottles',
      slug: 'water-bottles',
      description: 'Thermal insulated double-wall flasks with laser engraving.',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
      order: 3,
      isActive: true,
    },
    {
      code: 'GIFT_BOXES',
      name: 'Gifts & Gift Boxes',
      slug: 'gifts-gift-boxes',
      description: 'Curated bespoke gift sets wrapped in velvet presentation boxes.',
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
      order: 4,
      isActive: true,
    },
    {
      code: 'WRISTWATCHES',
      name: 'Wristwatches',
      slug: 'wristwatches',
      description: 'Timeless luxury timepieces with personalized caseback engravings.',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      order: 5,
      isActive: true,
    },
  ];

  await CategoryModel.insertMany(categoriesData);
  logger.info(`Seeded ${categoriesData.length} Categories`);

  const productsData = [
    {
      name: 'The Sovereign Gold Signet Ring',
      slug: 'sovereign-gold-signet-ring',
      categoryCode: 'JEWELRY_ACCESSORIES',
      description: 'A stately 18k solid gold signet ring engineered for custom crest engraving.',
      status: 'PUBLISHED',
      basePrice: 125000,
      currency: 'NGN',
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
      ],
      stock: 12,
      minQuantity: 1,
      maxQuantity: 5,
      customizationFields: [
        {
          key: 'engraving',
          label: 'Initials / Monogram Engraving',
          type: 'TEXT',
          required: true,
          maxLength: 5,
        },
      ],
      variants: [
        {
          id: 'var_signet_18k_7',
          name: '18k Yellow Gold / Size 7',
          sku: 'CST-JWL-01-7',
          price: 125000,
          stock: 6,
          images: [],
          options: { metal: '18k Yellow Gold', size: '7' },
          isActive: true,
        },
      ],
    },
    {
      name: 'The Atelier Monogrammed Leather Journal',
      slug: 'atelier-monogrammed-leather-journal',
      categoryCode: 'JOURNALS_BOOKS',
      description: 'Hand-stitched full-grain Tuscan leather diary featuring gold foil lettering.',
      status: 'PUBLISHED',
      basePrice: 35000,
      currency: 'NGN',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
      ],
      stock: 15,
      minQuantity: 1,
      maxQuantity: 10,
      customizationFields: [
        {
          key: 'journal_title',
          label: 'Cover Foil Name',
          type: 'TEXT',
          required: true,
          maxLength: 25,
        },
      ],
      variants: [],
    },
    {
      name: 'The Custom Hydro Flask Thermal Bottle',
      slug: 'custom-hydro-flask-thermal-bottle',
      categoryCode: 'WATER_BOTTLES',
      description: 'Double-walled vacuum insulated flask with laser etching.',
      status: 'PUBLISHED',
      basePrice: 22000,
      currency: 'NGN',
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
      ],
      stock: 4,
      minQuantity: 1,
      maxQuantity: 5,
      customizationFields: [
        {
          key: 'laser_name',
          label: 'Laser Etched Name',
          type: 'TEXT',
          required: true,
          maxLength: 18,
        },
      ],
      variants: [],
    },
    {
      name: 'The Bespoke Royal Velvet Gift Hamper',
      slug: 'bespoke-royal-velvet-gift-hamper',
      categoryCode: 'GIFT_BOXES',
      description: 'A regal collection featuring personalized leather accessories and candle.',
      status: 'PUBLISHED',
      basePrice: 85000,
      currency: 'NGN',
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
      ],
      stock: 10,
      minQuantity: 1,
      maxQuantity: 3,
      customizationFields: [
        {
          key: 'recipient_name',
          label: 'Recipient Name on Ribbon',
          type: 'TEXT',
          required: true,
          maxLength: 30,
        },
      ],
      variants: [],
    },
    {
      name: 'The Heritage Chronograph Wristwatch',
      slug: 'heritage-chronograph-wristwatch',
      categoryCode: 'WRISTWATCHES',
      description: 'Swiss-movement luxury chronograph featuring custom engraved caseback.',
      status: 'PUBLISHED',
      basePrice: 280000,
      currency: 'NGN',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      ],
      stock: 8,
      minQuantity: 1,
      maxQuantity: 2,
      customizationFields: [
        {
          key: 'caseback_engraving',
          label: 'Caseback Engraving Text',
          type: 'TEXT',
          required: true,
          maxLength: 35,
        },
      ],
      variants: [],
    },
  ];

  await ProductModel.insertMany(productsData);
  logger.info(`Seeded ${productsData.length} Products`);

  logger.info('Database seeded successfully!');
  await disconnectDatabase();
};

if (process.env.NODE_ENV !== 'test') {
  seedDatabase().catch((err) => {
    logger.error('Error seeding database:', err);
    process.exit(1);
  });
}
