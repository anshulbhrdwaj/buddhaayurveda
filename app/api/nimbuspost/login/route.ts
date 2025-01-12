import { NextResponse } from 'next/server';
import { nimbuspost, setAuthToken } from '@/lib/nimbuspost';
import { auth } from '@/lib/auth';

export const POST = async () => {
  const email = process.env.NP_EMAIL;
  const password = process.env.NP_PASSWORD;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email or Password environment variables are missing' },
      { status: 500 },
    );
  }

  const data = JSON.stringify({
    email,
    password,
  });

  try {
    const response = await nimbuspost.post('/users/login', data);

    console.log(response.data);

    const token = response.data.data;
    setAuthToken(token);
    return NextResponse.json({ token });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to authenticate' },
      { status: error.response?.status || 500 },
    );
  }
};


