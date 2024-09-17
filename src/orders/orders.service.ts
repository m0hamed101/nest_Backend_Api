import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  // Create a new order
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items } = createOrderDto;

    // Check if the user exists
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const orderItems: OrderItem[] = [];
    let total = 0;

    // Check product existence, quantity, and calculate total
    for (const item of items) {
      const product = await this.productsService.findProductById(item.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }
      if (item.quantity <= 0) {
        throw new BadRequestException(`Invalid quantity for product ID ${item.productId}`);
      }
      if (item.quantity > product.quantity) {
        throw new BadRequestException(`Insufficient stock for product ID ${item.productId}`);
      }
      const orderItem = this.orderItemsRepository.create({
        product,
        quantity: item.quantity,
        price: product.price * item.quantity,
      });
      orderItems.push(orderItem);
      total += orderItem.price;
    }

    // Create and save the order
    const order = this.ordersRepository.create({
      user,
      status: 'placed',
      total,
      items: orderItems,
    });
    await this.ordersRepository.save(order);

    // Update product stock
    for (const item of items) {
      await this.productsService.updateProductStock(item.productId, -item.quantity);
    }

    return order;
  }

  // Find all orders
  async findAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['user', 'items', 'items.product'] });
  }

  // Find an order by ID
  async findOrderById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  // Update order status
  async updateOrderStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOrderById(id);
    order.status = updateOrderStatusDto.status;
    return this.ordersRepository.save(order);
  }

  // Remove an order
  async removeOrder(id: number): Promise<void> {
    const order = await this.findOrderById(id);
    await this.ordersRepository.remove(order);
  }
}
