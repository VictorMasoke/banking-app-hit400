import React from 'react'
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox';
import RightSidebar from '@/components/RightSidebar';
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import TransactionsTable from '@/components/TransactionsTable';
import { getCustomerAccounts } from '@/lib/actions/user.banking';

interface SearchParamProps {
  searchParams: {
    id?: string;
    page?: string;
  }
}

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const loggedIn = await getLoggedInUser();
  const accountsData = await getCustomerAccounts();

  // Extract accounts from the response
  const accounts = accountsData?.data?.accounts || [];

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header margin-top-lg'>
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.user_name || "Guest"}
            subtext="Access and manage your account and transactions efficiently"
          />
        </header>

        <TransactionsTable />
      </div>

      <RightSidebar
        user={loggedIn}
        accountsData={accountsData}
      />
    </section>
  )
}

export default Home
