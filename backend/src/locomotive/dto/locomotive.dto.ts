import Train from 'src/train/dto/train.dto';

export default class Locomotive {
  id: number;
  type: number;
  name: string;
  trains?: Train[];
}
