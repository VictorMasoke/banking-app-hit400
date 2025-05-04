import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox'
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import { getCustomerAccounts } from '@/lib/actions/user.banking';
import React from 'react'

// Define TypeScript interfaces
interface Account {
  id: string;
  account_id: string;
  account_number: string;
  balance: number;
  account_type: string;
  interest_rate: number;
  status: string;
  created_at: string;
}

interface AccountsResponse {
  customer_id: string;
  accounts: Account[];
}

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();
  const accountsData = await getCustomerAccounts();

  if (!loggedIn) {
    // Handle case where user is not logged in
    return (
      <section className="flex">
        <div className="my-banks">
          <HeaderBox
            title="Access Denied"
            subtext="Please log in to view your bank accounts."
          />
        </div>
      </section>
    );
  }

  if (!accountsData) {
    // Handle case where accounts data couldn't be fetched
    return (
      <section className="flex">
        <div className="my-banks">
          <HeaderBox
            title="My Bank Accounts"
            subtext="Unable to load your accounts at this time."
          />
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Failed to load accounts. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex">
      <div className="my-banks w-full">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activities."
        />

        <div className="space-y-4 mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-24 font-semibold text-gray-900">
              Your Cards
            </h2>
            <p className="text-16 font-normal text-gray-600">
              {accountsData.accounts.length} bank account{accountsData.accounts.length !== 1 ? 's' : ''} associated with your profile
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            {accountsData.accounts.map((account: Account) => (
              <BankCard
                key={account.account_id}
                account={account}
                userName={`${loggedIn?.user_name}`}
              />
            ))}
          </div>

          {accountsData.accounts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <h3 className="text-20 font-semibold text-gray-900">
                No accounts found
              </h3>
              <p className="text-16 font-normal text-gray-600">
                You don't have any bank accounts yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MyBanks;
