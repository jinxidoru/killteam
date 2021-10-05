import { Weapon, Faction, Dict } from './types'


type I_Weapon = [0|1,string,number,number,number,number,string?,string?,string?]
type I_Ability = [2,string,string?]
type I_Action = [3,string,number,string]
type I_Extra = I_Weapon | I_Ability | I_Action
type I_Unit = [string,number,number,number,number,number,number,string,...I_Extra[]]


let next_id = 1;
const _ = undefined;

function faction(fname:string, faction:string, clan_label:string, kws:string, units_:I_Unit[])
  : Faction
{
  var _kws = kws.split(/, /g);

  let units = units_.map(o => {
    const [name,move,apl,ga,df,sv,hp,kws,...extra] = o;

    var keywords = _kws.concat(kws.split(/, /g));

    var weapons = (extra.filter(x => x[0] === 0 || x[0] === 1) as I_Weapon[]).map(w => {
      var uname = w[1].replace(/ \|.*$/,'')
      return {
        name:w[1], uname, type: (!w[0] ? 'r' : 'm'), atk:w[2], ws:w[3], dam:w[4], cdam:w[5],
        sr: w[6] || null, cr: w[7] || null, secondary:w[8] || null
      } as Weapon
    });

    var actions = (extra.filter(x => x[0] === 3) as I_Action[])
      .map(a => ({ name: a[1], cost: a[2], descr: a[3] }));

    var abilities = (extra.filter(x => x[0] === 2) as I_Ability[])
      .map(a => ({name: a[1], descr: a[2] || "", on_weapon:a[1].endsWith('*')}));

    var id = next_id++;
    return {id,name,faction,keywords,move,apl,ga,df,sv,hp,weapons,actions,abilities};
  });

  return {
    name: fname,
    clan_label, units,
  }
}


function tau() {
  var markerlight:I_Action = [3, 'Markerlight', 1, 'See page 137'];
  var camo_field:I_Ability = [2, 'Camouflage Field', 'Each time an enemy operative makes a shooting attack, unless it is within @0 of this operative or it is a subsequent attack made as a result of the Blast special rule, this operative is always treated as being in Cover for that shooting attack. While this operative has a Conceal order, it is always treated as having a Conceal order, regardless of any other rules (e.g. Vantage Point).']

  return faction("T'au Empire", 'hunter cadre', 'sept', "t'au, <>", [
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

function space_marine() {
  return faction('Space Marines', 'space marine', 'chapter', 'imperium, adeptus astartes, <>', [
    [
      'Intercessor (warrior)', 3, 3, 1, 3, 3, 13, 'primaris, intercessor, warrior',
      [0, 'Auto bolt rifle', 4, 3, 3, 4, 'Ceaseless'],
      [0, 'Bolt rifle', 4, 3, 3, 4, _, 'P1'],
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
      [0, 'Stalker bolt rifle', 4, 2, 3, 4, 'Heavy, A:1'],
      [1, 'Chainsword', 4, 3, 4, 5],
      [1, 'Fists', 4, 3, 3, 4],
      [1, 'Power fist', 4, 4, 5, 7, 'Brutal'],
      [1, 'Power weapon', 4, 3, 4, 6, 'Lethal 5+'],
      [1, 'Thunder hammer', 4, 4, 5, 6, '', 'Stun'],
    ]
  ]);
}

function orks() {
  let kombi:I_Ability = [2, 'Kombi*',
    'An operative equipped with this weapon is also equipped with a shoota.']
  let runt:I_Ability = [2, 'Runt',
    'This operative cannot be equipped with equipment. This operative cannot benefit from your Strategic and Tactical Ploys.'];

  return faction('Orks', 'greenskin', 'clan', 'ork, <>', [
    [
      'Boy (fighter)', 3, 2, 1, 3, 5, 10, 'boy, fighter',
      [0, 'Shoota', 4, 5, 3, 4],
      [0, 'Slugga', 4, 5, 3, 4, 'Rng @5'],
      [1, 'Choppa', 4, 3, 4, 5],
      [1, 'Fists', 3, 3, 3, 4],
    ],[
      'Boss Nob', 3, 2, 1, 3, 4, 13, 'leader, boy, boss nob',
      [0, 'Kombi-rokkit', 5, 5, 4, 5, 'Kombi*, Limited, AP1', 'Splash 1'],
      [0, 'Kombi-skorcha', 6, 2, 2, 2, 'Kombi*, Limtied, Rng @5, Torrent @1'],
      [0, 'Shoota', 4, 5, 3, 4, _, _, kombi[1]],
      [0, 'Slugga', 4, 5, 3, 4, 'Rng @5'],
      [1, 'Big choppa', 4, 2, 5, 6],
      [1, 'Choppa', 4, 2, 4, 5],
      [1, 'Fists', 3, 2, 3, 4],
      [1, 'Killsaw', 4, 3, 5, 7, _, 'Rending'],
      [1, 'Power klaw', 4, 3, 5, 7, 'Brutal'],
      kombi,
    ],[
      'Boy (gunner)', 3, 2, 1, 3, 5, 10, 'boy, gunner',
      [0, 'Big shoota', 6, 5, 2, 3, 'Fusillade'],
      [0, 'Rokkit launcha', 5, 5, 4, 5, 'AP1', 'Splash 1'],
      [1, 'Fists', 3, 3, 3, 4],
    ],[
      'Gretchin', 3, 2, 2, 3, 6, 5, 'boy, gretchin',
      [0, 'Gretchin blasta', 3, 4, 2, 3, 'Rng @5'],
      [1, 'Gretchin knife', 3, 5, 1, 2],
      runt,
    ],[
      'Clan kommando (fighter)', 3, 2, 1, 3, 5, 10, 'clan kommando, fighter',
      [0, 'Slugga', 4, 5, 3, 4, 'Rng @5'],
      [1, 'Choppa', 4, 3, 4, 5],
    ],[
      'Clan kommando nob', 3, 2, 1, 3, 4, 13, 'leader, clan kommando, kommando nob',
      [0, 'Slugga', 4, 4, 3, 4, 'Rng @5'],
      [1, 'Choppa', 4, 2, 4, 5],
      [1, 'Power klaw', 4, 3, 5, 7, 'Brutal'],
    ],[
      'Burna boy', 3, 2, 1, 3, 5, 10, 'speshulist, burna boy',
      [0, 'Burna', 5, 2, 2, 2, 'Rng @5, Torrent @1'],
      [1, 'Fists', 3, 3, 3, 4],
    ],[
      'Loota', 3, 2, 1, 3, 5, 10, 'speshulist, loota',
      [0, 'Deffgun', 5, 5, 4, 6],
      [1, 'Fists', 3, 3, 3, 4],
    ],[
      'Spanner', 3, 2, 1, 3, 5, 11, 'leader, speshulist, spanner',
      [0, 'Big shoota', 6, 4, 2, 3, 'Fusillade'],
      [0, 'Kustom mega-blasta', 4, 4, 5, 6, 'AP2, Hot'],
      [0, 'Rokkit launcha', 5, 4, 4, 5, 'AP1', 'Splash 1'],
      [1, 'Fists', 3, 3, 3, 4],
    ]
  ]);
}



const factions:Dict<Faction> = {
  tau: tau(),
  space_marine: space_marine(),
  ork: orks(),
}

function random_faction() {
  return Object.keys(factions).sort(() => Math.random()-.5)[0];
}

export const Compendium = {factions, random_faction}


