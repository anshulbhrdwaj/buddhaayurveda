'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useSWRMutation from 'swr/mutation';

import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { createOrders, verifyPayment } from '@/lib/razorpay';
import { useSession } from 'next-auth/react';

const Form = () => {
  const router = useRouter();
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    clear,
  } = useCartService();

  const { data: session } = useSession();
  const [isCreatingRazorpayOrder, setIsCreatingRazorpayOrder] = useState(false);

  // mutate data in the backend by calling trigger function
  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    `/api/orders/mine`,
    async (url) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress,
          items,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          user: { name: session?.user.fullName },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        clear();
        createRazorpayOrder(data.order._id);
        toast.success('Order placed successfully');
        return router.push(`/store/order/${data.order._id}`);
      } else {
        toast.error(data.message);
      }
    },
  );

  useEffect(() => {
    if (!paymentMethod) {
      return router.push('/store/payment');
    }
    if (items.length === 0) {
      return router.push('/store');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, router]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function loadRazorpayScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  async function createRazorpayOrder(orderId: string) {
    setIsCreatingRazorpayOrder(true);
    try {
      await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

      const result = await createOrders({ orderId });

      if (result.error) {
        toast.error('Error creating order');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: totalPrice * 100, // Assuming totalPrice is in INR
        currency: 'INR',
        name: 'Ecommerce Store',
        description: 'Order Payment',
        image: '/logo.png', // Update this with your brand's logo
        order_id: result.orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verificationResult = await verifyPayment(response);

          if (verificationResult.error) {
            toast.error('Payment verification failed');
            // router.push('/store/payment?status=failed');
            return;
          }

          toast.success('Payment successful');
          // router.push('/store/payment?status=success');
        },
        prefill: {
          name: session?.user.name || session?.user.fullName || 'Guest',
          email: session?.user.email || 'guest@example.com',
          contact: session?.user.contact || '9999999999', // Replace with user contact if available
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('An error occurred while processing your payment.');
    } finally {
      setIsCreatingRazorpayOrder(false);
    }
  }

  if (!mounted) return <>Loading...</>;

  return (
    <div>
      <CheckoutSteps current={4} />

      <div className='my-4 grid md:grid-cols-4 md:gap-5'>
        <div className='overflow-x-auto md:col-span-3'>
          <div className='card bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              <div>
                <Link className='btn' href='/store/shipping'>
                  Edit
                </Link>
              </div>
            </div>
          </div>

          <div className='card mt-4 bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Payment Method</h2>
              <p>{paymentMethod}</p>
              <div>
                <Link className='btn' href='/store/payment'>
                  Edit
                </Link>
              </div>
            </div>
          </div>

          <div className='card mt-4 bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Items</h2>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center'
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className='px-2'>
                            {item.name}({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>
                        <span>{item.qty}</span>
                      </td>
                      <td>₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link className='btn' href='/cart'>
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className='card bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Order Summary</h2>
              <ul className='space-y-3'>
                <li>
                  <div className=' flex justify-between'>
                    <div>Items</div>
                    <div>₹{itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className=' flex justify-between'>
                    <div>Tax</div>
                    <div>₹{taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className=' flex justify-between'>
                    <div>Shipping</div>
                    <div>₹{shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className=' flex justify-between'>
                    <div>Total</div>
                    <div>₹{totalPrice}</div>
                  </div>
                </li>

                <li>
                  <button
                    onClick={() => placeOrder()}
                    disabled={isPlacing || isCreatingRazorpayOrder}
                    className='btn btn-primary w-full'
                  >
                    {isPlacing && (
                      <span className='loading loading-spinner'></span>
                    )}
                    Place Order
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
