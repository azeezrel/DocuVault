import React from 'react';
import {
  FileCheck,
  Sparkles,
  Calendar,
  AlertCircle,
  Home,
  CheckCircle2,
  ChevronRight,
  Clock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const ContractsView: React.FC = () => {
  const { documents, setSelectedDocForView, setIsUploadModalOpen, setActiveView } = useVault();

  const contracts = documents.filter(
    (d) =>
      !d.isDeleted &&
      (d.category === 'Property' ||
        d.category === 'Career' ||
        d.category === 'Legal' ||
        d.documentType.toLowerCase().includes('agreement') ||
        d.documentType.toLowerCase().includes('contract') ||
        d.contractDetails)
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Contracts & Agreements Intelligence</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Legal AI
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Notice periods, rent terms, landlord notifications, and expiration clauses
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-sky-200 transition-colors"
        >
          Upload Agreement
        </button>
      </div>

      {/* Featured Intelligence Card: Concept #8 Tenancy Agreement */}
      <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white text-sky-600 flex items-center justify-center border border-sky-200 shadow-2xs">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                Key Contract Highlight
              </span>
              <h3 className="font-extrabold text-base text-slate-900">
                Residential Tenancy & Rent Agreement
              </h3>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-sky-800 border border-sky-200 shadow-2xs">
            Notice Window Active
          </span>
        </div>

        {/* 4 Details Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-sky-100">
            <span className="text-slate-400 text-[11px] block">Annual Rent</span>
            <span className="font-extrabold text-slate-900 text-base mt-0.5 block">₦1,500,000</span>
            <span className="text-[10px] text-slate-500">Per Year</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-sky-100">
            <span className="text-slate-400 text-[11px] block">Required Notice</span>
            <span className="font-extrabold text-sky-700 text-base mt-0.5 block">3 Months</span>
            <span className="text-[10px] text-slate-500">Prior to expiration</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-sky-100">
            <span className="text-slate-400 text-[11px] block">Agreement Period</span>
            <span className="font-bold text-slate-900 mt-0.5 block">01 Dec — 30 Nov</span>
            <span className="text-[10px] text-slate-500">Annual renewal</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-sky-100">
            <span className="text-slate-400 text-[11px] block">Notify Landlord By</span>
            <span className="font-extrabold text-sky-800 mt-0.5 block">31 August</span>
            <span className="text-[10px] text-sky-800">Deadline</span>
          </div>
        </div>

        {/* Prompt answer box */}
        <div className="bg-white p-4 rounded-xl border border-sky-100 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-slate-900">
              Q: "When should I notify my landlord?"
            </p>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Based on Section 4.2 of your Tenancy Agreement, you must notify your landlord 3 months before your agreement expires on 30 Nov. That means you must notify them by <strong>31 August</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-sky-100 bg-slate-50/60 flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-900 tracking-wider">
            ALL ACTIVE AGREEMENTS & CONTRACTS
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {contracts.length} {contracts.length === 1 ? 'document' : 'documents'}
          </span>
        </div>

        {contracts.length === 0 ? (
          <div className="p-12 text-center">
            <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-sm text-slate-700">No contracts uploaded yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Upload rent agreements, employment contracts, or partnership deeds. DocuMind AI will extract start/end dates and notice obligations.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {contracts.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocForView(doc)}
                className="p-4 hover:bg-sky-50/50 cursor-pointer transition-colors flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 flex-shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {doc.contractDetails?.startDate ? `${doc.contractDetails.startDate} to ${doc.contractDetails.endDate}` : doc.name} • Notice: {doc.contractDetails?.noticePeriod || 'Standard'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {doc.status}
                  </span>
                  {doc.contractDetails?.rentAmount && (
                    <p className="text-xs font-extrabold text-slate-900 mt-1">
                      {doc.contractDetails.rentAmount}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
