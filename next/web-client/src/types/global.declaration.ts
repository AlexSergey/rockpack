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
  const src: string;
  export default src;
}

declare module '*.component.svg' {
  import * as React from 'react';

  const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.css' {
  const src: string;
  export default src;
}

declare module '*.scss' {
  const src: string;
  export default src;
}

declare module '*.less' {
  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}
