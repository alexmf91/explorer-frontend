import { envConfig } from '@app/configs'

const BASE_URL = envConfig.ARCHIVER_API_URL

const formatTick = (tick: string) => parseInt(tick.replace(/,/g, ''), 10)

const makeTicksUrl = (tick: string) => `${BASE_URL}/ticks/${formatTick(tick)}`

export const ARCHIVER_API_ENDPOINTS = {
  STATUS: `${BASE_URL}/status`,
  // IDENTITIES
  IDENTITY_TRANSFER_TRANSACTIONS: (addressId: string, startTick: number, endtick: number) =>
    `${BASE_URL}/identities/${addressId}/transfer-transactions?startTick=${startTick}&endTick=${endtick}`,
  // BALANCES
  BALANCES: (addressId: string) => `${BASE_URL}/balances/${addressId}`,
  // TRANSACTIONS
  TRANSACTIONS: (txId: string) => `${BASE_URL}/transactions/${txId}`,
  TRANSACTION_STATUS: (txId: string) => `${BASE_URL}/tx-status/${txId}`,
  // TICKS
  TICK_DATA: (tick: string) => `${makeTicksUrl(tick)}/tick-data`,
  TICK_TRANSACTIONS: (tick: string) => `${makeTicksUrl(tick)}/transactions`,
  TICK_TRANSFER_TRANSACTIONS: (tick: string) => `${makeTicksUrl(tick)}/transfer-transactions`,
  TICK_APPROVED_TRANSACTIONS: (tick: string) => `${makeTicksUrl(tick)}/approved-transactions`,
  // EPOCHS
  EPOCH_COMPUTORS: (epoch: number) => `${BASE_URL}/epochs/${epoch}/computors`,
  // RICH_LIST
  RICH_LIST: (page: number, pageSize: number) =>
    `${BASE_URL}/rich-list?page=${page}&pageSize=${pageSize}`
} as const

export default ARCHIVER_API_ENDPOINTS
