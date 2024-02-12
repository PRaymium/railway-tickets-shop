import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import Carriage from './dto/carriage.dto';
import Seat from 'src/seat/dto/seat.dto';
import SeatTicket from 'src/seatTicket/dto/seatTicket.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CarriageService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.carriage.findMany();
  }

  async findManyWithFreePlacesInfoByTrainId(trainId: number) {
    type NewCarriage = {
      id: Carriage['id'];
      type: Carriage['type'];
      min_price: number;
      count: number;
    };

    const carriages: NewCarriage[] = await this.prisma.$queryRaw`
      SELECT carriage.id, carriage.type, MIN(ST.price) AS min_price, 
        COUNT(ST.id) AS count
      FROM carriage
	      JOIN seat ON seat.carriage_id = carriage.id
	      JOIN seat_ticket AS ST ON ST.seat_id = seat.id
      WHERE ST.is_buyed = 0 AND ST.train_id = ${trainId}
      GROUP BY carriage.id
    `;

    const res = carriages.map((carriage) => {
      return {
        id: carriage.id,
        type: carriage.type,
        free_places: {
          count: carriage.count,
          min_price: carriage.min_price,
        },
      };
    });

    return res;
  }

  async getAllSeatsWithTicketsByTrainId(
    trainId: number,
    carriagesIds: number[],
  ) {
    class AllSeatsWithTickets {
      id: Carriage['id'];
      type: Carriage['type'];
      seats: {
        id: Seat['id'];
        number: Seat['number'];
        position: Seat['position'];
        carriage_id: Seat['carriageId'];
        seat_ticket: {
          id: SeatTicket['id'];
          price: SeatTicket['price'];
          is_buyed: SeatTicket['isBuyed'];
        };
      }[];
    }

    const data = await this.prisma.$queryRaw<any[]>`
    SELECT 
    CR.id, CR.type, 
    seat.id as seat_id_main, seat.number, seat.position, 
	    seat.carriage_id, 
    ST.id as seat_ticket_id_main, ST.price, ST.is_buyed

    FROM carriage as CR
	    JOIN seat ON seat.carriage_id = CR.id
	    JOIN seat_ticket as ST ON ST.seat_id = seat.id
	  WHERE ST.train_id = ${trainId}
		  AND CR.id IN (${Prisma.join(carriagesIds)})
    `;

    const res: AllSeatsWithTickets[] = data.reduce<AllSeatsWithTickets[]>(
      (array, row: any) => {
        const ticket: AllSeatsWithTickets['seats'][0]['seat_ticket'] = {
          id: row.seat_ticket_id_main,
          price: row.price,
          is_buyed: row.is_buyed,
        };

        const seat: AllSeatsWithTickets['seats'][0] = {
          id: row.seat_id_main,
          number: row.number,
          position: row.position,
          carriage_id: row.carriage_id,
          seat_ticket: ticket,
        };

        const carriage = array.find(
          (item: AllSeatsWithTickets) => item.id === row.id,
        );

        if (carriage) {
          carriage.seats.push(seat);
        } else {
          const newCarriage: AllSeatsWithTickets = {
            id: row.id,
            type: row.type,
            seats: [seat],
          };

          array.push(newCarriage);
        }

        return array;
      },
      [],
    );

    return res;
  }
}
