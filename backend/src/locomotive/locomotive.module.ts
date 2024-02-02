import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locomotive } from './locomotive.entity';
import { LocomotiveService } from './locomotive.service';
import { LocomotiveController } from './locomotive.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Locomotive])],
  providers: [LocomotiveService],
  controllers: [LocomotiveController],
})
export class LocomotiveModule {}
