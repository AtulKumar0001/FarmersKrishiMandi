// types/blockchain.ts

export interface ContractLog {
  topics: string[];
  data: string;
  address?: string;
  blockNumber?: number;
  transactionHash?: string;
  transactionIndex?: number;
  blockHash?: string;
  logIndex?: number;
  removed?: boolean;
}

export interface ContractReceipt {
  hash: string;
  from: string;
  to: string | null;
  blockNumber: number;
  logs: ContractLog[];
}

export interface FarmContractDetails {
  id: bigint;
  farmer: string;
  contractor: string;
  cropName: string;
  price: bigint;
  expectedDeliveryDate: bigint;
  deliveryStatus: number;
  farmerOtpHash: string;
  contractorOtpHash: string;
}

export interface FormattedContractDetails {
  id: string;
  farmer: string;
  contractor: string;
  cropName: string;
  price: string;
  expectedDeliveryDate: string;
  deliveryStatus: string;
  farmerOtpHash: string;
  contractorOtpHash: string;
}

export interface ContractCreatedEventArgs {
  contractId: bigint;
  farmer: string;
  contractor: string;
  cropName: string;
  price: bigint;
  expectedDeliveryDate: bigint;
}

export enum DeliveryStatus {
  Pending = 0,
  Accepted = 1,
  InProgress = 2,
  ReadyForDelivery = 3,
  Completed = 4,
  Cancelled = 5
}