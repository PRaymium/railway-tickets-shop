import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('locomotive')
export class Locomotive {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', default: 1 })
  type: 1 | 2 | 3;

  @Column({ unique: true })
  name: string;
}
