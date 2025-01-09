import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

export const POST = async (request: NextRequest) => {
  const { fullName, email, contact, password = null } = await request.json();
  await dbConnect();

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 5);
  }

  const newUser = new UserModel({
    fullName,
    email,
    contact,
    password: hashedPassword, // Can be null if no password is provided
  });

  try {
    await newUser.save();
    return Response.json(
      { message: 'User has been created' },
      {
        status: 201,
      }
    );
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
};
