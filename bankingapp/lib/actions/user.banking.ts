"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.BASE_URL_API || "http://localhost:5600";
const JWT_SECRET = "your_very_secure_jwt_secret";

export const getCustomerAccounts = async () => {
  try {
    // 1. Get token from cookies
    const token = cookies().get("bankingToken")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode("your_very_secure_jwt_secret")
    );

    const email = payload.email;
    if (!email) throw new Error("Token doesn't email");

    const response = await fetch(`${API_BASE_URL}/users/${email}/balances`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        cookies().delete("bankingToken");
      }
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("Error in getLoggedInUser:", error);
    return null;
  }
};

interface Transaction {
  transaction_id: string;
  transaction_date: string;
  transaction_type: string;
  amount: number;
  description: string;
  reference: string;
  balance_after: number;
  account_number: string;
  account_type: string;
}

interface TransactionsResponse {
  status: number;
  message: string;
  data: {
    customer_id: string;
    transactions: Transaction[];
    summary: {
      total_deposits: number;
      total_withdrawals: number;
      transaction_count: number;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export const getUserTransactions = async (
  page = 1,
  limit = 10,
  filters = {}
): Promise<TransactionsResponse | null> => {
  try {
    const token = cookies().get("bankingToken")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(
        process.env.JWT_SECRET || "your_very_secure_jwt_secret"
      )
    );

    const email = payload.email;
    if (!email) throw new Error("Token doesn't contain user_id");

    // Construct query string from filters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await fetch(
      `${API_BASE_URL}/users/${email}/transactions?${queryParams}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        cookies().delete("bankingToken");
      }
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getUserTransactions:", error);
    return null;
  }
};

export const transFunds = async (transferData: {
  from_account_no: string;
  to_account_no: string;
  amount: number;
  description?: string;
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get("bankingToken")?.value;

  if (!token) {
    return { error: "Authentication required", status: 401 };
  }

  try {
    const { from_account_no, to_account_no, amount, description } =
      transferData;

    // Validate input
    if (!from_account_no || !to_account_no || !amount) {
      return { error: "Missing required fields", status: 400 };
    }

    const response = await fetch(`${API_BASE_URL}/transactions/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        from_account_no,
        to_account_no,
        amount,
        description,
      }),
    });

    const data = await response.json();

    // Return a plain object with status and data
    return data;
  } catch (error) {
    console.error("Transfer error:", error);
    return { error: "Internal server error", status: 500 };
  }
};

export const createAccount = async (accountData: {
  account_type_id: number;
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get("bankingToken")?.value;

  if (!token) {
    return { error: "Authentication required", status: 401 };
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(
        process.env.JWT_SECRET || "your_very_secure_jwt_secret"
      )
    );

    const email = payload.email;
    const { account_type_id } = accountData;

    // Validate input
    if (!email || !account_type_id) {
      return { error: "Missing required fields", status: 400 };
    }

    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        account_type_id,
      }),
    });

    const data = await response.json();

    // Return a plain object with status and data
    return data;
  } catch (error) {
    console.error("Account creation error:", error);
    return { error: "Internal server error", status: 500 };
  }
};
