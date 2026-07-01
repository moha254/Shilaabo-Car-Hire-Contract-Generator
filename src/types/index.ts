export interface CustomerDetails {
  fullName: string;
  businessOccupation: string;
  passportNumber: string;
  licenseNumber: string;
  citizenship: string;
  address: string;
  phone: string;
  email: string;
}

export interface VehicleDetails {
  vehicleType: string;
  carMake: string;
  model: string;
  registrationNumber: string;
  mileageIn: number;
  fuelLevel: string;
}

export interface RentalDetails {
  dateOut: string;
  timeOut: string;
  dateIn: string;
  timeIn: string;
  conditionNoted: string;
  ratePerDay: number;
  totalAmount: number;
  depositPaid: string;
}

export interface Accessory {
  name: string;
  price: number;
  selected: boolean;
}

export interface ContractData {
  id: string;
  createdAt: string;
  customer: CustomerDetails;
  vehicle: VehicleDetails;
  rental: RentalDetails;
  accessories: Accessory[];
  hireName: string;
  hireSignature: string;
  officerName: string;
  officerSignature: string;
}
