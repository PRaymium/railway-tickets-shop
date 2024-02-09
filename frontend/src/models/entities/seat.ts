import Carriage from './carriage';
import SeatTicket from './seatTicket';

export default interface Seat {
  id: number;
  number: number;
  position: number;
  carriageId: number;
  carriage?: Carriage;
  seatTickets?: SeatTicket[];
}
