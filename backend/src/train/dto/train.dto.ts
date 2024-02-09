import Carriage from 'src/carriage/dto/carriage.dto';
import Locomotive from 'src/locomotive/dto/locomotive.dto';
import SeatTicket from 'src/seatTicket/dto/seatTicket.dto';
import Trip from 'src/trip/dto/trip.dto';

export default class Train {
  id: number;
  trip?: Trip;
  locomotiveId: number;
  locomotive?: Locomotive;
  carriages?: Carriage[];
  seatTickets?: SeatTicket[];
}
