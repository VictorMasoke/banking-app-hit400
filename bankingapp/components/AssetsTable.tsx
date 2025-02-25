"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createAsset, deleteAssetById } from "@/lib/actions/portfolio.actions";
import { date } from "zod";

interface Asset {
  $id: string;
  assetName: string;
  assetType: string;
  assetValue: number;
  purchaseDate: string;
  maturityDate: string;
  intrestRate: number;
  createdAt: string;
}

interface AssetsTableProps {
  assets: Asset[];
}

const AssetsTable: React.FC<AssetsTableProps> = ({ assets: initialAssets }) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [open, setOpen] = useState(false);

  // Form state for adding a new asset
  const [newAsset, setNewAsset] = useState({
    assetName: "",
    assetType: "",
    assetValue: 0,
    purchaseDate: "",
    maturityDate: "",
    intrestRate: 0,
    createdAt: Date.now().toString(),
  });

  // Add a new asset using the server function
  const handleAddAsset = async () => {
    try {
      const createdAsset = await createAsset(newAsset);
      // Update local state with the new asset
      setAssets([...assets, createdAsset]);
      setOpen(false);
      // Reset form fields
      setNewAsset({
        assetName: "",
        assetType: "",
        assetValue: 0,
        purchaseDate: "",
        maturityDate: "",
        intrestRate: 0,
        createdAt: Date.now().toString(),
      });
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  // Delete an asset using the server function and update state
  const handleDeleteAsset = async (id: string) => {
    try {
      await deleteAssetById({ id });
      setAssets(assets.filter((asset) => asset.$id !== id));
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>Add New Asset</Button>
      </div>
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asset Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asset Type
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asset Value ($)
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Purchase Date
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Maturity Date
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Interest Rate (%)
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {assets.map((asset) => (
            <TableRow
              key={asset.$id}
              className="hover:bg-gray-100 transition-colors duration-150"
            >
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {asset.assetName}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {asset.assetType}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {asset.assetValue.toLocaleString()}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {asset.purchaseDate}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {asset.maturityDate}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {asset.intrestRate}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(asset.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAsset(asset.$id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for adding a new asset */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Add New Asset
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Fill out the form to add a new asset.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Asset Name
              </label>
              <Input
                className="w-full h-10 px-3 py-2 text-base"
                placeholder="Asset Name"
                value={newAsset.assetName}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, assetName: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Asset Type
              </label>
              <select
                className="w-full h-10 px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={newAsset.assetType}
                onChange={(e) => setNewAsset({ ...newAsset, assetType: e.target.value })}
              >
                <option value="">Select Asset Type</option>
                <option value="Cash and Cash Equivalents">Cash and Cash Equivalents</option>
                <option value="Investment Securities">Investment Securities</option>
                <option value="Loans">Loans</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Fixed Assets">Fixed Assets</option>
                <option value="Other Assets">Other Assets</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Asset Value ($)
              </label>
              <Input
                type="number"
                className="w-full h-10 px-3 py-2 text-base"
                placeholder="Asset Value"
                value={newAsset.assetValue}
                onChange={(e) =>
                  setNewAsset({
                    ...newAsset,
                    assetValue: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Purchase Date
              </label>
              <Input
                type="date"
                className="w-full h-10 px-3 py-2 text-base"
                placeholder="Purchase Date"
                value={newAsset.purchaseDate}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, purchaseDate: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Maturity Date
              </label>
              <Input
                type="date"
                className="w-full h-10 px-3 py-2 text-base"
                placeholder="Maturity Date"
                value={newAsset.maturityDate}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, maturityDate: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Interest Rate (%)
              </label>
              <Input
                type="number"
                className="w-full h-10 px-3 py-2 text-base"
                placeholder="Interest Rate (%)"
                value={newAsset.intrestRate}
                onChange={(e) =>
                  setNewAsset({
                    ...newAsset,
                    intrestRate: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button onClick={handleAddAsset}>Save Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetsTable;
