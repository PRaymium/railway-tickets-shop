import Train from './train';

export default interface Locomotive {
  id: number;
  type: number;
  name: string;
  trains?: Train[];
}
