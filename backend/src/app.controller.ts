import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import TripWithFreePlacesInfo from './dto/tripWithFreePlacesInfo.dto';
import TripWithDetailedInfo from './dto/tripWithDetailedInfo.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('tripsWithInfo')
  async getFreeTripsWithFreePlacesInfo(): Promise<TripWithFreePlacesInfo[]> {
    const data = await this.appService.findFreeTripsWithFreePlacesInfo();

    const res: TripWithFreePlacesInfo[] = data.map((trip) => {
      return {
        id: trip.id,
        departureCityName: trip.departure_city.name,
        destinationCityName: trip.destination_city.name,
        departureDate: trip.departure_date,
        destinationDate: trip.destination_date,
        freePlaces: trip.free_places_info.count,
        minPrice: trip.free_places_info.min_price,
      };
    });

    return res;
  }

  @Get('tripWithDetailedInfo/:id')
  async getTripWithDetailedInfo(
    @Param('id') id: string,
  ): Promise<TripWithDetailedInfo> {
    const trip = await this.appService.findTripWithDetailedInfoById(+id);

    const res = {
      id: trip.id,
      departureCityName: trip.departure_city.name,
      destinationCityName: trip.destination_city.name,
      departureDate: trip.departure_date,
      destinationDate: trip.destination_date,
      train: {
        id: trip.train_id,
        locomotive: {
          id: trip.train.locomotive_id,
          type: trip.train.locomotive.type,
          name: trip.train.locomotive.name,
        },
        carriages: trip.carriages.map((carriage) => {
          return {
            id: carriage.id,
            type: carriage.type,
            number: carriage.number,
            freePlaces: {
              count: carriage.free_places.count,
              minPrice: carriage.free_places.min_price,
            },
          };
        }),
      },
    } as TripWithDetailedInfo;

    return res;
  }
}
