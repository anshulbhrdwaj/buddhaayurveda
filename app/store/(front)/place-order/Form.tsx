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
import { company } from '@/lib/landingData';

interface LoginResponse {
  token: string;
}

const Form = () => {
  const router = useRouter();
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    codCharge,
    shippingPrice,
    totalPrice,
    clear,
  } = useCartService();

  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const { trigger: placeOrder } = useSWRMutation(
    '/api/orders/mine',
    async () => {
      try {
        setIsProcessing(true);

        // Step 1: Create Order
        const orderData = await createOrder();
        if (!orderData) throw new Error('Failed to create order.');

        // Step 2: Create Razorpay Payment
        if (paymentMethod === 'Razorpay') {
          const paymentResult = await createRazorpayOrder(orderData.order._id);
          if (!paymentResult) throw new Error('Payment failed or canceled.');
        }

        // Step 3: Login Nimbus Post
        const { token } = await loginNimbusPost();
        if (!token) throw new Error('Shipment connection failed.');

        // Step 4: Create Shipment
        const shipmentResult = await createShipment(orderData.order._id, token);
        if (!shipmentResult) {
          toast.error('Shipment creation failed, please contact support.');
        } else {
          toast.success('Order and shipment created successfully!');
        }

        // Clear cart and redirect to order details page
        clear();
        router.push(`/store/order/${orderData.order._id}`);
      } catch (error) {
        handleError(error);
      } finally {
        setIsProcessing(false);
      }
    },
  );

  useEffect(() => {
    if (!paymentMethod) return router.push('/store/payment');
    if (items.length === 0) return router.push('/store');
  }, [paymentMethod, items, router]);

  const createOrder = async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentMethod,
        shippingAddress,
        items,
        itemsPrice,
        codCharge: paymentMethod === 'COD' ? codCharge : 0,
        shippingPrice,
        totalPrice,
        user: { name: session?.user.fullName },
      }),
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message || 'Failed to create order.');
    }

    return response.json();
  };

  const createRazorpayOrder = async (orderId: string) => {
    try {
      await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
      const result = await createOrders({ orderId });

      if (result.error) {
        toast.error('Error creating Razorpay order.');
        return null;
      }

      return new Promise((resolve, reject) => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: totalPrice * 100, // Convert to paise
          currency: 'INR',
          name: 'Buddha Ayurveda',
          description: 'Order Payment',
          order_id: result.orderId,
          handler: async (response: any) => {
            const verifyResult = await verifyPayment(response);
            if (verifyResult.error) {
              reject('Payment verification failed.');
            } else {
              resolve(true);
            }
          },
          prefill: {
            name: session?.user.name || 'Guest',
            email: session?.user.email || 'guest@example.com',
            contact: session?.user.contact || '9999999999',
          },
          theme: { color: '#3399cc' },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', () => reject('Payment failed.'));
        rzp.open();
      });
    } catch (error) {
      console.error('Razorpay error:', error);
      throw new Error('An error occurred with Razorpay.');
    }
  };

  const loginNimbusPost = async (): Promise<LoginResponse> => {
    try {
      const res = await fetch('/api/nimbuspost/login', {
        method: 'POST', // Change GET to POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty body since you're using environment variables for the credentials
      });

      const data = await res.json();

      return data; // Return the data variable
    } catch (error) {
      return Promise.reject(error); // Return a rejected promise with an error message
    }
  };

  const createShipment = async (orderId: string, token: string) => {
    const response = await fetch('/api/nimbuspost/create-shipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shipmentData: {
          order_number: orderId,
          payment_type: paymentMethod === 'COD' || 'cod' ? 'cod' : 'prepaid',
          order_amount: totalPrice,
          package_weight: items.reduce(
            (total, item) => total + item.weight * item.qty,
            0,
          ),
          package_height: items.reduce(
            (total, item) => total + parseFloat(item.height),
            0,
          ),
          package_breadth: items.reduce(
            (total, item) => total + parseFloat(item.breadth),
            0,
          ),
          package_length: items.reduce(
            (total, item) => total + parseFloat(item.length),
            0,
          ),
          consignee: {
            name: shippingAddress.fullName,
            address: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.postalCode,
            phone: shippingAddress.contact,
          },
          pickup: {
            warehouse_name: 'VPO GHARWAL',
            name: 'VPO GHARWAL ',
            address: company.address,
            city: company.city,
            state: company.state,
            pincode: company.zip,
            phone: company.phone,
          },
          order_items: items.map((item) => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
            sku: "Buddha Ayurveda's " + item.slug,
          })),
        },
        token,
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Failed to create shipment.');
    }

    const data = await response.json();

    // console.log(data);

    // if (!data.data?.status) {
    //   const {
    //     data: { message },
    //   } = data;
    //   throw new Error(message || 'Failed to create shipment.');
    // }

    return data;
  };

  const loadRazorpayScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('Failed to load Razorpay script.'));
      document.body.appendChild(script);
    });

  const handleError = (error: any) => {
    console.error('Error:', error);
    toast.error(error.message || 'An unexpected error occurred.');
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
                    <div>Cod Charge</div>
                    <div>₹{(paymentMethod === 'COD' && codCharge) || 0}</div>
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
                    disabled={isProcessing}
                    className='btn btn-primary w-full'
                  >
                    {isProcessing && (
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
