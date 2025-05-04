// components/CreateAccountForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cookies } from "next/headers";
import { createAccount } from "@/lib/actions/user.banking";

interface AccountType {
  id: number;
  name: string;
}

interface CreateAccountData {
  email: string;
  account_type_id: number;
}

interface CreateAccountFormProps {
  onSuccess?: () => void; // Add this line
}

export default function CreateAccountForm({
  onSuccess,
}: CreateAccountFormProps) {
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
    details?: {
      accountId?: number;
      accountNumber?: string;
    };
  } | null>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    account_type_id: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    account_type_id: "",
    general: "",
  });

  const accountTypes: AccountType[] = [
    { id: 1, name: "Savings Account" },
    { id: 2, name: "Current Account" },
    { id: 3, name: "Premium Account" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      account_type_id: "",
      general: "",
    };

    if (!formData.account_type_id) {
      newErrors.account_type_id = "Account type is required";
      valid = false;
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
      const accountData = {
        account_type_id: Number(formData.account_type_id),
      };

      const result = await createAccount(accountData);

      if (result.status !== 200 && result.status !== 201) {
        setAlert({
          type: "error",
          message: result.message || "Account creation failed",
        });
        return;
      }

      // Set success alert
      setAlert({
        type: "success",
        message: result.message || "Account created successfully",
        details: {
          accountId: result.data.account_id,
          accountNumber: result.data.account_number,
        },
      });

      // Reset form
      setFormData({
        account_type_id: "",
      });

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 5000); // 5000 milliseconds = 5 seconds
      }

      // Refresh account data
      router.refresh();
    } catch (error) {
      console.error("Account creation error:", error);
      setAlert({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to create account",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create New Account
      </h2>
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
              {alert.details?.accountNumber && (
                <p>Account Number: {alert.details.accountNumber}</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="account_type_id">Account Type</Label>
          <select
            id="account_type_id"
            name="account_type_id"
            value={formData.account_type_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mt-1"
            disabled={isSubmitting}
          >
            <option value="">Select account type</option>
            {accountTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.account_type_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.account_type_id}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
