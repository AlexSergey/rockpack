import { LocalizationServiceInterface } from './service';

export const mockLocalizationService = (): LocalizationServiceInterface => ({
  fetchLocalization: () => (
    Promise.resolve({
      domain: 'messages',
      // eslint-disable-next-line @typescript-eslint/camelcase
      locale_data: {
        messages: {
          '': {
            domain: 'messages',
            // eslint-disable-next-line @typescript-eslint/camelcase
            plural_forms: 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);',
            lang: 'ru'
          },
          Posts: ['Посты']
        }
      }
    })
  )
});
