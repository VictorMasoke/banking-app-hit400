// components/TransactionsTable.tsx
"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAmount } from "@/lib/utils";
import { Button } from "./ui/button";
import { getAllTransactions } from "@/lib/actions/admin.actions";

interface Transaction {
  transaction_id: number;
  transaction_date: string;
  transaction_type: string;
  amount: string;
  description: string;
  reference: string;
  account_number: string;
  account_id: number;
  account_type: string;
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export default function AdminTransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getAllTransactions();

        setTransactions(response.transactions || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

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

  if (transactions.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No transactions found</AlertTitle>
        <AlertDescription>There are no transactions to display.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableCaption>A list of recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Reference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTransactions.map((transaction) => (
            <TableRow key={transaction.transaction_id}>
              <TableCell>
                {new Date(transaction.transaction_date).toLocaleString()}
              </TableCell>
              <TableCell className="capitalize">
                {transaction.transaction_type}
              </TableCell>
              <TableCell
                className={
                  transaction.transaction_type === "deposit"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {transaction.transaction_type === "deposit" ? "+" : "-"}
                {formatAmount(parseFloat(transaction.amount))}
              </TableCell>
              <TableCell>{transaction.description || "-"}</TableCell>
              <TableCell>
                {transaction.account_number} ({transaction.account_type})
              </TableCell>
              <TableCell>
                {transaction.first_name} {transaction.last_name}
                <br />
                <span className="text-sm text-gray-500">
                  {transaction.email}
                </span>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {transaction.reference}
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
    </div>
  );
}
