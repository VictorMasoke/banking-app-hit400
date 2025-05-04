// components/DepositModal.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { formatAmount } from "@/lib/utils";
import { depositFunds } from "@/lib/actions/user.banking";

interface Account {
  account_id: string;
  account_number: string;
  balance: number;
  account_type: string;
}

interface DepositModalProps {
  accounts: Account[];
}

export default function DepositModal({ accounts }: DepositModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
    details?: {
      reference?: string;
      newBalance?: number;
    };
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    account_number: "",
    amount: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    account_number: "",
    amount: "",
    general: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        general: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      account_number: "",
      amount: "",
      general: "",
    };

    if (!formData.account_number) {
      newErrors.account_number = "Account is required";
      valid = false;
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
      valid = false;
    } else if (isNaN(Number(formData.amount))) {
      newErrors.amount = "Amount must be a number";
      valid = false;
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be positive";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setAlert(null);

    try {
      const depositData = {
        account_number: formData.account_number,
        amount: Number(formData.amount),
        description: formData.description,
      };

      const result = await depositFunds(depositData);

      if ('error' in result) {
        throw new Error(result.error);
      }

      setAlert({
        type: "success",
        message: "Deposit successful",
        details: {
          reference: result.reference,
          newBalance: result.new_balance,
        },
      });

      // Reset form
      setFormData({
        account_number: "",
        amount: "",
        description: "",
      });

      // Close modal after 3 seconds if success
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Deposit error:", error);
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : "Deposit failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Link
        href="#"
        className="flex gap-2 items-center"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <Image
          src="/icons/deposit.svg" // Make sure you have this icon
          width={20}
          height={20}
          alt="deposit"
          className="filter-blue-500"
        />
        <h2 className="text-14 font-semibold text-gray-600">Deposit</h2>
      </Link>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Make a Deposit</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setAlert(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {alert && (
              <Alert
                variant={alert.type === "success" ? "default" : "destructive"}
                className="mb-4"
              >
                {alert.type === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {alert.type === "success" ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription>
                  <div className="space-y-1">
                    <p>{alert.message}</p>
                    {alert.details?.reference && (
                      <p>Reference: {alert.details.reference}</p>
                    )}
                    {alert.details?.newBalance && (
                      <p>New Balance: {formatAmount(alert.details.newBalance)}</p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="account_number">Account</Label>
                <select
                  id="account_number"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md mt-1"
                  disabled={isSubmitting}
                >
                  <option value="">Select account</option>
                  {accounts.map((account) => (
                    <option key={account.account_id} value={account.account_number}>
                      {account.account_number} - {account.account_type} (Balance:{" "}
                      {formatAmount(account.balance)})
                    </option>
                  ))}
                </select>
                {errors.account_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.account_number}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  disabled={isSubmitting}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Deposit description"
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Deposit Funds"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
