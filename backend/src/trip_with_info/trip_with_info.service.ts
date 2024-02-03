import { Injectable } from '@nestjs/common';
import { SeatTicketService } from 'src/seat_ticket/seat_ticket.service';
import { TripService } from 'src/trip/trip.service';
import { TripWithInfo } from './trip_with_info.entity';

@Injectable()
export class TripWithInfoService {
  constructor(
    private tripService: TripService,
    private seatTicketService: SeatTicketService,
  ) {}

  async findAll(): Promise<TripWithInfo[]> {
    const trips = await this.tripService.findAll();

    const trainIds = trips.reduce<number[]>((acc: number[], trip) => {
      acc.push(trip.train.id);
      return acc;
    }, []);

    const placesInfo =
      await this.seatTicketService.getFreePlacesInfoByTrainId(trainIds);

    const results = trips.map((trip) => {
      const placesInfoItem = placesInfo.find(
        (item) => item.train_id === trip.train.id,
      );

      return {
        tickets_info: {
          free_places: placesInfoItem.free_places,
          min_price: placesInfoItem.min_price,
        },

        ...trip,
      };
    });

    return results;
  }
}
