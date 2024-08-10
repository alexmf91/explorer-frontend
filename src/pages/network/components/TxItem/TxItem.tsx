import { memo, useEffect, useState } from 'react'

import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon } from '@app/assets/icons'
import type { Transaction } from '@app/services/archiver'
import { clsxTwMerge, formatString } from '@app/utils'
import type { Transfer } from '@app/utils/qubic-ts'
import { getTransfers, QUTIL_ADDRESS } from '@app/utils/qubic-ts'
import AddressLink from '../AddressLink'
import CardItem from '../CardItem'
import TxLink from '../TxLink'
import TxStatus from '../TxStatus'
import TransactionDetails from './TransactionDetails'
import type { TxItemVariant } from './TxItem.types'

type Props = {
  tx: Omit<Transaction, 'inputSize' | 'signatureHex'>
  identify?: string
  nonExecutedTxIds: string[]
  variant?: TxItemVariant
  isHistoricalTx?: boolean
}

function TxItem({
  tx: { txId, sourceId, tickNumber, destId, inputType, amount, inputHex },
  identify,
  nonExecutedTxIds,
  variant = 'primary',
  isHistoricalTx = false
}: Props) {
  const [entries, setEntries] = useState<Transfer[]>([])
  const [detailsOpen, setDetailsOpen] = useState(false)

  const handleToggleDetails = () => setDetailsOpen((prev) => !prev)

  useEffect(() => {
    if (destId === QUTIL_ADDRESS && inputType === 1 && inputHex) {
      ;(async () => {
        try {
          const transfers = await getTransfers(inputHex)
          setEntries(transfers)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      })()
    }
  }, [destId, inputHex, inputType])

  if (variant === 'secondary') {
    return (
      <>
        <div className="mb-24 flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
          <div className="">
            <TxStatus executed={!(nonExecutedTxIds || []).includes(txId)} />
          </div>
          <TxLink isHistoricalTx={isHistoricalTx} className="text-base text-gray-50" value={txId} />
        </div>
        <TransactionDetails
          txDetails={{ txId, sourceId, tickNumber, destId, inputType, amount }}
          isHistoricalTx={isHistoricalTx}
          variant={variant}
          entries={entries}
        />
      </>
    )
  }

  return (
    <CardItem className="flex flex-col rounded-12 p-12 transition-all duration-300">
      <div className="flex items-center justify-between gap-8">
        <TxStatus executed={!(nonExecutedTxIds || []).includes(txId)} />
        <div className="flex flex-grow flex-col items-start gap-8 sm:flex-row sm:justify-between">
          {identify ? (
            <div className="flex gap-8">
              {identify === sourceId ? (
                <ArrowDownIcon className="h-12 w-9" />
              ) : (
                <ArrowUpIcon className="h-12 w-9" />
              )}
              <AddressLink
                className="text-base"
                value={identify === sourceId ? destId : sourceId}
                copy
                ellipsis
              />
            </div>
          ) : (
            <TxLink
              isHistoricalTx={isHistoricalTx}
              value={txId}
              className="text-primary-40"
              ellipsis
              copy
            />
          )}
          <p className="text-center font-space text-base">
            {formatString(Number(amount))} <span className="text-gray-50">QUBIC</span>
          </p>
        </div>
        <button
          type="button"
          aria-label="toggle-transaction-details"
          className="rounded-8 px-6 py-3 hover:bg-primary-30"
          onClick={handleToggleDetails}
        >
          <ChevronDownIcon
            className={clsxTwMerge(
              'h-20 w-20 text-gray-50 transition-transform duration-300',
              detailsOpen ? 'rotate-180' : 'rotate-0'
            )}
          />
        </button>
      </div>
      {detailsOpen && (
        <TransactionDetails
          txDetails={{ txId, sourceId, tickNumber, destId, inputType, amount }}
          isHistoricalTx={isHistoricalTx}
          variant={variant}
          entries={entries}
        />
      )}
    </CardItem>
  )
}

const MemoizedTxItem = memo(TxItem)

export default MemoizedTxItem