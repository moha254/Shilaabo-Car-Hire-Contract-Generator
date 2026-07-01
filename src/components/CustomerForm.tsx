import React from 'react';
import { CustomerDetails } from '../types/index';

interface CustomerFormProps {
  data: CustomerDetails;
  onChange: (data: CustomerDetails) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Customer Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Business/Occupation
          </label>
          <input
            type="text"
            name="businessOccupation"
            value={data.businessOccupation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter business or occupation"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            ID/Passport No: *
          </label>
          <input
            type="text"
            name="passportNumber"
            value={data.passportNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter ID or passport number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Driving License No: *
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={data.licenseNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter driving license number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Citizenship *
          </label>
          <input
            type="text"
            name="citizenship"
            value={data.citizenship}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter citizenship"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Address *
        </label>
        <textarea
          name="address"
          value={data.address}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter address"
        />
      </div>
    </div>
  );
};
