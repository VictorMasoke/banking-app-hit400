
import React from 'react'
import HeaderBox from '@/components/HeaderBox'
import { getAllUsersInfo } from '@/lib/actions/user.actions'
import UsersTable from '@/components/UsersTable'

const page = async () => {

   const accounts = await getAllUsersInfo()
   if (!accounts) return;

  return (
    <div className='transactions'>
      <div className='transactions-header'>
        <HeaderBox
          title='All Bank Users'
          subtext='See all the user details using your Basel Banking System'
        />
      </div>

      <div className='space-y-6'>
        <div className='transactions-account'>
          <div className='transactions-account-balance'>
            <p className='text-14'>Total Bank Users</p>
            <p className='text-24 text-center font-bold'>
              {accounts.length}
            </p>
          </div>
        </div>

        <section className='flex w-full flex-col gap-6'>
          <UsersTable accounts={accounts}/>
        </section>
      </div>
    </div>
  )
}

export default page











