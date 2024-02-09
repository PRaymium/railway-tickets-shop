import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SeatTicketService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.seat_ticket.findMany();
  }

  async getFreePlacesInfoByTrainId(id: number[]) {
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

  async getTicketsWithSeatInfoByCarriageId(carriageId: number) {
    return this.prisma.seat_ticket.findMany({
      include: {
        seat: true,
      },
      where: {
        seat: {
          is: {
            carriage_id: carriageId,
          },
        },
      },
    });
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
