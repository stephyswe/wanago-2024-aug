import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import User from './user.entity';
import Address from './address.entity';
import { FilesModule } from '../files/files.module';
import { UsersController } from './users.controller';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address]),
    FilesModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}