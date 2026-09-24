declare module '*.component.svg' {
  const Component: React.FC<React.SVGProps<SVGSVGElement>>;
  export default Component;
}

declare module '*.svg' {
  const url: string;
  export default url;
}

declare module '*.png' {
  const url: string;
  export default url;
}

declare module '*.md' {
  const html: string;
  export default html;
}

declare module '*.mdx' {
  const Component: React.FC;
  export default Component;
}

declare module '*.wasm' {
  const instantiate: () => Promise<WebAssembly.WebAssemblyInstantiatedSource>;
  export default instantiate;
}

declare module '*.css';
