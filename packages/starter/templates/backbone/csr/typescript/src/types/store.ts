import { ServicesInterface } from '../services';
import { ImageState } from './Image';

export interface StoreProps {
  initialState?: {
    [key: string]: unknown;
  };
  services: ServicesInterface;
}

export interface RootState {
  image: ImageState;
}
