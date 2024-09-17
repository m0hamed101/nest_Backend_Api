import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async getSalesReport(startDate: Date, endDate: Date) {
    const orders = await this.ordersRepository.createQueryBuilder('order')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();

    // Replace 'totalPrice' with the correct property name from your Order entity
    const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;

    return { totalSales, totalOrders, orders };
  }

  async getAnalytics() {
    const totalUsers = await this.ordersRepository.query('SELECT COUNT(*) FROM "user"');
    const totalProducts = await this.ordersRepository.query('SELECT COUNT(*) FROM "product"');
    const totalOrders = await this.ordersRepository.query('SELECT COUNT(*) FROM "order"');

    return {
      totalUsers: totalUsers[0].count,
      totalProducts: totalProducts[0].count,
      totalOrders: totalOrders[0].count,
    };
  }
}
