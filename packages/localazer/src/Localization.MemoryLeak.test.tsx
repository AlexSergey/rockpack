import React, { useContext, createContext, useState } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { l, sprintf } from './jed';
import Localization from './Localization';
import LocalizationObserver, { components } from './LocalizationObserver';

const WrapperContext = createContext(null);

let ctx;
let wrapper;

const localeData = {
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
      'USER\u0004Your name is %s and surname is %s': ['Ваше имя %s ваша фамилия %s']
    }
  }
};

beforeAll(() => {
  const Wrapper = ({ children }): JSX.Element => {
    const [name, setName] = useState('Ivan');
    const [show, setVisibility] = useState(true);
    const [activeLang, setActiveLang] = useState('en');

    const resetName = (): void => {
      setName('Ivan');
    };

    const toggleComponent = (): void => {
      setVisibility(() => !show);
    };

    return (
      <WrapperContext.Provider value={{
        setName,
        resetName,
        toggleComponent,
        setActiveLang
      }}
      >
        {children(activeLang, name, show)}
      </WrapperContext.Provider>
    );
  };

  const App = ({ name, show }): JSX.Element => {
    ctx = useContext(WrapperContext);

    return (
      <div>
        <p className="test-case-3">
          {show && (
            <Localization>
              {
                sprintf(
                  l('Your name is %s and surname is %s', 'USER'),
                  <span style={{ textDecoration: 'underline' }}>
                    <b>{name}</b>
                  </span>,
                  <span style={{ textDecoration: 'underline' }}>
                    <b>Pupkin</b>
                  </span>
                )
              }
            </Localization>
          )}
        </p>
      </div>
    );
  };

  wrapper = mount(
    <Wrapper>
      {(activeLang, name, show): JSX.Element => (
        <LocalizationObserver currentLanguage={activeLang} languages={{ ru: localeData }}>
          <App name={name} show={show} />
        </LocalizationObserver>
      )}
    </Wrapper>
  );
});

describe('Test default language (English)', () => {
  test('sprintf test with react components', async () => {
    expect(
      wrapper.find('.test-case-3')
        .find('.localization-node')
        .html()
    )
      .toBe('<span class="localization-node ">Your name is <span style="text-decoration:underline"><b>Ivan</b></span> and surname is <span style="text-decoration:underline"><b>Pupkin</b></span></span>');
  });

  test('sprintf change name in the sentence', async () => {
    await act(async () => {
      ctx.setName('Sergey');
    });

    expect(
      wrapper.find('.test-case-3')
        .find('.localization-node')
        .html()
    )
      .toBe('<span class="localization-node ">Your name is <span style="text-decoration:underline"><b>Sergey</b></span> and surname is <span style="text-decoration:underline"><b>Pupkin</b></span></span>');
  });
});

describe('Test Russian language', () => {
  test('Change active language', async () => {
    await act(async () => {
      ctx.setActiveLang('ru');
    });
  });
});

describe('Test Russian language', () => {
  test('sprintf test with react components', async () => {
    await act(async () => {
      ctx.resetName();
    });
    expect(
      wrapper.find('.test-case-3')
        .find('.localization-node')
        .html()
    )
      .toBe('<span class="localization-node ">Ваше имя <span style="text-decoration:underline"><b>Ivan</b></span> ваша фамилия <span style="text-decoration:underline"><b>Pupkin</b></span></span>');
  });

  test('sprintf change name in the sentence', async () => {
    await act(async () => {
      ctx.setName('Sergey');
    });

    expect(
      wrapper.find('.test-case-3')
        .find('.localization-node')
        .html()
    )
      .toBe('<span class="localization-node ">Ваше имя <span style="text-decoration:underline"><b>Sergey</b></span> ваша фамилия <span style="text-decoration:underline"><b>Pupkin</b></span></span>');
  });
});

describe('Remove localization node', () => {
  test('Hide localization component', async () => {
    await act(async () => {
      ctx.toggleComponent();
    });
    expect(
      wrapper.find('.test-case-3')
        .html()
    )
      .toBe('<p class="test-case-3"></p>');
  });

  test('check components dictionary (hide)', async () => {
    expect(
      Object.keys(components).length
    )
      .toBe(0);
  });

  test('check components dictionary (show)', async () => {
    await act(async () => {
      ctx.toggleComponent();
    });
    expect(
      Object.keys(components).length
    )
      .toBe(1);
  });
});
