import {Unit,Dict,UnitConf,Weapon} from './types'
import {Compendium} from './compendium'
import {useState,useRef} from 'react'


export function TeamRoster() {
  const [edit,setEdit] = useState<UnitConf|null>(null)
  const roster = useRef(Compendium.all.filter((u,n) => (n===0)).map(u => ({
    count: Math.ceil(Math.random()*5), unit: u, ranged:"", melee:""
  })));

  const units = roster.current;

  const onSave = (nconf:UnitConf|null) => {
    const idx = units.findIndex(u => (u === edit));
    if (idx === -1) {
      if (nconf !== null) {
        units.push(nconf)
      }
    } else if (nconf === null) {
      units.splice(idx,1)
    } else {
      units[idx] = nconf;
    }
    setEdit(null)
  }

  return <div>
    {edit ? (<UnitEditor conf={edit} onSave={onSave} />) : null}

    <div className="kt-controls">
    </div>

    <div className="kt-roster">
      <div>{units.map((u,n) => (<UnitInfo key={n} conf={u} onEdit={() => setEdit(u)} />))}</div>
      <DamageTracker units={units} />
    </div>
  </div>
}


function UnitInfo(props:{
  conf:UnitConf,
  onEdit(): void,
}) {
  const conf = props.conf;
  const unit = conf.unit;
  var keywords = resolve_keywords(unit);
  var weapons = unit.weapons.filter(w => (w.uname === conf.ranged || w.uname === conf.melee));

  return (
    <div className="kt-unit-info">
      <button className="edit" onClick={props.onEdit}>EDIT</button>
      <div className="name">{conf.count ? `[${conf.count}] ` : ''}{unit.name}</div>
      <div className="keywords"><b>{unit.faction}</b>{keywords}</div>
      <div className="info">
        <div className="stats topline"><b>M</b> {unit.move} <b>APL</b> {unit.apl} <b>GA</b> {unit.ga} <b>DF</b> {unit.df} <b>SV</b> {unit.sv}+ <b>W</b> {unit.hp}</div>

        {weapons.map((w,n) => (<div key={n} className="weapon">
          <div className="wname"><div className={w.type} />{w.name} &nbsp;&nbsp;</div>
          <div className="stats ">
            <b>A</b> {w.atk} <b>{w.type === 'r' ? 'BS' : 'WS'}</b> {w.ws} <b>D</b> {w.dam}/{w.cdam}
            <br/>
            {!w.sr ? null : (<><b>SR</b> {w.sr} </>)}
            {!w.cr ? null : (<><b>!</b> {w.cr} </>)}
          </div>
        </div>))}

        {unit.actions.map((a,n) => (<div key={n} className="extra">
          <div className="i-action" />
          <span>{a.name} - {a.cost} AP</span><span className="descr"> - {a.descr}</span>
        </div>))}

        {unit.abilities.map((a,n) => (<div key={n} className="extra">
          <div className="i-ability" />
          <span>{a.name}</span><span className="descr"> - {a.descr}</span>
        </div>))}

      </div>
    </div>
  )
}

function DamageTracker({units}:{units:UnitConf[]}) {
  var n = 0;
  var each = units.map(({unit,count}) => (<div key={n++} className="unit">
    <div className="name">{unit.name}</div>
    {range_array(count).map(() => (<div key={n++}>
        {range_array(Math.ceil(unit.hp/2)).map(() => 'O').join('')}&nbsp;&nbsp;
        {range_array(Math.floor(unit.hp/2)).map(() => 'O').join('')}
    </div>))}
  </div>));

  return <div className="kt-dam-track">{each}</div>
}


function UnitEditor(props:{
  conf: UnitConf,
  onSave(_:UnitConf|null): void
}) {
  const conf = props.conf;
  const countRef = useRef(`${conf.count}`)
  const rangedRef = useRef(conf.ranged)
  const meleeRef = useRef(conf.melee)

  const onDelete = () => {
    props.onSave(null)
  }

  const onSave = () => {
    var nconf = Object.assign({},conf)
    nconf.count = parseInt(countRef.current);
    nconf.ranged = rangedRef.current;
    nconf.melee = meleeRef.current;
    props.onSave(nconf)
  }


  const r_weapons = get_unique_weapons('r',conf.unit.weapons);
  const m_weapons = get_unique_weapons('m',conf.unit.weapons);

  return (<Modal><div className="kt-unit-editor">
    <div>Count:</div><div>
      <Select value={countRef} values={range_array(10).map(n => `${n+1}`)} />
    </div>
    <div>Ranged:</div><div>
      <Select value={rangedRef} values={r_weapons} />
    </div>
    <div>Melee:</div><div>
      <Select value={meleeRef} values={m_weapons} />
    </div>
    <div style={{marginTop:10,gridColumn:'1/3'}}>
      <button onClick={() => onDelete()}>Delete</button>&nbsp;
      <button onClick={() => onSave()}>Save</button>
    </div>
  </div></Modal>);
}


function Modal({children}:{children:any}) {
  return (<div className="kt-modal"><div className="inner">{children}</div></div>)
}


function Select({values,value}:{values:string[], value:React.MutableRefObject<string>}) {
  const [state,setState] = useState(value.current)

  if (!values.find(x => (x===state))) {
    set(values[0]);
  }

  function set(nval:string) {
    value.current = nval;
    setState(nval)
  }

  return (<select value={state} onChange={e => set(e.target.value)}>
    {values.map(n => (<option key={n}>{n}</option>))}
  </select>)
}



// ---- helper functions
function resolve_keywords(unit:Unit) {
  var kw_replacement:Dict<string> = {};

  return unit.keywords.map(kw => {
    if (kw.startsWith("<")) {
      var kwx = kw_replacement[kw.substr(1,kw.length-2)] || '';
      if (kwx)  kw = kwx;
    }
    return `, ${kw}`
  }).join('');
}

function range_array(n:number) {
  return Array.from(Array(n).keys());
}

function get_unique_weapons(type:'r'|'m', weapons:Weapon[]) {
  let names = weapons.filter(w => w.type === type).map(w => w.uname)
  return [...new Set(names)]
}
