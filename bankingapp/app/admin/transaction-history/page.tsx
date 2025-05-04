import HeaderBox from "@/components/HeaderBox";
import React from "react";
import AdminTransactionsTable from "@/components/AdminTransactions";

const page = async () => {

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
          <AdminTransactionsTable />
        </section>
      </div>
    </>
  );
};

export default page;
