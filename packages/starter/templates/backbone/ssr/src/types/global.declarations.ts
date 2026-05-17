declare module '*.bmp' {
  const src: string;
  // eslint-disable-next-line @import-lite/no-default-export
  export default src;
}

declare module '*.gif' {
  const src: string;
  // eslint-disable-next-line @import-lite/no-default-export
  export default src;
}

declare module '*.jpg' {
  const src: string;
  // eslint-disable-next-line @import-lite/no-default-export
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  // eslint-disable-next-line @import-lite/no-default-export
  export default src;
}

declare module '*.png' {
  const src: string;
  // eslint-disable-next-line @import-lite/no-default-export
  export default src;
}

declare module '*.webp' {
  const src: string;
  // eslint-disable-next-line @import-lite/no-default-export
  export default src;
}

declare module '*.svg' {
  const src: string;
  // eslint-disable-next-line @import-lite/no-default-export
  export default src;
}

declare module '*.component.svg' {
  import type * as React from 'react';

  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  // eslint-disable-next-line @import-lite/no-default-export
  export default ReactComponent;
}

declare module '*.css' {
  const src: string;
  // eslint-disable-next-line @import-lite/no-default-export
  export default src;
}

declare module '*.scss' {
  const src: string;
  // eslint-disable-next-line @import-lite/no-default-export
  export default src;
}

declare module '*.less' {
  const src: string;
  // eslint-disable-next-line @import-lite/no-default-export
  export default src;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  // eslint-disable-next-line @import-lite/no-default-export
  export default classes;
}

declare module '*.module.scss' {
  const classes: Record<string, string>;
  // eslint-disable-next-line @import-lite/no-default-export
  export default classes;
}

declare module '*.module.less' {
  const classes: Record<string, string>;
  // eslint-disable-next-line @import-lite/no-default-export
  export default classes;
}

declare module '*.module.sass' {
  const classes: Record<string, string>;
  // eslint-disable-next-line @import-lite/no-default-export
  export default classes;
}
