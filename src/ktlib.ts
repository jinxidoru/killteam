import {Roster,Dict} from './types'
import {Compendium} from './compendium'


interface Storage {
  autosave?: Roster
  rosters: Dict<Roster>
}


function with_storage<T>(update:boolean, fn:(_:Storage) => T) {
  let storage:Storage = { rosters:{} };
  try {
    storage = JSON.parse(localStorage.getItem('kt') as string) as Storage;
  } catch (e) {
    localStorage.setItem('kt', JSON.stringify(storage));
  }

  let rv = fn(storage);
  if (update) {
    localStorage.setItem('kt', JSON.stringify(storage));
  }
  return rv;
}


export function store(roster:Roster, is_auto:boolean) {
  roster.updated = new Date()

  with_storage(true, storage => {
    if (is_auto) {
      storage.autosave = roster;
    } else {
      storage.rosters[roster.name] = roster;
    }
  });
}

export function load_autosave() : Roster {
  return with_storage(false, storage => {
    if (storage.autosave) {
      return storage.autosave;
    } else {
      return {
        name: "New Kill Team",
        faction: Compendium.factions.sort(() => Math.random()-.5)[0],
        units: [],
        created: new Date(),
        updated: new Date()
      }
    }
  });
}
