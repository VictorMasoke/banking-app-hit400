"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from 'jose';

const API_BASE_URL = process.env.BASE_URL_API || 'https://banking-api-b4x1.onrender.com';
const JWT_SECRET = 'your_very_secure_jwt_secret';

export const signIn = async ({ email, password }: { email: string; password: string; }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Sign in failed");
    }

    // Store token in httpOnly cookie
    cookies().set("bankingToken", data.data.token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400, // 24 hours
    });

    return data.data;
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error;
  }
};

export const signUp = async (userData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone: userData.phone || "",
        password: userData.password,
        date_of_birth: userData.dateOfBirth,
        address: userData.address1,
        city: userData.city,
        state: userData.state,
        zip_code: userData.postalCode,
        country: "US", // Default or from form
        security_question: "What city were you born in?", // Default or from form
        security_answer: userData.city // Using city as security answer for example
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Sign up failed");
    }

    // Auto-login after signup
    await signIn({ email: userData.email, password: userData.password });

    return data.data;
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
  }
};

export const getLoggedInUser = async () => {
  try {
    // 1. Get token from cookies
    const token = cookies().get("bankingToken")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode('your_very_secure_jwt_secret')
    );

    const email = payload.email as string;
    if (!email) throw new Error("Token doesn't contain email");

    const response = await fetch(`${API_BASE_URL}/users/${email}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      cache: 'no-store'
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

export const getLoggedInCustomer = async () => {
  try {
    // 1. Get token from cookies
    const token = cookies().get("bankingToken")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode('your_very_secure_jwt_secret')
    );

    const email = payload.email as string;
    if (!email) throw new Error("Token doesn't contain email");

    const response = await fetch(`${API_BASE_URL}/customers/${email}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      cache: 'no-store'
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

export const logout = async () => {
  try {
    // Clear client-side token
    cookies().delete("bankingToken");

    // Call server logout endpoint if needed
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include"
    });

    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
};

export const resetPassword = async (email: string, securityAnswer: string, newPassword: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        security_answer: securityAnswer,
        new_password: newPassword
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Password reset failed");
    }

    return data;
  } catch (error) {
    console.error("Error during password reset:", error);
    throw error;
  }
};

export const getSecurityQuestion = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/security-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get security question");
    }

    return data.data.security_question;
  } catch (error) {
    console.error("Error getting security question:", error);
    throw error;
  }
};
