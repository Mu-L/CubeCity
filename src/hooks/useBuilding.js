// src/composables/useBuilding.js
import { BUILDING_DATA } from '@/constants/constants'
import { useGameState } from '@/stores/useGameState'
import { useI18n } from 'vue-i18n'

export function useBuilding() {
  const gameState = useGameState()
  const { t } = useI18n()

  // 获取建筑花费
  const getBuildingCost = (buildingType) => {
    const building = BUILDING_DATA.find(b => b.type === buildingType)
    return building?.cost || 0
  }

  // 获取建筑退款金额 (70%)
  const getBuildingRefund = (buildingType) => {
    return getBuildingCost(buildingType) * 0.7
  }

  // 处理建筑操作的对话框配置
  const getDialogConfig = (action, buildingType) => {
    const cost = getBuildingCost(buildingType)
    const configs = {
      upgrade: {
        title: t('dialog.selectTitle'),
        message: t('dialog.selectMessage', {
          building: buildingType || t('dialog.building'),
          cost,
        }),
        confirmText: t('dialog.selectConfirm'),
        cost,
      },
      demolish: {
        title: t('dialog.demolishTitle'),
        message: t('dialog.demolishMessage', {
          building: buildingType || t('dialog.building'),
          refund: getBuildingRefund(buildingType),
        }),
        confirmText: t('dialog.demolishConfirm'),
        cost,
      },
      relocate: {
        title: t('dialog.relocateTitle'),
        message: t('dialog.relocateMessage', {
          building: buildingType || t('dialog.building'),
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
    }
  }

  // 判断是否可以执行操作
  const canAffordOperation = (action, buildingType) => {
    const cost = getBuildingCost(buildingType)
    return action === 'demolish' || gameState.credits >= cost
  }

  // 处理建筑操作的金额变动
  const handleBuildingTransaction = (action, buildingType) => {
    if (!canAffordOperation(action, buildingType)) {
      gameState.addToast(t('error.insufficientFunds'), 'error')
      return false
    }
    const cost = getBuildingCost(buildingType)
    switch (action) {
      case 'demolish':
        gameState.updateCredits(getBuildingRefund(buildingType))
        break
      case 'upgrade':
        gameState.updateCredits(-cost)
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
  }
}
