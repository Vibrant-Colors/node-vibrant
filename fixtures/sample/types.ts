import { Palette } from '@vibrant/color';

export interface Sample {
  name: string;
  filePath: string;
  palettes: {
    [env: string]: Palette;
  };
}

export interface SampleContext {
  current: Sample[]
  snapshot: Sample[] | null
}