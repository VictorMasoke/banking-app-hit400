"use client";

import HeaderBox from "@/components/HeaderBox";
import AdminDashboard from "@/components/AdminDashboard";
import React, { useEffect, useState } from "react";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import { getBaselMetrics } from "@/lib/actions/admin.actions";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState<{ firstName: string } | null>(null);
  const [metrics, setMetrics] = useState(null);
  const [assetAllocationData, setAssetAllocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionsData, setTransactionsData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getLoggedInUser();
        setLoggedIn(user);

        const baselData = await getBaselMetrics();
        setMetrics(baselData.data);

        setAssetAllocationData({
          labels: baselData.assetTypes,
          datasets: [{
            data: baselData.assetValues,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
              '#9966FF', '#FF9F40'
            ],
          }],
        });

        setTransactionsData({
          labels: baselData.transactionMonths,
          datasets: [{
            label: 'Transactions',
            data: baselData.transactionCounts,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
          }],
        });

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <section className="p-6">
      <HeaderBox
        type="greeting"
        title="Welcome"
        user={loggedIn?.firstName || "Admin"}
        subtext="Basel III Compliance Dashboard"
      />
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
