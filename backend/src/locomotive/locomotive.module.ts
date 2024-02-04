import { Module } from '@nestjs/common';
import { LocomotiveService } from './locomotive.service';
import { LocomotiveController } from './locomotive.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [LocomotiveService, PrismaService],
  controllers: [LocomotiveController],
})
export class LocomotiveModule {}
