import { NextResponse } from 'next/server';
import { nimbuspost } from '@/lib/nimbuspost';
import { auth } from '@/lib/auth';

export const POST = auth(async (request: any) => {
  if (!request.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      },
    );
  }
  const { data } = await request.json();

  try {
    const response = await nimbuspost.post(`/shipments/cancel`, data );
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to cancel shipment' },
      { status: error.response?.status || 500 },
    );
  }
});


// {
//   "status": true,
//   "message": "Shipment Cancelled"
// }