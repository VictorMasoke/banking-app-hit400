import HeaderBox from "@/components/HeaderBox";
import TransactionsTable from "@/components/TransactionsTable";
import { formatAmount } from "@/lib/utils";
import React from "react";
import { getAllTransactions } from "@/lib/actions/transaction.action";
import AdminTransactionsTable from "@/components/AdminTransactions";

const page = async () => {
  const allTransactions = await getAllTransactions();
  const transactionsList = Object.values(allTransactions);

  //console.log(transactionsList);
  return (
    <>
      <div className="transactions">
        <div className="transactions-header">
          <HeaderBox
            title="Transaction Tracker"
            subtext="See all transactions for the users in the bank"
          />
        </div>

        <section className="flex w-full flex-col gap-6">
          <AdminTransactionsTable transactions={transactionsList} />
        </section>
      </div>
    </>
  );
};

export default page;
