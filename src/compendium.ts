import { Weapon, Unit } from './types'


type I_Weapon = [0|1,string,number,number,number,number,string?,string?]
type I_Ability = [2,string,string?]
type I_Action = [3,string,number,string]
type I_Extra = I_Weapon | I_Ability | I_Action
type I_Unit = [string,number,number,number,number,number,number,string,...I_Extra[]]


let next_id = 1;

function units(faction:string, kws:string, units:I_Unit[]) : Unit[] {
  var _kws = kws.split(/, /g);

  return units.map(o => {
    const [name,move,apl,ga,df,sv,hp,kws,...extra] = o;

    var keywords = _kws.concat(kws.split(/, /g));
    var weapons = extra.map((w) : Weapon => {
      if (w[0] === 1 || w[0] === 0) {
        var uname = w[1].replace(/ \|.*$/,'')
        return {
          name:w[1], uname, type: (!w[0] ? 'r' : 'm'), atk:w[2], ws:w[3], dam:w[4], cdam:w[5],
          sr: w[6] || null, cr: w[7] || null
        }
      } else {
        return null as any;
      }
    }).filter(a => a)

    var actions = (extra.filter(x => x[0] === 3) as I_Action[])
      .map(a => ({ name: a[1], cost: a[2], descr: a[3] }));

    var abilities = (extra.filter(x => x[0] === 2) as I_Ability[])
      .map(a => ({name: a[1], descr: a[2] || ""}));

    var id = next_id++;
    return {id,name,faction,keywords,move,apl,ga,df,sv,hp,weapons,actions,abilities};
  });
}


function tau() : Unit[] {
  var markerlight:I_Action = [3, 'Markerlight', 1, 'See page 137'];
  var camo_field:I_Ability = [2, 'Camouflage Field', 'Each time an enemy operative makes a shooting attack, unless it is within @0 of this operative or it is a subsequent attack made as a result of the Blast special rule, this operative is always treated as being in Cover for that shooting attack. While this operative has a Conceal order, it is always treated as having a Conceal order, regardless of any other rules (e.g. Vantage Point).']

  return units('hunter cadre', "t'au, <sept>", [
    [
      "Fire warrior shas'la", 3, 2, 1, 3, 4, 7, "fire warrior, shas'la",
      [0, "Pulse blaster | Close range", 4, 4, 4, 5, 'Rng @5, AP1'],
      [0, "Pulse blaster | Long range", 4, 4, 3, 4],
      [0, "Pulse carbine", 4, 4, 4, 5],
      [0, "Pulse rifle", 4, 4, 4, 5],
      [1, "Gun butt", 3, 5, 2, 3],
      markerlight, camo_field
    ],[
      "Fire warrior shas'ui", 3, 2, 1, 3, 4, 8, "leader, fire warrior, shas'ui",
      [0, "Pulse blaster | Close range", 4, 3, 4, 5, 'Rng @5, AP1'],
      [0, "Pulse blaster | Long range", 4, 3, 3, 4],
      [0, "Pulse carbine", 4, 3, 4, 5],
      [0, "Pulse rifle", 4, 3, 4, 5],
      [1, "Gun butt", 3, 5, 2, 3]
    ],[
      "Pathfinder shas'la", 3, 2, 1, 3, 5, 7, "pathfinder, shas'la",
      [0, 'Pulse carbine', 4, 4, 4, 5],
      [1, 'Gun butt', 3, 5, 2, 3],
    ],[
      "Pathfinder (heavy gunner)", 3, 2, 1, 3, 5, 7, "pathfinder, heavy gunner",
      [0, 'Ion rifle | Standard', 5, 4, 4, 5, '', 'P1'],
      [0, 'Ion rifle | Overcharge', 5, 4, 5, 6, 'AP1, Hot'],
      [0, 'Rail Rifle', 4, 4, 4, 4, 'AP1, Lethal 5+', 'MW2'],
      [1, 'Gun butt', 3, 5, 2, 3]
    ],[
      "Pathfinder shas'ui", 3, 2, 1, 3, 5, 8, "leader, pathfinder, shas'ui",
      [0, 'Pulse carbine', 4, 3, 4, 5],
      [1, 'Gun butt', 3, 5, 2, 3],
      markerlight
    ],[
      "Stealth battlesuit shas'ui", 3, 2, 1, 3, 3, 10, "fly, stealth battlesuit, shas'ui",
      [0, 'Burst cannon', 6, 4, 3, 4, 'Ceaseless, Fusillade'],
      [0, 'Fusion blaster', 4, 4, 6, 3, 'Rng @5, AP2', 'MW4'],
      [1, 'Fists', 4, 5, 2, 3],
      camo_field
    ],[
      "Stealth battlesuit shas'vre", 3, 2, 1, 3, 3, 11, "fly, leader, stealth battlesuit, shas'vre",
      [0, 'Burst cannon', 6, 3, 3, 4, 'Ceaseless, Fusillade'],
      [0, 'Fusion blaster', 4, 4, 6, 3, 'Rng @5, AP2', 'MW4'],
      [1, 'Fists', 4, 4, 2, 3],
      camo_field
    ]
  ]);
}

function smarine() {

  return units('space marine', 'imperium, adeptus astartes, <chapter>', [
    [
      'Intercessor (warrior)', 3, 3, 1, 3, 3, 13, 'primaris, intercessor, warrior',
      [0, 'Auto bolt rifle', 4, 3, 3, 4, 'Ceaseless'],
      [0, 'Bolt rifle', 4, 3, 3, 4, undefined, 'P1'],
      [0, 'Stalker bolt rifle', 4, 3, 3, 4, 'Heavy, AP1'],
      [1, 'Fists', 4, 3, 3, 4]
    ],[
      'Intercessor sergeant', 3, 3, 1, 3, 3, 14, 'primaris, leader, intercessor, sergeant',
      [0, 'Auto bolt rifle', 4, 2, 3, 4, 'Ceaseless'],
      [0, 'Bolt pistol', 4, 2, 3, 4, 'Rng @5'],
      [0, 'Bolt rifle', 4, 2, 3, 4, '', 'P1'],
      [0, 'Hand flamer', 4, 2, 2, 2, 'Rng @5, Torrent @3'],
      [0, 'Plasma Pistol | Standard', 4, 2, 5, 6, 'Rng @5, AP1'],
      [0, 'Plasma Pistol | Supercharge', 4, 2, 5, 6, 'Rng @5, AP2, Hot'],
      [0, 'Stalker bolt rifle', 4, 2, 3, 4, 'Heavy, AP1'],
      [1, 'Chainsword', 4, 3, 4, 5],
      [1, 'Fists', 4, 3, 3, 4],
      [1, 'Power fist', 4, 4, 5, 7, 'Brutal'],
      [1, 'Power weapon', 4, 3, 4, 6, 'Lethal 5+'],
      [1, 'Thunder hammer', 4, 4, 5, 6, '', 'Stun'],
    ]
  ]);
}


const all = [...tau(),...smarine()]
const factions = [...new Set(all.map(u => u.faction))]

const by_faction = (faction:string) => {
  return all.filter(u => (u.faction === faction));
}

const get_clan_descr = (faction:string) => {
  for (let unit of all) {
    if (unit.faction === faction) {
      for (let kw of unit.keywords) {
        let x = kw.match(/^<(.*)>$/)
        if (x) {
          return x[1];
        }
      }
    }
  }
  return '';
}

export const Compendium = {all, factions, by_faction, get_clan_descr}
