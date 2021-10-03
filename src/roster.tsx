import {Unit,Dict} from './types'
import {Compendium} from './compendium'


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
  var units = Compendium;
  return <div>{ units.map(u => (<UnitInfo unit={u} />)) }</div>
}
