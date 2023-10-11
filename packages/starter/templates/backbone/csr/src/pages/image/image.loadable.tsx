import { Helmet } from 'react-helmet';

import { ImageArea } from '../../features/image';

const Image = (): JSX.Element => (
  <>
    <Helmet>
      <title>Image Page</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta content="Image page" name="description" />
    </Helmet>
    <ImageArea />
  </>
);

export default Image;
