// components/TransferForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatAmount } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import { getCustomerAccounts, transFunds } from "@/lib/actions/user.banking";

interface Account {
  account_id: string;
  account_number: string;
  balance: number;
  account_type: string;
}

interface TransferFormProps {
  accounts: Account[];
  userId: string;
}

interface TransferData {
  from_account_no: string;
  to_account_no: string;
  amount: number;
  description?: string;
  userId: string;
}

export default function TransferForm({ accounts, userId }: TransferFormProps) {
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
    details?: {
      reference?: string;
      fromBalance?: number;
      toBalance?: number;
    };
  } | null>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    from_account_no: "",
    to_account_no: "",
    amount: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    from_account_no: "",
    to_account_no: "",
    amount: "",
    general: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        general: "",
      }));
    }
  };

  const handleAccountSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      from_account_no: "",
      to_account_no: "",
      amount: "",
      general: "",
    };

    if (!formData.from_account_no) {
      newErrors.from_account_no = "Source account is required";
      valid = false;
    }

    if (!formData.to_account_no) {
      newErrors.to_account_no = "Destination account is required";
      valid = false;
    } else if (formData.from_account_no === formData.to_account_no) {
      newErrors.to_account_no = "Cannot transfer to the same account";
      valid = false;
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
      valid = false;
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
      valid = false;
    } else {
      const fromAccount = accounts.find(
        (acc) => acc.account_number === formData.from_account_no
      );
      if (fromAccount && Number(formData.amount)) {
        // You might want to add minimum balance check here if needed
        if (Number(formData.amount) > fromAccount.balance) {
          newErrors.amount = `Insufficient funds. Maximum transfer: ${formatAmount(
            fromAccount.balance
          )}`;
          valid = false;
        }
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setAlert(null); // Clear previous alerts

    try {
      const transferData = {
        from_account_no: formData.from_account_no,
        to_account_no: formData.to_account_no,
        amount: Number(formData.amount),
        description: formData.description,
        userId,
      };

      const result = await transFunds(transferData);

      if (result.status !== 200 && result.status !== 201) {
        setAlert({
          type: 'error',
          message: result.message || 'Transfer failed',
        });
        return;
      }

      // Set success alert
      setAlert({
        type: 'success',
        message: result.message || 'Transfer successful',
        details: {
          reference: result.data.transfer_reference,
          fromBalance: result.data.from_account_new_balance,
          toBalance: result.data.to_account_new_balance,
        },
      });

      // Reset form
      setFormData({
        from_account_no: '',
        to_account_no: '',
        amount: '',
        description: '',
      });

      // Refresh account data
      router.refresh();

    } catch (error) {
      console.error('Transfer error:', error);
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to process transfer',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Transfer Funds</h2>
      {
        alert && (
          <Alert variant={alert.type === 'success' ? 'default' : 'destructive'} className="mb-4">
            {alert.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>
              <div className="space-y-1">
                <p>{alert.message}</p>
                {alert.details?.reference && (
                  <p>Reference: {alert.details.reference}</p>
                )}
                {alert.details?.fromBalance && (
                  <p>New balance (from account): {formatAmount(alert.details.fromBalance)}</p>
                )}
                {alert.details?.toBalance && (
                  <p>New balance (to account): {formatAmount(alert.details.toBalance)}</p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )
      }
      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="from_account_no">From Account</Label>
          <select
            id="from_account_no"
            name="from_account_no"
            value={formData.from_account_no}
            onChange={handleAccountSelect}
            className="w-full p-2 border rounded-md mt-1"
            disabled={isSubmitting}
          >
            <option value="">Select source account</option>
            {accounts.map((account) => (
              <option key={account.account_id} value={account.account_number}>
                {account.account_number} - {account.account_type} (Balance:{" "}
                {formatAmount(account.balance)})
              </option>
            ))}
          </select>
          {errors.from_account_no && (
            <p className="text-red-500 text-sm mt-1">
              {errors.from_account_no}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="to_account_no">To Account Number</Label>
          <Input
            id="to_account_no"
            name="to_account_no"
            type="text"
            value={formData.to_account_no}
            onChange={handleChange}
            placeholder="Enter destination account number"
            disabled={isSubmitting}
          />
          {errors.to_account_no && (
            <p className="text-red-500 text-sm mt-1">{errors.to_account_no}</p>
          )}
        </div>

        <div>
          <Label htmlFor="amount">Amount</Label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="pl-8"
              disabled={isSubmitting}
              step="0.01"
              min="0.01"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add a note about this transfer"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Transfer Funds"}
        </Button>
      </form>
    </div>
  );
}
