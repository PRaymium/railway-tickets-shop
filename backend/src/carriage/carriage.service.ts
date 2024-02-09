import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CarriageService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.carriage.findMany();
  }

  async findManyWithFreePlacesInfoByTrainId(trainId: number) {
    const carriages = await this.prisma.carriage.findMany({
      include: {
        seats: {
          where: {
            seat_tickets: {
              some: {
                is_buyed: false,
              },
            },
          },
          select: {
            seat_tickets: {
              where: {
                train_id: trainId,
              },
              select: {
                price: true,
              },
            },
          },
        },
      },
      where: {
        trains: {
          some: {
            id: trainId,
          },
        },
      },
    });

    const res = carriages.map((carriage) => {
      const prices = carriage.seats.reduce<number[]>((acc, item) => {
        acc.push(item.seat_tickets[0].price);
        return acc;
      }, []);

      return {
        id: carriage.id,
        type: carriage.type,
        free_places: {
          count: carriage.seats.length,
          min_price: Math.min(...prices),
        },
      };
    });

    return res;
  }
}
