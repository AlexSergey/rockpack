import { Helmet } from 'react-helmet';
import { ImageArea } from '../../features/Image';

const Image = (): JSX.Element => (
  <>
    <Helmet>
      <title>Image Page</title>
      <meta name="description" content="Image page" />
    </Helmet>
    <ImageArea />
  </>
);

export default Image;
