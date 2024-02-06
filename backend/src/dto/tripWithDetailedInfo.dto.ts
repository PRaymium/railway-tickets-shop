export default class TripWithDetailedInfo {
  id: string;
  departureDate: Date;
  destinationDate: Date;
  departureCity: string;
  destinationCity: string;
  train: {
    id: string;
    locomotive: {
      id: string;
      type: number;
      name: string;
    };
    carriages: {
      id: string;
      type: number;
      free_places: {
        count: number;
        min_price: number;
      };
    }[];
  };
}
