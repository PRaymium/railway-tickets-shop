import { defineStore } from 'pinia';
import api from 'src/api/api';

import Carriage from 'src/models/entities/carriage';
import City from 'src/models/entities/city';
import { Locomotive } from 'src/models/entities/locomotive';
import { Seat } from 'src/models/entities/seat';
import SeatTicket from 'src/models/entities/seatTicket';
import Train from 'src/models/entities/train';
import TrainToCarriage from 'src/models/entities/trainToCarriage';
import Trip from 'src/models/entities/trip';
import { CarriageTypes } from 'src/models/tripWithDetailedInfo';

export interface StoredTrip {
  id: Trip['id'];
  departureCityName: City['name'];
  destinationCityName: City['name'];
  departureDate: Trip['departureDate'];
  destinationDate: Trip['destinationDate'];
  train?: {
    id: Train['id'];
    locomotive?: {
      id: Locomotive['id'];
      type: Locomotive['type'];
      name: Locomotive['name'];
    };
    carriages?: {
      id: Carriage['id'];
      type: CarriageTypes;
      number: TrainToCarriage['carriageNumber'];
      seats?: {
        id: Seat['id'];
        number: Seat['number'];
        position: Seat['position'];
        seatTicket: {
          id: SeatTicket['id'];
          price: SeatTicket['price'];
          isBuyed: SeatTicket['isBuyed'];
        };
      }[];
    }[];
  };
}

type FreePlacesInfo = {
  [id: number]: {
    count: number;
    minPrice: number;
  };
};

export const useTripsStore = defineStore('trips', {
  state: () => ({
    trips: [] as StoredTrip[] | null,

    _totalFreePlacesInTrip: {} as FreePlacesInfo,

    _freePlacesInCarriage: {} as FreePlacesInfo,
  }),
  getters: {
    getFreePlacesInCarriage(state) {
      const res: FreePlacesInfo = {};

      state.trips?.forEach((trip) => {
        trip.train?.carriages?.forEach((carriage) => {
          if (!carriage.seats) {
            res[carriage.id] = state._freePlacesInCarriage[carriage.id];
          } else {
            const nonBuyedSeats = carriage.seats.filter(
              (seat) => !seat.seatTicket.isBuyed
            );

            res[carriage.id] = {
              count: nonBuyedSeats.length,
              minPrice: Math.min(
                ...nonBuyedSeats.map((seat) => seat.seatTicket.price)
              ),
            };
          }
        });
      });

      return res;
    },

    getTotalFreePlacesInTrip(state) {
      const res: FreePlacesInfo = {};

      this.trips?.forEach((trip) => {
        let hasCarriageFreePlacesInfo = false;

        trip.train?.carriages?.forEach((carriage) => {
          if (this.getFreePlacesInCarriage[carriage.id]) {
            hasCarriageFreePlacesInfo = true;
            return;
          }
        });

        if (!hasCarriageFreePlacesInfo) {
          res[trip.id] = state._totalFreePlacesInTrip[trip.id];
        } else {
          const carriagesWithFreePlacesInfo: FreePlacesInfo[0][] = [];

          trip.train?.carriages?.forEach((carriage) =>
            carriagesWithFreePlacesInfo.push(
              this.getFreePlacesInCarriage[carriage.id]
            )
          );

          res[trip.id] = {
            count: carriagesWithFreePlacesInfo.reduce(
              (sum, carriage) => sum + carriage.count,
              0
            ),
            minPrice: Math.min(
              ...carriagesWithFreePlacesInfo.map(
                (carriage) => carriage.minPrice
              )
            ),
          };
        }
      });

      return res;
    },

    getFreeTrips(state): StoredTrip[] {
      const trips = state.trips as StoredTrip[];

      const filteredTrips = trips.filter((trip) =>
        this.getTotalFreePlacesInTrip[trip.id].count === 0 ? false : true
      );

      return filteredTrips;
    },
  },
  actions: {
    async fetchTrips() {
      const data = await api.getTripsWithTicketInfo();

      if (!data) return;

      this.trips = [];

      data.forEach((trip) => {
        const newTrip: StoredTrip = {
          id: trip.id,
          departureCityName: trip.departureCityName,
          destinationCityName: trip.destinationCityName,
          departureDate: trip.departureDate,
          destinationDate: trip.destinationDate,
        };

        const foundTripIdx = this.trips?.findIndex(
          (findTrip) => trip.id === findTrip.id
        );

        if (foundTripIdx !== -1 && foundTripIdx) {
          if (!this.trips) return;

          this.trips[foundTripIdx] = newTrip;
        } else this.trips?.push(newTrip);

        this._totalFreePlacesInTrip[trip.id] = {
          count: trip.freePlaces,
          minPrice: trip.minPrice,
        };
      });
    },

    async fetchTripWithDetailedInfo(tripId: number) {
      const data = await api.getTripWithDetailedInfoById(tripId);

      const trip = this.trips?.find((trip) => trip.id === data?.id);

      if (!data || !trip) return;

      const carriages: any[] = [];

      data.train.carriages.forEach((carriage) => {
        const newCarriage = {
          id: carriage.id,
          type: carriage.type,
          number: carriage.number,
        };

        carriages.push(newCarriage);

        this._freePlacesInCarriage[carriage.id] = {
          count: carriage.freePlaces.count,
          minPrice: carriage.freePlaces.minPrice,
        };
      });

      const train = {
        id: data.train.id,
        locomotive: data.train.locomotive,
        carriages: carriages,
      } as StoredTrip['train'];

      trip.train = train;
    },

    async fetchCarriageWithSeatsAndTicket(
      trainId: number,
      carriagesId: number[]
    ) {
      const data = await api.getCarriageWithSeatsAndTicket(
        trainId,
        carriagesId
      );

      if (!data) return;

      const trip = this.trips?.find((trip) => trip.train?.id === trainId);

      if (!trip) return;

      data.forEach((dataCarriage) => {
        const carriage = trip.train?.carriages?.find(
          (carriage) => carriage.id === dataCarriage.id
        );

        if (!carriage) return;

        carriage.seats = dataCarriage.seats;
      });
    },

    async getFreeTripById(tripId: number) {
      const trips = this.getFreeTrips;

      let trip = trips.find((trip) => trip.id === tripId);

      if (!trip?.train) {
        await this.fetchTripWithDetailedInfo(tripId);
        trip = trips.find((trip) => trip.id === tripId);
      }

      return trip;
    },

    async buyTickets(
      tripId: number,
      tickets: { ticketId: number; carriageId: number }[]
    ) {
      const ticketsIds = tickets.map((ticket) => ticket.ticketId);
      const data = await api.buyTickets(ticketsIds);

      const trip = this.trips?.find((trip) => trip.id === tripId);

      if (!trip) return;

      if (data?.status === 'complete') {
        tickets.forEach((ticket) => {
          const carriage = trip.train?.carriages?.find(
            (carriage) => carriage.id === ticket.carriageId
          );

          const seat = carriage?.seats?.find(
            (seat) => seat.seatTicket.id === ticket.ticketId
          );

          if (!seat) return;

          seat.seatTicket.isBuyed = true;
        });
      }

      return data;
    },
  },
});
