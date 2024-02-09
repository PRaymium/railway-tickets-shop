import Carriage from 'src/carriage/dto/carriage.dto';
import SeatTicket from 'src/seatTicket/dto/seatTicket.dto';

export default class Seat {
  id: number;
  number: number;
  position: number;
  carriageId: number;
  carriage?: Carriage;
  seatTickets?: SeatTicket[];
}
