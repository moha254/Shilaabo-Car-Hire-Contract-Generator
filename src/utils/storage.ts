import { ContractData } from '../types/index';

const STORAGE_KEY = 'shilaabo_contracts';

export function generateContractId(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const contracts = getAllContracts();
  const todaysContracts = contracts.filter(c => c.id.includes(`${year}${month}${day}`));
  const sequence = String(todaysContracts.length + 1).padStart(3, '0');
  
  return `STC-${year}${month}${day}-${sequence}`;
}

export function saveContract(contract: ContractData): void {
  const contracts = getAllContracts();
  
  const existingIndex = contracts.findIndex(c => c.id === contract.id);
  if (existingIndex >= 0) {
    contracts[existingIndex] = contract;
  } else {
    contracts.push(contract);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
}

export function getAllContracts(): ContractData[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getContractById(id: string): ContractData | null {
  const contracts = getAllContracts();
  return contracts.find(c => c.id === id) || null;
}

export function deleteContract(id: string): void {
  const contracts = getAllContracts();
  const filtered = contracts.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
