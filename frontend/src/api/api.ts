import axios from 'axios';
import BuyedTicket from 'src/models/buyedTicket';
import CarriageWithSeatsAndTicket from 'src/models/carriageWithSeatsAndTicket';
import { TripWithDetailedInfo } from 'src/models/tripWithDetailedInfo';
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

  async getTripWithDetailedInfoById(id: number) {
    try {
      const response = await axios.get(`${URL}tripWithDetailedInfo/${id}`);
      const data: TripWithDetailedInfo = response.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async getCarriageWithSeatsAndTicket(trainId: number, carriagesIds: number[]) {
    try {
      const response = await axios.post(`${URL}carriage/allSeatsWithTickets`, {
        trainId: trainId,
        carriagesIds: carriagesIds,
      });
      const data: CarriageWithSeatsAndTicket[] = response.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async buyTickets(ticketsIds: number[]) {
    try {
      const response = await axios.post(`${URL}seatTicket/buy`, {
        ticketsIds: ticketsIds,
      });
      const data: BuyedTicket = response.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Api();
