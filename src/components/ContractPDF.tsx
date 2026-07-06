import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ContractData } from '../types/index';

interface ContractPDFProps {
  contract: ContractData;
}

export interface ContractPDFRef {
  generatePDF: () => Promise<void>;
}

export const generateContractPDF = async (contract: ContractData, contentRef: React.RefObject<HTMLDivElement | null>) => {
  if (!contentRef.current) return;

  try {
    const canvas = await html2canvas(contentRef.current, {
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

    const fileName = `Shilaabo_Contract_${contract.id}_${Date.now()}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const ContractPDF = forwardRef<ContractPDFRef, ContractPDFProps>(({ contract }, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const selectedAccessories = contract.accessories.filter(a => a.selected);
  const totalAccessoriesCost = selectedAccessories.reduce((sum, a) => sum + a.price, 0);
  const grandTotal = contract.rental.totalAmount + totalAccessoriesCost;

  const generatePDF = async () => {
    console.log('generatePDF called, contentRef.current:', contentRef.current);
    if (!contentRef.current) {
      console.error('contentRef.current is null');
      throw new Error('Content ref is not available');
    }
    await generateContractPDF(contract, contentRef as React.RefObject<HTMLDivElement>);
  };

  useImperativeHandle(ref, () => ({
    generatePDF
  }));

  return (
    <div>
      <div ref={contentRef} className="w-full bg-white p-8 text-xs">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-blue-600">
          <div className="flex items-center gap-4">
            <img src="/img/logo.jpeg" alt="Shilaabo Logo" className="w-20 h-20 object-contain" />
            <h1 className="text-2xl font-bold text-blue-600">SHILAABO TOUR & CAR HIRE <br/>HIRE CONTRACT</h1>
          </div>
          <div className="text-right text-xs">
            <p>BBS Mall Basement</p>
            <p>Room No. LGC 48</p>
            <p>Tel: +254 722 814 942</p>
          </div>
        </div>

        {/* Contract Number and Date */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-red-600">{contract.id}</div>
          <div className="text-sm">Date: {new Date(contract.createdAt).toLocaleDateString()}</div>
        </div>

        {/* Customer Section */}
        <div className="mb-4">
          <h4 className="text-sm font-bold bg-blue-100 p-2 mb-2">CUSTOMER INFORMATION</h4>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Full Name:</span>
            <span className="w-3/5">{contract.customer.fullName}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Business/Occupation:</span>
            <span className="w-3/5">{contract.customer.businessOccupation}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Passport No.:</span>
            <span className="w-3/5">{contract.customer.passportNumber}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">License No.:</span>
            <span className="w-3/5">{contract.customer.licenseNumber}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Citizenship:</span>
            <span className="w-3/5">{contract.customer.citizenship}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Address:</span>
            <span className="w-3/5">{contract.customer.address}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Phone:</span>
            <span className="w-3/5">{contract.customer.phone}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Email:</span>
            <span className="w-3/5">{contract.customer.email}</span>
          </div>
        </div>

        {/* Vehicle Section */}
        <div className="mb-4">
          <h4 className="text-sm font-bold bg-blue-100 p-2 mb-2">VEHICLE INFORMATION</h4>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Vehicle Type:</span>
            <span className="w-3/5">{contract.vehicle.vehicleType}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Car Make:</span>
            <span className="w-3/5">{contract.vehicle.carMake}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Model:</span>
            <span className="w-3/5">{contract.vehicle.model}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Registration No.:</span>
            <span className="w-3/5">{contract.vehicle.registrationNumber}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Mileage In:</span>
            <span className="w-3/5">{contract.vehicle.mileageIn}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Fuel Level on Departure:</span>
            <span className="w-3/5">{contract.vehicle.fuelLevel}</span>
          </div>
        </div>

        {/* Rental Section */}
        <div className="mb-4">
          <h4 className="text-sm font-bold bg-blue-100 p-2 mb-2">RENTAL TERMS & CONDITIONS</h4>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Condition/Damage Noted:</span>
            <span className="w-3/5">{contract.rental.conditionNoted || 'None'}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Date Out:</span>
            <span className="w-3/5">{contract.rental.dateOut} @ {contract.rental.timeOut}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Date In:</span>
            <span className="w-3/5">{contract.rental.dateIn} @ {contract.rental.timeIn}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Rate Charged Per Day:</span>
            <span className="w-3/5">KES {contract.rental.ratePerDay.toLocaleString()}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Total Amount:</span>
            <span className="w-3/5">KES {contract.rental.totalAmount.toLocaleString()}</span>
          </div>
          <div className="border-b border-gray-300 pb-1 mb-2 flex justify-between">
            <span className="font-bold text-blue-600 w-2/5">Deposit Paid:</span>
            <span className="w-3/5">{contract.rental.depositPaid}</span>
          </div>
        </div>

        {/* Accessories */}
        {selectedAccessories.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-bold bg-blue-100 p-2 mb-2">ACCESSORIES</h4>
            <div className="flex flex-wrap gap-4 mb-2">
              {selectedAccessories.map((accessory, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">{accessory.name}:</span>
                  <span>KES {accessory.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-blue-600 pt-1 flex justify-between font-bold">
              <span>Total Accessories Cost:</span>
              <span>KES {totalAccessoriesCost.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Grand Total */}
        <div className="bg-blue-600 text-white p-3 mb-4 font-bold text-sm flex justify-between">
          <span>GRAND TOTAL:</span>
          <span>KES {grandTotal.toLocaleString()}</span>
        </div>

        {/* Terms Box */}
        <div className="bg-yellow-100 border border-yellow-300 p-3 mb-4 text-xs">
          <p className="font-bold mb-2">EXCESS PAYABLE IN DAMAGE INCASE OF ANY</p>
          <p className="leading-relaxed">
            I fully understand that by the daily insurance, my maximum liability to the company is limited to upto KS.. I undertake that the hired vehicle should be returned strictly within the stipulated time and date and any extension will attract a fee of KSh 1000 per hour. In case of an accident and every claim payable to the insurance company not withstanding payment of the excess.
          </p>
        </div>

        {/* Signatures */}
        <div className="flex justify-between mt-8">
          <div className="w-2/5">
            <p className="text-xs font-bold mb-12">Name of the Hirer</p>
            <div className="border-t border-black pt-1 text-xs">Signature</div>
          </div>
          <div className="w-2/5">
            <p className="text-xs font-bold mb-12">Name of the Hiring Officer/Agent</p>
            <div className="border-t border-black pt-1 text-xs">Signature</div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-xs mt-6 pt-4 border-t border-gray-300 text-gray-600">
          <p>
            I fully understand that I am the only person authorised to drive this vehicle unless specific authority has been passed by the company in writing with the consent of the Hirers, and Hirerized. If the car is used for any illegal activities, Shilaabo Tour & Car Hire will have no responsibility for the cost of the vehicle will be held responsible.
          </p>
          <p className="mt-2 font-bold">CHECK TERMS AND CONDITIONS OVERLEAF.</p>
        </div>
      </div>
    </div>
  );
});

ContractPDF.displayName = 'ContractPDF';
