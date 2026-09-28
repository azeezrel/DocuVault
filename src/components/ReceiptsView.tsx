import React from 'react';
import {
  Receipt,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Calendar,
  Plus,
  ArrowUpRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const ReceiptsView: React.FC = () => {
  const { documents, setSelectedDocForView, setIsUploadModalOpen, setActiveView } = useVault();

  // Filter receipt documents
  const receipts = documents.filter(
    (d) =>
      !d.isDeleted &&
      (d.category === 'Finance' ||
        d.documentType.toLowerCase().includes('receipt') ||
        d.financials?.amount)
  );

  const totalSpent = receipts.reduce((sum, d) => sum + (d.financials?.amount || 0), 0);
  const groceryReceipts = receipts.filter(
    (d) =>
      d.financials?.expenseCategory?.toLowerCase().includes('grocer') ||
      d.title.toLowerCase().includes('grocer') ||
      d.name.toLowerCase().includes('shoprite')
  );
  const groceryTotal = groceryReceipts.reduce((sum, d) => sum + (d.financials?.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Receipts & Expense Intelligence</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                AI Extraction
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Automatic merchant, total amount, category, and payment method extraction
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-sky-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Receipt</span>
        </button>
      </div>

      {/* Concept #7 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Total Tracked Expenses</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            ₦{totalSpent.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Across {receipts.length} receipts in vault</p>
        </div>

        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Groceries This Month</span>
          <p className="text-2xl font-extrabold text-sky-700 mt-2">
            ₦{groceryTotal.toLocaleString()}
          </p>
          <p className="text-[11px] text-sky-600 mt-1">Supermarket & store expenses</p>
        </div>

        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-sky-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Ask AI About Your Receipts</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              "How much did I spend on groceries this month?"
            </p>
          </div>
          <button
            onClick={() => setActiveView('ai-assistant')}
            className="mt-3 text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
          >
            <span>Query Receipts in AI Assistant</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Receipts List */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-sky-100 bg-slate-50/60 flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-900 tracking-wider">
            RECEIPT VAULT ARCHIVE
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {receipts.length} {receipts.length === 1 ? 'receipt' : 'receipts'}
          </span>
        </div>

        {receipts.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-sm text-slate-700">No receipts uploaded yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Upload photos of grocery receipts, utility bills, or invoices. The AI engine will extract the merchant, line items, and totals automatically.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg text-xs font-bold hover:bg-sky-600 transition-colors shadow-2xs"
            >
              Upload Receipt
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {receipts.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedDocForView(rec)}
                className="p-4 hover:bg-sky-50/50 cursor-pointer transition-colors flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 flex-shrink-0">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {rec.financials?.merchant || rec.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {rec.issueDate || 'Recent'} • {rec.financials?.expenseCategory || 'Expense'} • {rec.financials?.paymentMethod || 'Card'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900 block">
                    {rec.financials?.currency || '₦'}
                    {(rec.financials?.amount || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
