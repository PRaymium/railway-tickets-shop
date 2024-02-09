export default interface BuyedTicket {
  status: 'busy' | 'complete';
  ticketsIds?: number[];
}
