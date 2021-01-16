import React, { useEffect } from 'react';
import Localization, { l } from '@localazer/component';
import { useLocalizationAPI } from './hooks';
import { createTestWrapper } from '../../tests/TestWrapper';
import { Languages } from '../../types/Localization';
import ru from '../../locales/ru.json';

test('Check localization', async () => {
  const { wrapper } = await createTestWrapper(() => {
    const { changeLanguage } = useLocalizationAPI();

    useEffect(() => {
      changeLanguage(Languages.ru);
      //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div id="test">
        <Localization>{l('Posts')}</Localization>
      </div>
    );
  }, {
    localization: {
      languages: {
        ru
      }
    }
  });

  expect(wrapper.find('#test').text())
    .toEqual('Посты');
});
