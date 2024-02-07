export default interface TicketWithSeatInfo {
  id: string;
  price: number;
  is_buyed: boolean;
  carriageId: string;

  seat: {
    id: string;
    number: number;
    position: number;
  };
}