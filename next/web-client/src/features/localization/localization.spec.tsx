import Localization, { l } from '@localazer/component';
import { render, waitFor } from '@testing-library/react';
import { ReactElement, useEffect } from 'react';

import ru from '../../locales/ru.json';
import { createAppWrapper } from '../../tests/create-app-wrapper';
import { Languages } from '../../types/localization';
import { useLocalizationAPI } from './hooks';

test('Check localization', async () => {
  const AppWrapper = createAppWrapper({
    initialState: {
      localization: {
        languages: {
          ru,
        },
      },
    },
  });

  const Inner = (): ReactElement => {
    const { changeLanguage } = useLocalizationAPI();
    useEffect(() => {
      changeLanguage(Languages.ru);
    }, [changeLanguage]);

    return (
      <div>
        <Localization>{l('Posts')}</Localization>
      </div>
    );
  };

  const { getByText } = render(
    <AppWrapper>
      <Inner />
    </AppWrapper>,
  );

  await waitFor(() => {
    const element = getByText(/Посты/i);

    expect(element).toBeInTheDocument();
  });
});
