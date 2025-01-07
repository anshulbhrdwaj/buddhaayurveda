import { InstagramIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import GithubIcon from '@/components/icons/github-icon';
import LinkedInIcon from '@/components/icons/linkedin-icon';
import XIcon from '@/components/icons/x-icon';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { products } from '@/lib/landingData';
interface ProductsProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  socialNetworks: SocialNetworkProps[];
}
interface SocialNetworkProps {
  name: string;
  url: string;
}
export const ProductsSection = () => {
  const socialIcon = (socialName: string) => {
    switch (socialName) {
      case 'LinkedIn':
        return <LinkedInIcon />;
      case 'Github':
        return <GithubIcon />;
      case 'X':
        return <XIcon />;
      case 'Instagram':
        return <InstagramIcon />;
    }
  };

  return (
    <section id='products' className='container py-24 sm:py-32 lg:w-[75%]'>
      <div className='mb-8 text-center'>
        <h2 className='mb-2 text-center text-lg tracking-wider text-primary'>
          {products.title}
        </h2>

        <h2 className='text-center text-3xl font-bold md:text-4xl'>
          {products.subtitle}
        </h2>
      </div>

      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {products.productsList.map(
          (
            { imageUrl, firstName, lastName, positions, socialNetworks },
            index,
          ) => (
            <Card
              key={index}
              className='group/hoverimg flex h-full flex-col overflow-hidden bg-muted/60 dark:bg-card'
            >
              <CardHeader className='gap-0 p-0'>
                <div className='h-full overflow-hidden'>
                  <video
                    width={1080}
                    height={1920}
                    controls
                    preload='none'
                    loop 
                    muted
                    autoPlay
                    className='size-full w-full saturate-0 transition-all duration-200 ease-linear group-hover/hoverimg:scale-[1.01] group-hover/hoverimg:saturate-100'
                  >
                    <source src={imageUrl} type='video/mp4' />
                  </video>
                </div>
                <CardTitle className='px-6 py-6 pb-4'>
                  {firstName}
                  <span className='ml-2 text-primary'>{lastName}</span>
                </CardTitle>
              </CardHeader>
              {positions.map((position, index) => (
                <CardContent
                  key={index}
                  className={`pb-0 text-muted-foreground ${
                    index === positions.length - 1 && 'pb-6'
                  }`}
                >
                  {position}
                  {index < positions.length - 1 && <span>,</span>}
                </CardContent>
              ))}

              <CardFooter className='mt-auto space-x-4'>
                {socialNetworks.map(({ name, url }, index) => (
                  <Link
                    key={index}
                    href={url}
                    target='_blank'
                    className='transition-all hover:opacity-80'
                  >
                    {socialIcon(name)}
                  </Link>
                ))}
              </CardFooter>
            </Card>
          ),
        )}
      </div>
    </section>
  );
};
