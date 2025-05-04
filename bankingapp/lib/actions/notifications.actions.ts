"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const API_BASE_URL = process.env.BASE_URL_API || "https://banking-api-b4x1.onrender.com";
// const API_BASE_URL = "localhost:5600";
const JWT_SECRET = process.env.JWT_SECRET || "your_very_secure_jwt_secret";

interface Notification {
  notification_id: string;
  email: string;
  subject: string;
  content: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
  updated_at: string;
}

export const getAllNotifications = async (): Promise<Notification[] | null> => {
  try {
    const token = cookies().get("bankingToken")?.value;
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 401) {
        cookies().delete("bankingToken");
      }
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();
    return data.data.notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
};


interface SendNotificationParams {
    email: string;
    subject: string;
    content: string;
  }

  export const sendNotification = async ({ email, subject, content }: SendNotificationParams): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = cookies().get("bankingToken")?.value;
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, subject, content })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send notification');
      }

      return { success: true, message: 'Notification queued successfully' };
    } catch (error) {
      console.error("Error sending notification:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send notification'
      };
    }
  };
