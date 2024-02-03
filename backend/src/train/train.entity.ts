import { Locomotive } from 'src/locomotive/locomotive.entity';
import { TrainToCarriage } from 'src/train_to_carriage/train_to_carriage.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('train')
export class Train {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Locomotive, (locomotive) => locomotive.id)
  locomotive: Locomotive;

  @OneToMany(() => TrainToCarriage, (trainToCarriage) => trainToCarriage.train)
  trainToCarriage: TrainToCarriage[];
}
