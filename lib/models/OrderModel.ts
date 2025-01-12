import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    razorpayOrderId: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      contact: { type: String, required: true },
      email: { type: String, required: true },
      state: { type: String, required: true },
    },
    shipmentDetails: {
      order_id: { type: Number },
      shipment_id: { type: Number },
      awb_number: { type: String },
      courier_id: { type: String },
      courier_name: { type: String },
      status: { type: String },
      additional_info: { type: String },
      payment_type: { type: String },
      label: { type: String },
    },    
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

const OrderModel =
  mongoose.models.Order || mongoose.model('Order', orderSchema);

export default OrderModel;

export type Order = {
  _id: string;
  razorpayOrderId: string;
  user?: { name: string };
  items: [OrderItem];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    contact: string;
    email: string;
    state: string;
  };
  shipmentDetails?: ShipmentDetails;
  paymentMethod: string;
  paymentResult?: { id: string; status: string; email_address: string };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
};

export type OrderItem = {
  name: string;
  slug: string;
  qty: number;
  image: string;
  price: number;
  color: string;
  size: string;
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  contact: string;
  email: string;
};

export type ShipmentDetails = {
  order_id: number;
  shipment_id: number;
  awb_number: string;
  courier_id: string;
  courier_name: string;
  status: string;
  additional_info: string;
  payment_type: string;
  label: string;
};
