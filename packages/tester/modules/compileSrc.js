module.exports = (argv, src, options) => {
  src.forEach(s => {
    argv += ` --testMatch="<rootDir>${s}/**/*.${options.prefix}.{js,jsx,ts,tsx}"`;
  });
  return argv;
};