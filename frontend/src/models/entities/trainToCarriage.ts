import Carriage from './carriage';
import Train from './train';

export default interface TrainToCarriage {
  trainId: Train['id'];
  carriageId: Carriage['id'];
  carriageNumber: number;
  train?: Train;
  carriage?: Carriage;
}
