import axios from 'axios';
//import config from '../config';

export const rest = axios.create({
  timeout: 1000
});
