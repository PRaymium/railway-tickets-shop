import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from 'src/city/city.entity';
import { Train } from 'src/train/train.entity';

@Entity('trip')
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => City, (city) => city.id)
  departure_city: City;

  @ManyToOne(() => City, (city) => city.id)
  destination_city: City;

  @Column()
  departure_date: Date;

  @Column()
  destination_date: Date;

  @OneToOne(() => Train)
  @JoinColumn()
  train: Train;

  @Column({ type: 'integer', default: 0 })
  is_complete: 0 | 1;
}
