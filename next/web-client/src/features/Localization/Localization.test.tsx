/**
 * @jest-environment jsdom
 */
import React, { useEffect, createElement } from 'react';
import { render, waitFor } from '@testing-library/react';
import Localization, { l } from '@localazer/component';
import { useLocalizationAPI } from './hooks';
import { createAppWrapper } from '../../tests/createAppWrapper';
import { Languages } from '../../types/Localization';
import ru from '../../locales/ru.json';

test('Check localization', async () => {
  const AppWrapper = createAppWrapper({
    initialState: {
      localization: {
        languages: {
          ru
        }
      }
    }
  });

  const Inner = (): JSX.Element => {
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

  const { getByText } = render(createElement(() => (
    <AppWrapper>
      <Inner />
    </AppWrapper>
  )));

  await waitFor(() => {
    const element = getByText(/Посты/i);

    expect(element)
      .toBeInTheDocument();
  });
});
