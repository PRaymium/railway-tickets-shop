import Seat from 'src/seat/dto/seat.dto';
import Train from 'src/train/dto/train.dto';

export default class Carriage {
  id: number;
  type: number;
  seatsCount: number;
  trains?: Train[];
  seats?: Seat[];
}
