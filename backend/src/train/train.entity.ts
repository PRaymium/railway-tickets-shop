import { Locomotive } from 'src/locomotive/locomotive.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('train')
export class Train {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Locomotive, (locomotive) => locomotive.id)
  locomotive: Locomotive;
}
