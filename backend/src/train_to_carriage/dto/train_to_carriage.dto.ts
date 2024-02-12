import Carriage from 'src/carriage/dto/carriage.dto';
import Train from 'src/train/dto/train.dto';

export default class TrainToCarriage {
  trainId: Train['id'];
  carriageId: Carriage['id'];
  carriageNumber: number;
}
