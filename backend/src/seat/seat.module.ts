import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './seat.entity';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Seat], 'railway-tickets')],
  controllers: [SeatController],
  providers: [SeatService],

  exports: [SeatService],
})
export class SeatModule {}
