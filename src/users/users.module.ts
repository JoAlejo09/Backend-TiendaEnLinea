import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { CustomerProfile } from './entities/customer-profile.entity.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from './auth.guard.js';
import { RolesGuard } from './roles.guard.js';
import { CartModule } from '../cart/cart.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, CustomerProfile]), CartModule],
  providers: [UsersService, AuthService,RolesGuard,AuthGuard],
  controllers: [UsersController, AuthController],
  exports: [TypeOrmModule, AuthService, AuthGuard, RolesGuard],
})
export class UsersModule {}