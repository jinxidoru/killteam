import {Roster} from './types'
import {Compendium} from './compendium'


type Save = {id:number, name:string, faction:string}
type Saves = Save[]


function storage_get<T>(key:string) : T|null {
  key = `kt_${key}`
  try {
    let json = localStorage.getItem(key)
    if (json) {
      return JSON.parse(json) as T
    }
  } catch (e) {}
  return null;
}

function storage_get_dflt<T>(key:string, dflt:T) : T {
  let val = storage_get<T>(key);
  if (val) {
    return val;
  } else {
    storage_set(key,dflt)
    return dflt;
  }
}

function storage_set<T>(key:string, obj:T) {
  key = `kt_${key}`
  localStorage.setItem(key, JSON.stringify(obj));
}


function scrub_roster(roster:Roster|null) {
  if (roster) {
    const units = Compendium.factions[roster.faction].units

    for (let unit of roster.units) {
      const cunit = units.find(u => (u.name === unit.unit.name));
      if (cunit)  unit.unit = cunit;
    }
  }

  return roster
}


export function autosave(roster:Roster) {
  roster.updated = new Date()
  storage_set('autosave', roster);
}

export function load_autosave() : Roster|null {
  return scrub_roster(storage_get<Roster>('autosave'))
}

export function save(roster:Roster) {
  var saves = storage_get_dflt('saves', [] as Saves)
  var save = saves.find(s => (s.name === roster.name && s.faction === roster.faction));

  // create a new save
  if (!save) {
    var id = Math.max(0, ...saves.map(s => s.id)) + 1;
    save = {id:id, name:roster.name, faction:roster.faction};
    saves.push(save);
    storage_set('saves',saves);
  }

  // write the save
  storage_set(`save_${save?.id}`, roster);
}

export function get_saves() : Saves {
  return storage_get_dflt('saves', [] as Saves)
}

export function load(id:number) : Roster|null {
  return scrub_roster(storage_get<Roster>(`save_${id}`));
}


