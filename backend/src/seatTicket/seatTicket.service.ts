import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import Train from 'src/train/dto/train.dto';

@Injectable()
export class SeatTicketService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.seat_ticket.findMany();
  }

  async getFreePlacesInfoByTrainId(trainsId: number[]) {
    class FreePlacesInfo {
      train_id: Train['id'];
      min_price: number;
      count: number;
    }

    return this.prisma.$queryRaw<FreePlacesInfo[]>`
      SELECT MIN(ST.price) as min_price, COUNT(ST.id) as count, ST.train_id
        FROM seat_ticket as ST
	      WHERE ST.train_id IN (${Prisma.join(trainsId)}) AND ST.is_buyed = 0
	    GROUP BY ST.train_id
    `;
  }

  async buyTicketsByIds(ticketsIds: number[]) {
    const buyedTickets = await this.prisma.seat_ticket.findMany({
      where: {
        is_buyed: true,
        id: {
          in: ticketsIds,
        },
      },
    });

    if (buyedTickets.length !== 0) {
      return buyedTickets.map((ticket) => ticket.id);
    } else {
      try {
        await this.prisma.seat_ticket.updateMany({
          where: {
            id: {
              in: ticketsIds,
            },
          },
          data: {
            is_buyed: true,
          },
        });
        return 1;
      } catch (err) {
        console.log(err);
      }
    }
  }
}
