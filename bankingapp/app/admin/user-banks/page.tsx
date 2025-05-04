
import React from 'react'
import HeaderBox from '@/components/HeaderBox'
import {getLoggedInUser} from "@/lib/actions/auth.actions";
import UsersTable from '@/components/UsersTable'
import InactiveAccounts from '@/components/InactiveAccounts';

const page = async () => {

  return (
    <div className='transactions'>
       <div className='transactions-header'>
        <HeaderBox
          title='Inactive Accounts'
          subtext='See all inactive accounts'
        />
      </div>

        <section className='flex w-full flex-col gap-6'>
          <InactiveAccounts />
        </section>
    </div>
  )
}

export default page











