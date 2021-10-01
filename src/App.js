import logo from './logo.svg';
import './bob.scss';
import {useState,useEffect} from 'react';
import {TeamRoster} from './roster';



const OPTS_APL = [1,2,3,4,5,6];
const OPTS_MOV = [1,2,3,4,5,6];
const OPTS_GA = [1,2,3,4,5,6];
const OPTS_DF = [1,2,3,4,5,6];
const OPTS_SV = [2,3,4,5,6].map(n => `${n}+`);
const OPTS_WOUNDS = [...Array(30).keys()].map(n => (n+1));


function App() {
  return (
    <TeamRoster />
  );
}

function Dropdown({onChange, options, value}) {

  useEffect(() => {
    if (!value)  onChange(options[0]);
  });

  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      {options.map(v => (<option>{v}</option>))}
    </select>
  )
}

function UnitEditor({unit, onChange}) {

  console.log(unit);

  const updater = (key) => {
    return (val) => {
      if (onChange) {
        var nvals = {};
        nvals[key] = val;
        onChange({...unit, ...nvals});
      }
    };
  }

  return (
    <table>
      <tr>
        <td>NAME</td>
        <td>M</td>
        <td>APL</td>
        <td>GA</td>
        <td>DF</td>
        <td>SV</td>
        <td>W</td>
      </tr>
      <tr>
        <td><input type="text" value={unit.name} onChange={e => updater('name')(e.target.value)} /></td>
        <td><Dropdown value={unit.move} options={OPTS_MOV} onChange={updater('move')} /></td>
        <td><Dropdown value={unit.apl} options={OPTS_APL} onChange={updater('apl')} /></td>
        <td><Dropdown value={unit.ga} options={OPTS_GA} onChange={updater('ga')} /></td>
        <td><Dropdown value={unit.df} options={OPTS_DF} onChange={updater('df')} /></td>
        <td><Dropdown value={unit.sv} options={OPTS_SV} onChange={updater('sv')} /></td>
        <td><Dropdown value={unit.wounds} options={OPTS_WOUNDS} onChange={updater('wounds')} /></td>
      </tr>
    </table>
  );
}


function TeamRosterEditor() {
  const [units,setUnits] = useState([
    {name:'Assault Intercessor Sergeant', move:3},
    {name:'Bob Jenkins', apl:3},
  ]);

  const updateUnit = (n,unit) => {
    setUnits(units => units.map((u,i) => (n==i) ? unit : u));
  }

  const addUnit = () => {
    setUnits([...units, {}])
  }

  return (
    <div>
      <button onClick={addUnit}>Add new Unit</button>
      { units.map((unit,n) => (<UnitEditor unit={unit} onChange={u => updateUnit(n,u)} />)) }
    </div>
  );
}


export default App;
