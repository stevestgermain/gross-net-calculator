import React, { useState, useMemo } from "react";
import {
  Calculator,
  ArrowRightLeft,
  DollarSign,
  Percent,
  RefreshCw,
  Info,
} from "lucide-react";
import { CalculationMode } from "../types";

const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({
  title,
  icon,
}) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="text-blue-600 dark:text-blue-400">{icon}</div>
    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
      {title}
    </span>
  </div>
);

const UtilityButton: React.FC<{
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}> = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-600 dark:text-gray-200 shadow-sm hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
  >
    {icon}
    {label}
  </button>
);

const StyledInput: React.FC<{
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  icon?: React.ReactNode;
  label?: string;
}> = ({ value, onChange, placeholder, type = "text", icon, label }) => (
  <div className="w-full mb-4 group">
    {label && (
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
        {label}
      </label>
    )}
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base p-3 pl-10 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
    </div>
  </div>
);

const StatBox: React.FC<{
  label: string;
  value: string;
  subtext?: string;
  highlight?: boolean;
}> = ({ label, value, subtext, highlight }) => (
  <div
    className={`p-3 rounded-2xl border shadow-sm transition-colors cursor-default
    ${
      highlight
        ? "bg-blue-50/50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-700"
        : "bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-700"
    }`}
  >
    <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider mb-1">
      {label}
    </div>
    <div
      className={`text-2xl font-bold tracking-tight ${
        highlight ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"
      }`}
    >
      {value}
    </div>
    {subtext && (
      <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
        {subtext}
      </div>
    )}
  </div>
);

export const GrossNetTool: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [mode, setMode] = useState<CalculationMode>(CalculationMode.GrossToNet);

  const numericAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const numericRate = parseFloat(rate) || 0;

  const result = useMemo(() => {
    let calculated = 0;
    let commission = 0;
    const r = numericRate / 100;

    if (mode === CalculationMode.GrossToNet) {
      calculated = numericAmount * (1 - r);
      commission = numericAmount - calculated;
    } else {
      calculated = numericAmount / (1 - r);
      commission = calculated - numericAmount;
    }

    return { calculated, commission };
  }, [numericAmount, numericRate, mode]);

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(v);

  return (
    <>
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 bg-blue-600 dark:bg-blue-500 rounded-2xl shadow-lg shadow-blue-600/10 mb-5 text-white transform -rotate-6 flex items-center justify-center">
          <Calculator size={28} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Gross vs Net Calculator
        </h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-300 max-w-[420px] mx-auto leading-relaxed">
          Translate between Gross (Client Cost) and Net (Publisher Cost) using standard agency margin formulas.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/30 border border-gray-200 dark:border-zinc-700 p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <SectionHeader
              title={mode === CalculationMode.GrossToNet ? "Gross → Net" : "Net → Gross"}
              icon={<RefreshCw size={16} />}
            />
            <UtilityButton
              label="Swap Inputs"
              icon={<ArrowRightLeft size={12} />}
              onClick={() =>
                setMode((prev) =>
                  prev === CalculationMode.GrossToNet
                    ? CalculationMode.NetToGross
                    : CalculationMode.GrossToNet
                )
              }
            />
          </div>

          <StyledInput
            label={
              mode === CalculationMode.GrossToNet
                ? "Gross Budget (Client Cost)"
                : "Net Cost (Vendor Payable)"
            }
            value={amount}
            onChange={setAmount}
            type="number"
            icon={<DollarSign size={18} />}
            placeholder="10000"
          />

          <StyledInput
            label="Agency Margin %"
            value={rate}
            onChange={setRate}
            type="number"
            icon={<Percent size={16} />}
            placeholder="15"
          />
        </div>

        <SectionHeader title="Calculated Results" icon={<Info size={16} />} />

        <div className="grid grid-cols-1 gap-3">
          <StatBox
            label={
              mode === CalculationMode.GrossToNet
                ? "Net Amount (Payable)"
                : "Gross Amount (Billable)"
            }
            value={fmt(result.calculated)}
            highlight
          />
          <StatBox
            label="Agency Commission"
            value={fmt(result.commission)}
          />
        </div>
      </div>
    </>
  );
};
