import { useTranslation } from 'react-i18next'

import { InfiniteScroll } from '@app/components/ui'
import { DotsLoader } from '@app/components/ui/loaders'
import type { TransactionV2 } from '@app/store/apis/archiver-v2.types'
import { useCallback } from 'react'
import { TxItem } from '../../../components'

type Props = {
  addressId: string
  transactions: TransactionV2[]
  loadMore: () => Promise<void>
  hasMore: boolean
  isLoading: boolean
  error: string | null
}

export default function LatestTransactions({
  addressId,
  transactions,
  loadMore,
  hasMore,
  isLoading,
  error
}: Props) {
  const { t } = useTranslation('network-page')

  const renderTxItem = useCallback(
    ({ transaction, moneyFlew, timestamp }: TransactionV2) => (
      <TxItem
        key={transaction.txId}
        tx={transaction}
        identity={addressId}
        variant="primary"
        nonExecutedTxIds={moneyFlew ? [] : [transaction.txId]}
        timestamp={timestamp}
      />
    ),
    [addressId]
  )

  return (
    <InfiniteScroll
      items={transactions}
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      loader={<DotsLoader showLoadingText />}
      error={error && t('loadingTransactionsError')}
      endMessage={
        <p className="py-32 text-center text-sm text-gray-50">
          {transactions.length === 0 ? t('noTransactions') : t('allTransactionsLoaded')}
        </p>
      }
      renderItem={renderTxItem}
    />
  )
}
