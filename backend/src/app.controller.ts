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
  async getAllTripsWithFreePlacesInfo(): Promise<TripWithFreePlacesInfo[]> {
    const data = await this.appService.findAllTripsWithFreePlacesInfo();

    const res: TripWithFreePlacesInfo[] = data.map((trip) => {
      return {
        id: trip.id.toString(),
        departureCity: trip.departure_city.name,
        destinationCity: trip.destination_city.name,
        departureDate: trip.departure_date,
        destinationDate: trip.destination_date,
        freePlaces: trip.free_places_info.count,
        minPrice: trip.free_places_info.min_price,
        trainId: trip.train_id.toString(),
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
      id: trip.id.toString(),
      departureCity: trip.departure_city.name,
      destinationCity: trip.destination_city.name,
      departureDate: trip.departure_date,
      destinationDate: trip.destination_date,
      train: {
        id: trip.train_id.toString(),
        locomotive: {
          id: trip.train.locomotive_id.toString(),
          type: trip.train.locomotive.type,
          name: trip.train.locomotive.name,
        },
        carriages: trip.carriages.map((carriage) => {
          return { ...carriage, id: carriage.id.toString() };
        }),
      },
    };

    return res;
  }
}
