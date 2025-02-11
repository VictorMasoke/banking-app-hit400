import HeaderBox from '@/components/HeaderBox'
import TransactionsTable from '@/components/TransactionsTable'
import { formatAmount } from '@/lib/utils'
import React from 'react'

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ account }) => {
  // Assuming you want to display the first account in the data array:
  const primaryAccount = account.data[0]

  return (
    <div className='transactions'>
      <div className='transactions-header'>
        <HeaderBox
          title='Transaction History'
          subtext='See your bank details and transactions'
        />
      </div>

      <div className='space-y-6'>
        <div className='transactions-account'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-18 font-bold text-white'>
              {primaryAccount?.name}
            </h2>
            <p className='text-14 text-blue-25'>
              {primaryAccount?.officialName}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● <span className="text-16">{primaryAccount?.mask}</span>
            </p>
          </div>

          <div className='transactions-account-balance'>
            <p className='text-14'>Current Balance</p>
            <p className='text-24 text-center font-bold'>
              {formatAmount(primaryAccount?.currentBalance)}
            </p>
          </div>
        </div>

        <section className='flex w-full flex-col gap-6'>
          {/* Pass transactions if available; otherwise, you can pass an empty array */}
          <TransactionsTable transactions={account?.transactions || []}/>
        </section>
      </div>
    </div>
  )
}

export default TransactionHistory
