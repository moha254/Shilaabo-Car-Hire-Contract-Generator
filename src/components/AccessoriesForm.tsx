import React from 'react';
import { Accessory } from '../types/index';

interface AccessoriesFormProps {
  accessories: Accessory[];
  onChange: (accessories: Accessory[]) => void;
}

export const AccessoriesForm: React.FC<AccessoriesFormProps> = ({ accessories, onChange }) => {
  const handleAccessoryChange = (index: number, field: string, value: any) => {
    const updated = [...accessories];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addAccessory = () => {
    onChange([...accessories, { name: '', price: 0, selected: false }]);
  };

  const removeAccessory = (index: number) => {
    onChange(accessories.filter((_, i) => i !== index));
  };

  const totalAccessoriesCost = accessories
    .filter(a => a.selected)
    .reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Accessories & Add-ons</h2>

      <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-green-800">
          <strong>Total Accessories Cost:</strong> KES {totalAccessoriesCost.toLocaleString()}
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {accessories.map((accessory, index) => (
          <div key={index} className="border border-slate-300 rounded-lg p-3 sm:p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Accessory Name *
                </label>
                <input
                  type="text"
                  value={accessory.name}
                  onChange={(e) => handleAccessoryChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="e.g., GPS Navigator, Child Seat"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Price (KES) *
                </label>
                <input
                  type="number"
                  value={accessory.price}
                  onChange={(e) => handleAccessoryChange(index, 'price', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="0"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
                <label className="flex items-center gap-2 flex-grow">
                  <input
                    type="checkbox"
                    checked={accessory.selected}
                    onChange={(e) => handleAccessoryChange(index, 'selected', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">Selected</span>
                </label>

                <button
                  onClick={() => removeAccessory(index)}
                  className="px-2 sm:px-3 py-2 bg-red-500 text-white text-xs sm:text-sm rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addAccessory}
        className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
      >
        + Add Accessory
      </button>
    </div>
  );
};
