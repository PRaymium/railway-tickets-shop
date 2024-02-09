import Seat from 'src/seat/dto/seat.dto';
import Train from 'src/train/dto/train.dto';

export default class SeatTicket {
  id: number;
  price: number;
  isBuyed: boolean;
  trainId: number;
  train?: Train;
  seatId: number;
  seat?: Seat;
}
