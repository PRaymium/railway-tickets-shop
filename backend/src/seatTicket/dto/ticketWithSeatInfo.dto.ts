import Seat from 'src/seat/dto/seat.dto';
import SeatTicket from './seatTicket.dto';

export default class TicketWithSeatInfo {
  id: SeatTicket['id'];
  price: SeatTicket['price'];
  isBuyed: SeatTicket['isBuyed'];

  seat: {
    id: Seat['id'];
    number: Seat['number'];
    position: Seat['position'];
    carriageId: Seat['carriageId'];
  };
}
