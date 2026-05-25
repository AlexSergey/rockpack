declare module '*.svg' {
  const content: string;
  export default content;
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

declare module '*.module.scss' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module '*.scss' {}

declare module '*.module.less' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module '*.less' {}
