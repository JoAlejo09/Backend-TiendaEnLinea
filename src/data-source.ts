import 'dotenv/config';
import { resolve } from 'node:path';
import { DataSource } from 'typeorm';
import { Category } from './catalog/entities/category.entity.js';
import { Subcategory } from './catalog/entities/subcategory.entity.js';
import { Product } from './catalog/entities/product.entity.js';
import { User } from './users/entities/user.entity.js';
import { CustomerProfile } from './users/entities/customer-profile.entity.js';
import { InventoryMovement } from './invetory/entities/inventory-movement.entity.js';
import { Cart } from './cart/entities/cart.entity.js';
import { CartItem } from './cart/entities/cart-items.entity.js';
import { Order } from './order/entities/order.entity.js';
import { OrderItem } from './order/entities/order-item.entity.js';
import { Payment } from './payment/entities/payment.entity.js';
import { Invoice } from './invoice/entities/invoice.entity.js';


function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}.`);
  }

  return value;
}

export default new DataSource({
  type: 'postgres',
  host: requiredEnv('DB_HOST'),
  port: Number(requiredEnv('DB_PORT')),
  username: requiredEnv('DB_USERNAME'),
  password: requiredEnv('DB_PASSWORD'),
  database: requiredEnv('DB_DATABASE'),
  entities: [Category, Subcategory, Product,
    User, CustomerProfile, InventoryMovement, 
    Cart, CartItem, Order, OrderItem, Payment,
    Invoice
  ],
  migrations: [resolve(import.meta.dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false,
});