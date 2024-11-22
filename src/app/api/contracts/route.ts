import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const data = await request.json();
    console.log('Received data:', data);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the buyer's ID
    const { data: buyerData, error: buyerError } = await supabase
      .from('buyer_registrations')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (buyerError || !buyerData) {
      console.error('Buyer Error:', buyerError);
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Get farmer registration ID
    const { data: farmerData, error: farmerError } = await supabase
      .from('farmer_registrations')
      .select('id')
      .eq('user_id', data.farmer_id)
      .single();

    if (farmerError || !farmerData) {
      console.error('Farmer Error:', farmerError);
      return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
    }

    // Check if contract already exists
    const { data: existingContract } = await supabase
      .from('contracts')
      .select('id')
      .eq('buyer_id', buyerData.id)
      .eq('farmer_id', farmerData.id)
      .eq('crop_name', data.crop_name)
      .single();

    if (existingContract) {
      return NextResponse.json(
        { error: 'Contract already exists with this farmer' },
        { status: 400 }
      );
    }

    // Insert the new contract
    const { data: contract, error: insertError } = await supabase
      .from('contracts')
      .insert([{
        buyer_id: buyerData.id,
        farmer_id: farmerData.id,
        type: data.type,
        price: data.price,
        delivery_date: data.delivery_date,
        status: 'pending',
        crop_name: data.crop_name,
        quantity: data.quantity,
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Insert Error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create contract' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, contract });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}