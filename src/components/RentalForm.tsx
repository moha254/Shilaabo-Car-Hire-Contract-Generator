import React from 'react';
import { RentalDetails } from '../types/index';

interface RentalFormProps {
  data: RentalDetails;
  onChange: (data: RentalDetails) => void;
}

export const RentalForm: React.FC<RentalFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let updatedData = {
      ...data,
      [name]: name === 'ratePerDay' || name === 'totalAmount' ? Number(value) : value
    };

    // Auto-calculate total amount if rate per day changes
    if (name === 'ratePerDay') {
      const days = calculateDays(data.dateOut, data.dateIn);
      updatedData.totalAmount = days * Number(value);
    }

    onChange(updatedData);
  };

  const calculateDays = (dateOut: string, dateIn: string): number => {
    if (!dateOut || !dateIn) return 0;
    const out = new Date(dateOut);
    const in_date = new Date(dateIn);
    const diff = in_date.getTime() - out.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const rentalDays = calculateDays(data.dateOut, data.dateIn);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Rental Details</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-blue-800">
          <strong>Rental Period:</strong> {rentalDays} day{rentalDays !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
            Date Out *
          </label>
          <input
            type="date"
            name="dateOut"
            value={data.dateOut}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
            Time Out *
          </label>
          <input
            type="time"
            name="timeOut"
            value={data.timeOut}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
            Date In *
          </label>
          <input
            type="date"
            name="dateIn"
            value={data.dateIn}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
            Time In *
          </label>
          <input
            type="time"
            name="timeIn"
            value={data.timeIn}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
            Rate Per Day (KES) *
          </label>
          <input
            type="number"
            name="ratePerDay"
            value={data.ratePerDay}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter daily rate"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
            Total Amount (KES) *
          </label>
          <input
            type="number"
            name="totalAmount"
            value={data.totalAmount}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Auto-calculated"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
            Deposit Paid *
          </label>
          <input
            type="text"
            name="depositPaid"
            value={data.depositPaid}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="e.g., Yes/No or amount"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
          Condition/Damage Noted
        </label>
        <textarea
          name="conditionNoted"
          value={data.conditionNoted}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          placeholder="Note any pre-existing condition or damage"
        />
      </div>
    </div>
  );
};
