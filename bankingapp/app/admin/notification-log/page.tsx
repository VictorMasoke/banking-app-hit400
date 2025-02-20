"use client";

import React, { useState, useEffect } from "react";
import { Client, Databases, Query } from "node-appwrite";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust the import path as needed
import HeaderBox from "@/components/HeaderBox";

const page = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("6788eda1003430b7cae6")
      .setKey(
        "standard_1691566e87753eae87341d72353d8c61d9c920d1c0fd2320f857df032433bbc3dbaa1600f8e63c29f97282cb23c925c71d9358ebbe80763a766ea33cbd92fa569d30c8f4659777cf060acb1b1d1ce65808fb0a19332a994d4017cc1611b217e02d38c030c32db46dac57a497a0e9cda4c9d28e68925ca4c9ca5dd6a3a9de0245"
      ); // Use env variable in production

    const db = new Databases(client);
    // Fetch all notifications from the Notifications collection
    db.listDocuments("6788f3a6000ec891cc6a", "67b6340a001d9b4911f9")
      .then((response) => {
        setNotifications(response.documents);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await db.listDocuments(
          "6788f3a6000ec891cc6a",
          "67b6340a001d9b4911f9"
        );
        setNotifications(response.documents);
        // Optionally, update your aggregate counts here.
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Set interval to fetch notifications every 60 seconds
    const intervalId = setInterval(fetchNotifications, 20000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='transactions'>
      <div className='transactions-header'>
        <HeaderBox
          title='Notifications Log'
          subtext='See notifications being sent to customers in real time'
        />
      </div>
      {/* <div className="mb-4 flex gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Past 10 Days</h2>
          <p className="text-2xl">{count10}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Past 30 Days</h2>
          <p className="text-2xl">{count30}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Past 90 Days</h2>
          <p className="text-2xl">{count90}</p>
        </div>
      </div> */}
      {loading ? (
        <p className="text-center">Loading notifications...</p>
      ) : (
        <Table>
          <TableHeader className="bg-[#f9fafb]">
            <TableRow>
              <TableHead className="px-2">Email</TableHead>
              <TableHead className="px-2">Subject</TableHead>
              <TableHead className="px-2">Status</TableHead>
              <TableHead className="px-2">Response</TableHead>
              <TableHead className="px-2">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((n) => (
              <TableRow key={n.$id}>
                <TableCell className="px-2">{n.email}</TableCell>
                <TableCell className="px-2">{n.subject}</TableCell>
                <TableCell className="px-2">{n.status}</TableCell>
                <TableCell className="px-2">{n.response || "—"}</TableCell>
                <TableCell className="px-2">
                  {new Date(n.$createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default page;
