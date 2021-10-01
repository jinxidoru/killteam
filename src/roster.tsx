

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


export function UnitInfo({unit}:{unit:Unit}) {
  var kw_replacement = {"chapter": "Adulators"};

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
          {unit.weapons.map(w => (
              <div className="weapon">
                <div className="wname">{w.name}</div>
                <div>A</div>
                <div>{w.atk}</div>
                <div>{w.type === 'r' ? 'WS' : 'BS'}</div>
                <div>{w.ws}+</div>
                { w.sr.length ? (<><div>SR</div><div>{w.sr.join(', ')}</div></>) : null }
                { w.cr.length ? (<><div>!</div><div>{w.cr.join(', ')}</div></>) : null }
              </div>
          ))}
        </div></div>
      </div>
    </div>
  )


  /*
  return (
    <div className="unit-info">
      <div className="name">{unit.name}</div>
      <div className="attrs">
        <div>
          <span><span>M</span><span>{unit.move}</span></span>
          <span><span>APL</span><span>{unit.apl}</span></span>
        </div>
        <div>
        </div>
        <div>
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
  */
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
