<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/starter

**@rockpack/starter** this is **create-react-app** on steroids. Supports the following types of applications:

**@rockpack/starter** this module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

**React SPA** – Preset for a Single Page Application using React.
**React SPA + SSR** – Preset for a React Single Page Application with Server-Side Rendering.
**React Component** – Preset for publishing a reusable React component to NPM.
**UMD Library** – Preset for a vanilla JavaScript UMD library, suitable for NPM publishing.

*All types of applications support:*
- Import of many file formats. [List of formats](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md)
- Image optimization, SVG Optimization
- Loading SVG files as React components
- CSS/SCSS/Less modules
- Babel or TS; TS support for CSS/SCSS/Less modules
- PostCSS Autoprefixer
- SEO Optimizations, React optimizations, Antd optimizations
- Support for settings via Dotenv and Dotenv safe
- Bundle Analyzer
- GraphQL support

Full list of features see [here](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md)

*Additionally, for each type of application, you can install:*
- Configured ESLint with best practices rules [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md)
- Customized Jest with additions [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md)

## Using

1. Installation

```shell script
npm i @rockpack/starter -g
```

2. Creating an App
```shell script
rockpack <project name>
```

3. Select the type of application.

![Rockpack Starter](https://www.natrube.net/rockpack/readme_assets/rockpack_starter_1.v3.jpg)
***

## Arguments
*--yarn* - use Yarn as default package manager
```shell script
rockpack <project name> --yarn
```

***
*If you can't use **@rockpack/starter** or want to migrate your existing application please follow the manual for each module*

- [@rockpack/compiler](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md#how-it-works)
- [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md#how-it-works)
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md#how-it-works)

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
