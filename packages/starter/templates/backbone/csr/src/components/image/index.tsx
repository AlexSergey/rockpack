import { ReactElement } from 'react';

import * as styles from './styles.module.scss';

interface Image {
  error: boolean;
  loading: boolean;
  url: string;
}

export const Image = ({ error, loading, url }: Image): ReactElement => (
  <div className={styles.img}>
    {loading && <p>Loading...</p>}
    {error && <p>Error, try again</p>}
    <img alt="random" src={url} width="200px" />
  </div>
);
