import { TrainToCarriage } from 'src/train_to_carriage/train_to_carriage.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('carriage')
export class Carriage {
  @PrimaryGeneratedColumn()
  id: number;

  // 1 - сидячий
  // 2 - плацкарт
  // 3 - купе
  // 4 - СВ
  @Column({ type: 'integer', default: 1 })
  type: 1 | 2 | 3 | 4;

  @Column()
  seats_count: number;

  @OneToMany(
    () => TrainToCarriage,
    (trainToCarriage) => trainToCarriage.carriage,
  )
  trainToCarriage: TrainToCarriage[];
}
