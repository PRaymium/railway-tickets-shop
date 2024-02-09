import Carriage from './carriage';
import Locomotive from './locomotive';
import SeatTicket from './seatTicket';
import Trip from './trip';

export default interface Train {
  id: number;
  trip?: Trip;
  locomotiveId: number;
  locomotive?: Locomotive;
  carriages?: Carriage[];
  seatTickets?: SeatTicket[];
}
