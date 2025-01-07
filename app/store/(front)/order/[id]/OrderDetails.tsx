'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTransition } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { OrderItem } from '@/lib/models/OrderModel';
import { createOrders, verifyPayment } from '@/lib/razorpay';


interface IOrderDetails {
  orderId: string;
  paypalClientId: string;
}

const OrderDetails = ({ orderId, paypalClientId }: IOrderDetails) => {
  const { data: session } = useSession();
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success('Order delivered successfully')
        : toast.error(data.message);
    },
  );

  function createPayPalOrder() {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((order) => order.id);
  }

  function onApprovePayPalOrder(data: any) {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((orderData) => {
        toast.success('Order paid successfully');
      });
  }

  const { data, error } = useSWR(`/api/orders/${orderId}`);

  if (error) return error.message;
  if (!data) return 'Loading...';

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data;

  // function createRazorpayOrder() {
  //   startTransition(async () => {
  //     const script = document.createElement("script");
  //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //     script.async = true;

  //     script.onload = async () => {
  //       const result = await createOrders({ productId: orderId, quantity: 1 });

  //       if (result.error) {
  //         alert("Error creating orders");
  //         return;
  //       }

  //       const options = {
  //         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  //         amount: (item.price - item.price * (product.discount / 100)) * 100,
  //         currency: "USD",
  //         name: "Payment Gateways Demo",
  //         image: `${process.env.NEXT_PUBLIC_BASE_URL}${product.image}`,
  //         order_id: result.orderId,
  //         handler: async function (response: {
  //           razorpay_payment_id: string;
  //           razorpay_order_id: string;
  //           razorpay_signature: string;
  //         }) {
  //           const result = await verifyPayment(response);
  //           if (result.error) {
  //             toast.error("Payment failed");
  //             router.push("/payment?status=failed");
  //             return;
  //           }
  //           router.push("/payment?status=success");
  //           toast.success("Payment successful");
  //         },
  //         prefill: {
  //           name: "Payment Gateways Demo",
  //           email: "premprakash@example.com",
  //           contact: "9999999999",
  //         },
  //       };

  //       const rzp = new (window as any).Razorpay(options);
  //       rzp.open();
  //     };

  //     document.body.appendChild(script);
  //   });
  // }

  function loadRazorpayScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  async function createRazorpayOrder() {
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
          name: session?.user.name || 'Guest',
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
    }
  }

  return (
    <div>
      <h1 className='py-4 text-2xl'>Order {orderId}</h1>
      <div className='my-4 grid md:grid-cols-4 md:gap-5'>
        <div className='md:col-span-3'>
          <div className='card bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <div className='text-success'>
                  Delivered at{' '}
                  {moment(deliveredAt).format('MMMM Do YYYY, h:mm:ss a')}
                </div>
              ) : (
                <div className='text-error'>Not Delivered</div>
              )}
            </div>
          </div>

          <div className='card mt-4 bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <div className='text-success'>
                  Paid at {moment(paidAt).format('MMMM Do YYYY, h:mm:ss a')}
                </div>
              ) : (
                <div className='text-error'>Not Paid</div>
              )}
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
                  {items.map((item: OrderItem) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/store/product/${item.slug}`}
                          className='flex items-center'
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className='px-2'>
                            {item.name} ({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className='card bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Order Summary</h2>
              <ul>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Items</div>
                    <div>₹{itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Tax</div>
                    <div>₹{taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Shipping</div>
                    <div>₹{shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Total</div>
                    <div>₹{totalPrice}</div>
                  </div>
                </li>

                {!isPaid && paymentMethod === 'PayPal' && (
                  <li>
                    <PayPalScriptProvider
                      options={{ clientId: paypalClientId }}
                    >
                      <PayPalButtons
                        createOrder={createPayPalOrder}
                        onApprove={onApprovePayPalOrder}
                      />
                    </PayPalScriptProvider>
                  </li>
                )}
                {paymentMethod === 'Razorpay' && !isPaid && (
                  <li>
                    <button
                      className='btn my-2 w-full'
                      onClick={createRazorpayOrder}
                    >
                      Pay with Razorpay
                    </button>
                  </li>
                )}

                {session?.user.isAdmin && (
                  <li>
                    <button
                      className='btn my-2 w-full'
                      onClick={() => deliverOrder()}
                      disabled={isDelivering}
                    >
                      {isDelivering && (
                        <span className='loading loading-spinner'></span>
                      )}
                      Mark as delivered
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
