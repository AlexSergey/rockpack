declare module '*.svg' {
  import type React from 'react';
  const SvgComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SvgComponent;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.css' {}
declare module '*.scss' {}
declare module '*.less' {}
