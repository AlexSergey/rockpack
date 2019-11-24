export default function ignoreFiles(extensions = []) {
    return async (ctx, next) => {
        let isFile = false;
        let pth = ctx.request.originalUrl.replace(/^\/+/, '');

        if (!pth.includes('/')) {
            let [filename, ext] = pth.split('.');

            if (typeof filename === 'string' &&
                typeof ext === 'string') {

                if (extensions.indexOf(ext) >= 0) {
                    isFile = true;
                }
            }
        }

        if (isFile) {
            ctx.status = 204;
        }
        else {
            await next();
        }
    };
}
