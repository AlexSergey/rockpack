/* eslint-disable no-unused-vars,import/export */
// / <reference types="node" />
// / <reference types="react" />
// / <reference types="react-dom" />

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}

declare module '*.modules.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.modules.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.modules.sass' {
  const classes: { [key: string]: string };
  export default classes;
}
