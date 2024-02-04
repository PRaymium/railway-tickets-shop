import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SeatTicketService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.seat_ticket.findMany();
  }

  getFreePlacesInfoByTrainId(id: number[]) {
    return this.prisma.seat_ticket.groupBy({
      by: ['train_id'],
      where: {
        train_id: {
          in: id,
        },
        is_buyed: false,
      },
      _min: {
        price: true,
      },
      _count: {
        id: true,
      },
    });
  }
}
