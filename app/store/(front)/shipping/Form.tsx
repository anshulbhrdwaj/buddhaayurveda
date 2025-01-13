'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, ValidationRule, useForm } from 'react-hook-form';

import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { ShippingAddress } from '@/lib/models/OrderModel';
import toast from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';

const Form = () => {
  const params = useSearchParams();
  const router = useRouter();
  // let callbackUrl = params.get('/store/callbackUrl') || '/store/';

  const { saveShippingAddress, shippingAddress } = useCartService();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      contact: '',
      email: '',
    },
  });

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
    setValue('contact', shippingAddress.contact);
    setValue('email', shippingAddress.email);
    setValue('state', shippingAddress.state);
  }, [setValue, shippingAddress]);

  const { data: session } = useSession();

  let callbackUrl = '/store/payment';

  // useEffect(() => {
  //   if (session && session.user) {
  //     router.push(callbackUrl);
  //   }
  // }, [callbackUrl, router, session, params]);

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    const { fullName, email, contact } = form;
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          contact,
        }),
      });
      if (res.ok) {
        // return router.push(
        //   `/store/signin?callbackUrl=${callbackUrl}&success=User has been created`,
        // );
        signIn('credentials', {
          email,
          password: null,
          callbackUrl,
        });
        toast.success('User has been created');
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (err: any) {
      const error =
        err.message && err.message.indexOf('E11000') === 0
          ? signIn('credentials', { email, password: null, callbackUrl })
          : err.message;
      error && toast.error(error || 'error');
    }
    saveShippingAddress(form);
    router.push('/store/payment');
  };

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof ShippingAddress;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <div className='mb-2'>
      <label className='label' htmlFor={id}>
        {name}
      </label>
      <input
        type='text'
        id={id}
        {...register(id, {
          required: required && `${name} is required`,
          pattern,
        })}
        className='input input-bordered w-full max-w-sm'
      />
      {errors[id]?.message && (
        <div className='text-error'>{errors[id]?.message}</div>
      )}
    </div>
  );

  return (
    <div>
      <CheckoutSteps current={1} />
      <div className='card mx-auto my-4 max-w-sm bg-base-300'>
        <div className='card-body'>
          <h1 className='card-title'>Shipping Address</h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <FormInput name='Full Name' id='fullName' required />
            <FormInput name='Address' id='address' required />
            <FormInput name='City' id='city' required />
            <FormInput name='State' id='state' required />
            <FormInput name='Postal Code' id='postalCode' required />
            <FormInput name='Country' id='country' required />
            <FormInput name='Contact' id='contact' required />
            <FormInput name='Email' id='email' required />
            <div className='my-2'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='btn btn-primary w-full'
              >
                {isSubmitting && <span className='loading loading-spinner' />}
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
