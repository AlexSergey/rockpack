import { getDefault, detectBrowserLanguage } from './utils';

describe('getDefault use cases', () => {
  test('check getDefault "en" language without locale data', () => {
    const lang = 'en';

    expect(getDefault(lang))
      .toEqual({
        locale_data: {
          messages: {
            '': {
              domain: 'messages',
              lang,
              plural_forms: 'nplurals=2; plural=(n != 1);'
            }
          }
        }
      });
  });

  test('check getDefault "en" language with locale data', () => {
    const lang = 'ru';

    const localeData = {
      domain: 'messages',
      locale_data: {
        messages: {
          '': {
            domain: 'messages',
            plural_forms: 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);',
            lang: 'ru'
          },
          'Alarm!': ['Ахтунг!'],
          'Hello world': ['Привет мир'],
          '%d click': ['%d клик', '%d кликов', '%d кликов'],
          'Sort By': ['Сортировать по'],
          Latest: ['По последнему'],
          'Most Popular': ['Самый популярный'],
          'Most Viewed': ['Самый просматриваемый'],
          'Most Commented': ['Самый комментируемый'],
          'USER\u0004Your name is %s and surname is %s': ['Ваше имя %s ваша фамилия %s']
        }
      }
    };

    expect(getDefault(lang, localeData))
      .toEqual(localeData);
  });
});

test('detect browser default language from languages array', () => {
  expect(detectBrowserLanguage())
    .toBe('en-US');
});
