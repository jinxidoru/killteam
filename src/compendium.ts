import { Weapon, Faction, Dict } from './types'


type I_Weapon = [0|1,string,number,number,number,number,string?,string?,I_Ability?]
type I_Ability = [2,string,string?]
type I_Action = [3,string,number,string]
type I_Extra = I_Weapon | I_Ability | I_Action
type I_Unit = [string,number,number,number,number,number,number,string,...I_Extra[]]


let next_id = 1;
const _ = undefined;

function faction(fname:string, faction:string, clan_label:string, kws:string, units_:I_Unit[])
  : Faction
{
  var _kws = (kws.length > 0) ? kws.split(/, /g) : [];

  let units = units_.map(o => {
    const [name,move,apl,ga,df,sv,hp,kws,...extra] = o;

    var keywords = _kws.concat(kws.split(/, /g));

    var weapons = (extra.filter(x => x[0] === 0 || x[0] === 1) as I_Weapon[]).map(w => {
      var uname = w[1].replace(/ \|.*$/,'')
      return {
        name:w[1], uname, type: (!w[0] ? 'r' : 'm'), atk:w[2], ws:w[3], dam:w[4], cdam:w[5],
        sr: w[6] || null, cr: w[7] || null, secondary:w[8] ? (w[8][1]) : null
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


const icon_bearer:I_Ability = [2, 'Icon Bearer', "When determining control of an objective marker, treat this operative's APL as being 1 higher. Note that this is not a modifier. In narrative play, this is cumulative with the Focused Battle Honour (see the Kill Team Core Book)."];



function tau() {
  var markerlight:I_Action = [3, 'Markerlight', 1, 'See page 137'];
  var camo_field:I_Ability = [2, 'Camouflage Field', 'Each time an enemy operative makes a shooting attack, unless it is within @0 of this operative or it is a subsequent attack made as a result of the Blast special rule, this operative is always treated as being in Cover for that shooting attack. While this operative has a Conceal order, it is always treated as having a Conceal order, regardless of any other rules (e.g. Vantage Point).']

  return faction("T'au Empire", 'hunter cadre', 'sept', "t'au, <>", [
    [
      "Fire warrior shas'la", 3, 2, 1, 3, 4, 7, "fire warrior, shas'la",
      [0, "Pulse blaster | Close range", 4, 4, 4, 5, 'Rng @6, AP1'],
      [0, "Pulse blaster | Long range", 4, 4, 3, 4],
      [0, "Pulse carbine", 4, 4, 4, 5],
      [0, "Pulse rifle", 4, 4, 4, 5],
      [1, "Gun butt", 3, 5, 2, 3],
      markerlight, camo_field
    ],[
      "Fire warrior shas'ui", 3, 2, 1, 3, 4, 8, "leader, fire warrior, shas'ui",
      [0, "Pulse blaster | Close range", 4, 3, 4, 5, 'Rng @6, AP1'],
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
      [0, 'Fusion blaster', 4, 4, 6, 3, 'Rng @6, AP2', 'MW4'],
      [1, 'Fists', 4, 5, 2, 3],
      camo_field
    ],[
      "Stealth battlesuit shas'vre", 3, 2, 1, 3, 3, 11, "fly, leader, stealth battlesuit, shas'vre",
      [0, 'Burst cannon', 6, 3, 3, 4, 'Ceaseless, Fusillade'],
      [0, 'Fusion blaster', 4, 4, 6, 3, 'Rng @6, AP2', 'MW4'],
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
      [0, 'Bolt pistol', 4, 2, 3, 4, 'Rng @6'],
      [0, 'Bolt rifle', 4, 2, 3, 4, '', 'P1'],
      [0, 'Hand flamer', 4, 2, 2, 2, 'Rng @6, Torrent @1'],
      [0, 'Plasma Pistol | Standard', 4, 2, 5, 6, 'Rng @6, AP1'],
      [0, 'Plasma Pistol | Supercharge', 4, 2, 5, 6, 'Rng @6, AP2, Hot'],
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
      [0, 'Slugga', 4, 5, 3, 4, 'Rng @6'],
      [1, 'Choppa', 4, 3, 4, 5],
      [1, 'Fists', 3, 3, 3, 4],
    ],[
      'Boss Nob', 3, 2, 1, 3, 4, 13, 'leader, boy, boss nob',
      [0, 'Kombi-rokkit', 5, 5, 4, 5, 'Kombi*, Limited, AP1', 'Splash 1'],
      [0, 'Kombi-skorcha', 6, 2, 2, 2, 'Kombi*, Limtied, Rng @6, Torrent @1'],
      [0, 'Shoota', 4, 5, 3, 4, _, _, kombi],
      [0, 'Slugga', 4, 5, 3, 4, 'Rng @6'],
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
      [0, 'Gretchin blasta', 3, 4, 2, 3, 'Rng @6'],
      [1, 'Gretchin knife', 3, 5, 1, 2],
      runt,
    ],[
      'Clan kommando (fighter)', 3, 2, 1, 3, 5, 10, 'clan kommando, fighter',
      [0, 'Slugga', 4, 5, 3, 4, 'Rng @6'],
      [1, 'Choppa', 4, 3, 4, 5],
    ],[
      'Clan kommando nob', 3, 2, 1, 3, 4, 13, 'leader, clan kommando, kommando nob',
      [0, 'Slugga', 4, 4, 3, 4, 'Rng @6'],
      [1, 'Choppa', 4, 2, 4, 5],
      [1, 'Power klaw', 4, 3, 5, 7, 'Brutal'],
    ],[
      'Burna boy', 3, 2, 1, 3, 5, 10, 'speshulist, burna boy',
      [0, 'Burna', 5, 2, 2, 2, 'Rng @6, Torrent @1'],
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

function death_guard() {
  const kw_base = `chaos, bubonic astartes, <>`
  const kw_marine = `${kw_base}, plague marine`

  let resilient:I_Ability = [2, 'Disgustingly Resilient', 'Each time this operative would lose a wound, roll one 06: on a 5+, that wound is not lost. Other than the effects of Battle Scars, this operative cannot be injured.']

  return faction('Death Guard', 'death guard', 'company', '', [
    [
      'Plague marine (warrior)', 2, 3, 1, 3, 3, 12, `${kw_marine}, warrior`,
      [0, 'Boltgun', 4, 3, 3, 4],
      [1, 'Plague knife', 3, 3, 3, 5],
      resilient
    ],[
      'Plague marine (gunner)', 2, 3, 1, 3, 3, 12, `${kw_marine}, gunner`,
      [0, 'Meltagun', 4, 3, 6, 3, 'Rng @6, AP2', 'MW4'],
      [0, 'Plague belcher', 5, 2, 2, 3, 'Rng @6, Torrent @1'],
      [0, 'Plasma gun | Standard', 4, 3, 5, 6, 'AP1'],
      [0, 'Plasma gun | Supercharge', 4, 3, 5, 6, 'AP2, Hot'],
      [1, 'Plague knife', 3, 3, 3, 5],
      resilient
    ],[
      'Plague marine (heavy gunner)', 2, 3, 1, 3, 3, 12, `${kw_marine}, heavy gunner`,
      [0, 'Blight launcher', 4, 3, 4, 6, 'AP1'],
      [0, 'Plague spewer', 6, 2, 2, 3, 'Rng @6, Torrent @1'],
      [1, 'Plague knife', 3, 3, 3, 5],
      resilient
    ],[
      'Plague marine (fighter)', 2, 3, 1, 3, 3, 12, `${kw_marine}, fighter`,
      [0, 'Bolt pistol', 4, 3, 3, 4, 'Rng @6'],
      [1, 'Bubotic axe', 5, 3, 4, 6, _, 'Rending'],
      [1, 'Flail of corruption', 5, 3, 4, 5, _, 'Reap 2'],
      [1, 'Great plague cleaver', 5, 4, 5, 7, _, 'Rending'],
      [1, 'Mace of contagion', 5, 3, 4, 5, _, 'Stun'],
      [1, 'Plague knives', 5, 3, 3, 5, 'Relentless'],
      resilient
    ],[
      'Plague marine (icon bearer)', 2, 3, 1, 3, 3, 12, `${kw_marine}, icon bearer`,
      [0, 'Boltgun', 4, 3, 3, 4],
      [1, 'Plague knife', 3, 3, 3, 5],
      resilient,
      icon_bearer,
      [3, 'Icon of Decay', 1, "Until the end of the Turning Point, while this operative is Visible to and within @3 of a friendly BUBONIC ASTARTES operative, that friendly operative is invigorated by decay. While an operative is invigorated by decay, when rolling for its Disgustingly Resilient ability, you can re-roll results of 1 and 2."]
    ],[
      'Plague marine champion', 3, 3, 1, 3, 3, 13, `${kw_base}, leader, plague marine, champion`,
      [0, 'Boltgun', 4, 2, 3, 4],
      [0, 'Bolt pistol', 4, 2, 3, 4, 'Rng @6'],
      [0, 'Plasma pistol | Standard', 4, 2, 5, 6, 'Rng @6, AP1'],
      [0, 'Plasma pistol | Supercharge', 4, 2, 5, 6, 'Rng @6, AP2, Hot'],
      [1, 'Plague knife', 5, 2, 3, 5],
      [1, 'Plague sword', 5, 2, 4, 6],
      [1, 'Power fist', 5, 3, 5, 7, 'Brutal']
    ],[
      'Poxwalker', 2, 2, 2, 3, 6, 7, 'chaos, poxwalker',
      [1, 'Improvised weapon', 4, 4, 2, 3],
      resilient,
      [2, 'Mindless', "Each time this operative would perform a mission action or the Pick Up action, you must subtract one additional AP to do so. This operative cannot be equipped with equipment. In narrative play, it cannot gain (or lose) experience and automatically passes Casualty tests."]
    ]
  ]);
}

function ecclesiarchy() {
  const kw_base = 'imperium, adeptus ministorum, adepta sororitas, <>'
  const kw_bsister = `${kw_base}, battle sister`
  let combi:I_Ability = [2, 'Combi*',
    'An operative equipped with this weapon is also equipped with a boltgun.']

  return faction('Ecclesiarchy', 'ecclesiarchy', 'order', '', [
    [
      'Battle sister (warrior)', 3, 2, 1, 3, 3, 8, `${kw_bsister}, warrior`,
      [0, 'Boltgun', 4, 3, 3, 4],
      [1, 'Gun butt', 3, 4, 2, 3],
    ],[
      'Battle sister (icon bearer)', 3, 2, 1, 3, 3, 8, `${kw_bsister}, icon bearer`,
      [0, 'Boltgun', 4, 3, 3, 4],
      [1, 'Gun butt', 3, 4, 2, 3],
      icon_bearer,
      [3, 'Icon of Purity', 1, "Until the end of the Turning Point, while this operative is Visible to and within @3 of a friendly ADEPTA SORORITAS operative, that friendly operative is inspired by purity. While an operative is inspired by purity, each time it fights in combat or makes a shooting attack, in the Roll Attack Dice step of that combat or shooting attack, you can retain one of your attack dice results of 5+ that is a successful hit as a critical hit."]
    ],[
      'Battle sister (gunner)', 3, 2, 1, 3, 3, 8, `${kw_bsister}, gunner`,
      [0, 'Meltagun', 4, 3, 6, 3, 'Rng @6, AP2', 'MW4'],
      [0, 'Ministorum flamer', 5, 2, 2, 3, 'Rng @6, Torrent @2'],
      [0, 'Storm bolter', 4, 3, 3, 4, 'Relentless'],
      [1, 'Gun butt', 3, 4, 2, 3]
    ],[
      'Battle sister (heavy gunner)', 3, 2, 1, 3, 3, 8, `${kw_bsister}, heavy gunner`,
      [0, 'Heavy bolter', 5, 3, 4, 5, 'Heavy, Fusillade', 'P1'],
      [0, 'Ministorum heavy flamer', 6, 2, 2, 3, 'Heavy, Rng @6, Torrent @2'],
      [1, 'Gun butt', 3, 4, 2, 3],
    ],[
      'Battle sister superior', 3, 2, 1, 3, 3, 9, `${kw_base}, leader, battle sister, superior`,
      [0, 'Bolt pistol', 4, 2, 3, 4, 'Rng @6'],
      [0, 'Boltgun', 4, 2, 3, 4, _, _, combi],
      [0, 'Combi-melta', 4, 2, 6, 3, 'Combi*, Rng @6, AP2, Limited', 'MW4'],
      [0, 'Combi-plasma | Standard', 4, 2, 5, 6, 'Combi*, AP1, Limited'],
      [0, 'Combi-plasma | Overcharge', 4, 2, 5, 6, 'Combi*, AP2, Hot, Limited'],
      [0, 'Condemnor boltgun', 4, 2, 3, 3, 'Combi*, Silent, Limited', 'MW1, P1'],
      [0, 'Inferno pistol', 4, 2, 5, 3, 'Rng @3, AP2', 'MW3'],
      [0, 'Ministorum combi-flamer', 5, 2, 2, 3, 'Combi*, Rng @6, Torrent @2, Limited'],
      [0, 'Ministorum hand flamer', 4, 2, 2, 3, 'Rng @6, Torrent @1'],
      [0, 'Plasma pistol | Standard', 4, 2, 5, 6, 'Rng @6, AP1'],
      [0, 'Plasma pistol | Supercharge', 4, 2, 5, 6, 'Rng @6, AP2, Hot'],
      [1, 'Chainsword', 4, 2, 3, 4],
      [1, 'Gun butt', 3, 3, 2, 3],
      [1, 'Power maul', 4, 2, 4, 5, _, 'Stun'],
      [1, 'Power weapon', 4, 2, 4, 6, 'Lethal 5+'],
      combi
    ],[
      'Sister repentia', 3, 2, 1, 3, 6, 7, `${kw_base}, sister, repentia`,
      [1, 'Penitent eviscerator', 4, 4, 5, 6, 'Brutal', 'Reap 2'],
      [2, 'Solace in Anguish', 'Each time this operative would lose a wound, roll one D6: on a 5+, that wound is not lost.']
    ],[
      'Repentia superior', 3, 2, 1, 3, 3, 9, `${kw_base}, leader, repentia, superior`,
      [0, 'Neural whips', 5, 3, 2, 3, 'Lethal 5+, Rng @3', 'Stun'],
      [1, 'Neural whips', 5, 3, 2, 3, 'Lethal 5+', 'Stun'],
      [3, 'Whip Into Fury', 1, "Select on friendly SISTER REPENTIA operation within @3 of and Visible to this operative. Add 1 to that friendly operative's Movement characteristic"]
    ],[
      'Arco-flagellant', 3, 2, 1, 3, 6, 10, `imperium, adeptus ministorum, arco-flagellant`,
      [1, 'Arco-flails', 5, 3, 3, 4, 'Ceaseless', 'Reap 1'],
      [2, 'Berserk Killing Machine', 'Each time this operative would lose a wound, roll one D6: on a 5+, that wound is not lost. This operation cannot perform mission actions or Pick Up actions. Unless otherwise specified, this operative cannot be equipped with equipment.']
    ]
  ])
}



const factions:Dict<Faction> = {
  tau: tau(),
  space_marine: space_marine(),
  ork: orks(),
  death_guard: death_guard(),
  ecclesiarchy: ecclesiarchy(),
}

function random_faction() {
  return Object.keys(factions).sort(() => Math.random()-.5)[0];
}

export const Compendium = {factions, random_faction}


