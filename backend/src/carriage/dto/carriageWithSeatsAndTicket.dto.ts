import Seat from 'src/seat/dto/seat.dto';
import Carriage from './carriage.dto';
import SeatTicket from 'src/seatTicket/dto/seatTicket.dto';

export default class CarriageWithSeatsAndTicket {
  id: Carriage['id'];
  seats: {
    id: Seat['id'];
    number: Seat['number'];
    position: Seat['position'];
    carriageId: Seat['carriageId'];
    seatTicket: {
      id: SeatTicket['id'];
      price: SeatTicket['price'];
      isBuyed: SeatTicket['isBuyed'];
    };
  }[];
}
