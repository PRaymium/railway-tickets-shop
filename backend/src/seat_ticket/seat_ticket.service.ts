import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeatTicket } from './seat_ticket.entity';

@Injectable()
export class SeatTicketService {
  constructor(
    @InjectRepository(SeatTicket)
    private seatTicketRepository: Repository<SeatTicket>,
  ) {}

  findAll(): Promise<SeatTicket[]> {
    return this.seatTicketRepository.find();
  }
}
