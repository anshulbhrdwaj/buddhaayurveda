import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

import DrawerButton from '@/components/DrawerButton';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Providers from '@/components/Providers';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Buddha Ayurveda - Ayurvedic Health Products Store',
  description: 'At Budhha Ayurveda, we bring the power of nature to your doorstep. Experience pure Ayurveda, crafted for modern lifestyles.',
};

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Providers>
        <div className='drawer'>
          <DrawerButton />
          <div className='drawer-content'>
            <div className='flex min-h-screen flex-col'>
              <Header />
              {children}
              {/* <Footer /> */}
            </div>
          </div>
          <div className='drawer-side'>
            <label
              htmlFor='my-drawer'
              aria-label='close sidebar'
              className='drawer-overlay'
            ></label>
            <Sidebar />
          </div>
        </div>
      </Providers>
    </>
  );
};

export default StoreLayout;
