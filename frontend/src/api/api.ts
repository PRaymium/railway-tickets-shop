import axios from 'axios';
import {
  TripWithDetailedInfoApi,
  TripWithDetailedInfo,
} from 'src/models/tripWithDetailedInfo.dto';
import {
  TripWithFreePlacesInfo,
  TripWithFreePlacesInfoApi,
} from 'src/models/tripWithFreePlacesInfo';

const URL = process.env.BACK_API;

class Api {
  async getTripsWithTicketInfo() {
    try {
      const response = await axios.get(`${URL}tripsWithInfo`);
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

  async getTripWithDetailedInfoById(id: string) {
    try {
      const response = await axios.get(`${URL}tripWithDetailedInfo/${id}`);
      const data: TripWithDetailedInfoApi = response.data;
      const res = {
        ...data,
        departureDate: new Date(data.departureDate),
        destinationDate: new Date(data.destinationDate),
      } as TripWithDetailedInfo;
      return res;
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Api();