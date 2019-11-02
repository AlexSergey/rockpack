import { ChunkExtractor } from '@loadable/server';

export default function makeLoadableExtractor({ stats }) {
    const webExtractor = new ChunkExtractor({
        stats,
        entrypoints: ['index']
    });

    return webExtractor;
}
