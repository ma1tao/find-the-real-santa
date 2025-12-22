
export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}

export interface GameSettings {
  initialGridSize: number;
  santaImg: string;
  aobaiImg: string;
}
