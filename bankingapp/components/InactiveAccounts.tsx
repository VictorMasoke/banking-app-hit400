// components/InactiveAccounts.tsx
"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAmount, formatDate } from "@/lib/utils";
import { Button } from "./ui/button";
import { accountFreezeUnfreeze, getInactiveAccounts } from "@/lib/actions/admin.actions";

interface InactiveAccount {
  account_id: number;
  account_number: string;
  balance: string;
  account_type: string;
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  days_inactive: number | null;
  last_transaction_date: string | null;
  account_open_date: string;
  status: 'active' | 'frozen';
}

interface AlertState {
  type: 'success' | 'error';
  message: string;
}

export default function InactiveAccounts() {
  const [accounts, setAccounts] = useState<InactiveAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 10;
  const daysThreshold = 30;

  const fetchInactiveAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInactiveAccounts();
      setAccounts(response.inactiveAccounts || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInactiveAccounts();
  }, []);

  const handleAccountAction = async (accountNumber: string, actionType: 'freeze' | 'activate') => {
    try {
      const userConfirmed = window.confirm(
        `Are you sure you want to ${actionType} account ${accountNumber}?`
      );

      if (!userConfirmed) return;

      const result = await accountFreezeUnfreeze({
        account_no: accountNumber,
        freeze: actionType === 'freeze'
      });

      if ('error' in result) {
        setAlert({
          type: "error",
          message: result.error || "Something went wrong",
        });
      } else {
        setAlert({
          type: "success",
          message: result.message || `Account ${actionType}d successfully`,
        });
        fetchInactiveAccounts();
      }

    } catch (error) {
      console.error('Account action error:', error);
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : 'Failed to perform account action',
      });
    }
  };

  // Pagination logic
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = accounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );
  const totalPages = Math.ceil(accounts.length / accountsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alert for freeze/unfreeze actions */}
      {alert && (
        <Alert variant={alert.type === 'success' ? 'default' : 'destructive'} className="mb-4">
          {alert.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {accounts.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No inactive accounts found</AlertTitle>
          <AlertDescription>
            No accounts have been inactive for {daysThreshold} days or more.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Table>
            <TableCaption>
              Accounts inactive for {daysThreshold} days or more
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Days Inactive</TableHead>
                <TableHead>Account Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAccounts.map((account) => (
                <TableRow key={account.account_id}>
                  <TableCell className="font-medium">
                    {account.account_number}
                  </TableCell>
                  <TableCell>
                    {account.first_name} {account.last_name}
                    <br />
                    <span className="text-sm text-gray-500">
                      {account.email}
                    </span>
                  </TableCell>
                  <TableCell>{formatAmount(parseFloat(account.balance))}</TableCell>
                  <TableCell>{account.account_type}</TableCell>
                  <TableCell>
                    {formatDate(account.account_open_date)}
                  </TableCell>
                  <TableCell>
                    {account.last_transaction_date
                      ? formatDate(account.last_transaction_date)
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    {account.days_inactive ?? "Never Used"}
                  </TableCell>
                  <TableCell>
                    {account.status ?? "Never Used"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAccountAction(
                        account.account_number,
                        account.status === 'active' ? 'freeze' : 'activate'
                      )}
                    >
                      {account.status === 'active' ? 'Freeze' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination controls */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
