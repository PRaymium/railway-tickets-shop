import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TripController],
  providers: [TripService, PrismaService],

  exports: [TripService],
})
export class TripModule {}
