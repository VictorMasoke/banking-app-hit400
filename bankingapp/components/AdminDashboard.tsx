"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  // Dummy Data for Charts
  const accountGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Deposits ($M)",
        data: [5, 8, 6, 12, 15, 20],
        backgroundColor: "#2563EB",
      },
    ],
  };

  const riskData = {
    labels: [
      "Credit Risk",
      "Market Risk",
      "Operational Risk",
      "Liquidity Risk",
    ],
    datasets: [
      {
        label: "Risk Exposure ($M)",
        data: [3.2, 4.5, 2.8, 3.9],
        backgroundColor: ["#1E3A8A", "#2563EB", "#60A5FA", "#93C5FD"],
      },
    ],
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
            <p className="text-xl font-bold">$1.2B</p>
          </CardContent>
        </Card>

        <Card className="bg-white text-blue-700 border border-blue-600 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">$800M</p>
          </CardContent>
        </Card>

        <Card className="bg-white text-blue-700 border border-blue-600 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Net Interest Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">3.5%</p>
          </CardContent>
        </Card>

        <Card className="bg-white text-blue-700 border border-blue-600 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Loan Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">$500M</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Management & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Deposit Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={accountGrowthData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-[650px] h-[650px] mx-auto">
              <Pie data={riskData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
