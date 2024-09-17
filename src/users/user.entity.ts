import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cart } from '../cart/dto/cart.entity'; // Adjust the path if necessary
import { Order } from 'src/orders/order.entity';
import { Review } from 'src/reviews/dto/review.entity';
import { Wishlist } from 'src/wishlist/dto/wishlist.entity';
import { Notification } from 'src/notifications/dto/notifications.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string; // 'admin' or 'customer'

  @Column({ default: '' })
  profile: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  // Add the carts relationship
  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
  
  @OneToMany(() => Review, review => review.user)
  reviews: Review[]; // Add the reviews relationship
  
  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
  
}
