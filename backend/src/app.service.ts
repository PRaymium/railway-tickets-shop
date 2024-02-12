import { Injectable } from '@nestjs/common';
import { TripService } from './trip/trip.service';
import { SeatTicketService } from './seatTicket/seatTicket.service';
import { CarriageService } from './carriage/carriage.service';

@Injectable()
export class AppService {
  constructor(
    private readonly tripService: TripService,
    private readonly seatTicketService: SeatTicketService,
    private readonly carriageService: CarriageService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async findAllTripsWithFreePlacesInfo() {
    let trips = await this.tripService.findAll();

    const trainIds = trips.reduce<number[]>((acc: number[], trip) => {
      acc.push(trip.train_id);
      return acc;
    }, []);

    const freePlacesInfo =
      await this.seatTicketService.getFreePlacesInfoByTrainId(trainIds);

    trips = trips.filter((trip) =>
      freePlacesInfo.some((item) => item.train_id == trip.train_id),
    );

    const results = trips.map((trip) => {
      const placesInfoItem = freePlacesInfo.find(
        (item) => item.train_id === trip.train_id,
      );

      return {
        free_places_info: {
          count: placesInfoItem.count,
          min_price: placesInfoItem.min_price,
        },
        ...trip,
      };
    });

    return results;
  }

  async findTripWithDetailedInfoById(tripId: number) {
    const trip = await this.tripService.findOneWithTrainInfoById(tripId);
    const carriages =
      await this.carriageService.findManyWithFreePlacesInfoByTrainId(
        trip.train_id,
      );

    const res = {
      ...trip,
      carriages: [...carriages],
    };

    return res;
  }
}
