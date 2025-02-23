"use client";

import HeaderBox from "@/components/HeaderBox";
import AdminDashboard from "@/components/AdminDashboard";
import React, { useEffect, useState } from "react";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { calculateBankMetrics, getAssetAllocation } from "@/lib/actions/portfolio.actions";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState<{ firstName: string } | null>(null);
  const [metrics, setMetrics] = useState(null);
  const [assetAllocationData, setAssetAllocationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const user = await getLoggedInUser();
        setLoggedIn(user);

        const metricsData = await calculateBankMetrics();
        const assetData = await getAssetAllocation();

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

  const accountGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Total Deposits ($M)",
        data: [5, 8, 12, 18, 25, 33, 42, 50, 58, 67, 75, 85],
        borderColor: "#2563EB",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

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
        accountGrowthData={accountGrowthData}
      />
    </section>
  );
};

export default Home;
