import { ReactElement } from 'react';

import styles from './styles.module.scss';

interface IImage {
  error: boolean;
  loading: boolean;
  url: string;
}

export const Image = ({ error, loading, url }: IImage): ReactElement => (
  <div className={styles.img}>
    {loading && <p>Loading...</p>}
    {error && <p>Error, try again</p>}
    <img alt="random" src={url} width="200px" />
  </div>
);
