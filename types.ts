
export interface Point {
  x: number;
  y: number;
}

export interface Landmark extends Point {
  z: number;
}

export enum GestureType {
  NONE = 'NONE',
  OPEN_PALM = 'OPEN_PALM',
  FIST = 'FIST',
  WAVE = 'WAVE'
}

export interface HandData {
  landmarks: Landmark[];
  gesture: GestureType;
  center: Point;
}

export enum ParticleType {
  SNOWFLAKE = 'SNOWFLAKE',
  STAR = 'STAR',
  BOKEH = 'BOKEH'
}

export interface ParticleConfig {
  color: string;
  size: number;
  speed: number;
  type: ParticleType;
}
