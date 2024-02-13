import Carriage from './entities/carriage';
import { Seat } from './entities/seat';
import SeatTicket from './entities/seatTicket';

export default interface CarriageWithSeatsAndTicket {
  id: Carriage['id'];
  seats: {
    id: Seat['id'];
    number: Seat['number'];
    position: Seat['position'];
    seatTicket: {
      id: SeatTicket['id'];
      price: SeatTicket['price'];
      isBuyed: SeatTicket['isBuyed'];
    };
  }[];
}
