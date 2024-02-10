import { Body, Controller, Get, Post } from '@nestjs/common';
import { CarriageService } from './carriage.service';
import CarriageWithSeatsAndTicket from './dto/carriageWithSeatsAndTicket.dto';

@Controller('carriage')
export class CarriageController {
  constructor(private carriageService: CarriageService) {}

  @Get()
  async getAll() {
    return this.carriageService.findAll();
  }

  @Get('withFreePlacesInfo')
  async getWithFreePlacesInfo() {
    return this.carriageService.findManyWithFreePlacesInfoByTrainId(1);
  }

  @Post('allSeatsWithTickets')
  async getAllSeatsWithTickets(
    @Body() body: { trainId: number; carriagesIds: number[] },
  ): Promise<CarriageWithSeatsAndTicket[]> {
    const data = await this.carriageService.getAllSeatsWithTicketsByTrainId(
      body.trainId,
      body.carriagesIds,
    );
    const res: CarriageWithSeatsAndTicket[] = data.map((carriage) => {
      return {
        id: carriage.id,
        seats: carriage.seats.map((seat) => {
          return {
            id: seat.id,
            number: seat.number,
            position: seat.position,
            carriageId: seat.carriage_id,
            seatTicket: {
              id: seat.seat_tickets[0].id,
              price: seat.seat_tickets[0].price,
              isBuyed: seat.seat_tickets[0].is_buyed,
            },
          };
        }),
      };
    });

    return res;
  }
}
