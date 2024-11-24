export interface Contracts {
  id: string;
  title: string;
  amount: number;
  completionDate?: string;
  startDate?: string;
  expectedCompletionDate?: string;
}

export interface BuyerInfo {
  id: number;
  user_id: string;
  name: string;
  address: string;
  phone_number: string;
  state: string;
}

export interface Contract {
  id: string;
  buyer_id: number;
  farmer_id: number;
  type: 'land_lease' | 'pre_sowing' | 'post_harvest';
  price: number;
  crop_name: string;
  quantity: number;
  delivery_date: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  delivery_status: 'pending' | 'started' | 'fulfilled';
  block_no: string | null;
  farmer_otp: string | null;
  buyer_otp: string | null;
  created_at: string;
  buyer: BuyerInfo;
}