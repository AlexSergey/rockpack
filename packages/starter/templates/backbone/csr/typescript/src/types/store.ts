import { History } from 'history';
import { RouterState } from 'connected-react-router';
import { ServicesInterface } from '../services';
import { ImageState } from './Image';

export interface StoreProps {
  history: History;
  services: ServicesInterface;
}

export interface RootState {
  router: RouterState;
  image: ImageState;
}
