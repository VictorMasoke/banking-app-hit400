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
import { formatNumber } from "@/lib/utils";

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
  {/* Total Assets */}
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

  {/* Total Deposits */}
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

  {/* Loan Portfolio */}
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

  {/* Net Interest Margin */}
  <Card className="bg-white text-blue-700 border border-blue-600 p-4 rounded-lg shadow-md">
    <CardHeader>
      <CardTitle>Net Interest Margin</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-xl font-bold">{formatNumber(metricsData?.netInterestMargin) || "0.0"}%</div>
    </CardContent>
  </Card>

  {/* Risk-Weighted Assets */}
  <Card className="bg-white text-blue-700 border border-blue-600 p-4 rounded-lg shadow-md">
    <CardHeader>
      <CardTitle>Risk-Weighted Assets</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-xl font-bold">
        <AnimatedCountUp amount={metricsData?.riskWeightedAssets || 0} />
      </div>
    </CardContent>
  </Card>

  {/* CET1 Ratio */}
  <Card className="bg-white text-green-700 border border-green-600 p-4 rounded-lg shadow-md">
    <CardHeader>
      <CardTitle>CET1 Ratio</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-xl font-bold">{formatNumber(metricsData?.CET1_Ratio * 100) || "0.0"}%</div>
    </CardContent>
  </Card>

  {/* Tier 1 Capital Ratio */}
  <Card className="bg-white text-purple-700 border border-purple-600 p-4 rounded-lg shadow-md">
    <CardHeader>
      <CardTitle>Tier 1 Capital Ratio</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-xl font-bold">{formatNumber(metricsData?.Tier1_Ratio * 100) || "0.0"}%</div>
    </CardContent>
  </Card>

  {/* Total Capital Ratio */}
  <Card className="bg-white text-orange-700 border border-orange-600 p-4 rounded-lg shadow-md">
    <CardHeader>
      <CardTitle>Total Capital Ratio</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-xl font-bold">{formatNumber(metricsData?.Total_Capital_Ratio * 100) || "0.0"}%</div>
    </CardContent>
  </Card>

  {/* Leverage Ratio */}
  <Card className="bg-white text-red-700 border border-red-600 p-4 rounded-lg shadow-md">
    <CardHeader>
      <CardTitle>Leverage Ratio</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-xl font-bold">{formatNumber(metricsData?.Leverage_Ratio * 100) || "0.0"}%</div>
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
