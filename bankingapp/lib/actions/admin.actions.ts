"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

const API_BASE_URL = process.env.BASE_URL_API || "https://banking-api-b4x1.onrender.com";
const JWT_SECRET = "your_very_secure_jwt_secret";

export const getAllTransactions = async () => {
  try {
    // 1. Get token from cookies
    const token = cookies().get("bankingToken")?.value;

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/admin/transactions`, {
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
    console.error("Error in getAllTransactions:", error);
    return null;
  }
};

export const getInactiveAccounts = async () => {
  try {
    // 1. Get token from cookies
    const token = cookies().get("bankingToken")?.value;

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/admin/inactive-accounts/30`, {
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
    console.error("Error in getInactiveAccounts:", error);
    return null;
  }
};

export const accountFreezeUnfreeze = async (accountData: {
  account_no: string;
  freeze: boolean;
}): Promise<{ message: string } | { error: string; status: number }> => {
  const cookieStore = cookies();
  const token = cookieStore.get("bankingToken")?.value;

  if (!token) {
    return { error: "Authentication required", status: 401 };
  }

  try {
    // Verify JWT token (though payload isn't used in this function)
    await jwtVerify(
      token,
      new TextEncoder().encode(
        process.env.JWT_SECRET || "your_very_secure_jwt_secret"
      )
    );

    const url = accountData.freeze
      ? `${API_BASE_URL}/accounts/freeze`
      : `${API_BASE_URL}/accounts/unfreeze`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        account_no: accountData.account_no,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to update account status",
        status: response.status,
      };
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Account status update error:", error);
    return {
      error: error instanceof Error ? error.message : "Internal server error",
      status: 500,
    };
  }
};

interface BaselMetrics {
  capitalAdequacyRatio: number;
  tier1CapitalRatio: number;
  liquidityCoverageRatio: number;
  leverageRatio: number;
  riskWeightedAssets: number;
  totalCapital: number;
  hqla: number;
  netCashOutflows: number;
  carStatus: string;
  lcrStatus: string;
  assetTypes: string[];
  assetValues: number[];
  transactionMonths: string[];
  transactionCounts: number[];
  tier1Capital: number;
  tier2Capital: number;
  nsfr: number;
  asf: number;
  rsf: number;
}

export async function getBaselMetrics(): Promise<BaselMetrics> {
  try {
    const response = await fetch(`${API_BASE_URL}/basel/metrics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Basel metrics');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Basel metrics:', error);
    throw error;
  }
}
