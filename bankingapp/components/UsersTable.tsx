"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatDateTime } from "@/lib/utils";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { Button } from "@/components/ui/button";
import TransactionsTable from "./TransactionsTable";
import { formatAmount } from "@/lib/utils";

interface UsersTableProps {
  accounts: any[]; // Adjust your type according to your data model
}

const UsersTable: React.FC<UsersTableProps> = ({ accounts }) => {
  const [open, setOpen] = useState(false);
  const [primaryAccount, setPrimaryAccount] = useState<any>(null);

  const handleRowClick = async (userId: string) => {
    try {
      const accountsData = await getAccounts({ userId });
      const primary = accountsData?.data[0];
      // const appwriteItemId =  primary.appwriteItemId;
      // const account = await getAccount({ appwriteItemId });
      
      setPrimaryAccount(primary);
      setOpen(true); // Open the modal once data is fetched
    } catch (error) {
      console.error(error);
    }
  };  

  return (
    <>
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead className="px-2">Email</TableHead>
            <TableHead className="px-2">User ID</TableHead>
            <TableHead className="px-2">Name</TableHead>
            <TableHead className="px-2">Address</TableHead>
            <TableHead className="px-2">City</TableHead>
            <TableHead className="px-2">Postal Code</TableHead>
            <TableHead className="px-2">DOB</TableHead>
            <TableHead className="px-2">Created At</TableHead>
            <TableHead className="px-2">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow
              key={account.userId}
              onClick={() => handleRowClick(account.$id)}
              className="bg-[#FFFBFA] cursor-pointer !over:bg-none !border-b-DEFAULT"
            >
              <TableCell className="pl-2 pr-10">{account.email}</TableCell>
              <TableCell className="pl-2 pr-10">{account.userId}</TableCell>
              <TableCell className="pl-2 pr-10">
                {account.firstName} {account.lastName}
              </TableCell>
              <TableCell className="pl-2 pr-10">{account.address1}</TableCell>
              <TableCell className="pl-2 pr-10">{account.city}</TableCell>
              <TableCell className="pl-2 pr-10">{account.postalCode}</TableCell>
              <TableCell className="pl-2 pr-10">{account.dateOfBirth}</TableCell>
              <TableCell className="pl-2 pr-10">
                {formatDateTime(new Date(account["$createdAt"])).dateTime}
              </TableCell>
              <TableCell className="pl-2 pr-10">{account.role || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal that shows account details and transactions */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ width: '60%' }}>
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
            
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="space-y-6">
              {primaryAccount && (
                <>
                  <div className="transactions-account">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-18 font-bold text-white">
                        {primaryAccount.name}
                      </h2>
                      <p className="text-14 text-blue-25">
                        {primaryAccount.officialName}
                      </p>
                      <p className="text-14 font-semibold tracking-[1.1px] text-white">
                        ●●●● ●●●● ●●●●{" "}
                        <span className="text-16">{primaryAccount.mask}</span>
                      </p>
                    </div>
                    <div className="transactions-account-balance">
                      <p className="text-14">Current Balance</p>
                      <p className="text-24 text-center font-bold">
                        {formatAmount(primaryAccount.currentBalance)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersTable;
