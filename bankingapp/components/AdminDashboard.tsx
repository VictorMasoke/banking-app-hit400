"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import AnimatedCountUp from "./AnimatedCountUp";
import { formatNumber } from "@/lib/utils";

Chart.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement
);

const AdminDashboard = ({
  metricsData,
  assetData,
  loading,
  transactionsTracker
}) => {
  if (loading) {
    return <div className="text-center p-8">Loading Basel metrics...</div>;
  }

  if (!metricsData) {
    return <div className="text-center p-8 text-red-500">Failed to load metrics</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Basel Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Capital Adequacy Ratio */}
        <Card className={`border-2 ${
          metricsData.carStatus === "Compliant"
            ? "border-green-500 bg-green-50"
            : "border-red-500 bg-red-50"
        }`}>
          <CardHeader>
            <CardTitle>Capital Adequacy Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metricsData.capitalAdequacyRatio * 100)}%
            </div>
            <div className="text-sm mt-2">
              Status: <span className={
                metricsData.carStatus === "Compliant"
                  ? "text-green-600"
                  : "text-red-600"
              }>
                {metricsData.carStatus}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              (Min 8% required)
            </div>
          </CardContent>
        </Card>

        {/* Tier 1 Capital Ratio */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Tier 1 Capital Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(metricsData.tier1CapitalRatio * 100)}%
            </div>
            <div className="text-sm text-blue-500 mt-2">
              Tier 1 Capital: ${formatNumber(metricsData.tier1Capital)}
            </div>
          </CardContent>
        </Card>

        {/* Liquidity Coverage Ratio */}
        <Card className={`border-2 ${
          metricsData.lcrStatus === "Compliant"
            ? "border-green-500 bg-green-50"
            : "border-red-500 bg-red-50"
        }`}>
          <CardHeader>
            <CardTitle>Liquidity Coverage Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metricsData.liquidityCoverageRatio * 100)}%
            </div>
            <div className="text-sm mt-2">
              Status: <span className={
                metricsData.lcrStatus === "Compliant"
                  ? "text-green-600"
                  : "text-red-600"
              }>
                {metricsData.lcrStatus}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              (Min 100% required)
            </div>
          </CardContent>
        </Card>

        {/* Leverage Ratio */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle>Leverage Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(metricsData.leverageRatio * 100)}%
            </div>
            <div className="text-sm text-purple-500 mt-2">
              Against ${formatNumber(metricsData.totalAssets)} assets
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asset Allocation Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <Pie
              data={assetData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Risk Weighted Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Assets:</span>
                <span className="font-bold">
                  ${formatNumber(metricsData.totalAssets)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Risk-Weighted Assets:</span>
                <span className="font-bold">
                  ${formatNumber(metricsData.riskWeightedAssets)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Risk Weight:</span>
                <span className="font-bold">
                  {formatNumber(
                    (metricsData.riskWeightedAssets / metricsData.totalAssets) * 100
                  )}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Transactions</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <Line
            data={transactionsTracker}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
