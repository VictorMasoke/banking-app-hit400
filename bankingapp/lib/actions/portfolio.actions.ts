"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_PORTFOLIO_COLLECTION_ID: PORTFOLIO_COLLECTION_ID,
} = process.env;

export const createAsset = async (asset: CreateAssetProps) => {
  try {
    const { database } = await createAdminClient();

    const newAsset = await database.createDocument(
      DATABASE_ID!,
      PORTFOLIO_COLLECTION_ID!,
      ID.unique(),
      {
        ...asset,
      }
    );

    return parseStringify(newAsset);
  } catch (error) {
    console.error("Error creating asset:", error);
  }
};

export const getAssetById = async ({ id }: getAssetByIdProps) => {
  try {
    const { database } = await createAdminClient();

    // Directly retrieve the document by its id
    const asset = await database.getDocument(
      DATABASE_ID!,
      PORTFOLIO_COLLECTION_ID!,
      id
    );

    return parseStringify(asset);
  } catch (error) {
    console.error("Error getting asset by id:", error);
  }
};

export const getAllAssets = async () => {
  try {
    const { database } = await createAdminClient();

    const allAssets = await database.listDocuments(
      DATABASE_ID!,
      PORTFOLIO_COLLECTION_ID!
    );

    // Return the array of asset documents
    return parseStringify(allAssets.documents);
  } catch (error) {
    console.error("Error getting all assets:", error);
  }
};

export const deleteAssetById = async ({ id }: { id: string }) => {
  try {
    const { database } = await createAdminClient();

    const result = await database.deleteDocument(
      DATABASE_ID!,
      PORTFOLIO_COLLECTION_ID!,
      id
    );

    return parseStringify(result);
  } catch (error) {
    console.error("Error deleting asset:", error);
  }
};

export const calculateBankMetrics = async () => {
  try {
    // Retrieve all assets from Appwrite
    const assets = await getAllAssets(); // Expecting an array of asset objects

    // Initialize metrics
    let totalAssets = 0;
    let totalDeposits = 0;
    let loanPortfolio = 0;
    let weightedInterestSum = 0;
    let loanAssetValueSum = 0;

    // Map to store total value per asset type
    let assetTypeTotals: { [key: string]: number } = {};

    // Loop through each asset and aggregate values based on type
    assets.forEach((asset: any) => {
      const assetValue = Number(asset.assetValue);
      totalAssets += assetValue;

      // Track total value per asset type
      assetTypeTotals[asset.assetType] =
        (assetTypeTotals[asset.assetType] || 0) + assetValue;

      // Assume deposits are assets of type "Cash and Cash Equivalents"
      if (asset.assetType === "Cash and Cash Equivalents") {
        totalDeposits += assetValue;
      }

      // For loans, sum the value and accumulate a weighted interest rate
      if (asset.assetType === "Loans") {
        loanPortfolio += assetValue;
        weightedInterestSum += Number(asset.intrestRate) * assetValue;
        loanAssetValueSum += assetValue;
      }
    });

    // Calculate a weighted average interest rate for loan assets as Net Interest Margin.
    let netInterestMargin =
      loanAssetValueSum > 0 ? weightedInterestSum / loanAssetValueSum : 0;

    // **Dynamically determine risk weights based on portfolio composition**
    let riskWeightedAssets = 0;
    Object.entries(assetTypeTotals).forEach(([assetType, value]) => {
      let riskWeight = value / totalAssets; // Proportion of asset type in total assets
      riskWeightedAssets += value * riskWeight;
    });

    // **Basel III Ratios**
    const CET1_Capital = totalAssets * 0.07; // Assuming 7% of total assets as CET1 capital
    const Tier1_Capital = totalAssets * 0.08; // Assuming 8% of total assets as Tier 1 capital
    const Total_Capital = totalAssets * 0.1; // Assuming 10% of total assets as Total Capital
    const Total_Exposure = totalAssets; // Assuming exposure is total assets

    const CET1_Ratio = CET1_Capital / riskWeightedAssets;
    const Tier1_Ratio = Tier1_Capital / riskWeightedAssets;
    const Total_Capital_Ratio = Total_Capital / riskWeightedAssets;
    const Leverage_Ratio = Tier1_Capital / Total_Exposure;

    return {
      totalAssets,
      totalDeposits,
      loanPortfolio,
      netInterestMargin,
      riskWeightedAssets,
      CET1_Ratio,
      Tier1_Ratio,
      Total_Capital_Ratio,
      Leverage_Ratio,
    };
  } catch (error) {
    console.error("Error calculating bank metrics:", error);
  }
};

export const getAssetAllocation = async () => {
  try {
    const allAssets = await getAllAssets();

    if (!allAssets || allAssets.length === 0) {
      return {
        labels: [],
        datasets: [
          { label: "Asset Allocation ($M)", data: [], backgroundColor: [] },
        ],
      };
    }

    // Group assets by type and sum their values
    const allocationMap: Record<string, number> = {};

    allAssets.forEach((asset: any) => {
      if (asset.assetType && asset.assetValue) {
        allocationMap[asset.assetType] =
          (allocationMap[asset.assetType] || 0) + asset.assetValue;
      }
    });

    // Generate the pie chart dataset
    const labels = Object.keys(allocationMap);
    const data = Object.values(allocationMap);
    const backgroundColor = [
      "#1E3A8A",
      "#2563EB",
      "#60A5FA",
      "#93C5FD",
      "#A78BFA",
      "#34D399",
    ];

    return {
      labels,
      datasets: [{ label: "Asset Allocation ($M)", data, backgroundColor }],
    };
  } catch (error) {
    console.error("Error calculating asset allocation:", error);
    return {
      labels: [],
      datasets: [
        { label: "Asset Allocation ($M)", data: [], backgroundColor: [] },
      ],
    };
  }
};
