export interface Crop {
    id: string;
    crop_name: string;
    farmer_name: string;
    farmer_id: string;
    farmer_address: string;
    farmer_city: string;
    farmer_pincode: string;
    phone_number : string;
    quantity: number;
    expected_price: number;
    description: string;
  }
  
  export interface ContractData {
    type: 'land_lease' | 'pre_sowing' | 'post_harvest';
    price: number;
    delivery_date: string;
    status: 'pending' | 'accepted' | 'rejected';
    farmer_id: string;
    
  }