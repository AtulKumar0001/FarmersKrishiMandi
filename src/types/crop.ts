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
    crop_name:string;
    quantity:number;
    farmer_id: string;
    // farmer_otp:string | null,
    // buyer_otp:string | null,
    // block_no:string | null,
    delivery_status:'pending'|'started'|'fullfilled'
  }