import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { CartService } from './cart.service';
  import { CreateCartItemDto } from './dto/create-cart-item.dto';
  import { UpdateCartItemDto } from './dto/update-cart-item.dto';
  import { Request } from 'express';
  import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'; // Assuming you have a JWT guard
  
  @Controller('cart')
  export class CartController {
    constructor(private readonly cartService: CartService) {}  
    @UseGuards(JwtAuthGuard) // Ensure user is authenticated
    @Post('add')
    addItem(@Req() req: Request, @Body() createCartItemDto: CreateCartItemDto) {
      const userId = req.user['id']; // Make sure 'id' is the correct property in user
      return this.cartService.addItem(userId, createCartItemDto);
    }
  
    @UseGuards(JwtAuthGuard)
    @Patch('update/:itemId')
    updateItem(
      @Req() req: Request,
      @Param('itemId') itemId: number,
      @Body() updateCartItemDto: UpdateCartItemDto,
    ) {
      const userId = req.user['id'];
      return this.cartService.updateItem(userId, itemId, updateCartItemDto);
    }
  
    @UseGuards(JwtAuthGuard)
    @Delete('remove/:itemId')
    removeItem(@Req() req: Request, @Param('itemId') itemId: number) {
      const userId = req.user['id'];
      return this.cartService.removeItem(userId, itemId);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('summary')
    getCartSummary(@Req() req: Request) {
      const userId = req.user['id'];
      return this.cartService.getCartSummary(userId);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('checkout')
    async checkout(@Req() req: Request) {
      const userId = req.user['id'];
      const cart = await this.cartService.getCartSummary(userId);
      // Integrate the order placement and payment here
      await this.cartService.clearCart(userId);
      return { message: 'Checkout successful' };
    }
  }
  