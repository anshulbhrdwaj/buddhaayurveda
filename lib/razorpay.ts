"use server";
import { createHmac } from "crypto";

import Razorpay from "razorpay";

import dbConnect from "./dbConnect";
import OrderModel from "./models/OrderModel";

interface CreateOrdersInput {
  orderId: string;
}

export async function createOrders({ orderId }: CreateOrdersInput) {
  if (!orderId) {
    return { error: "Invalid input" };
  }
  
  await dbConnect();

  // const product = products.find((product) => product.id === orderId);
  const order = await OrderModel.findById(orderId);

  if (!order) {
    return { error: "Product not found" };
  }

  // console.log("Product details:", order);

  try {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.log("Razorpay keys are missing");
      return { error: "Razorpay keys are missing" };
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const razorpayOrder = await instance.orders.create({
      amount: order.totalPrice * 100,
      currency: "INR",
      receipt: `order_${orderId}`,
    });

    if (!razorpayOrder) {
      return { error: "Error creating orders" };
    }

    // Save the order details in the database

    // console.log(razorpayOrder)
    
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return { orderId: razorpayOrder.id };
  } catch (error) {
    console.log("Error creating orders", error);
    return { error: "Error creating orders" };
  }
}

export async function verifyPayment(data: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = data;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return { error: "Missing required payment fields" };
    }

    // Generate HMAC using Razorpay secret key
    const shasum = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      console.error("Transaction verification failed: Invalid signature");
      return { error: "Invalid payment signature" };
    }
    await dbConnect();

    // console.log(razorpay_order_id)
    // Find the order in the database using the Razorpay order ID
    const order = await OrderModel.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      console.error("Order not found in the database");
      return { error: "Order not found" };
    }

    // Update the order status to paid
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: razorpay_payment_id,
      status: "success", // Razorpay doesn't provide a status directly
    };

    await order.save();

    return { success: true };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { error: "Error verifying payment" };
  }
}