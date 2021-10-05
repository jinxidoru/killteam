import {Unit,Dict,UnitConf,Weapon} from './types'
import {Compendium} from './compendium'
import {useState,useRef} from 'react'
import * as ktlib from './ktlib'


export function TeamRoster() {
  const [edit,setEdit] = useState<UnitConf|null>(null)
  const [add,setAdd] = useState(false)

  const roster = useRef(ktlib.load_autosave());
  const units = roster.current.units;

  const autosave = () => {
    ktlib.store(roster.current, true);
  }

  // setup the editor
  let editor = render_iff(!!edit || add, () => {

    const onSave = (nconf:UnitConf) => {

      const idx = units.findIndex(u => (u === edit));
      if (idx === -1) {
        units.push(nconf)
      } else {
        units[idx] = nconf;
      }

      autosave()
      setEdit(null)
      setAdd(false)
    }

    const onCancel = (doDelete:boolean) => {
      if (doDelete) {
        const idx = units.findIndex(u => (u === edit));
        if (idx !== -1) {
          units.splice(idx,1);
        }
      }

      autosave()
      setEdit(null)
      setAdd(false)
    }

    if (edit) {
      return (<UnitEditor onSave={onSave} onCancel={onCancel} conf={edit} />)
    } else {
      let faction = units.length ? units[0].unit.faction : Compendium.factions[0]
      return (<UnitEditor onSave={onSave} onCancel={onCancel} faction={faction} />)
    }
  })

  // render
  return <div>
    {editor}

    <div className="kt-controls">
      <button onClick={() => setAdd(true)}>Add Unit</button>
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
  conf?: UnitConf,
  onSave(_:UnitConf): void,
  onCancel(_:boolean): void,
  faction?: string,
}) {
  const conf = props.conf;
  const is_edit = !!conf;
  const countRef = useRef(conf ? `${conf.count}`: '0')
  const rangedRef = useRef(conf ? conf.ranged : '')
  const meleeRef = useRef(conf ? conf.melee : '')

  const [unitid,setUnitId] = useState<number>(0)
  const [faction,setFaction] = useState(props.faction || Compendium.factions[0])
  const [unit,setUnit] = useState(conf?.unit)

  const onSave = () => {
    props.onSave({
      count: ~~countRef.current,
      ranged: rangedRef.current,
      melee: meleeRef.current,
      unit: unit as Unit
    })
  }

  // setup the add unit portion
  var el1:any
  if (!conf) {
    let units = Compendium.by_faction(faction);

    const setId = (id:number) => {
      setUnitId(id)
      setUnit(units.find(u => u.id === id))
    }

    const setFaction_ = (faction:string) => {
      setFaction(faction)
      units = Compendium.by_faction(faction)
      setId(units[0].id)
    }

    // default the unit selection
    if (units.length && !units.find(u => (u.id === unitid))) {
      setId(units[0].id)
    }

    el1 = (<>
      <div>Faction:</div><div>
        <select value={faction} onChange={e => setFaction_(e.target.value)}>
          {Compendium.factions.map(f => (<option key={f}>{f}</option>))}
        </select>
      </div>
      {!units.length ? null : (<><div>Unit:</div><div>
        <select value={unitid} onChange={e => setId(~~e.target.value)}>
          {units.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}
        </select>
      </div></>)}
    </>)
  }

  // setup the configuration part
  var el2:any;
  if (unit) {
    const r_weapons = get_unique_weapons('r',unit.weapons);
    const m_weapons = get_unique_weapons('m',unit.weapons);

    el2 = (<>
      <div>Count:</div><div>
        <Select value={countRef} values={range_array(10).map(n => `${n+1}`)} />
      </div>
      <div>Ranged:</div><div>
        <Select value={rangedRef} values={r_weapons} />
      </div>
      <div>Melee:</div><div>
        <Select value={meleeRef} values={m_weapons} />
      </div>
    </>)
  }

  return (<Modal><div className="kt-unit-editor">
    {el1}{el2}
    <div style={{marginTop:10,gridColumn:'1/3'}}>
      <button onClick={() => props.onCancel(false)}>Cancel</button>
      {render_if(is_edit, (<button onClick={() => props.onCancel(true)}>Delete</button>))}
      <button onClick={() => onSave()}>{is_edit ? 'Save' : 'Add'}</button>
    </div>
  </div></Modal>);
}


function Modal({children}:{children:any}) {
  return (<div className="kt-modal"><div className="inner">{children}</div></div>)
}


function Select({values,value}:{
  values: string[],
  value: React.MutableRefObject<string>,


}) {
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

type RenderFn = () => JSX.Element;

function render_if(cond:boolean, el:JSX.Element) : JSX.Element|null {
  return cond ? el : null;
}

function render_iff(cond:boolean, fn:RenderFn) : JSX.Element|null {
  return cond ? fn() : null;
}
