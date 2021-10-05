
export interface Weapon {
  name: string;
  uname: string;
  type: "r"|"m";
  atk: number;
  ws: number;
  dam: number;
  cdam: number;
  sr: string|null;
  cr: string|null;
  secondary: string|null;
}

export interface Unit {
  id: number;
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
  actions: {
    name: string;
    cost: number;
    descr: string;
  }[]
  abilities: {
    name: string;
    descr: string;
    on_weapon: boolean;
  }[]
}

export interface UnitConf {
  unit: Unit
  count: number
  ranged: string
  melee: string
}

export interface Roster {
  name: string
  faction: string
  clan: string
  units: UnitConf[]

  created: Date
  updated: Date
}

export interface Faction {
  name: string
  clan_label: string
  units: Unit[]
}

export interface Dict<T> {
  [name:string]: T
}
