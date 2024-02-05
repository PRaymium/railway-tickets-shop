import { Controller, Get } from '@nestjs/common';
import { TripService } from './trip.service';
import TripWithFreePlacesInfo from './dto/tripWithFreePlacesInfo.dto';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Get()
  getAll() {
    return this.tripService.findAll();
  }

  @Get('withFreePlaces')
  async getAllWithFreePlacesInfo() {
    const data = await this.tripService.findAllWithFreePlacesInfo();

    const res: TripWithFreePlacesInfo[] = [];
    data.forEach((trip) => {
      const mappedTrip = {
        id: trip.id.toString(),
        departureCity: trip.departure_city.name,
        destinationCity: trip.destination_city.name,
        departureDate: trip.departure_date,
        destinationDate: trip.destination_date,
        freePlaces: trip._count.id,
        minPrice: trip._min.price,
        trainId: trip.train_id.toString(),
      } as TripWithFreePlacesInfo;

      res.push(mappedTrip);
    });

    return res;
  }
}
