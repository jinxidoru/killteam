import {Unit,UnitConf,Weapon,Roster} from './types'
import {Compendium} from './compendium'
import {useState,useRef} from 'react'
import * as ktlib from './ktlib'


const mov1 = (<span className="ktg-m1" />)
const mov2 = (<span className="ktg-m2" />)
const mov3 = (<span className="ktg-m4" />)
const mov6 = (<span className="ktg-m6" />)



function useState2<T>(init:T, onChange: (_:T) => void) : [T,(_:T) => void] {
  const [val,setVal] = useState(init);
  const setVal2 = (nval:T) => {
    setVal(nval);
    onChange(nval);
  }

  return [val,setVal2]
}


export function Root() {
  const [mode,setMode] = useState(0)
  const [roster,setRoster] = useState2(ktlib.load_autosave(), () => setMode(0));

  const onCancel = () => setMode(0);

  let roster_view = <></>
  if (roster) {
    roster_view = (<RosterView roster={roster} onNew={() => setMode(1)} onLoad={() => setMode(2)}/>)
  }
  let create_view = render_if(!roster || mode === 1,
    (<CreateRoster onCreate={setRoster} onCancel={onCancel} />))
  let loader_view = render_if(mode === 2,
    (<LoadRoster onLoad={setRoster} onCancel={onCancel} />))

  return <>{roster_view}{create_view}{loader_view}</>
}


export function CreateRoster(props:{
  onCreate(roster:Roster): void,
  onCancel?: () => void
}) {
  const [name,setName] = useState('')
  const [faction,setFaction] = useState(() => Compendium.random_faction())
  const [clan,setClan] = useState('')

  const {clan_label} = Compendium.factions[faction]

  const create = () => {
    props.onCreate({
      name: name.trim(),
      faction: faction.trim(),
      clan: clan.trim(),
      units: [],
      created: new Date(),
      updated: new Date(),
    })
  }

  return <Modal><div className="kt-create">
    <div>Faction:</div><div><select value={faction} onChange={e => setFaction(e.target.value)}>
      {Object.entries(Compendium.factions).map(([id,f]) => (
            <option key={id} value={id}>{f.name}</option>
      ))}
    </select></div>
    <div>Name:</div><div><input value={name} onChange={e => setName(e.target.value)} /></div>
    <div style={{textTransform:'capitalize'}}>{clan_label}:</div>
    <div><input value={clan} onChange={e => setClan(e.target.value)} /></div>
    <div className="buttons">
      {render_if(!!props.onCancel, (<button onClick={props.onCancel}>Cancel</button>))}
      <button onClick={create} disabled={!name.trim() || !clan.trim()}>Create</button>
    </div>
  </div></Modal>
}


export function RosterView(props:{
  roster:Roster,
  onNew() : void,
  onLoad() : void,
}) {
  const [edit,setEdit] = useState<UnitConf|null>(null)
  const [add,setAdd] = useState(false)

  const roster = props.roster;
  const units = roster.units;
  ktlib.autosave(roster);
  const faction = Compendium.factions[roster.faction]

  // setup the editor
  let editor = render_iff(!!edit || add, () => {

    const onSave = (nconf:UnitConf) => {
      setEdit(null)
      setAdd(false)

      const idx = units.findIndex(u => (u === edit));
      if (idx === -1) {
        units.push(nconf)
      } else {
        units[idx] = nconf;
      }
    }

    const onCancel = (doDelete:boolean) => {
      setEdit(null)
      setAdd(false)

      if (doDelete) {
        const idx = units.findIndex(u => (u === edit));
        if (idx !== -1) {
          units.splice(idx,1);
        }
      }
    }

    if (edit) {
      return (<UnitEditor onSave={onSave} onCancel={onCancel} faction={roster.faction} conf={edit} />)
    } else {
      return (<UnitEditor onSave={onSave} onCancel={onCancel} faction={roster.faction} />)
    }
  })

  // render
  return <div>
    {editor}

    <div className="kt-controls">
      <button onClick={props.onNew}>New</button>
      <button onClick={() => ktlib.save(roster)}>Save</button>
      <button onClick={props.onLoad}>Load</button>
      <button onClick={() => setAdd(true)}>Add Operative</button>
    </div>

    <div className="kt-roster">
      <div className="header">
        <b>Name</b> {roster.name}<br/>
        <b>Faction</b> {faction.name}<br/>
        <b>{faction.clan_label}</b> {roster.clan}
      </div>
      <div className="body">
        <div>{units.map((u,n) => (<DataCard clan={roster.clan} key={n} conf={u} onEdit={() => setEdit(u)} />))}</div>
        <DamageTracker units={units} />
      </div>
    </div>
  </div>
}


function DataCard(props:{
  conf:UnitConf,
  clan:string,
  onEdit(): void,
}) {
  const conf = props.conf;
  const unit = conf.unit;
  var keywords = unit.keywords.map(kw => (kw === '<>') ? `, ${props.clan}` : `, ${kw}`)
  var primary = unit.weapons.filter(w => (w.uname === conf.ranged || w.uname === conf.melee));
  const has_sr = (rule:string) => !!primary.find(wx => wx.sr && (wx.sr.indexOf(rule) !== -1));

  // check if secondary weapons should be enabled
  var weapons = unit.weapons.filter(w => {
    return ((w.secondary !== null) && has_sr(w.secondary))
        || (w.uname === conf.ranged || w.uname === conf.melee);
  });

  // check if any of the abilities are based upon the weapons
  var abilities = unit.abilities.filter(a => {
    return !a.on_weapon || has_sr(a.name);
  });

  // replace special rules
  return (
    <div className="kt-data-card">
      <button className="edit" onClick={props.onEdit}>EDIT</button>
      <div className="name">{conf.count ? `( ${conf.count} ) ` : ''}&nbsp;{unit.name}</div>
      <div className="keywords"><b>{unit.faction}</b>{keywords}</div>
      <div className="info">
        <div className="stats topline"><b>M</b> {unit.move}{mov2} <b>APL</b> {unit.apl} <b>GA</b> {unit.ga} <b>DF</b> {unit.df} <b>SV</b> {unit.sv}+ <b>W</b> {unit.hp}</div>

        {weapons.map((w,n) => (<div key={n} className="weapon">
          <div className="wname"><div className={w.type} />{w.name} &nbsp;&nbsp;</div>
          <div className="stats ">
            <b>A</b> {w.atk} <b>{w.type === 'r' ? 'BS' : 'WS'}</b> {w.ws}+ <b>D</b> {w.dam}/{w.cdam}
            <br/>
            {!w.sr ? null : (<><b>SR</b> </>)}
            {[...(w.sr||"").matchAll(/([^@]+|@.)/g)].map(([x],i) => {
              if (x[0] === '@') {
                let clazz= `ktg-m${x[1]}`
                return (<span key={i} className={clazz} />)
              } else {
                return (<span key={i}>{x}</span>)
              }
            })}
            {!w.cr ? null : (<> <b>!</b> {w.cr} </>)}
          </div>
        </div>))}

        {unit.actions.map((a,n) => (<div key={n} className="extra">
          <div className="i-action" />
          <span>{a.name} - {a.cost} AP</span><span className="descr"> - {a.descr}</span>
        </div>))}

        {abilities.map((a,n) => (<div key={n} className="extra">
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
    {range_array(count).map(i => (<div className="pips" key={n++}>
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
  faction: string,
}) {
  const conf = props.conf;
  const is_edit = !!conf;
  const countRef = useRef(conf ? `${conf.count}`: '0')
  const rangedRef = useRef(conf ? conf.ranged : '')
  const meleeRef = useRef(conf ? conf.melee : '')

  const [unitid,setUnitId] = useState<number>(0)
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
    let {units} = Compendium.factions[props.faction];

    const setId = (id:number) => {
      setUnitId(id)
      setUnit(units.find(u => u.id === id))
    }

    // default the unit selection
    if (units.length && !units.find(u => (u.id === unitid))) {
      setId(units[0].id)
    }

    el1 = (<>
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
    const weapons = unit.weapons.filter(w => !w.secondary);
    let r_weapons = get_unique_weapons('r',weapons);
    const m_weapons = get_unique_weapons('m',weapons);

    if (r_weapons.length === 0) {
      r_weapons = ["-"];
    }

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
    <div className="buttons">
      <button onClick={() => props.onCancel(false)}>Cancel</button>
      {render_if(is_edit, (<button onClick={() => props.onCancel(true)}>Delete</button>))}
      <button onClick={() => onSave()}>{is_edit ? 'Save' : 'Add'}</button>
    </div>
  </div></Modal>);
}


function LoadRoster(props:{
  onLoad(roster:Roster) : void,
  onCancel() : void
}) {
  let saves = ktlib.get_saves()

  const onLoad = (id:number) => {
    let roster = ktlib.load(id)
    if (roster)  props.onLoad(roster)
  }

  return <Modal><div className="kt-loader">
    {saves.map(s => (<button onClick={() => onLoad(s.id)}>
        {s.name} | {Compendium.factions[s.faction].name}
    </button>))}
    <button onClick={props.onCancel}>Cancel</button>
  </div></Modal>
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
