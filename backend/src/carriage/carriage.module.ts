import { Module } from '@nestjs/common';
import { CarriageService } from './carriage.service';
import { CarriageController } from './carriage.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [CarriageService, PrismaService],
  controllers: [CarriageController],

  exports: [CarriageService],
})
export class CarriageModule {}
