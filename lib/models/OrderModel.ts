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
        codCharge: { type: Number, required: true, default: 0 },
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
    codCharge: { type: Number, required: true },
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
  mongoose.models?.Order || mongoose.model('Order', orderSchema);

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
  codCharge: number;
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
  codCharge: number;
  color: string;
  size: string;
  height: string;
  breadth: string;
  length: string;
  weight: number;
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

export type ShipmentTrackingDetails = {
  id: string;
  order_id: string;
  order_number: string;
  created: string;
  awb_number: string;
  rto_awb: string;
  courier_id: string;
  warehouse_id: string;
  rto_warehouse_id: string;
  status: string;
  rto_status: string;
  shipment_info: string;
  history: ILatestStatus[];
};

export interface ILatestStatus {
  status_code: string;
  location: string;
  event_time: string;
  message: string;
}

export function statusInterpreter(status_code: string): string {
  switch (status_code) {
    case 'PP':
      return 'Pending Pickup';
    case 'IT':
      return 'In Transit';
    case 'EX':
      return 'Exception';
    case 'OFD':
      return 'Out For Delivery';
    case 'DL':
      return 'Delivered';
    case 'RT':
      return 'RTO';
    case 'RT-IT':
      return 'RTO In Transit';
    case 'RT-DL':
      return 'RTO Delivered';
    default:
      return 'Unknown Status';
  }
}
