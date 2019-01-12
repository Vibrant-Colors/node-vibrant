import { Palette } from '../../src/color';

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