import Image from "next/image";
import Link from "next/link";
import React from "react";
import BankCard from "./BankCard";
import AddBankModal from "./AddBankModal";

interface RightSidebarProps {
  user: {
    user_name: string;
    email: string;
  };
  accountsData: {
    email: string;
    accounts: Account[];
  }
}

interface Account {
  account_id: string;
  account_number: string;
  balance: number;
  account_type: string;
  interest_rate: number;
  status: string;
  opened_date: string;
}

const RightSidebar = ({ user, accountsData }: RightSidebarProps) => {
  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner">
          <div className="profile">
            <div className="profile-img">
              <span className="text-5xl font-bold text-blue-500">
                {user?.user_name?.[0]?.toUpperCase() || 'G'}
              </span>
            </div>

            <div className="profile-details">
              <h1 className="profile-name">
                {user?.user_name || 'Guest User'}
              </h1>
              <p className="profile-email">{user?.email || 'guest@example.com'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="banks">
        <div className="flex w-full justify-between items-center">
          <h2 className="header-2">My Banks</h2>
          <AddBankModal/>
        </div>

        {accountsData.accounts.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {accountsData.accounts.map((account: Account) => (
              <BankCard
                key={account.account_id}
                account={account}
                userName={`${user?.user_name}`}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-2">
            <p className="text-sm text-gray-600">You don't have any bank accounts yet</p>
            <Link href="/" className="text-sm text-blue-500 font-medium">
              Add your first bank account
            </Link>
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightSidebar;
