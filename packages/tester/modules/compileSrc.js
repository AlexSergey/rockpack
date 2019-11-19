module.exports = function(argv, src, options) {
    src.forEach(src => {
        argv += ` --testMatch="<rootDir>${src}/**/*.${options.prefix}.{js,jsx,ts,tsx}"`;
    });
    return argv;
}
