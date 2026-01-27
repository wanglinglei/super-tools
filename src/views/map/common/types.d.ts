import type { mapDefaultConfig } from './constants';
export interface BaseMapProps {
  containerId: string;
  baseMapConfig?: Partial<typeof mapDefaultConfig>;
}