import {Unit,Dict} from './types'
import {Compendium} from './compendium'
import {useState} from 'react'


export function UnitInfo({unit}:{unit:Unit}) {
  var keywords = resolve_keywords(unit);
  var count = 3;

  return (
    <div className="kt-unit-info2">
      <div className="name">{count ? `[${count}] ` : ''}{unit.name}</div>
      <div className="keywords"><b>{unit.faction}</b>{keywords}</div>
      <div className="info">
        <div className="stats topline"><b>M</b> {unit.move} <b>APL</b> {unit.apl} <b>GA</b> {unit.ga} <b>DF</b> {unit.df} <b>SV</b> {unit.sv}+ <b>W</b> {unit.hp}</div>

        {unit.weapons.map(w => (<div className="weapon">
          <div className="wname"><div className={w.type} />{w.name} &nbsp;&nbsp;</div>
          <div className="stats ">
            <b>A</b> {w.atk} <b>{w.type === 'r' ? 'BS' : 'WS'}</b> {w.ws} <b>D</b> {w.dam}/{w.cdam}
            <br/>
            {!w.sr ? null : (<><b>SR</b> {w.sr} </>)}
            {!w.cr ? null : (<><b>!</b> {w.cr} </>)}
          </div>
        </div>))}

        {unit.actions.map(a => (<div className="extra">
          <div className="i-action" />
          <span>{a.name} - {a.cost} AP</span><span className="descr"> - {a.descr}</span>
        </div>))}

        {unit.abilities.map(a => (<div className="extra">
          <div className="i-ability" />
          <span>{a.name}</span><span className="descr"> - {a.descr}</span>
        </div>))}

      </div>
    </div>
  )
}

/*
*/

export function TeamRoster() {
  var units = Compendium;

  return <div>
    <div className="controls">
    </div>
    <div>{units.map(u => (<UnitInfo unit={u} />))}</div>
  </div>
}



// ---- helper functions

function resolve_keywords(unit:Unit) {
  var kw_replacement:Dict<string> = {
    "chapter": "Adulators",
    "sept": "goobers"
  };

  return unit.keywords.map(kw => {
    if (kw.startsWith("<")) {
      kw = kw_replacement[kw.substr(1,kw.length-2)] || '';
    }
    return kw ? `, ${kw}` : '';
  }).join('');
}


