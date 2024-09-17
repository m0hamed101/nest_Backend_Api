import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import * as Twilio from 'twilio';
import { User } from '../users/user.entity';
import { Notification } from '../notifications/dto/notifications.entity';
import { UsersService } from '../users/users.service'; // Adjust import path if necessary

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;
  private twilioClient: Twilio.Twilio;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly usersService: UsersService,
  ) {
    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',  // Replace with your email
        pass: 'your-email-password',   // Replace with your email password
      },
    });

    // Initialize Twilio client
    this.twilioClient = Twilio('ACCOUNT_SID', 'AUTH_TOKEN');  // Replace with your Twilio Account SID and Auth Token
  }

  // Create in-app notification
  async createInAppNotification(userId: number, message: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = this.notificationsRepository.create({ user, message });
    return this.notificationsRepository.save(notification);
  }

  // Get in-app notifications
  async getNotifications(userId: number): Promise<Notification[]> {
    return this.notificationsRepository.find({ where: { user: { id: userId } } });
  }

  // Mark in-app notification as read
  async markAsRead(notificationId: number) {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.read = true;
    return this.notificationsRepository.save(notification);
  }

  // Email notifications
  async sendOrderConfirmationEmail(email: string, orderId: number) {
    const mailOptions = {
      from: 'your-email@gmail.com',  // Replace with your email
      to: email,
      subject: 'Order Confirmation',
      text: `Your order with ID ${orderId} has been confirmed.`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendShippingUpdateEmail(email: string, orderId: number, status: string) {
    const mailOptions = {
      from: 'your-email@gmail.com',  // Replace with your email
      to: email,
      subject: 'Shipping Update',
      text: `Your order with ID ${orderId} is now ${status}.`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // SMS notifications
  async sendOrderConfirmationSMS(phone: string, orderId: number) {
    await this.twilioClient.messages.create({
      body: `Your order with ID ${orderId} has been confirmed.`,
      from: '+1234567890',  // Replace with your Twilio phone number
      to: phone,
    });
  }

  async sendShippingUpdateSMS(phone: string, orderId: number, status: string) {
    await this.twilioClient.messages.create({
      body: `Your order with ID ${orderId} is now ${status}.`,
      from: '+1234567890',  // Replace with your Twilio phone number
      to: phone,
    });
  }
}
