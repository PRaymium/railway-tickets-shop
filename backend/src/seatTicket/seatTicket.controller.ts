import { Controller, Get, Param } from '@nestjs/common';
import { SeatTicketService } from './seatTicket.service';
import TicketWithSeatInfo from './dto/ticketWithSeatInfo.dto';

@Controller('seatTicket')
export class SeatTicketController {
  constructor(private seatTicketService: SeatTicketService) {}

  @Get()
  getAll() {
    return this.seatTicketService.findAll();
  }

  @Get('freePlacesInfo')
  getFreePlacesInfo() {
    return this.seatTicketService.getFreePlacesInfoByTrainId([1, 2, 3]);
  }

  @Get('withSeatInfo/:carriageId')
  async getTicketsWithSeatInfo(
    @Param('carriageId') carriageId: string,
  ): Promise<TicketWithSeatInfo[]> {
    const data =
      await this.seatTicketService.getTicketsWithSeatInfoByCarriageId(
        +carriageId,
      );

    const res: TicketWithSeatInfo[] = data.map((ticket) => {
      return {
        id: ticket.id.toString(),
        price: ticket.price,
        is_buyed: ticket.is_buyed,
        carriageId: ticket.seat.carriage_id.toString(),

        seat: {
          id: ticket.seat.id.toString(),
          number: ticket.seat.num,
          position: ticket.seat.position,
        },
      };
    });

    return res;
  }
}
