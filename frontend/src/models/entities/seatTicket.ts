import { Seat } from './seat';
import Train from './train';

export default interface SeatTicket {
  id: number;
  price: number;
  isBuyed: boolean;
  trainId: number;
  train?: Train;
  seatId: number;
  seat?: Seat;
}
