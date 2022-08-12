import styles from './styles.module.scss';

interface IImage {
  loading: boolean;
  error: boolean;
  url: string;
}

export const Image = ({ loading, error, url }: IImage): JSX.Element => (
  <div className={styles.img}>
    {loading && <p>Loading...</p>}
    {error && <p>Error, try again</p>}
    <img width="200px" alt="random" src={url} />
  </div>
);
