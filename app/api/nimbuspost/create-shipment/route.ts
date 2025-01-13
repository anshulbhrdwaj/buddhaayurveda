import { NextResponse } from 'next/server';
import { nimbuspost } from '@/lib/nimbuspost';
import { auth } from '@/lib/auth';
import OrderModel from '@/lib/models/OrderModel';

export const POST = auth(async (request: any) => {
  if (!request.auth) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized access' },
      { status: 401 },
    );
  }

  try {
    const {shipmentData, token} = await request.json();

    // Validate request payload
    if (!shipmentData.order_number) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: order_number' },
        { status: 400 },
      );
    }

    // Ensure the order exists in the database
    const order = await OrderModel.findById(shipmentData.order_number);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 },
      );
    }

    // Make the external API call with timeout handling
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    const response = await nimbuspost.post('shipments/', shipmentData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timeout); // Clear timeout if the API call succeeds

    if (!response?.status || !response?.data) {
      throw new Error('Invalid response from NimbusPost');
    }

    // Update order with shipment details
    order.shipmentDetails = response.data;
    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Shipment created successfully',
      data: response.data,
    });
  } catch (error: any) {
    console.error('Error creating shipment:', error.message);

    // Handle specific error types more gracefully
    if (error.name === 'AbortError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Request timed out while connecting to NimbusPost',
        },
        { status: 504 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred',
      },
      { status: error.response?.status || 500 },
    );
  }
});
