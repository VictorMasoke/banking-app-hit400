// lib/actions/portfolio.actions.ts
'use server';

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

const API_BASE_URL = process.env.BASE_URL_API || 'http://localhost:5600';

export async function getAllAssets(): Promise<Asset[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/assets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }

    const data = await response.json();
    return data.data.assets;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
}

export async function createAsset(assetData: Omit<Asset, 'asset_id' | 'created_at'>): Promise<Asset> {
  try {
    const response = await fetch(`${API_BASE_URL}/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assetData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create asset');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
}

// lib/actions/portfolio.actions.ts
export async function deleteAssetById(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete asset');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  }
