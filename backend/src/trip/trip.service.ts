import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SeatTicketService } from 'src/seat_ticket/seat_ticket.service';

@Injectable()
export class TripService {
  constructor(
    private prisma: PrismaService,
    private seatTicketService: SeatTicketService,
  ) {}

  findAll() {
    return this.prisma.trip.findMany({
      include: {
        departure_city: true,
        destination_city: true,
      },
    });
  }

  async findAllWithFreePlacesInfo() {
    const trips = await this.findAll();

    const trainIds = trips.reduce<number[]>((acc: number[], trip) => {
      acc.push(trip.train_id);
      return acc;
    }, []);

    const freePlacesInfo =
      await this.seatTicketService.getFreePlacesInfoByTrainId(trainIds);

    const results = trips.map((trip) => {
      const placesInfoItem = freePlacesInfo.find(
        (item) => item.train_id === trip.train_id,
      );

      return {
        tickets_info: {
          free_places: placesInfoItem._count.id,
          min_price: placesInfoItem._min.price,
        },

        ...trip,
      };
    });

    return results;
  }
}
