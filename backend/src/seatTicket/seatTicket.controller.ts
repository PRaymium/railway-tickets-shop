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
        id: ticket.id,
        price: ticket.price,
        isBuyed: ticket.is_buyed,

        seat: {
          id: ticket.seat.id,
          number: ticket.seat.number,
          position: ticket.seat.position,
          carriageId: ticket.seat.carriage_id,
        },
      };
    });

    return res;
  }
}
