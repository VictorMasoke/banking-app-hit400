"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import HeaderBox from "@/components/HeaderBox";
import { getAllNotifications } from "@/lib/actions/notifications.actions";

interface Notification {
  notification_id: string;
  email: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  response?: string;
  created_at: string;
  updated_at: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getAllNotifications();

        if (data) {
          setNotifications(data);
        } else {
          setError("Failed to load notifications");
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("An error occurred while loading notifications");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Set interval to fetch notifications every 20 seconds
    const intervalId = setInterval(fetchNotifications, 20000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Notifications Log"
          subtext="See notifications being sent to customers in real time"
        />
      </div>

      {error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : loading ? (
        <p className="text-center p-4">Loading notifications...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-[#f9fafb]">
              <TableRow>
                <TableHead className="px-4">Email</TableHead>
                <TableHead className="px-4">Subject</TableHead>
                <TableHead className="px-4">Status</TableHead>
                <TableHead className="px-4">Response</TableHead>
                <TableHead className="px-4">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.notification_id}>
                  <TableCell className="px-4">{notification.email}</TableCell>
                  <TableCell className="px-4">{notification.subject}</TableCell>
                  <TableCell className="px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      notification.status === 'sent'
                        ? 'bg-green-100 text-green-800'
                        : notification.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {notification.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4">
                    {notification.response || "—"}
                  </TableCell>
                  <TableCell className="px-4">
                    {new Date(notification.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {notifications.length === 0 && (
            <div className="text-center p-4 text-gray-500">
              No notifications found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
