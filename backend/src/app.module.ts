import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocomotiveModule } from './locomotive/locomotive.module';
import { Locomotive } from './locomotive/locomotive.entity';
import { Carriage } from './carriage/carriage.entity';
import { City } from './city/city.entity';
import { Seat } from './seat/seat.entity';
import { SeatTicket } from './seat_ticket/seat_ticket.entity';
import { Train } from './train/train.entity';
import { TrainToCarriage } from './train-carriage/train_to_carriage.entity';
import { Trip } from './trip/trip.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './db/railway-tickets.db',
      //entities: ['src/**/*.entity.ts'],
      entities: [
        Locomotive,
        Carriage,
        City,
        Seat,
        SeatTicket,
        Train,
        TrainToCarriage,
        Trip,
      ],
      synchronize: true,
    }),

    LocomotiveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
