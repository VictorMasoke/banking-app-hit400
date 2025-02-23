import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import AssetsTable from '@/components/AssetsTable';
import { getAllAssets } from '@/lib/actions/portfolio.actions';

const page = async () => {
  // Fetch live assets using your Appwrite server function.
  const assets = await getAllAssets();

  return (
    <div className="p-6">
      <HeaderBox
        title="Bank Assets"
        subtext="Track and manage your bank's assets using your Basel Banking System"
      />
      <AssetsTable assets={assets} />
    </div>
  );
};

export default page;
