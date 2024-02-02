import { Carriage } from 'src/carriage/carriage.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seat')
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  num: number;

  // 0 - нижнее место
  // 1 - верхнее место
  @Column({ type: 'integer' })
  position: 0 | 1;

  @ManyToOne(() => Carriage, (carriage) => carriage.id)
  carriage: Carriage;
}
