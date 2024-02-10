import Train from './train';

export enum LocomotiveTypes {
  'Стандартный' = 1,
  'Скоростной' = 2,
  'Сверхскоростной' = 3,
}

export interface Locomotive {
  id: number;
  type: LocomotiveTypes;
  name: string;
  trains?: Train[];
}
