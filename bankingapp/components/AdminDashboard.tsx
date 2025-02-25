"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import AnimatedCountUp from "./AnimatedCountUp";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface AdminDashboardProps {
  metricsData: any;
  assetData: any;
  loading: boolean;
  transactionsTracker: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ metricsData, assetData, loading, transactionsTracker }) => {
  if (loading) {
    return <div className="text-center text-blue-700 font-semibold text-lg">Loading Dashboard...</div>;
  }

  const lineChartOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: "easeInOutQuad",
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: true, color: "#E5E7EB" } },
    },
  };

  const pieChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: "easeOutBounce",
    },
  };

  return (
    <div>
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Card className="bg-white text-blue-700 border border-blue-600 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              <AnimatedCountUp amount={metricsData?.totalAssets || 0} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-blue-700 border border-blue-600 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              <AnimatedCountUp amount={metricsData?.totalDeposits || 0} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-blue-700 border border-blue-600 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Net Interest Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{metricsData?.netInterestMargin || "0.0"}%</div>
          </CardContent>
        </Card>

        <Card className="bg-white text-blue-700 border border-blue-600 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Loan Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              <AnimatedCountUp amount={metricsData?.loanPortfolio || 0} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Management & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="bg-white text-blue-700 border border-blue-600 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Transaction Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={transactionsTracker} options={lineChartOptions} />
          </CardContent>
        </Card>

        <Card className="bg-white text-blue-700 border border-blue-600 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-[620px] h-[620px] mx-auto">
              <Pie data={assetData} options={pieChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
