import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CustomerForm } from './components/CustomerForm';
import { VehicleForm } from './components/VehicleForm';
import { RentalForm } from './components/RentalForm';
import { AccessoriesForm } from './components/AccessoriesForm';
import { ContractData, CustomerDetails, VehicleDetails, RentalDetails, Accessory } from './types/index';
import { generateContractId, saveContract, getAllContracts, getContractById } from './utils/storage';
import { FileText, Save, Plus, Eye, Trash2 } from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'form' | 'list' | 'preview'>('form');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const contractPDFRef = useRef<HTMLDivElement>(null);

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
  const [isDownloading, setIsDownloading] = useState(false);

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

  const generatePDF = async () => {
    if (!contractPDFRef.current) return;

    try {
      const canvas = await html2canvas(contractPDFRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yPosition = 10;

      if (imgHeight > pageHeight - 20) {
        const pages = Math.ceil(imgHeight / (pageHeight - 20));
        for (let i = 0; i < pages; i++) {
          if (i > 0) pdf.addPage();
          pdf.addImage(
            imgData,
            'PNG',
            10,
            yPosition - i * (pageHeight - 20),
            imgWidth,
            imgHeight
          );
        }
      } else {
        pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
      }

      const fileName = `Shilaabo_Contract_${currentContract?.id}_${Date.now()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
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
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/img/logo.jpeg" alt="Shilaabo Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg bg-white" />
            <div>
              <h1 className="text-xl sm:text-3xl font-bold">Shilaabo Tour & Car Hire</h1>
              <p className="text-blue-100 text-xs sm:text-sm">Contract Generator System</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => { resetForm(); setViewMode('form'); setCurrentStep(1); }}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium transition text-sm ${
                viewMode === 'form'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500 hover:bg-blue-700 text-white'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">New Contract</span>
              <span className="sm:hidden">New</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium transition text-sm ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500 hover:bg-blue-700 text-white'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Saved Contracts ({contracts.length})</span>
              <span className="sm:hidden">Saved ({contracts.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Form View */}
        {viewMode === 'form' && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
            {/* Progress Steps */}
            <div className="flex justify-between mb-6 sm:mb-8 overflow-x-auto">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex items-center ${step < 5 ? 'flex-1' : ''} min-w-max`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                      currentStep >= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`flex-1 h-1 mx-1 sm:mx-2 ${
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
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Signatures & Final Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                        Hirer Name *
                      </label>
                      <input
                        type="text"
                        value={hireName}
                        onChange={(e) => setHireName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="Enter hirer's name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                        Hirer Signature
                      </label>
                      <input
                        type="text"
                        value={hireSignature}
                        onChange={(e) => setHireSignature(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="Enter or draw signature"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                        Officer/Agent Name *
                      </label>
                      <input
                        type="text"
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="Enter officer's name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                        Officer Signature
                      </label>
                      <input
                        type="text"
                        value={officerSignature}
                        onChange={(e) => setOfficerSignature(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="Enter or draw signature"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-blue-800">
                      Please review all information carefully before generating the contract. You will be able to download the PDF and view all saved contracts.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-2 sm:gap-4 mt-6 sm:mt-8">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 sm:px-6 py-2 bg-slate-500 text-white font-medium rounded-lg hover:bg-slate-600 transition text-sm sm:text-base"
                >
                  Previous
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  onClick={handleNext}
                  className="ml-auto px-4 sm:px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleGenerateContract}
                  className="ml-auto px-4 sm:px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm sm:text-base"
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Generate & Save Contract</span>
                  <span className="sm:hidden">Save</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-900">Saved Contracts</h2>
            {contracts.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4 text-sm sm:text-base">No contracts saved yet.</p>
                <button
                  onClick={() => { resetForm(); setViewMode('form'); setCurrentStep(1); }}
                  className="px-4 sm:px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Create First Contract
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {contracts.map((contract) => (
                  <div key={contract.id} className="border border-slate-200 rounded-lg p-3 sm:p-4 hover:shadow-lg transition">
                    <h3 className="font-bold text-base sm:text-lg text-blue-600 mb-2">{contract.id}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-1">
                      <strong>Customer:</strong> {contract.customer.fullName}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 mb-1">
                      <strong>Vehicle:</strong> {contract.vehicle.carMake} {contract.vehicle.model}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                      <strong>Date:</strong> {new Date(contract.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadContract(contract.id)}
                        className="flex-1 px-2 sm:px-3 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded hover:bg-blue-700 transition"
                      >
                        View/Edit
                      </button>
                      <button
                        onClick={() => deleteContract(contract.id)}
                        className="px-2 sm:px-3 py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded hover:bg-red-700 transition"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Contract Preview: {currentContract.id}</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={async () => {
                    setIsDownloading(true);
                    try {
                      await generatePDF();
                    } catch (error) {
                      console.error('Error generating PDF:', error);
                      alert('Failed to generate PDF. Please try again.');
                    } finally {
                      setIsDownloading(false);
                    }
                  }}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isDownloading ? 'Generating...' : 'Download PDF'}
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition text-sm sm:text-base"
                >
                  Back
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 sm:p-4 md:p-6 h-64 sm:h-80 md:h-96 overflow-y-auto">
              <div ref={contractPDFRef} className="bg-white p-3 sm:p-4 md:p-8 text-[10px] sm:text-xs text-slate-800 space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-blue-600">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <img src="/img/logo.jpeg" alt="Shilaabo Logo" className="w-10 h-10 sm:w-16 sm:h-16 object-contain" />
                    <h1 className="text-sm sm:text-xl font-bold text-blue-600">SHILAABO TOUR & CAR HIRE <br/>HIRE CONTRACT</h1>
                  </div>
                  <div className="text-right text-[10px] sm:text-xs">
                    <p>BBS Mall Basement</p>
                    <p>Room No. LGC 48</p>
                    <p>Tel: 0722814942/0792837410</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
                  <div className="text-lg sm:text-2xl font-bold text-red-600">{currentContract.id}</div>
                  <div className="text-xs sm:text-sm">Date: {new Date(currentContract.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="mb-3 sm:mb-4">
                  <h4 className="text-xs sm:text-sm font-bold bg-blue-100 p-1 sm:p-2 mb-2">CUSTOMER INFORMATION</h4>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Full Name:</span>
                    <span className="sm:w-3/5">{currentContract.customer.fullName}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Business/Occupation:</span>
                    <span className="sm:w-3/5">{currentContract.customer.businessOccupation}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Passport No.:</span>
                    <span className="sm:w-3/5">{currentContract.customer.passportNumber}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">License No.:</span>
                    <span className="sm:w-3/5">{currentContract.customer.licenseNumber}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Citizenship:</span>
                    <span className="sm:w-3/5">{currentContract.customer.citizenship}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Address:</span>
                    <span className="sm:w-3/5">{currentContract.customer.address}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Phone:</span>
                    <span className="sm:w-3/5">{currentContract.customer.phone}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Email:</span>
                    <span className="sm:w-3/5">{currentContract.customer.email}</span>
                  </div>
                </div>

                <div className="mb-3 sm:mb-4">
                  <h4 className="text-xs sm:text-sm font-bold bg-blue-100 p-1 sm:p-2 mb-2">VEHICLE INFORMATION</h4>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Vehicle Type:</span>
                    <span className="sm:w-3/5">{currentContract.vehicle.vehicleType}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Car Make:</span>
                    <span className="sm:w-3/5">{currentContract.vehicle.carMake}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Model:</span>
                    <span className="sm:w-3/5">{currentContract.vehicle.model}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Registration No.:</span>
                    <span className="sm:w-3/5">{currentContract.vehicle.registrationNumber}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Mileage In:</span>
                    <span className="sm:w-3/5">{currentContract.vehicle.mileageIn}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Fuel Level on Departure:</span>
                    <span className="sm:w-3/5">{currentContract.vehicle.fuelLevel}</span>
                  </div>
                </div>

                <div className="mb-3 sm:mb-4">
                  <h4 className="text-xs sm:text-sm font-bold bg-blue-100 p-1 sm:p-2 mb-2">RENTAL TERMS & CONDITIONS</h4>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Condition/Damage Noted:</span>
                    <span className="sm:w-3/5">{currentContract.rental.conditionNoted || 'None'}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Date Out:</span>
                    <span className="sm:w-3/5">{currentContract.rental.dateOut} @ {currentContract.rental.timeOut}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Date In:</span>
                    <span className="sm:w-3/5">{currentContract.rental.dateIn} @ {currentContract.rental.timeIn}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Rate Charged Per Day:</span>
                    <span className="sm:w-3/5">KES {currentContract.rental.ratePerDay.toLocaleString()}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Total Amount:</span>
                    <span className="sm:w-3/5">KES {currentContract.rental.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-b border-gray-300 pb-1 mb-2 flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-bold text-blue-600 sm:w-2/5">Deposit Paid:</span>
                    <span className="sm:w-3/5">{currentContract.rental.depositPaid}</span>
                  </div>
                </div>

                {currentContract.accessories.filter(a => a.selected).length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-bold bg-blue-100 p-1 sm:p-2 mb-2">ACCESSORIES</h4>
                    <div className="flex flex-wrap gap-2 sm:gap-4 mb-2">
                      {currentContract.accessories.filter(a => a.selected).map((accessory, index) => (
                        <div key={index} className="flex items-center gap-1 sm:gap-2">
                          <span className="text-blue-600 font-bold">{accessory.name}:</span>
                          <span>KES {accessory.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t-2 border-blue-600 pt-1 flex justify-between font-bold">
                      <span>Total Accessories Cost:</span>
                      <span>KES {currentContract.accessories.filter(a => a.selected).reduce((sum, a) => sum + a.price, 0).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="bg-blue-600 text-white p-2 sm:p-3 mb-3 sm:mb-4 font-bold text-xs sm:text-sm flex justify-between">
                  <span>GRAND TOTAL:</span>
                  <span>KES {(currentContract.rental.totalAmount + currentContract.accessories.filter(a => a.selected).reduce((sum, a) => sum + a.price, 0)).toLocaleString()}</span>
                </div>

                <div className="bg-yellow-100 border border-yellow-300 p-2 sm:p-3 mb-3 sm:mb-4 text-[10px] sm:text-xs">
                  <p className="font-bold mb-2">EXCESS PAYABLE IN DAMAGE INCASE OF ANY</p>
                  <p className="leading-relaxed">
                    I fully understand that by the daily insurance, my maximum liability to the company is limited to upto KS.. I undertake that the hired vehicle should be returned strictly within the stipulated time and date and any extension will attract a fee of KSh 1000 per hour. In case of an accident and every claim payable to the insurance company not withstanding payment of the excess.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 mt-6 sm:mt-8">
                  <div className="w-full sm:w-2/5">
                    <p className="text-[10px] sm:text-xs font-bold mb-8 sm:mb-12">Name of the Hirer</p>
                    <div className="border-t border-black pt-1 text-[10px] sm:text-xs">Signature</div>
                  </div>
                  <div className="w-full sm:w-2/5">
                    <p className="text-[10px] sm:text-xs font-bold mb-8 sm:mb-12">Name of the Hiring Officer/Agent</p>
                    <div className="border-t border-black pt-1 text-[10px] sm:text-xs">Signature</div>
                  </div>
                </div>

                <div className="text-[10px] sm:text-xs mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-300 text-gray-600">
                  <p>
                    I fully understand that I am the only person authorised to drive this vehicle unless specific authority has been passed by the company in writing with the consent of the Hirers, and Hirerized. If the car is used for any illegal activities, Shilaabo Tour & Car Hire will have no responsibility for the cost of the vehicle will be held responsible.
                  </p>
                  <p className="mt-2 font-bold">CHECK TERMS AND CONDITIONS OVERLEAF.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
