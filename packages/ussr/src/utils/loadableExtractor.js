//@ts-ignore
import { ChunkExtractor } from '@loadable/server';

const loadableExtractor = ({
    //@ts-ignore
    stats
}) => {
    if (!stats) {
        return {
            //@ts-ignore
            collectChunks: children => children
        }
    }
    const webExtractor = new ChunkExtractor({
        stats,
        entrypoints: ['index']
    });

    return webExtractor;
};

export default loadableExtractor;
