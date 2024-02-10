import { Body, Controller, Get, Post } from '@nestjs/common';
import { SeatTicketService } from './seatTicket.service';
import BuyedTicket from './dto/buyedTicket.dto';

@Controller('seatTicket')
export class SeatTicketController {
  constructor(private seatTicketService: SeatTicketService) {}

  @Get()
  async getAll() {
    return this.seatTicketService.findAll();
  }

  @Get('freePlacesInfo')
  async getFreePlacesInfo() {
    return this.seatTicketService.getFreePlacesInfoByTrainId([1, 2, 3]);
  }

  @Post('buy')
  async buyTickets(
    @Body() body: { ticketsIds: number[] },
  ): Promise<BuyedTicket> {
    const data = await this.seatTicketService.buyTicketsByIds(body.ticketsIds);

    const res: BuyedTicket = {
      status: 'complete',
    };

    if (Array.isArray(data)) {
      res.status = 'busy';
      res.ticketsIds = data;
    }

    return res;
  }
}
