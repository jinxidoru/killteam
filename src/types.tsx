
export interface Weapon {
  name: string;
  type: "r"|"m";
  atk: number;
  ws: number;
  dam: number;
  cdam: number;
  sr: string[];
  cr: string[];
}

export interface Unit {
  name: string;
  faction: string;
  keywords: string[];
  move: number;
  apl: number;
  ga: number;
  df: number;
  sv: number;
  hp: number;
  weapons: Weapon[];
}

export interface Dict<T> {
  [name:string]: T
}

