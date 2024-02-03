import { Carriage } from 'src/carriage/carriage.entity';
import { Train } from 'src/train/train.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('train_to_carriage')
export class TrainToCarriage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Train, (train) => train.id)
  train: Train;

  @ManyToOne(() => Carriage, (carriage) => carriage.id)
  carriage: Carriage;
}
