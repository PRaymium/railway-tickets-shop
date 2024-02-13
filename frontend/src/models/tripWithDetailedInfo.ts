import Carriage from './entities/carriage';
import { Locomotive } from './entities/locomotive';
import Train from './entities/train';
import TrainToCarriage from './entities/trainToCarriage';
import Trip from './entities/trip';

export enum CarriageTypes {
  'Сидячий' = 1,
  'Плацкарт' = 2,
  'Купе' = 3,
  'СВ' = 4,
}

export interface TripWithDetailedInfo {
  id: Trip['id'];
  train: {
    id: Train['id'];
    locomotive: {
      id: Locomotive['id'];
      type: Locomotive['type'];
      name: Locomotive['name'];
    };
    carriages: {
      id: Carriage['id'];
      type: CarriageTypes;
      number: TrainToCarriage['carriageNumber'];
      freePlaces: {
        count: number;
        minPrice: number;
      };
    }[];
  };
}
