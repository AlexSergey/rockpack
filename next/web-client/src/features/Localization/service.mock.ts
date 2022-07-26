import { ILocalizationService } from './service';

export const mockLocalizationService = (): ILocalizationService => ({
  fetchLocalization: () =>
    Promise.resolve({
      domain: 'messages',
      // eslint-disable-next-line camelcase
      locale_data: {
        messages: {
          '': {
            domain: 'messages',

            lang: 'ru',
            // eslint-disable-next-line camelcase
            plural_forms:
              'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);',
          },
          Posts: ['Посты'],
        },
      },
    }),
});
