import ContractABI from './abi.json';
import ContractAddress from './contract-address.json';

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || ContractAddress.DonationApp;
export const DONATION_FACTORY_ABI = ContractABI;
