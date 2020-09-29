# @rockpack/starter

**@rockpack/starter** это **create-react-app** на стеройдах. Позволяет создавать не только обычное React приложение, а также:
 - Приложение с Server Side Rendering [@rockpack/ussr](https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md)
 - Настроенный линтер с best practices правилами [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md)
 - Настроенный Jest с дополнениями [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md)
 - Typescript, CSS(SCSS, LESS) Modules, @loadable components [@rockpack/compiler](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md)
*А также такие типы приложения как*
- Библиотека. Настроенный webpack для создания UMD библиотеки, как React так и Vanilla JS
- NodeJS приложение. Поддержка ES6 Imports, минификации исходного кода и т.д.

**@rockpack/starter** это модуль является частью проекта **Rockpack** о котором можно прочитать <a href="https://github.com/AlexSergey/rockpack/blob/master/README.md" target="_blank">здесь</a>

## Использование

1. Установка
```shell script
npm i @rockpack/starter -g
```

2. Создание приложения
```shell script
rockpack <project name>
```

3. Выбрать тип приложения, выбрать необходимые модули.

<div style="text-align: center"><img style="width: 100%" src="https://www.rock-book.io/readme_assets/rockpack_starter_1.jpg"></div>

***

*Если вы не можете использовать **@rockpack/starter** или хотите мигрировать ваше существующее приложение воспроьзуйтесь мануальной инструкцией для каждого модуля*

- [@rockpack/compiler](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md#how-it-works)
- [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md#how-it-works)
- [@rockpack/ussr](https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md#how-it-works)
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md#how-it-works)
- [@rockpack/logger](https://github.com/AlexSergey/rockpack/blob/master/packages/logger/README.md#how-it-works)
- [@rockpack/localazer](https://github.com/AlexSergey/rockpack/blob/master/packages/localazer/README.md#how-it-works)

## Лицензия MIT

<a href="https://github.com/AlexSergey/rockpack#%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F-mit" target="_blank">MIT</a>
