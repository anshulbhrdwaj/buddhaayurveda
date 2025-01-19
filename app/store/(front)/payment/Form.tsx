'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';

const Form = () => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const {
    items,
    codCharge,
    savePaymentMethod,
    paymentMethod,
    shippingAddress,
  } = useCartService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentMethod(selectedPaymentMethod);
    router.push('/store/place-order');
  };

  useEffect(() => {
    if (!shippingAddress) {
      return router.push('/store/shipping');
    }
    setSelectedPaymentMethod(paymentMethod || 'Razorpay');
  }, [paymentMethod, router, shippingAddress]);

  return (
    <div>
      <CheckoutSteps current={2} />
      <div className='card mx-auto my-4 max-w-sm bg-base-300'>
        <div className='card-body'>
          <h1 className='card-title'>Payment Method</h1>
          <form onSubmit={handleSubmit}>
            {['Razorpay', 'COD'].map((payment, index) => (
              <div key={payment}>
                <label className='label cursor-pointer'>
                  <span className='label-text'>
                    {payment === 'Razorpay'
                      ? 'Online Payment'
                      : 'Cash on Delivery'}
                    {index === 1 &&
                      ` (Extra ₹${items.reduce((acc, item) => acc + item.codCharge, 0)})`}
                  </span>
                  <input
                    type='radio'
                    name='paymentMethod'
                    className='radio'
                    value={payment}
                    checked={selectedPaymentMethod === payment}
                    onChange={() => setSelectedPaymentMethod(payment)}
                  />
                </label>
              </div>
            ))}
            <div className='my-2'>
              <button type='submit' className='btn btn-primary w-full'>
                Next
              </button>
            </div>
            <div className='my-2'>
              <button
                type='button'
                className='btn my-2 w-full'
                onClick={() => router.back()}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Form;
