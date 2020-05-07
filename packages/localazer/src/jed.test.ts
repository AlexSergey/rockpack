import Jed from 'jed';
import { I18N, l, nl, sprintf } from './jed';

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

let i18n: I18N;

beforeAll(() => {
  i18n = new Jed({ domain: 'messages' });

  i18n.options = localeData;
});

test('"l" test. Hello world -> Привет мир', () => {
  expect(l('Hello world')(i18n)).toBe('Привет мир');
});

test('"l" test. Alarm! -> Ахтунг!', () => {
  expect(l('Alarm!')(i18n))
    .toBe('Ахтунг!');
});

test('"l" test. Default variant', () => {
  const defaultString = 'I am default';
  expect(l(defaultString)(i18n))
    .toBe(defaultString);
});


test('nl plural with zero test', () => {
  expect(nl(
    '%d click',
    '%d clicks',
    0
  )(i18n))
    .toBe('%d кликов');
});

test('nl singular test', () => {
  expect(nl(
    '%d click',
    '%d clicks',
    1
  )(i18n))
    .toBe('%d клик');
});

test('nl plural with many test', () => {
  expect(nl(
    '%d click',
    '%d clicks',
    123
  )(i18n))
    .toBe('%d кликов');
});

test('sprintf pass 0 variable to nl', () => {
  const count = 0;
  expect(
    sprintf(
      nl(
        '%d click',
        '%d clicks',
        count
      ),
      count
    )(i18n)
  )
    .toBe('0 кликов');
});

test('sprintf pass 1 variable to nl', () => {
  const count = 1;
  expect(
    sprintf(
      nl(
        '%d click',
        '%d clicks',
        count
      ),
      count
    )(i18n)
  )
    .toBe('1 клик');
});

test('sprintf pass 123 variable to nl', () => {
  const count = 123;
  expect(
    sprintf(
      nl(
        '%d click',
        '%d clicks',
        count
      ),
      count
    )(i18n)
  )
    .toBe('123 кликов');
});
