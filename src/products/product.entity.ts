import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Review } from 'src/reviews/dto/review.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number; // Stock quantity

  @ManyToOne(() => Category, category => category.products)
  category: Category;
  
  @OneToMany(() => Review, review => review.product)
  reviews: Review[]; // Add the reviews relationship
}
