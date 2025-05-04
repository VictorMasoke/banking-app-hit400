// components/TransactionsTable.tsx
import { formatAmount, formatDateTime } from '@/lib/utils';
import { getUserTransactions } from '@/lib/actions/user.banking';
import { Pagination } from './Pagination';

interface TransactionsTableProps {
  currentPage?: number;
  filters?: Record<string, string>;
}

export default async function TransactionsTable({
  currentPage = 1,
  filters = {},
}: TransactionsTableProps) {
  const transactionsData = await getUserTransactions(currentPage, 10, filters);

  if (!transactionsData) {
    return (
      <div className="text-gray-500 py-8 text-center">
        Failed to load transactions. Please try again later.
      </div>
    );
  }

  const { transactions, summary, pagination } = transactionsData.data;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
          <p className="text-2xl font-semibold">{summary.transaction_count}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Deposits</h3>
          <p className="text-2xl font-semibold text-green-600">
            {formatAmount(summary.total_deposits)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Withdrawals</h3>
          <p className="text-2xl font-semibold text-red-600">
            {formatAmount(summary.total_withdrawals)}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.transaction_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.transaction_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.account_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.account_type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.transaction_type === 'deposit'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.transaction_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {transaction.description || 'N/A'}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.transaction_type === 'deposit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.transaction_type === 'deposit' ? '+' : '-'}
                    {formatAmount(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatAmount(transaction.balance_after)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
          />
        </div>
      </div>
    </div>
  );
}
