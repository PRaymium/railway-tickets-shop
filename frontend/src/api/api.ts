import axios from 'axios';
import {
  TripWithFreePlacesInfo,
  TripWithFreePlacesInfoApi,
} from 'src/models/TripWithFreePlacesInfo';

const URL = process.env.BACK_API;

class Api {
  async getTripsWithTicketInfo() {
    try {
      const response = await axios.get(URL + 'trip/withFreePlaces');
      const data: TripWithFreePlacesInfoApi[] = response.data;
      const res: TripWithFreePlacesInfo[] = data.map((item) => {
        return {
          ...item,
          departureDate: new Date(item.departureDate),
          destinationDate: new Date(item.destinationDate),
        };
      });
      return res;
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Api();
