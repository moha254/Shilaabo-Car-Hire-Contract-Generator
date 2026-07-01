import React from 'react';
import { VehicleDetails } from '../types/index';

interface VehicleFormProps {
  data: VehicleDetails;
  onChange: (data: VehicleDetails) => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: name === 'mileageIn' ? Number(value) : value
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Vehicle Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Vehicle Type *
          </label>
          <input
            type="text"
            name="vehicleType"
            value={data.vehicleType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Car, Van, SUV"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Car Make *
          </label>
          <input
            type="text"
            name="carMake"
            value={data.carMake}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Toyota, Honda, Nissan"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Model *
          </label>
          <input
            type="text"
            name="model"
            value={data.model}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Camry, Civic"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Registration Number *
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={data.registrationNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., KEN-1234AB"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mileage In *
          </label>
          <input
            type="number"
            name="mileageIn"
            value={data.mileageIn}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter mileage"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fuel Level on Departure *
          </label>
          <select
            name="fuelLevel"
            value={data.fuelLevel}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select fuel level</option>
            <option value="Empty">Empty</option>
            <option value="1/4">1/4</option>
            <option value="1/2">1/2</option>
            <option value="3/4">3/4</option>
            <option value="Full">Full</option>
          </select>
        </div>
      </div>
    </div>
  );
};
