import HeaderBox from '@/components/HeaderBox'
import TransactionsTable from '@/components/TransactionsTable';
import {getLoggedInUser} from "@/lib/actions/auth.actions";
import { formatAmount } from '@/lib/utils';
import React from 'react';

const TransactionHistory = async ({searchParams: {id, page}}: SearchParamProps) => {
    const currentPage = Number(page as string) || 1;
    const loggedIn = await getLoggedInUser();

  return (

    <div className='transactions'>
       <div className='transactions-header'>
        <HeaderBox
          title='Transaction History'
          subtext='See your bank details and transactions'
        />
      </div>

        <section className='flex w-full flex-col gap-6'>
          <TransactionsTable />
        </section>
    </div>
  )
}

export default TransactionHistory
