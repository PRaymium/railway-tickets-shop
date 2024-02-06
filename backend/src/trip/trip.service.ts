import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TripService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.trip.findMany({
      include: {
        departure_city: true,
        destination_city: true,
      },
    });
  }

  findOneWithTrainInfoById(tripId: number) {
    return this.prisma.trip.findFirst({
      include: {
        departure_city: true,
        destination_city: true,
        train: {
          include: {
            locomotive: true,
          },
        },
      },
      where: {
        id: tripId,
      },
    });
  }
}
