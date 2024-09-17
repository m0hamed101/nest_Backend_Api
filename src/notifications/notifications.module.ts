import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './dto/notifications.entity';
import { UsersModule } from '../users/users.module'; // Adjust import path if necessary

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]), // Import TypeOrmModule and provide Notification repository
    UsersModule, // Import UsersModule if UsersService is provided there
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService], // Export NotificationsService if it will be used in other modules
})
export class NotificationsModule {}
