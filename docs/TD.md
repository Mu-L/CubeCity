#  Simcity threejs version

> by:hexianWeb

# Threejs 游戏基建结构

| 要素         | 作用             | 类比现实                       |
| ------------ | ---------------- | ------------------------------ |
| **Scene**    | 游戏世界的3D环境 | 就像游乐场的场地               |
| **Game UI**  | 用户界面和交互层 | 相当于游乐场的指示牌和售票处   |
| **Metadata** | 游戏数据和逻辑   | 类似游乐场的运营规则和游客数据 |

# Metadata 设计



## BUILDING_DATA 数据结构说明

`BUILDING_DATA` 是一个包含所有建筑类型及其属性的常量对象，定义于 `src/constants/constants.js`。其结构如下：

```js
export const BUILDING_DATA = {
  [buildingType]: {
    name: { zh: '中文名', en: 'English Name' }, // 建筑名称（多语言）
    type: 'buildingType',                      // 建筑类型唯一标识
    icon: '🏠',                                // 图标（emoji或字符串）
    buildingType: { zh: '建筑类型', en: 'Type' }, // 建筑大类（多语言）
    category: 'residential' | 'industrial' | 'commercial' | 'environment' | 'governance' | 'social' | 'infrastructure', // 分类
    levels: {
      [level]: {
        displayName: { zh: '中文名', en: 'English Name' }, // 等级显示名
        cost: number,                // 建造消耗金币
        maxPopulation?: number,      // 最大人口（住宅类）
        powerUsage?: number,         // 用电量
        powerOutput?: number,        // 发电量（发电建筑）
        pollution: number,           // 污染值（负数为减污）
        coinOutput?: number,         // 金币产出（商业/工业）
        population?: number,         // 提供就业/人口（商业/工业/设施）
        upgradeCost?: number,        // 升级消耗金币
        nextLevel?: number,          // 下一级编号（无则为null）
        visible: boolean,            // 是否在UI可见
      },
      // ...更多等级
    }
  },
  // ...更多建筑类型
}
```

### 字段说明

- **name**：建筑的多语言名称，`zh` 为中文，`en` 为英文。
- **type**：建筑类型唯一标识（如 `house`, `factory`）。
- **icon**：建筑图标，通常为 emoji。
- **buildingType**：建筑大类（如“住宅建筑”、“工业建筑”），多语言。
- **category**：建筑所属分类，用于功能分组（如 `residential`、`industrial`）。
- **levels**：建筑的多级属性，key 为等级（1, 2, 3...），value 为该等级的详细属性对象。

#### levels 下的属性

- **displayName**：该等级的多语言显示名。
- **cost**：建造该等级建筑所需金币。
- **maxPopulation**：最大人口容量，仅住宅类有。
- **powerUsage**：用电量，部分建筑有。
- **powerOutput**：发电量，仅发电建筑有。
- **pollution**：污染值，负数表示减污（如公园）。
- **coinOutput**：金币产出，商业/工业建筑有。
- **population**：提供就业/人口，部分建筑有。
- **upgradeCost**：升级到下一级所需金币。
- **nextLevel**：下一级编号，无则为 null。
- **visible**：该等级是否在UI中可见。

### 示例

以住宅（house）为例：

```js
house: {
  name: { zh: '住宅', en: 'Residential' },
  type: 'house',
  icon: '🏠',
  buildingType: { zh: '住宅建筑', en: 'Residential Building' },
  category: 'residential',
  levels: {
    1: {
      displayName: { zh: '普通住宅', en: 'Basic Residential' },
      cost: 300,
      maxPopulation: 50,
      powerUsage: 10,
      pollution: 2,
      upgradeCost: 600,
      nextLevel: 2,
      visible: true,
    },
    2: {
      displayName: { zh: '高级住宅', en: 'Advanced Residential' },
      cost: 600,
      maxPopulation: 100,
      powerUsage: 15,
      pollution: 3,
      upgradeCost: 1200,
      nextLevel: 3,
      visible: false,
    },
    3: {
      displayName: { zh: '豪华住宅', en: 'Luxury Residential' },
      cost: 1200,
      maxPopulation: 200,
      powerUsage: 20,
      pollution: 5,
      upgradeCost: null,
      nextLevel: null,
      visible: false,
    },
  },
}
```

---

### 设计原则

- **多语言支持**：所有显示相关字段均为 `{ zh, en }` 结构，便于国际化。
- **多级建筑**：通过 `levels` 字段支持建筑升级，每级有独立属性。
- **灵活扩展**：可轻松添加新建筑类型或扩展属性。
- **UI 可控**：`visible` 字段控制各等级在UI的显示与否。

---

如需进一步细化字段含义或扩展，请补充在此结构说明下方。

# SimObject  互动基类

> 提供了 mesh 管理、选中高亮、HTML 信息展示等通用交互能力。

- SimObject 提供了 mesh 管理、选中高亮、HTML 信息展示等通用交互能力。

- 只要是场景中可交互的对象（如 Tile、Building），都应继承 SimObject。

# building 类组件

## 🧠 分析与设计思路

1. 单一职责原则

- Tile 只负责地皮格子的表现和状态，不关心建筑的具体逻辑。

- Building 负责建筑的加载、表现、升级、功能（如产出人口、电力、经济等）。

2. 多态与扩展性

- 不同类型建筑继承自 Building，重写各自的功能方法（如 getPopulation、getPower、getEconomy）。

- 便于后续扩展新建筑类型或功能。

3. 解耦与协作

- Tile 只持有 Building 的实例（如 this.buildingInstance），通过接口与其交互。

- Building 需要能访问 Experience、scene、resources 等核心实例。

------

## 推荐实现步骤

### 1. 新建 building.js 基础类

- 负责加载建筑模型、通用属性（如 position、direction）、升级等。

- 提供通用接口（如 update、upgrade、get功能值等）。

### 2. 新建具体建筑子类（如 house.js、factory.js、shop.js）

- 继承 Building，重写/扩展功能方法。

### 3. 修改 Tile 类

- Tile 只负责地皮表现，持有 Building 实例。

- 通过接口与 Building 交互（如升级、获取功能值等）。

```mermaid
classDiagram
  SimObject <|-- Tile
  Tile <|-- Building
  SimObject <|-- Building
  Building <|-- House
  Building <|-- Factory
  Building <|-- Shop
```

# Tile 地皮交互

## 1. 方案梳理

### 方案一：Tile 负责建筑实例

- 流程：射线检测命中 tile（地皮），直接调用 tile.userData.setBuilding('house', 0) 在 tile 内部生成建筑实例（如 House），并作为 tile 的子对象（mesh.add(buildingInstance)）。

- 特点：

- 建筑和地皮是父子关系，建筑始终附着在 tile 上。

- 交互、管理、拾取都通过 tile 进行。

- 删除/移动建筑时，直接操作 tile 实例。

### 方案二：Tile 和 Building 分离

- 流程：射线检测命中 tile，获取其 position.x/z，随后在 buildingsGroup（独立 group）中创建建筑实例，建筑与 tile 仅通过坐标关联。

- 特点：

- 地皮和建筑完全分离，建筑统一管理在 buildingsGroup。

- 需要额外的数据结构维护 tile 与 building 的映射关系。

- 移动/删除建筑时，需要先查找对应 tile，再操作 buildingsGroup。

------

## 2. 需求与扩展性分析

### PRD 需求

- 建筑与地皮一一对应，每个 tile 最多一个建筑。

- 需要支持建筑的放置、移动、删除。

- 未来可能有 tile 升级、建筑升级、地皮扩展等需求。

### 技术实现对比

| 维度       | 方案一（父子）             | 方案二（分离）               |
| :--------- | :------------------------- | :--------------------------- |
| 实现难度   | 简单，直接操作 tile        | 复杂，需维护映射关系         |
| 性能       | 高效，遍历 tile 即可       | 需遍历 buildingsGroup 或查表 |
| 扩展性     | 易于扩展（如 tile 升级）   | 灵活，但管理复杂             |
| 交互逻辑   | 直观，所有交互聚焦 tile    | 需同步 tile 与 building 状态 |
| 数据一致性 | 易保证（父子结构天然一致） | 需手动同步，易出错           |
| 未来扩展   | 支持 tile/建筑联动、升级等 | 支持建筑独立动画、批量操作等 |

### 代码风格与维护

- 你的框架强调通过 Experience 单例获取依赖，tile 作为地皮的核心单元，建筑作为 tile 的"内容"更符合直觉。

- 方案一更贴合"组合"思想，tile 作为容器，建筑作为内容，便于后续扩展 tile 的属性（如地皮类型、状态等）。

------

## 3. 推荐与理由

强烈推荐采用方案一（tile 负责建筑实例，建筑作为 tile 的子对象），理由如下：

1. 符合 PRD 需求：每个 tile 只允许一个建筑，tile 作为地皮的唯一管理者，建筑作为其内容，逻辑清晰。

1. 易于维护：所有操作（放置、删除、移动、升级）都只需操作 tile 实例，无需额外维护映射关系。

1. 高扩展性：未来如地皮扩展、建筑升级、tile 状态变化等，都可以在 tile 类中集中管理，便于统一调试和维护。

1. 性能优越：遍历 tile 即可获取所有建筑，无需遍历全场景或查找映射表。

1. 代码风格统一：符合你当前框架的单例与组件化设计，便于团队协作和后续开发。

------

## 4. 方案一的最佳实践建议

- tile.js 中的 setBuilding(type, direction) 方法负责创建/替换建筑实例，并将其作为 tile 的子对象。

- interactor.js 通过射线检测命中 tile 后，直接调用 tile.userData.setBuilding(...) 实现建筑放置。

- 建筑删除/移动：可在 tile 上实现 removeBuilding()、moveBuilding() 等方法，保持 tile 的唯一性和一致性。

- 建筑信息面板：通过 tile 统一获取建筑信息，便于展示和交互。

------

## 5. 方案二的适用场景

- 如果未来有建筑与 tile 多对多、建筑可跨 tile、建筑批量动画等需求，可以考虑方案二。但目前 PRD 明确是一一对应，方案一更优

# UI 交互

- UI 交互（如选择建筑、切换模式、点击地皮）目前只在前端 JS 层（index.js）和 HTML 层（index.html）生效。

- Three.js 场景中的建筑实际放置、删除、移动等操作由 tile/building 组件（如 tile.js、house.js）负责。

- 需要桥接：UI 事件 → Three.js 场景 & Three.js 场景 → UI 事件操作。

  - 用户在左侧面板选择建筑类型（如"FACTORY"）。

  - 用户切换到"BUILD"模式。

  - 用户点击画布（canvas）上的某个 tile，期望在该 tile 上放置所选建筑。

  - 用户切换到"DEMOLISH"模式，点击建筑，期望删除该建筑。

  - 用户点击建筑，右侧面板显示详细信息。

### 方案：mitt js 事件驱动（推荐）

- 全局状态：用  Experience 单例存储当前选中的建筑类型、操作模式。多用于 UI 事件 → Three.js 场景

  ```js
  export default class Experience extends EventEmitter {
    constructor(canvas) {
      super()
      // ...
      this.currentMode = 'build'
      this.selectedBuilding = null
      this.credits = 12345
      // ...
    }
  }
  ```

随后在 Ray 射线检测相关逻辑中读取全局变量相应状态并做不同逻辑操作

```js
// interactor.js
_onClick(_event) {
  if (this.focused) {
    if (this.experience.currentMode === 'build' && window.selectedBuilding) {
      this.focused.setBuilding(window.selectedBuilding)

    } else if (this.experience.currentMode === 'demolish') {
      this.focused.removeBuilding()
      // 可选：window.showToast('建筑已拆除')
    } else {
      // 显示信息面板
      const html = this.focused.toHTML()
      document.getElementById('info-panel').innerHTML = html
    }
  }
}
```

- 事件驱动：UI 事件只负责更新全局状态，Three.js 交互（如 Interactor）在射线命中 tile/building 时，读取全局状态并执行相应操作。Three.js 场景 → UI 事件

  ```js
  // experience.js / interactor.js
  import { eventBus } from './event-bus'
  eventBus.emit('building:placed', { tile, type })
  
  // index.js
  import { eventBus } from './event-bus'
  eventBus.on('building:placed', ({ tile, type }) => {
    showToast(`${type} 已放置在 (${tile.x}, ${tile.y})`, 'success')
    // ...刷新 UI
  })
  ```

## 典型需求场景

- 用户在左侧面板选择建筑类型（如"FACTORY"）。

- 用户切换到"BUILD"模式。

- 用户点击画布（canvas）上的某个 tile，期望在该 tile 上放置所选建筑。

- 用户切换到"DEMOLISH"模式，点击建筑，期望删除该建筑。

- 用户点击建筑，右侧面板显示详细信息

## 典型事件设计

### ① 建筑相关

| 事件名            | 触发时机               | 事件参数结构                     |
| :---------------- | :--------------------- | :------------------------------- |
| building:placed   | 成功放置建筑后         | { tile, type, buildingInstance } |
| building:removed  | 拆除建筑后             | { tile, type }                   |
| building:selected | 选中建筑（点击/hover） | { tile, type, buildingInstance } |
| building:upgraded | 建筑升级后             | { tile, type, level }            |

### ② 地皮/格子相关

| 事件名        | 触发时机   | 事件参数结构 |
| :------------ | :--------- | :----------- |
| tile:selected | 选中地皮   | { tile }     |
| tile:expanded | 地皮扩展后 | { newSize }  |

### ③ 模式/状态相关

| 事件名           | 触发时机                   | 事件参数结构 |
| :--------------- | :------------------------- | :----------- |
| mode:changed     | 操作模式切换（build/move） | { mode }     |
| building:choosed | 选择建筑卡片               | { type }     |

### ④ 资源/经济相关

| 事件名             | 触发时机 | 事件参数结构          |
| :----------------- | :------- | :-------------------- |
| credits:changed    | 金币变化 | { credits, delta }    |
| population:changed | 人口变化 | { population, delta } |

### ⑤ UI 相关

| 事件名        | 触发时机       | 事件参数结构      |
| :------------ | :------------- | :---------------- |
| ui:toast      | 需要弹出提示时 | { message, type } |
| ui:panel:show | 显示信息面板   | { panel, data }   |

# 建筑四大模式

## 1. SELECT（选择）模式
**核心功能**：信息查看与建筑升级
```mermaid
graph TD
    A[SELECT模式] --> B[鼠标悬停效果]
    A --> C[点击交互]
    A --> D[信息面板]
    A --> E[建筑升级]

    B --> B1[地皮：浅蓝色边框]
    B --> B2[建筑：轻微浮动动画]

    C --> C1[点击地皮：显示空地信息]
    C --> C2[点击建筑：显示建筑详情]

    D --> D1[右侧面板显示]
    D1 --> D11[建筑名称/类型]
    D1 --> D12[居民人数/状态]
    D1 --> D13[当前产出]
    D1 --> D14[升级选项]

    E --> E1[显示升级按钮]
    E1 --> E11[升级条件检查]
    E1 --> E12[扣除金币]
    E1 --> E13[更新建筑模型]
```

**实现要点**：
- 视觉反馈：
  - 悬停地皮：浅蓝色半透明边框
  - 悬停建筑：Y轴轻微浮动(0.2单位 gsap ease )+发光效果
- 信息面板内容：
  ```js
  // 建筑信息示例
  {
    name: "高级公寓",
    type: "住宅",
    residents: "12/15",
    status: "正常", // 状态标签颜色：正常-绿色，拥挤-橙色，空置-灰色
    output: "+5.2金币/秒",
    nextLevel: {
      cost: 1500,
      benefits: "+2居民容量"
    }
  }
  ```
- 交互限制：
  - 禁用放置/删除操作
  - 升级按钮仅在满足条件时可用
  
  ```mermaid
  graph TD
    A[用户鼠标点击/移动] --> B[Interactor 监听事件]
    B --> C[获取当前模式: SELECT]
    C --> D[获取射线焦点 Tile]
    D --> E[高亮/选中 Tile]
    E --> F[调用 _handleSelectMode]
    F --> G[更新 Pinia: selectBuilding/selectPosition]
    G --> H[UI 组件监听 Pinia 状态]
    H --> I[App.vue 及子组件响应, 展示详情/高亮]
  ```

### upgrade, demolish 升级功能

```mermaid
sequenceDiagram
  participant User as 用户
  participant Interactor as Interactor(射线交互器)
  participant Pinia as Pinia(GameState)
  participant App as App.vue/子组件
  participant Building as buildingInstance

  User->>Interactor: 鼠标点击建筑
  Interactor->>Interactor: 获取当前模式: SELECT
  Interactor->>Interactor: 获取射线焦点 Tile
  Interactor->>Interactor: 高亮/选中 Tile
  Interactor->>Interactor: 调用 _handleSelectMode
  Interactor->>Pinia: setSelectedBuilding(building.type)
  Interactor->>Pinia: setSelectedPosition(tile.position)
  Pinia-->>App: 状态变更通知
  App->>App: 响应状态, 展示建筑详情/高亮

  User->>App: 点击升级/拆除按钮
  App->>App: 弹出 ConfirmDialog
  User->>App: 确认操作
  App->>Interactor: eventBus.emit('ui:action-confirmed', action)
  Interactor->>Interactor: _onActionConfirmed(action)
  alt 升级
    Interactor->>Interactor: _confirmUpgrade
    Interactor->>Building: building.upgrade()
    alt 可升级
      Building-->>Interactor: 返回新 building 数据
      Interactor->>Building: selected.setBuilding(newType, newDir, options)
      Interactor->>App: eventBus.emit('toast:add', '升级成功')
    else 已最高级
      Interactor->>App: eventBus.emit('toast:add', '已达最高等级')
    end
  else 拆除
    Interactor->>Interactor: _confirmDemolish
    Interactor->>Pinia: setTile, removeBuilding
    Interactor->>App: eventBus.emit('toast:add', '建筑移除')
  end
  App->>App: 响应状态, 刷新地图
```



## 2. BUILD（建造）模式

**核心流程**：

```mermaid
sequenceDiagram
    participant UI as 左侧面板
    participant Camera as 摄像机
    participant Tile as 地皮系统
    participant Economy as 经济系统

    UI->>Camera: 选择建筑类型
    Camera->>Tile: 显示放置预览(半透明模型)
    loop 地皮悬停检测
        Tile-->>Camera: 可用地皮(绿色高亮)<br/>不可用地皮(红色高亮)
    end
    Tile->>Economy: 点击放置时检查金币
    alt 金币充足
        Economy->>Tile: 扣除金币，生成建筑
        Tile->>Camera: 播放放置特效
    else 金币不足
        Economy->>UI: 显示"金币不足"提示
    end
```

**关键实现**：
```js
// 在Interactor.js中的实现
_onClick() {
  if (this.experience.currentMode === 'build') {
    const cost = Building.getCost(selectedBuildingType);

    if (this.experience.credits >= cost) {
      this.focusedTile.setBuilding(selectedBuildingType);
      this.experience.credits -= cost;
      eventBus.emit('credits:changed', {
        credits: this.experience.credits,
        delta: -cost
      });
    } else {
      eventBus.emit('ui:toast', {
        message: `金币不足！需要 ${cost} 金币`,
        type: 'error'
      });
    }
  }
}
```

**UI提示要素**：
1. 左侧面板：
   - 当前选中建筑卡片：金色边框+放大效果
   - 建筑价格显示（红色标注不足金额）
2. 场景内：
   - 可用地皮：绿色网格高亮
   - 不可用地皮：红色网格闪烁
   - 建筑预览：50%透明度的3D模型
3. 状态栏：
   - 实时金币计数（放置时跳动减少）

## 3. RELOCATE（移动）模式
**状态机实现**：
```mermaid
stateDiagram-v2
    [*] --> 选择阶段
    选择阶段 --> 放置阶段: 点击选中建筑
    放置阶段 --> 选择阶段: 按ESC取消

    放置阶段 --> 旋转调整: 按R键
    旋转调整 --> 放置阶段: 自动返回

    放置阶段 --> 确认放置: 点击空地
    确认放置 --> [*]: 完成移动

    state 放置阶段 {
        原建筑： 半透明显示
        目标位置： 绿色高亮框
        建筑预览： 跟随鼠标位置
    }

    state 旋转调整 {
        方向指示器： 4方向箭头UI
        当前朝向： 0°/90°/180°/270°
    }
```

**技术要点**：
```js
// 在Experience.js中
startRelocation(building) {
  this.relocatingBuilding = building;
  this.originalTile = building.parentTile;
  this.originalTile.setBuilding(null, true); // 临时移除

  // 创建预览模型
  this.previewModel = building.clone();
  this.previewModel.material.transparent = true;
  this.previewModel.material.opacity = 0.7;
}

// 旋转处理
rotatePreview(angle = 90) {
  this.previewRotation = (this.previewRotation + angle) % 360;
  this.previewModel.rotation.y = THREE.MathUtils.degToRad(this.previewRotation);
}

// 确认放置
confirmRelocation(targetTile) {
  targetTile.setBuildingInstance(this.relocatingBuilding);
  this.relocatingBuilding.setRotation(this.previewRotation);
  this.cleanupPreview();
}
```

**视觉反馈**：
1. 选中建筑：半透明化（opacity: 0.5）
2. 预览模型：70%透明度+发光轮廓
3. 有效目标地皮：脉动绿色光圈
4. 无效目标地皮：静态红色边框
5. 方向指示器：底部罗盘UI（显示当前朝向）

```mermaid
graph TD
  A[用户鼠标点击/移动] --> B[Interactor 监听事件]
  B --> C[获取当前模式: RELOCATE]
  C --> D[获取射线焦点 Tile]
  D --> E[高亮/选中 Tile]
  E --> F{第几次点击?}
  F -- 第一次 --> G[记录 relocateFirst]
  F -- 第二次 --> H{canPlaceBuilding 合法性判断}
  H -- 合法且空地 --> I[事件总线 ui:confirm-action]
  I --> J[App.vue 监听, 弹出 ConfirmDialog]
  J --> K[用户确认]
  K --> L[事件总线 'ui:action-confirmed']
  L --> M[Interactor._confirmRelocate]
  M --> N[Pinia: setTile, 交换建筑]
  N --> O[UI Toast: 搬迁成功]
  H -- 不合法/已占用 --> P[UI Toast: 无法搬迁]
  O & P --> Q[UI 组件监听 Pinia 状态]
  Q --> R[App.vue 及子组件响应, 刷新地图]
```



## 4. DEMOLISH（拆除）模式

**安全交互流程**：
```mermaid
graph LR
    A[点击建筑] --> B{确认对话框}
    B -->|确认| C[执行拆除]
    B -->|取消| D[返回DEMOLISH模式]

    C --> E[播放拆除动画]
    E --> F[返还部分资源]
    F --> G[更新经济系统]

    style A stroke:#f00
    style C stroke:#090
```

**视觉提示**：
1. 场景内：
   - 所有建筑：显示红色边框
   - 悬停建筑：脉动红色警示效果
2. 光标变化：
   - 默认：红色禁止图标
   - 悬停建筑：锤子图标
3. 确认对话框：
   - 半透明黑色蒙层
   - 居中红色边框面板
   - 拆除图标动画

```mermaid
graph TD
  A[用户鼠标点击/移动] --> B[Interactor 监听事件]
  B --> C[获取当前模式: DEMOLISH]
  C --> D[获取射线焦点 Tile]
  D --> E[高亮/选中 Tile]
  E --> F{Tile 是否有建筑}
  F -- 有建筑 --> G[事件总线 ui:confirm-action]
  G --> H[App.vue 监听, 弹出 ConfirmDialog]
  H --> I[用户确认]
  I --> J[事件总线 ui:action-confirmed]
  J --> K[已确认销毁 执行销毁逻辑]
  K --> L[Metadata 更新数据，Scene 删除地皮]
  L --> M[UI Toast: 建筑移除]
  F -- 无建筑 --> N[设置地皮为草地]
  M & N --> O[UI 组件监听 Pinia 状态]
  O --> P[App.vue 及子组件响应, 刷新地图]
```



# 产出系统

## 1.人口资源

### 1. 机制说明
- **住宅建筑**（如🏠、🏡）只决定"人口容量"上限（maxPopulation 字段）。
- **商业/工业建筑**（如🏭、🧪、🏬、🏢）提供就业岗位（population 字段），吸纳实际人口。
- **实际人口** = 所有商业/工业建筑的岗位总和，不能超过人口容量。
- **人口利用率** = 实际人口 / 人口容量。
- 当人口利用率 > 1.5 或 < 0.5 时，满意度下降。
- 满意度过低会导致人口流失、经济产出下降。

### 2. 资源关系矩阵（新版）
| 资源类型   | 来源建筑           | 吸纳/限制建筑     | 影响机制                                   |
| ---------- | ------------------ | ---------------- | ------------------------------------------ |
| 人口容量   | 住宅建筑           | -                | 限制实际人口上限                           |
| 实际人口   | -                  | 商业/工业建筑    | 由商业/工业建筑需求决定，不能超过人口容量   |
| 满意度     | 公园、医院、学校等 | 工厂、发电厂等   | 受人口利用率影响，过高/过低均会下降         |
| 资金       | 所有建筑           | -                | 受实际人口和满意度共同影响                 |

### 3. 资源流向与满意度影响（Mermaid 图）
```mermaid
graph TD
    A[住宅建筑🏠] -- 提供 --> B[人口容量]
    C[商业/工业建筑🏭/🏬] -- 吸纳 --> D[实际人口]
    B -- 限制 --> D
    D & B -- 计算比例 --> E[人口利用率]
    E -- 影响 --> F[满意度]
    F -- 影响 --> G[人口增长/流失]
    F -- 影响 --> H[经济产出]
```

### 4. 满意度影响机制
- **人口利用率 = 实际人口 / 人口容量**
- 当人口利用率 > 1.5 或 < 0.5 时，满意度每分钟下降X点
- 满意度过低时，人口增长变为负数（流失），经济产出下降

### 5. 公式示例
```
实际人口 = min(人口容量, 商业/工业总岗位需求)
人口利用率 = 实际人口 / 人口容量
满意度变化 =
  if (人口利用率 > 1.5 || 人口利用率 < 0.5)
    则满意度 -= Δ
  else
    满意度 += 正常增长
```

> 详见 @src/constants/constants.js 中 BUILDING_DATA 字段定义。

## 2. 金币的产出 & 获取 💰

### 机制说明
- 金币是城市建设与运营的核心资源。
- 金币主要通过商业（🏬、🏢）和工业（🏭、🧪、☢️）建筑按时间周期自动产出。
- 金币消耗主要用于新建筑的建造、升级、搬迁等。
- 产出与消耗数值详见下表。

### 产出与消耗一览表

| 建筑类型 | 建筑名称 | 产出金币/周期 | 建造消耗金币 |
| :--: | :--: | :--: | :--: |
| 工业 | 工厂 🏭 | 20 | 500 |
| 工业 | 化学工厂 🧪 | 30/45/60 | 1000/1500/2000 |
| 工业 | 核电站 ☢️ | 50 | 5000 |
| 商业 | 商店 🏬 | 25/40/60 | 400/800/1600 |
| 商业 | 办公室 🏢 | 35/55/80 | 500/1000/2000 |

> 说明：
> - "产出金币/周期"为该建筑每个时间周期（如每分钟）自动产出的金币数量。
> - "建造消耗金币"为新建该建筑时需要消耗的金币数量。
> - 部分建筑有多级，表格中以"/"分隔不同等级。
> - 详细数据请参考 @src/constants/constants.js 中 BUILDING_DATA。

### 机制细节
- 金币产出受市场需求、满意度等因素影响，详见"动态经济系统"章节。
- 拆除建筑可返还部分金币。
- 随着游戏进程推进，金币产出与消耗会动态调整。

# 未来功能

## 1. 挑战与失败机制

### 1..1 动态经济系统
```js
class Economy {
  constructor() {
    this.marketDemand = {
      residential: 1.0,
      commercial: 1.0,
      industrial: 1.0
    }

    // 每10分钟重新计算市场需求
    setInterval(() => this.calculateMarketDemand(), 600000)
  }

  calculateMarketDemand() {
    // 基于建筑比例调整需求
    const totalBuildings = this.experience.buildings.length
    const resRatio = this.getBuildingRatio('residential')
    const comRatio = this.getBuildingRatio('commercial')

    // 住宅需求公式：商业比例越高，住宅需求越大
    this.marketDemand.residential = 0.5 + comRatio * 1.5

    // 商业需求公式：住宅比例越高，商业需求越大
    this.marketDemand.commercial = 0.3 + resRatio * 2.0

    // 工业需求随机波动
    this.marketDemand.industrial = 0.8 + Math.random() * 0.4
  }

  getBuildingOutput(building) {
    const baseOutput = building.baseOutput
    const demandFactor = this.marketDemand[building.type]
    const efficiency = this.getEfficiency(building)

    return baseOutput * demandFactor * efficiency
  }
}
```

### 1.2 失败条件
```js
class GameState {
  checkFailureConditions() {
    // 条件1: 连续负债超过5分钟
    if (this.credits < 0) {
      this.debtTimer += delta
      if (this.debtTimer > 300) {
        this.triggerFailure('经济崩溃')
      }
    }
    else {
      this.debtTimer = 0
    }

    // 条件2: 人口归零
    if (this.population <= 0) {
      this.triggerFailure('城市荒废')
    }

    // 条件3: 污染爆表
    if (this.pollution >= 100) {
      this.triggerFailure('生态灾难')
    }
  }

  triggerFailure(reason) {
    eventBus.emit('game:over', { reason })
    // 保存分数到排行榜
    this.saveScore()
    // 显示失败界面
    this.showGameOverScreen(reason)
  }
}
```

## 2. 策略性建筑系统

### 2.1 建筑相互依存关系
```mermaid
graph LR
    A[住宅] -->|提供| B[人口]
    B -->|需要| C[就业]
    C -->|由| D[提供 by 商业/工业]
    D -->|消耗| E[电力]
    E -->|由| F[提供 by 发电厂]
    F -->|产生| G[污染]
    G -->|降低| H[满意度]
    H -->|影响| A[住宅人口增长]

    I[公园] -->|减少| G[污染]
    I -->|提升| H[满意度]

    J[学校] -->|提升| K[劳动力质量]
    K -->|增加| D[商业收入]
```

### 2.2 建筑升级树示例（住宅）
```
基础住宅
  ├─ 升级方向A：公寓大楼
  │    ├─ 高级公寓
  │    │    └─ 豪华公寓
  │    └─ 绿色公寓（减少污染）
  │
  └─ 升级方向B：社区住宅
       ├─ 学区房（靠近学校提升满意度）
       └─ 商业住宅（增加商业收入）
```

## 3. 动态事件系统

**事件类型表**：
| 事件类型 | 频率       | 影响                | 玩家应对策略           |
| -------- | ---------- | ------------------- | ---------------------- |
| 经济危机 | 10-15分钟  | 所有商业收入减少40% | 转向工业或缩减开支     |
| 移民潮   | 随机       | 人口+20%            | 快速建造住宅提供住所   |
| 能源短缺 | 电力>90%时 | 电力产出-30%        | 建造备用能源或减少消耗 |
| 环保抗议 | 污染>60%时 | 满意度-25%          | 建造公园或升级清洁技术 |
| 技术突破 | 学校>3座时 | 所有升级费用-20%    | 趁机升级关键建筑       |

**事件实现代码**：
```js
class EventSystem {
  constructor() {
    this.events = [
      {
        id: 'economic_crisis',
        name: '全球经济危机',
        probability: 0.01, // 每分钟1%概率
        condition: () => this.experience.playTime > 600, // 10分钟后可能发生
        apply: () => {
          this.marketDemand.commercial *= 0.6
          eventBus.emit('ui:toast', {
            message: '经济危机！商业收入减少40%',
            type: 'warning'
          })
        },
        duration: 120 // 持续2分钟
      }
    ]
  }

  update(delta) {
    this.events.forEach((event) => {
      if (!event.active && Math.random() < event.probability * delta) {
        if (!event.condition || event.condition()) {
          this.activateEvent(event)
        }
      }

      if (event.active) {
        event.timeRemaining -= delta
        if (event.timeRemaining <= 0) {
          this.deactivateEvent(event)
        }
      }
    })
  }
}
```

## 4. 进阶游戏机制

### 5.1 区域规划加成
```js
class ZoneSystem {
  getEfficiencyBonus(building) {
    let bonus = 1.0

    // 检查相邻格子
    const neighbors = this.getNeighborTiles(building.tile)

    // 住宅相邻公园：满意度+10%
    if (building.type === 'residential') {
      const parkCount = neighbors.filter(t => t.building?.type === 'park').length
      bonus += parkCount * 0.1
    }

    // 工厂远离住宅：污染-15%
    if (building.type === 'industrial') {
      const residentialCount = neighbors.filter(t => t.building?.type === 'residential').length
      bonus -= residentialCount * 0.15
    }

    return Math.max(0.5, bonus) // 最低50%效率
  }
}
```

### 5.2 科技树系统
```mermaid
graph TD
    A[基础技术] --> B[清洁能源]
    A --> C[智能电网]
    A --> D[绿色建筑]

    B --> E[太阳能电池板<br>+20%电力 -30%污染]
    B --> F[核聚变发电<br>+50%电力 高风险]

    C --> G[电力传输优化<br>-10%电力损耗]
    C --> H[智能负载均衡<br>+15%电力效率]

    D --> I[垂直农场<br>+人口 +满意度]
    D --> J[生态住宅<br>-维护费 +满意度]
```

### 5.3 政策系统（二选一机制）
```js
class PolicySystem {
  policies = [
    {
      id: 'tax_policy',
      name: '税收政策',
      options: [
        {
          label: '低税率吸引投资',
          effect: '+20%人口增长，-15%建筑收入'
        },
        {
          label: '高税率增加收入',
          effect: '-10%人口增长，+25%建筑收入'
        }
      ]
    },
    {
      id: 'environment_policy',
      name: '环境政策',
      options: [
        {
          label: '工业优先',
          effect: '+30%工业产出，+0.2污染/分钟'
        },
        {
          label: '环保优先',
          effect: '-50%污染，-20%工业产出'
        }
      ]
    }
  ]

  applyPolicy(policyId, optionIndex) {
    const policy = this.policies.find(p => p.id === policyId)
    const option = policy.options[optionIndex]

    // 应用效果
    this.parseEffect(option.effect)

    // 锁定选择30分钟
    this.policyCooldowns[policyId] = 1800

    eventBus.emit('policy:enacted', { policy, option })
  }
}
```

## 5. 平衡性调整

### 5.1 资源转换公式
```
人口增长 = (基础增长率 + 满意度/100) × (1 - 污染/200)
        × (就业率^0.5) × 住宅容量使用率

电力需求 = Σ(工业建筑×1.2 + 商业建筑×0.8 + 住宅×0.2)
污染产生 = Σ(燃煤发电×0.8 + 工业建筑×0.5 - 公园×0.3)
```

### 5.2 动态难度曲线
```js
class DifficultySystem {
  getDifficultyMultiplier() {
    const timeFactor = Math.min(1.0, this.playTime / 3600) // 1小时后达最大难度
    const buildingFactor = Math.min(1.5, this.buildings.length / 50) // 50建筑后达上限

    return 0.8 + (timeFactor * 0.5) + (buildingFactor * 0.7)
  }

  adjustGameParameters() {
    const multiplier = this.getDifficultyMultiplier()

    // 增加维护成本
    this.maintenanceMultiplier = multiplier

    // 增加事件频率
    this.eventProbabilityMultiplier = 0.5 + multiplier * 0.5

    // 降低资源产出
    this.resourceOutputMultiplier = 1.2 - multiplier * 0.4
  }
}
```

## 6. 玩家进度与成就

### 6.1 里程碑系统
```js
const milestones = [
  { id: 'first_city', name: '初具规模', condition: state => state.population >= 100 },
  { id: 'power_king', name: '电力大亨', condition: state => state.powerOutput >= 500 },
  { id: 'eco_champion', name: '环保先锋', condition: state => state.pollution < 20 && state.playTime > 1800 },
  { id: 'metropolis', name: '大都市', condition: state => state.population >= 5000 }
]
```

### 6.2 保存进度设计
```js
class SaveSystem {
  saveGame() {
    const saveData = {
      version: 1.1,
      timestamp: Date.now(),
      resources: this.experience.resources,
      buildings: this.experience.buildings.map(b => ({
        type: b.type,
        level: b.level,
        x: b.tile.x,
        z: b.tile.z,
        rotation: b.rotation
      })),
      stats: {
        playTime: this.playTime,
        totalEarnings: this.totalEarnings,
        buildingsConstructed: this.buildingsConstructed
      },
      upgrades: this.unlockedUpgrades,
      policies: this.activePolicies
    }

    localStorage.setItem('city_save', JSON.stringify(saveData))
  }

  loadGame() {
    const saveData = JSON.parse(localStorage.getItem('city_save'))
    // 重建游戏状态...
  }
}
```

## 实施路线图

1. **第一阶段：核心经济系统重构（1-2周）**
   - 实现电力、人口、满意度资源
   - 添加建筑维护费
   - 创建基本失败条件

2. **第二阶段：策略深度扩展（2-3周）**
   - 实现区域规划加成
   - 添加基础事件系统
   - 设计初始科技树

3. **第三阶段：内容丰富化（3-4周）**
   - 添加10+新建筑类型
   - 实现政策系统
   - 创建成就和里程碑

4. **第四阶段：平衡与优化（1-2周）**
   - 调整资源公式
   - 优化新玩家引导
   - 添加难度选项

这些改进将游戏从简单的"放置-等待"循环转变为需要持续决策和战略规划的城市模拟游戏。玩家现在需要：
- 平衡多种相互冲突的资源
- 应对随机事件和危机
- 规划长期科技发展
- 在政策决策中权衡取舍
- 避免多个失败条件

同时保持了游戏的休闲本质，所有复杂系统都通过清晰的UI和渐进式引导呈现给玩家。

---

