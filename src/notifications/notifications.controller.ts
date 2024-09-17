import { Controller, Post, Get, Patch, Param, Req, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Request } from 'express';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  createNotification(@Req() req: Request, @Body('message') message: string) {
    const userId = req.user["id"];
    return this.notificationsService.createInAppNotification(userId, message);
  }

  @Get()
  getNotifications(@Req() req: Request) {
    const userId = req.user["id"];
    return this.notificationsService.getNotifications(userId);
  }

  @Patch(':notificationId')
  markAsRead(@Param('notificationId') notificationId: number) {
    return this.notificationsService.markAsRead(notificationId);
  }
}