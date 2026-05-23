module.exports = (src, prefix) => {
  return src.map((s) => {
    return `<rootDir>${s}/**/*.${prefix}.{js,jsx,ts,tsx}`;
  });
};
