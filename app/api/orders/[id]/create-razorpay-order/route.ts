import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

interface Params {
  orderId: string;
}

export async function POST(req: Request, { params }: { params: Params }) {
  const { orderId } = params;

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  await dbConnect();

  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ error: 'Razorpay keys are missing' }, { status: 500 });
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const razorpayOrder = await instance.orders.create({
      amount: order.totalPrice * 100, // Amount in paise (INR)
      currency: 'INR',
      receipt: `order_${orderId}`,
    });

    if (!razorpayOrder) {
      return NextResponse.json({ error: 'Error creating Razorpay order' }, { status: 500 });
    }

    // Save the Razorpay order ID to the database
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return NextResponse.json({ orderId: razorpayOrder.id });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
