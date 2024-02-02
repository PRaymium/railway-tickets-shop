import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
