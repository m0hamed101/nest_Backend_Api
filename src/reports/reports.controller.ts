import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from '../auth/jwt/roles.decorator';
import { Role } from '../auth/jwt/role.enum';
import { RolesGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('reports')
@UseGuards(RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @Roles(Role.Admin)
  getSalesReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.reportsService.getSalesReport(new Date(startDate), new Date(endDate));
  }

  @Get('analytics')
  @Roles(Role.Admin)
  getAnalytics() {
    return this.reportsService.getAnalytics();
  }
}