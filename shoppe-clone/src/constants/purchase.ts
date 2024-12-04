export const PurchaseStatus = {
  inCart: -1,
  all: 0,
  waitForConfirming: 1,
  waitForGetting: 2,
  inProgress: 3,
  delivered: 4,
  cancelled: 5
} as const
