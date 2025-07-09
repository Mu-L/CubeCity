// src/composables/useBuilding.js
import { BUILDING_DATA } from '@/constants/constants'
import { useGameState } from '@/stores/useGameState'
import { useI18n } from 'vue-i18n'

export function useBuilding() {
  const gameState = useGameState()
  const { t } = useI18n()

  // 获取建筑花费
  const getBuildingCost = (buildingType, level = 1) => {
    const building = BUILDING_DATA[buildingType]
    return building?.levels?.[level]?.cost || 0
  }

  // 获取建筑退款金额 (70%)
  const getBuildingRefund = (buildingType, level = 1) => {
    return getBuildingCost(buildingType, level) * 0.7
  }

  // 获取下一级建筑等级
  const getNextLevel = (buildingType, level = 1) => {
    const building = BUILDING_DATA[buildingType]
    if (!building || !building.levels)
      return null
    return building.levels[level].nextLevel
  }

  // 处理建筑操作的对话框配置
  const getDialogConfig = (action, buildingType, level = 1) => {
    let buildingLevel = 0
    if (action === 'upgrade') {
      buildingLevel = getNextLevel(buildingType, level)
      if (!buildingLevel) {
        gameState.addToast(t('error.noNextLevel'), 'error')
        return null
      }
    }
    else if (action === 'demolish') {
      buildingLevel = level
    }
    else if (action === 'relocate') {
      buildingLevel = level
    }
    const buildingName = `${BUILDING_DATA[buildingType]?.levels[buildingLevel]?.displayName?.[t('lang')]} Lv.${buildingLevel}`
    const buildingCost = getBuildingCost(buildingType, buildingLevel)
    const configs = {
      upgrade: {
        title: t('dialog.selectTitle'),
        message: t('dialog.selectMessage', {
          building: buildingName,
          cost: buildingCost,
        }),
        confirmText: t('dialog.selectConfirm'),
        cost: buildingCost,
      },
      demolish: {
        title: t('dialog.demolishTitle'),
        message: t('dialog.demolishMessage', {
          building: buildingName,
          refund: getBuildingRefund(buildingType, level),
        }),
        confirmText: t('dialog.demolishConfirm'),
        cost: buildingCost,
      },
      relocate: {
        title: t('dialog.relocateTitle'),
        message: t('dialog.relocateMessage', {
          building: buildingName,
        }),
        confirmText: t('dialog.relocateConfirm'),
        cost: 0,
      },
    }

    return {
      ...configs[action],
      cancelText: t('common.cancel'),
      action,
      buildingType,
      buildingLevel: level,
    }
  }

  // 判断是否可以执行操作
  const canAffordOperation = (action, buildingType, level = 1) => {
    const cost = getBuildingCost(buildingType, level)
    return action === 'demolish' || gameState.credits >= cost
  }

  // 处理建筑操作的金额变动
  const handleBuildingTransaction = (action, buildingType, level = 1) => {
    if (!canAffordOperation(action, buildingType, level)) {
      gameState.addToast(t('error.insufficientFunds'), 'error')
      return false
    }
    const cost = getBuildingCost(buildingType, level)
    switch (action) {
      case 'demolish':
        gameState.updateCredits(getBuildingRefund(buildingType, level))
        break
      case 'upgrade':
        gameState.updateCredits(-cost)
        break
      case 'relocate':
        gameState.updateCredits(-100)
        break
      default:
        break
      // 可以添加其他操作类型
    }
  }

  return {
    getBuildingCost,
    getBuildingRefund,
    getDialogConfig,
    handleBuildingTransaction,
    canAffordOperation,
    getNextLevel,
  }
}
