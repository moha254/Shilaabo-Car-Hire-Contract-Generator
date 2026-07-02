import { useState, useEffect, useRef } from 'react';
import { CustomerForm } from './components/CustomerForm';
import { VehicleForm } from './components/VehicleForm';
import { RentalForm } from './components/RentalForm';
import { AccessoriesForm } from './components/AccessoriesForm';
import { ContractPDF, generateContractPDF } from './components/ContractPDF';
import { ContractData, CustomerDetails, VehicleDetails, RentalDetails, Accessory } from './types/index';
import { generateContractId, saveContract, getAllContracts, getContractById } from './utils/storage';
import { FileText, Save, Plus, Eye, Trash2 } from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'form' | 'list' | 'preview'>('form');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const pdfContentRef = useRef<HTMLDivElement | null>(null);

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    businessOccupation: '',
    passportNumber: '',
    licenseNumber: '',
    citizenship: '',
    address: '',
    phone: '',
    email: '',
  });

  const [vehicle, setVehicle] = useState<VehicleDetails>({
    vehicleType: '',
    carMake: '',
    model: '',
    registrationNumber: '',
    mileageIn: 0,
    fuelLevel: '',
  });

  const [rental, setRental] = useState<RentalDetails>({
    dateOut: '',
    timeOut: '',
    dateIn: '',
    timeIn: '',
    conditionNoted: '',
    ratePerDay: 0,
    totalAmount: 0,
    depositPaid: '',
  });

  const [accessories, setAccessories] = useState<Accessory[]>([
    { name: 'Spare Wheel', price: 500, selected: false },
    { name: 'Jack', price: 300, selected: false },
    { name: 'Radio Cassette', price: 1000, selected: false },
    { name: 'Wheel Spinner', price: 200, selected: false },
    { name: 'CD Player', price: 1500, selected: false },
  ]);

  const [hireName, setHireName] = useState('');
  const [hireSignature, setHireSignature] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [officerSignature, setOfficerSignature] = useState('');
  const [contracts, setContracts] = useState<ContractData[]>([]);

  useEffect(() => {
    setContracts(getAllContracts());
  }, []);

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(customer.fullName && customer.passportNumber && customer.licenseNumber && customer.citizenship && customer.address && customer.phone);
      case 2:
        return !!(vehicle.vehicleType && vehicle.carMake && vehicle.model && vehicle.registrationNumber && vehicle.fuelLevel);
      case 3:
        return !!(rental.dateOut && rental.timeOut && rental.dateIn && rental.timeIn && rental.ratePerDay > 0);
      case 4:
        return true;
      case 5:
        return !!(hireName && officerName);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Please fill in all required fields in this step.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleGenerateContract = () => {
    if (!isStepValid() || !hireName || !officerName) {
      alert('Please complete all required fields.');
      return;
    }

    const contractId = generateContractId();
    const newContract: ContractData = {
      id: contractId,
      createdAt: new Date().toISOString(),
      customer,
      vehicle,
      rental,
      accessories,
      hireName,
      hireSignature,
      officerName,
      officerSignature,
    };

    saveContract(newContract);
    setContracts(getAllContracts());
    alert(`Contract ${contractId} generated and saved successfully!`);
    setViewMode('list');
    setCurrentStep(1);
    resetForm();
  };

  const resetForm = () => {
    setCustomer({
      fullName: '',
      businessOccupation: '',
      passportNumber: '',
      licenseNumber: '',
      citizenship: '',
      address: '',
      phone: '',
      email: '',
    });
    setVehicle({
      vehicleType: '',
      carMake: '',
      model: '',
      registrationNumber: '',
      mileageIn: 0,
      fuelLevel: '',
    });
    setRental({
      dateOut: '',
      timeOut: '',
      dateIn: '',
      timeIn: '',
      conditionNoted: '',
      ratePerDay: 0,
      totalAmount: 0,
      depositPaid: '',
    });
    setAccessories([
      { name: 'Spare Wheel', price: 500, selected: false },
      { name: 'Jack', price: 300, selected: false },
      { name: 'Radio Cassette', price: 1000, selected: false },
      { name: 'Wheel Spinner', price: 200, selected: false },
      { name: 'CD Player', price: 1500, selected: false },
    ]);
    setHireName('');
    setHireSignature('');
    setOfficerName('');
    setOfficerSignature('');
  };

  const loadContract = (id: string) => {
    const contract = getContractById(id);
    if (contract) {
      setCustomer(contract.customer);
      setVehicle(contract.vehicle);
      setRental(contract.rental);
      setAccessories(contract.accessories);
      setHireName(contract.hireName);
      setHireSignature(contract.hireSignature);
      setOfficerName(contract.officerName);
      setOfficerSignature(contract.officerSignature);
      setSelectedContractId(id);
      setViewMode('preview');
    }
  };

  const deleteContract = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      const updated = contracts.filter(c => c.id !== id);
      setContracts(updated);
      localStorage.setItem('shilaabo_contracts', JSON.stringify(updated));
    }
  };

  const currentContract: ContractData | null = selectedContractId ? {
    id: selectedContractId,
    createdAt: new Date().toISOString(),
    customer,
    vehicle,
    rental,
    accessories,
    hireName,
    hireSignature,
    officerName,
    officerSignature,
  } : null;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/img/logo.jpeg" alt="Shilaabo Logo" className="w-12 h-12 object-contain rounded-lg bg-white" />
            <div>
              <h1 className="text-3xl font-bold">Shilaabo Tour & Car Hire</h1>
              <p className="text-blue-100">Contract Generator System</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setViewMode('form'); setCurrentStep(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'form'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500 hover:bg-blue-700 text-white'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              New Contract
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500 hover:bg-blue-700 text-white'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Saved Contracts ({contracts.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Form View */}
        {viewMode === 'form' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Progress Steps */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex items-center ${step < 5 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mb-8">
              {currentStep === 1 && <CustomerForm data={customer} onChange={setCustomer} />}
              {currentStep === 2 && <VehicleForm data={vehicle} onChange={setVehicle} />}
              {currentStep === 3 && <RentalForm data={rental} onChange={setRental} />}
              {currentStep === 4 && <AccessoriesForm accessories={accessories} onChange={setAccessories} />}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900">Signatures & Final Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Hirer Name *
                      </label>
                      <input
                        type="text"
                        value={hireName}
                        onChange={(e) => setHireName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter hirer's name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Hirer Signature
                      </label>
                      <input
                        type="text"
                        value={hireSignature}
                        onChange={(e) => setHireSignature(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter or draw signature"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Officer/Agent Name *
                      </label>
                      <input
                        type="text"
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter officer's name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Officer Signature
                      </label>
                      <input
                        type="text"
                        value={officerSignature}
                        onChange={(e) => setOfficerSignature(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter or draw signature"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Please review all information carefully before generating the contract. You will be able to download the PDF and view all saved contracts.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-2 bg-slate-500 text-white font-medium rounded-lg hover:bg-slate-600 transition"
                >
                  Previous
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  onClick={handleNext}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleGenerateContract}
                  className="ml-auto px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Generate & Save Contract
                </button>
              )}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Saved Contracts</h2>
            {contracts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No contracts saved yet.</p>
                <button
                  onClick={() => setViewMode('form')}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Create First Contract
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contracts.map((contract) => (
                  <div key={contract.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-lg transition">
                    <h3 className="font-bold text-lg text-blue-600 mb-2">{contract.id}</h3>
                    <p className="text-sm text-slate-600 mb-1">
                      <strong>Customer:</strong> {contract.customer.fullName}
                    </p>
                    <p className="text-sm text-slate-600 mb-1">
                      <strong>Vehicle:</strong> {contract.vehicle.carMake} {contract.vehicle.model}
                    </p>
                    <p className="text-sm text-slate-600 mb-4">
                      <strong>Date:</strong> {new Date(contract.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadContract(contract.id)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                      >
                        View/Edit
                      </button>
                      <button
                        onClick={() => deleteContract(contract.id)}
                        className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Preview View */}
        {viewMode === 'preview' && currentContract && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Contract Preview: {currentContract.id}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => generateContractPDF(currentContract, pdfContentRef)}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="px-6 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition"
                >
                  Back to List
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 h-96 overflow-y-auto">
              <div className="bg-white p-8 text-sm text-slate-800 space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <img src="/img/logo.jpeg" alt="Shilaabo Logo" className="w-16 h-16 object-contain" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-600">SHILAABO TOUR & CAR HIRE</h3>
                    <p className="font-bold">HIRE CONTRACT</p>
                  </div>
                </div>
                <p className="text-red-600 text-lg font-bold">{currentContract.id}</p>

                <div className="border-t pt-4">
                  <h4 className="font-bold mb-2">CUSTOMER INFORMATION</h4>
                  <p><strong>Name:</strong> {currentContract.customer.fullName}</p>
                  <p><strong>Phone:</strong> {currentContract.customer.phone}</p>
                  <p><strong>License:</strong> {currentContract.customer.licenseNumber}</p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-bold mb-2">VEHICLE INFORMATION</h4>
                  <p><strong>Type:</strong> {currentContract.vehicle.vehicleType}</p>
                  <p><strong>Make/Model:</strong> {currentContract.vehicle.carMake} {currentContract.vehicle.model}</p>
                  <p><strong>Registration:</strong> {currentContract.vehicle.registrationNumber}</p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-bold mb-2">RENTAL INFORMATION</h4>
                  <p><strong>Out:</strong> {currentContract.rental.dateOut} {currentContract.rental.timeOut}</p>
                  <p><strong>In:</strong> {currentContract.rental.dateIn} {currentContract.rental.timeIn}</p>
                  <p><strong>Rate:</strong> KES {currentContract.rental.ratePerDay.toLocaleString()}/day</p>
                  <p><strong>Total:</strong> KES {currentContract.rental.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Hidden ContractPDF component for PDF generation */}
            <div className="hidden">
              <div ref={pdfContentRef}>
                <ContractPDF contract={currentContract} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
