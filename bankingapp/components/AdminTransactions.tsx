import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { transactionCategoryStyles } from "@/constants";
  import {
    cn,
    formatAmount,
    formatDateTime,
    getTransactionStatus,
    removeSpecialCharacters,
  } from "@/lib/utils";
  
  const CategoryBadge = ({ category }: { category: string }) => {
    const {
      borderColor,
      backgroundColor,
      textColor,
      chipBackgroundColor,
    } =
      transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] ||
      transactionCategoryStyles.default;
  
    return (
      <div className={cn("category-badge", borderColor, chipBackgroundColor)}>
        <div className={cn("size-2 rounded-full", backgroundColor)} />
        <p className={cn("text-[12px] font-medium", textColor)}>{category}</p>
      </div>
    );
  };
  
  interface Transaction {
    name: string;
    amount: string;
    createdAt: string;
    senderId: string;
    reciverId: string;
    channel: string;
    category: string;
    $id: string;
    // If you have a "type" field, you can include it here:
    type?: string;
  }
  
  interface TransactionTableProps {
    transactions?: Transaction[];
  }
  
  const AdminTransactionsTable = ({ transactions = [] }: TransactionTableProps) => {
    if (!Array.isArray(transactions)) {
      console.error("Transactions data is not an array:", transactions);
      return (
        <p className="text-center text-red-500">No transactions available.</p>
      );
    }
  
    // Sort transactions so that the latest (by createdAt) comes first
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  
    return (
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead className="px-2">Transaction</TableHead>
            <TableHead className="px-2">Sender Id</TableHead>
            <TableHead className="px-2">Receiver Id</TableHead>
            <TableHead className="px-2">Amount</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2">Date</TableHead>
            <TableHead className="px-2 max-md:hidden">Channel</TableHead>
            <TableHead className="px-2 max-md:hidden">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((t: Transaction) => {
            // Use createdAt instead of a generic "date" property.
            const transactionDate = new Date(t.createdAt);
            const status = getTransactionStatus(transactionDate);
            const amount = formatAmount(t.amount);
  
            // Optional: if you have a transaction type to decide debit/credit styling.
            const isDebit = t.type === "debit";
            const isCredit = t.type === "credit";
  
            return (
              <TableRow
                key={t.$id}
                className={`${
                  isDebit || amount[0] === "-"
                    ? "bg-[#FFFBFA]"
                    : "bg-[#F6FEF9]"
                } !over:bg-none !border-b-DEFAULT`}
              >
                <TableCell className="max-w-[250px] pl-2 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                      {removeSpecialCharacters(t.name)}
                    </h1>
                  </div>
                </TableCell>

                <TableCell className="max-w-[250px] pl-2 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                      {t.senderId}
                    </h1>
                  </div>
                </TableCell>

                <TableCell className="max-w-[250px] pl-2 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                      {t.receiverId}
                    </h1>
                  </div>
                </TableCell>
  
                <TableCell
                  className={`pl-2 pr-10 font-semibold ${
                    isDebit || amount[0] === "-"
                      ? "text-[#f04438]"
                      : "text-[#039855]"
                  }`}
                >
                  {isDebit ? `-${amount}` : isCredit ? amount : amount}
                </TableCell>
  
                <TableCell className="pl-2 pr-10">
                  <CategoryBadge category={status} />
                </TableCell>
  
                <TableCell className="min-w-32 pl-2 pr-10">
                  {formatDateTime(transactionDate).dateTime}
                </TableCell>
  
                <TableCell className="pl-2 pr-10 capitalize min-w-24">
                  {t.channel}
                </TableCell>
  
                <TableCell className="pl-2 pr-10 max-md:hidden">
                  <CategoryBadge category={t.category} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };
  
  export default AdminTransactionsTable;
  