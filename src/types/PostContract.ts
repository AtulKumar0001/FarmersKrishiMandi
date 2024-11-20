export interface Contract {
    id: string;
    buyer_name: string;
    crop_name: string;
    quantity: number;
    offered_price: number;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    title?: string;
    amount?: number;
    completionDate?: string;
    startDate?: string;
    expectedCompletionDate?: string;
  }
  
  export interface SubmittedCrop {
    id: string;
    crop_name: string;
    quantity: string;
    expected_price: string;
    description: string;
    created_at: string;
    farmer_name: string;
    farmer_id: string;
  }