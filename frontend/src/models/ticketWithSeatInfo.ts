import Seat from './entities/seat';
import SeatTicket from './entities/seatTicket';

export default interface TicketWithSeatInfo {
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
