import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secretKey', // Replace with your environment variable or configuration
      signOptions: { expiresIn: '60m' },
    }),
    forwardRef(() => UsersModule), // Ensure UsersModule is correctly imported
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Export AuthService so it can be used in other modules
})
export class AuthModule {}
