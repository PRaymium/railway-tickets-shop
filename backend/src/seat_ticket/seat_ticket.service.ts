import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SeatTicket } from './seat_ticket.entity';
import { FreePlacesInfo } from './interface/free_places_info.interface';
import { Train } from 'src/train/train.entity';

@Injectable()
export class SeatTicketService {
  constructor(
    @InjectRepository(SeatTicket)
    private seatTicketRepository: Repository<SeatTicket>,
  ) {}

  findAll(): Promise<SeatTicket[]> {
    return this.seatTicketRepository.find({
      relations: {
        train: true,
        seat: true,
      },
    });
  }

  async getFreePlacesInfoByTrainId(id: number[]): Promise<FreePlacesInfo[]> {
    return this.seatTicketRepository
      .createQueryBuilder('seat_ticket')
      .select(
        'MIN(seat_ticket.price) as min_price, COUNT(seat_ticket.id) as free_places, train.id as train_id',
      )
      .leftJoin('seat_ticket.train', 'train')
      .where('seat_ticket.train_id IN (:...train_ids)', {
        train_ids: [...id],
      })
      .andWhere('seat_ticket.is_buyed = 0')
      .groupBy('seat_ticket.train_id')
      .getRawMany();
  }
}
