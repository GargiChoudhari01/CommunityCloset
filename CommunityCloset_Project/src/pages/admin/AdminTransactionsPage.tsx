import React from 'react';
import type { Transaction } from '../../types';
import { ArrowLeft } from 'lucide-react';

interface AdminTransactionsPageProps {
  transactions: Transaction[];
  onBack: () => void;
}

export const AdminTransactionsPage: React.FC<AdminTransactionsPageProps> = ({ transactions, onBack }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <button onClick={onBack} className="inline-flex items-center space-x-1 text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      <h1 className="text-2xl font-black text-gray-900">All Transactions Audit Log ({transactions.length})</h1>

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
              <th className="p-4">Item</th>
              <th className="p-4">Lender</th>
              <th className="p-4">Borrower</th>
              <th className="p-4">Status</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Deposit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="p-4 font-bold text-gray-900">{tx.listingTitle}</td>
                <td className="p-4">{tx.lenderName}</td>
                <td className="p-4">{tx.borrowerName}</td>
                <td className="p-4 font-extrabold uppercase text-purple-700">{tx.status}</td>
                <td className="p-4 text-gray-500">{tx.startDate} to {tx.endDate}</td>
                <td className="p-4 font-bold">₹{tx.depositPaid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
