import Carriage from './carriage';
import SeatTicket from './seatTicket';

export enum SeatPositionType {
  'Нижнее' = 0,
  'Верхнее' = 1,
}

export interface Seat {
  id: number;
  number: number;
  position: SeatPositionType;
  carriageId: number;
  carriage?: Carriage;
  seatTickets?: SeatTicket[];
}
