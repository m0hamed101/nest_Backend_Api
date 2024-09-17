import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
  
    // Create the JWT payload
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    // Generate the JWT token
    const accessToken = this.jwtService.sign(payload);
    
    // Return the user information along with the access token
    const { password: _, ...userInfo } = user;
    return {
      access_token: accessToken,
      user: userInfo,
    };
  }
  
}