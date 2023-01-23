import type { ChunkExtractor } from '@loadable/server';
import type { ReactNode } from 'react';

declare module '@loadable/server' {
  export interface ChunkExtractorManagerProps {
    extractor: ChunkExtractor;
    children: ReactNode;
  }
}
