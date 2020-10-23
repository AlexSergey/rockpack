<p align="center">
  <img src="http://www.natrube.net/logrock/LogRock.png" alt="This module can help you build error tracking & crash reporting system" />
</p>

# @rockpack/logger

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/logger/README.md">Readme (English version)</a>
</p>

Если сравнить программу с живым организмом, то баг в ней — это болезнь. На возникновение «болезни» может повлиять целый ряд факторов и окружение, особенно, если мы рассматриваем веб-платформу в качестве запуска. Иногда причинно-следственная связь очень сложная, и баг, который нашли при тестировании результат целого ряда событий.

Для понимания возникновения бага, нам нужен список действий, которые совершил пользователь в нашем приложении.

**@rockpack/logger** это React компонент и система логирования позволяющая записать все действия перед возникновением критической ошибки чтобы в дальнейшем эту информацию можно было проанализировать.

**@rockpack/logger** это модуль является частью проекта **Rockpack** о котором можно прочитать <a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md" target="_blank">здесь</a>

## Использование

1. Установка:

```sh
# NPM
npm install @rockpack/logger --save

# YARN
yarn add @rockpack/logger
```

2. Для корректной работы logger системы, нужно обернуть наше приложение в *<LoggerContainer>* компонент

```jsx
import React, { useCallback, useContext } from 'react';
import logger, { LoggerContainer, useLoggerApi } from '@rockpack/logger';

const App = () => {
  const { getStackData, triggerError } = useLoggerApi();
  ...
}

export default function () {
  const loggerCtx = useContext(LoggerContext);
  const showMessage = useCallback((level, message, important) => {
    alert(message);
  });

  return <LoggerContainer
    sessionID={window.sessionID}
    limit={75} // Лимит стека. При переполнении - первый элемент будет удален
    getCurrentDate={() => {
      // Дата возникновкния критической ошибки
      return dayjs()
        .format('YYYY-MM-DD HH:mm:ss');
    }}
    stdout={showMessage} // Выводить некоторые ошибки в виде тултипа для пользователей
    onError={stackData => {
      // Отправить стек действий перед ошибкой на бекенд (или как то иначе обработать)
      sendToServer(stack);
    }}
    onPrepareStack={stack => {
      // Позволяет добавить дополнительную информацию к стеку
      stack.language = window.navigator.language;
    }}>
    <App/>
  </LoggerContainer>
}
```

4. Для того, чтобы произвести качественное логирование действий пользователя, нам придется покрыть наш код лог-вызовами.

В комплекте модуля **@rockpack/logger** идет логгер, который связан с *<LoggerContainer />*

Предположим у нас есть компонент

```jsx
import React, { useState } from 'react';

export default function Toggle(props) {
  const [toggleState, setToggleState] = useState('off');

  function toggle() {
    setToggleState(toggleState === 'off' ? 'on' : 'off');
  }

  return <div className={`switch ${toggleState}`} onClick={toggle}/>;
}
```

Для того, чтобы его правильно покрыть логом, нам нужно модифицировать метод toggle

```jsx
import React, { useState } from 'react';
import logger from '@rockpack/logger';

export default function Toggle(props) {
  const [toggleState, setToggleState] = useState('off');

  function toggle() {
    let state = toggleState === 'off' ? 'on' : 'off';
    logger.info(`React.Toggle|Toggle component changed state ${state}`);
    setToggleState(state);
  }

  return <div className={`switch ${toggleState}`} onClick={toggle}/>;
}
```

Мы добавили логгер, в котором информация разделена на 2 части. React.Toggle показывает нам, что данное действие произошло на уровне React, компонента Toggle, а далее мы имеем словесное пояснение действия и текущий state, который пришел в этот компонент.

Таким образом, при возникновении критической ошибки в системе, у нас появится **BSOD** с подробным описанием действий пользователя. А также будет возможность отправить данный стек в систему анализа ошибок или на ElasticSearch, чтобы быстрее отлавливать ошибки произошедшие у наших пользователей.

<p align="right">
  <img alt="BSOD" src="https://www.rockpack.io/readme_assets/rockpack_logger_bsod.jpg" />
</p>

*- При логгировании приложений нужно проставлять логи в наиболее запутанные и сложные участки кода, таким образом вы будете понимать, что происходило на этом этапе.*

*- Также мы можем использовать метод “componentDidCatch”, который введен в React 16 версии, на случай возникновения ошибки.*

## Свойства

- \<LoggerContainer /> свойства:

| Свойство | Тип | Описание |
| --- | --- | --- |
| active | Boolean[true] | Включить/выключить логгирование. Рекомендовано отключать логгинг на этапе тестирования. |
| bsodActive | Boolean[true] | Включить/выключить вывод BSOD. Рекомендуется отключать для Production  |
| sessionID | Number | Если нужно связать логирование с Backend вызовами - единая сессия для Frontend и Backend позволит это сделать |
| bsod | ReactElement[Component] | Можно задать свой BSOD Component |
| limit | Number[25] | Лимит на длинну стека. При переполнении первый элемент будет удален |
| getCurrentDate | Function | Формат даты при возникновении ошибки. По умолчанию - new Date().toLocaleString() |
| onError | Function | window.onbeforeunload callback. В данном callback можно обработать стек или отправить его на Backend |
| onPrepareStack | Function | Позволяет добавить дополнительную информацию к стеку перед вызовом onError. Например можно добавить текущую локализацию приложения, тему выбранную пользователем, имя пользователя у кого произошла ошибка и т.д. |
| stdout | Function | Данный метод позволяет вывести лог-метод для пользователя (который был вызван со вторым параметром "true"). Например, при вызове logger.error('Ups...', true) в методе stdout можно выводить alert(message);|

- logger методы:

Логгер поставляемый с **@rockpack/logger** имеет методы:

```js
logger.log('log text here!');
logger.info('Some extra log information');
logger.warn('Warning! Warning!');
logger.debug('I\'m a debug message!');
logger.error('Ups...');
```

Если мы добавим вторым параметром *true*, сообщение переданное в данный лог метод будет передано в stdout *<LoggerContainer>*. Это позволит вывести некоторые полезные для пользователя сообщения, например в tooltip или alert.

## Лицензия MIT

<a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md#%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F-mit" target="_blank">MIT</a>
