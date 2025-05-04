"use client";

import React, { useState } from "react";
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
import { formatDateTime } from "@/lib/utils";

interface Asset {
  asset_id: string;
  asset_name: string;
  asset_type: string;
  asset_value: number;
  purchase_date: string;
  maturity_date?: string;
  interest_rate?: number;
  created_at: string;
}

interface AssetsTableProps {
  assets: Asset[];
}

const AssetsTable: React.FC<AssetsTableProps> = ({ assets: initialAssets }) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for adding a new asset
  const [newAsset, setNewAsset] = useState({
    asset_name: "",
    asset_type: "",
    asset_value: 0,
    purchase_date: "",
    maturity_date: "",
    interest_rate: 0,
  });

  // Add a new asset
  const handleAddAsset = async () => {
    setIsLoading(true);
    try {
      const createdAsset = await createAsset({
        asset_name: newAsset.asset_name,
        asset_type: newAsset.asset_type,
        asset_value: Number(newAsset.asset_value),
        purchase_date: newAsset.purchase_date,
        maturity_date: newAsset.maturity_date || undefined,
        interest_rate: Number(newAsset.interest_rate) || undefined,
      });

      setAssets([...assets, createdAsset]);
      setOpen(false);
      setNewAsset({
        asset_name: "",
        asset_type: "",
        asset_value: 0,
        purchase_date: "",
        maturity_date: "",
        interest_rate: 0,
      });
    } catch (error) {
      console.error("Error adding asset:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an asset
  const handleDeleteAsset = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteAssetById(id); // Now passing just the string ID
      setAssets(assets.filter((asset) => asset.asset_id !== id));
    } catch (error) {
      console.error("Error deleting asset:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)} disabled={isLoading}>
          {isLoading ? "Processing..." : "Add New Asset"}
        </Button>
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
              key={asset.asset_id}
              className="hover:bg-gray-100 transition-colors duration-150"
            >
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {asset.asset_name}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {asset.asset_type}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {asset.asset_value.toLocaleString()}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {asset.purchase_date}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {asset.maturity_date ? asset.maturity_date : "N/A"}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {asset.interest_rate || "N/A"}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {asset.created_at}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAsset(asset.asset_id)}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Asset Dialog */}
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
                value={newAsset.asset_name}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, asset_name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Asset Type
              </label>
              <select
                className="w-full h-10 px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={newAsset.asset_type}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, asset_type: e.target.value })
                }
              >
                <option value="">Select Asset Type</option>
                <option value="Cash and Cash Equivalents">
                  Cash and Cash Equivalents
                </option>
                <option value="Investment Securities">
                  Investment Securities
                </option>
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
                value={newAsset.asset_value}
                onChange={(e) =>
                  setNewAsset({
                    ...newAsset,
                    asset_value: Number(e.target.value),
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
                value={newAsset.purchase_date}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, purchase_date: e.target.value })
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
                value={newAsset.maturity_date}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, maturity_date: e.target.value })
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
                value={newAsset.interest_rate}
                onChange={(e) =>
                  setNewAsset({
                    ...newAsset,
                    interest_rate: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button onClick={handleAddAsset} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Asset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetsTable;
