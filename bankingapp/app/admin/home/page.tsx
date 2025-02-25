"use client";

import HeaderBox from "@/components/HeaderBox";
import AdminDashboard from "@/components/AdminDashboard";
import React, { useEffect, useState } from "react";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { calculateBankMetrics, getAssetAllocation } from "@/lib/actions/portfolio.actions";
import { getAllTransactions } from "@/lib/actions/transaction.action";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState<{ firstName: string } | null>(null);
  const [metrics, setMetrics] = useState(null);
  const [assetAllocationData, setAssetAllocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionsData, setTransactionsData] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const user = await getLoggedInUser();
        setLoggedIn(user);

        const metricsData = await calculateBankMetrics();
        const assetData = await getAssetAllocation();
        const allTransactions = await getAllTransactions();
        const transactionsList = Object.values(allTransactions); // Convert to array

        // Process transactions to get totals per month
        const monthlyTotals = new Array(12).fill(0);
        transactionsList.forEach(transaction => {
          const date = new Date(transaction.createdAt);
          const month = date.getMonth(); // 0 = Jan, 11 = Dec
          monthlyTotals[month] += parseFloat(transaction.amount);
        });

        setTransactionsData({
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Total Transactions ($)",
              //data: [23, 23, 41, 21, 12, 21, 23, 12, 13, 6, 9, 24],
              data: monthlyTotals.map(amount => amount),
              borderColor: "#2563EB",
              backgroundColor: "rgba(37, 99, 235, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        });

        setMetrics(metricsData);
        setAssetAllocationData(assetData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndData();
  }, []);

  return (
    <section className="p-6">
      {/* Header */}
      <HeaderBox
        type="greeting"
        title="Welcome"
        user={loggedIn?.firstName || "Admin"}
        subtext="Manage your clients with ease and efficiency using Basel Compliance"
      />

      {/* Dashboard */}
      <AdminDashboard
        metricsData={metrics}
        assetData={assetAllocationData}
        loading={loading}
        transactionsTracker={transactionsData}
      />
    </section>
  );
};

export default Home;