import ChemistryFactory from './buildings/chemistry-factory.js'
import Factory from './buildings/factory.js'
import FireStation from './buildings/fire_station.js'
import GarbageStation from './buildings/garbage_station.js'
import HeroPark from './buildings/hero_park.js'
import Hospital from './buildings/hospital.js'
import House from './buildings/house.js'
import NukeFactory from './buildings/nuke-factory.js'
import Office from './buildings/office.js'
import Park from './buildings/park.js'
import Police from './buildings/police.js'
import Road from './buildings/road.js'
import Shop from './buildings/shop.js'
import SunPower from './buildings/sun_power.js'
import WaterTower from './buildings/water_tower.js'
import WindPower from './buildings/wind_power.js'
// 未来可引入更多建筑

const BUILDING_CLASS_MAP = {
  house: House,
  house_level1: House,
  house_level2: House,
  house_level3: House,
  house2_level1: House,
  house2_level2: House,
  house2_level3: House,
  factory: Factory,
  shop: Shop,
  shop_level1: Shop,
  shop_level2: Shop,
  shop_level3: Shop,
  office: Office,
  office_level1: Office,
  office_level2: Office,
  office_level3: Office,
  park: Park,
  park_level1: Park,
  park_level2: Park,
  park_level3: Park,
  police: Police,
  hospital: Hospital,
  road: Road,
  chemistry_level1: ChemistryFactory,
  chemistry_level2: ChemistryFactory,
  chemistry_level3: ChemistryFactory,
  nuke_factory: NukeFactory,
  fire_station: FireStation,
  sun_power: SunPower,
  water_tower: WaterTower,
  wind_power: WindPower,
  garbage_station: GarbageStation,
  hero_park: HeroPark,
  // 其他建筑类型可在此扩展
}

export function createBuilding(type, direction = 0, options = {}) {
  const Cls = BUILDING_CLASS_MAP[type]
  if (Cls) {
    return new Cls(type, direction, options)
  }
  return null
}
