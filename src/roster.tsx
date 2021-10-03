

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

interface Dict<T> {
  [name:string]: T
}


export function UnitInfo({unit}:{unit:Unit}) {
  var kw_replacement:Dict<string> = {"chapter": "Adulators"};

  var keywords = unit.keywords.map(kw => {
    if (kw.startsWith("::")) {
      kw = kw_replacement[kw.substr(2)] || '';
    }
    return kw ? `, ${kw}` : '';
  }).join('');

  return (
    <div className="unit-info">
      <div className="name">
        {unit.name}<br/>
        <span className="faction">{unit.faction}</span><span className="keywords">{keywords}</span>
      </div>
      <div className="bottom">
        <div className="attrs">
          <div>M</div><div>{unit.move}</div>
          <div>APL</div><div>{unit.apl}</div>
          <div>GA</div><div>{unit.ga}</div>
          <div>DF</div><div>{unit.df}</div>
          <div>SV</div><div>{unit.sv}+</div>
          <div>W</div><div>{unit.hp}</div>
        </div>
        <div className="loadout"><div>
          <div className="weapons">
            <div></div><div>NAME</div><div>A</div><div>BS/WS</div>
            <div>D</div><div>SR</div><div>!</div>
            {unit.weapons.map(w => (<>
              <div>{w.type}</div>
              <div>{w.name}</div>
              <div>{w.atk}</div>
              <div>{w.ws}+</div>
              <div>{w.dam}/{w.cdam}</div>
              <div>{w.sr.length ? w.sr.join(',') : '-'}</div>
              <div>{w.cr.length ? w.cr.join(',') : '-'}</div>
            </>))}
          </div>
        </div></div>
      </div>
    </div>
  )
}


export function TeamRoster() {

  var bolt_rifle:Weapon = {
    name: "Auto bolt rifle", type:"r", atk:4, ws:3, dam:3, cdam:4, sr:["Ceaseless"], cr:[]
  };

  var fists:Weapon = {
    name: "Fists", type:"m", atk:4, ws:3, dam:3, cdam:4, sr:[], cr:[]
  }

  var units:Unit[] = [
    { name: "Intercessor (Warrior)", faction: "space marine",
      keywords: ["imperium", "adeptus astartes", "::chapter", "primaris", "leader",
        "intercessor", "sergeant"],
      move:3, apl:3, ga:1, df:3, sv:3, hp:13,
      weapons: [bolt_rifle,fists] }
  ];


  return <div>
    <UnitInfo unit={units[0]} />
    <UnitInfo unit={units[0]} />
    <UnitInfo unit={units[0]} />
    <UnitInfo unit={units[0]} />
    <UnitInfo unit={units[0]} />
    <UnitInfo unit={units[0]} />
  </div>
}
