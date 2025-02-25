"use client";

import React, { useEffect, useState } from "react";
import HeaderBox from "@/components/HeaderBox";
import AssetsTable from "@/components/AssetsTable";
import { getAllAssets } from "@/lib/actions/portfolio.actions";

const Page = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const data = await getAllAssets();
        setAssets(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAssets();
  }, []);

  return (
    <div className="p-6">
      <HeaderBox
        title="Bank Assets"
        subtext="Track and manage your bank's assets using your Basel Banking System"
      />
      {loading ? (
        <div className="p-6">Loading assets... Please wait.</div>
      ) : (
        <AssetsTable assets={assets} />
      )}
    </div>
  );
};

export default Page;
