import { Seat } from 'src/seat/seat.entity';
import { Train } from 'src/train/train.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seat_ticket')
export class SeatTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column({ type: 'integer' })
  is_buyed: 0 | 1;

  @ManyToOne(() => Train, (train) => train.id)
  train: Train;

  @ManyToOne(() => Seat, (seat) => seat.id)
  seat: Seat;
}
