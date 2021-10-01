

interface Weapon {
  name: string;
  type: "r"|"m";
  atk: number;
  ws: number;
  dam: number;
  cdam: number;
  sr: string[];
  cr: string[];
}

interface Unit {
  name: string;
  move: number;
  apl: number;
  ga: number;
  df: number;
  sv: number;
  hp: number;
  weapons: Weapon[];
}


export function UnitInfo({unit}:{unit:Unit}) {
  return (
    <div className="unit-info">
      <div className="name">{unit.name}</div>
      <div className="attrs">
        <div>
          <span><span>M</span><span>{unit.move}</span></span>
          <span><span>APL</span><span>{unit.apl}</span></span>
        </div>
        <div>
          <span><span>GA</span><span>{unit.ga}</span></span>
          <span><span>DF</span><span>{unit.df}</span></span>
        </div>
        <div>
          <span><span>SV</span><span>{unit.sv}+</span></span>
          <span><span>W</span><span>{unit.hp}</span></span>
        </div>
      </div>
      {unit.weapons.map(w => (
        <div className="weapon">
          <div className="name">{w.name}</div>
          <div className="attrs">
            <span><span>A</span><span>{w.atk}</span></span>
            <span><span>{w.type == 'r' ? 'WS' : 'BS'}</span><span>{unit.ws}+</span></span>
            <span><span>D</span><span>{w.dam}/{w.cdam}</span></span>
            <span><span>SR</span><span>{w.sr.join(', ')}</span></span>
            <span><span>!</span><span>{w.cr.join(', ')}</span></span>
          </div>
        </div>
      ))}
    </div>
  )
}


export function TeamRoster() {

  var bolt_rifle:Weapon = {
    name: "Auto bolt rifle", type:"r", atk:4, ws:3, dam:3, cdam:4, sr:["Ceaseless"], cr:[]
  };

  var units:Unit[] = [
    { name: "Intercessor (Warrior)", move:3, apl:3, ga:1, df:3, sv:3, hp:13,
      weapons: [bolt_rifle] }
  ];


  return <UnitInfo unit={units[0]} />
}
