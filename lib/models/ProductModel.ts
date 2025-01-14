import mongoose from 'mongoose';

export type Product = {
  _id?: string;
  name: string;
  slug: string;
  image: string;
  banner?: string;
  price: number;
  codCharge: number;
  brand: string;
  weight: number;
  length: number;
  breadth: number;
  height: number;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  colors?: [];
  sizes?: [];
};

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    codCharge: { type: Number, required: true },
    brand: { type: String, required: true },
    weight: { type: Number, required: true },
    length: { type: Number, required: true },
    breadth: { type: Number, required: true },
    height: { type: Number, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: String,
  },
  {
    timestamps: true,
  },
);

const ProductModel =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default ProductModel;
