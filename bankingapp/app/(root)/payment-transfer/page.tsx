import HeaderBox from '@/components/HeaderBox'
import TransferForm from '@/components/TransferForm'
import {getLoggedInUser} from "@/lib/actions/auth.actions";
import React from 'react'
import { getCustomerAccounts } from '@/lib/actions/user.banking';


const Transfer = async () => {
  const loggedIn = await getLoggedInUser();
  const accountsData = await getCustomerAccounts();


  return (
    <section className="payment-transfer">
       <HeaderBox
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />
      <section className="size-full pt-5">
      <TransferForm
          accounts={accountsData.accounts}
          userId={loggedIn.userId}
        />
        </section>
    </section>
  )
}

export default Transfer
