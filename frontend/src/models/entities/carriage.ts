import { Seat } from './seat';
import Train from './train';

export default interface Carriage {
  id: number;
  type: number;
  seatsCount: number;
  trains?: Train[];
  seats?: Seat[];
}
