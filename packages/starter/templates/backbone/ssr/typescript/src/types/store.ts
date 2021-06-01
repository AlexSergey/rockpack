import { History } from 'history';
import { ServicesInterface } from '../services';
import { ImageState } from './Image';

export interface StoreProps {
  initialState?: {
    [key: string]: unknown;
  };
  history: History;
  services: ServicesInterface;
}

export interface RootState {
  image: ImageState;
}
