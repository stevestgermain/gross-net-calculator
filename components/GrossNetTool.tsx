import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRightLeft, DollarSign, Percent, RefreshCw, Info } from 'lucide-react';
import { CalculationMode } from '../types';

// --- UI Atoms based on Style Guide ---

const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="text-blue-600">
      {icon}
    </div>
    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
      {title}
    </span>
  </div>
);

const UtilityButton: React.FC<{ 
  label: string; 
  icon?: React.ReactNode;
  onClick: () => void 
}> = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold bg-white border border-gray-200 rounded-lg text-gray-600 shadow-sm hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all duration-200"
  >
    {icon}
    {label}
  </button>
);

const StyledInput: React.FC<{
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
  icon?: React.ReactNode;
  label?: string;
}> = ({ value, onChange, placeholder, type = 'text', icon, label }) => (
  <div className="w-full mb-4 group">
    {label && <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">{label}</label>}
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 text-base placeholder:text-gray-400 p-3 pl-10 focus:bg-white focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
    </div>
  </div>
);

const StatBox: React.FC<{ label: string; value: string; subtext?: string; highlight?: boolean }> = ({ label, value, subtext, highlight }) => (
  <div className={`p-3 rounded-2xl border shadow-sm transition-colors cursor-default
    ${highlight ? 'bg-blue-50/50 border-blue-200 hover:border-blue-300' : 'bg-white border-gray-200 hover:border-blue-300'}
  `}>
    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
      {label}
    </div>
    <div className={`text-2xl font-bold tracking-tight ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>
      {value}
    </div>
    {subtext && <div className="text-[10px] text-gray-400 mt-1">{subtext}</div>}
  </div>
);

// --- Main Component ---

export const GrossNetTool: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [mode, setMode] = useState<CalculationMode>(CalculationMode.GrossToNet);

  // Parse inputs safely
  const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0;
  const numericRate = parseFloat(rate) || 0;

  // Calculation Logic
  const result = useMemo(() => {
    let calculatedAmount = 0;
    let commissionAmount = 0;
    const decimalRate = numericRate / 100;

    if (mode === CalculationMode.GrossToNet) {
      // Gross to Net: Net = Gross * (1 - rate)
      calculatedAmount = numericAmount * (1 - decimalRate);
      commissionAmount = numericAmount - calculatedAmount;
    } else {
      // Net to Gross: Gross = Net / (1 - rate)
      calculatedAmount = numericAmount / (1 - decimalRate);
      commissionAmount = calculatedAmount - numericAmount;
    }

    return {
      calculatedAmount,
      commissionAmount,
    };
  }, [numericAmount, numericRate, mode]);

  // Formatters
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const toggleMode = () => {
    setMode((prev) => 
      prev === CalculationMode.GrossToNet 
        ? CalculationMode.NetToGross 
        : CalculationMode.GrossToNet
    );
  };

  return (
    <>
      {/* 2. Signature Header ("Tilted Sticker") */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/10 mb-5 text-white transform -rotate-6 flex items-center justify-center hover:scale-105 duration-300 transition-transform">
          <Calculator size={28} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          Gross vs Net Calculator
        </h1>
        <p className="text-[13px] text-gray-500 max-w-[420px] mx-auto font-normal leading-relaxed">
          Translate media costs between Gross (Client Cost) and Net (Publisher Cost) using standard agency margin formulas.
        </p>
      </div>

      {/* 3. Main Toolbox Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200 p-6">
        
        {/* Controls Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <SectionHeader 
              title={mode === CalculationMode.GrossToNet ? "Gross → Net" : "Net → Gross"} 
              icon={<RefreshCw size={16} />} 
            />
            <UtilityButton 
               label="Swap Inputs" 
               icon={<ArrowRightLeft size={12} />}
               onClick={toggleMode} 
            />
          </div>

          <div className="space-y-4">
            <StyledInput 
              label={mode === CalculationMode.GrossToNet ? "Gross Budget (Client Cost)" : "Net Cost (Vendor Payable)"}
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
        </div>

        {/* Results Section */}
        <div>
          <SectionHeader title="Calculated Results" icon={<Info size={16} />} />
          
          <div className="grid grid-cols-1 gap-3">
            <StatBox 
              label={mode === CalculationMode.GrossToNet ? "Net Amount (Payable)" : "Gross Amount (Billable)"}
              value={formatCurrency(result.calculatedAmount)}
              highlight={true}
            />
            <StatBox 
              label="Agency Commission"
              value={formatCurrency(result.commissionAmount)}
            />
          </div>
        </div>

      </div>
    </>
  );
};