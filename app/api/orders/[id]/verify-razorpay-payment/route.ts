import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

interface PaymentData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature }: PaymentData = await req.json();

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing required payment fields' }, { status: 400 });
  }

  await dbConnect();

  try {
    const shasum = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const order = await OrderModel.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Mark order as paid
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'success', // Razorpay doesn't provide a status directly
    };

    await order.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
