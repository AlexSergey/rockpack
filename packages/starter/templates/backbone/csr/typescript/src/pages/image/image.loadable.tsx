import { Helmet } from 'react-helmet';

import { ImageArea } from '../../features/image';

const Image = (): JSX.Element => (
  <>
    <Helmet>
      <title>Image Page</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Image page" />
    </Helmet>
    <ImageArea />
  </>
);

export default Image;
