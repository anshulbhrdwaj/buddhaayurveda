'use client';
import { ChevronsDown, Github, InstagramIcon, Menu } from 'lucide-react';
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Separator } from '../ui/separator';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ToggleTheme } from './toogle-theme';
import { company, navbar } from '@/lib/landingData';

interface RouteProps {
  href: string;
  label: string;
}

interface FeatureProps {
  title: string;
  description: string;
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <header className='sticky top-5 z-40 mx-auto flex w-[90%] items-center justify-between rounded-full border border-secondary bg-card bg-opacity-15 p-2 px-8 shadow-inner md:w-[70%] lg:w-[75%] lg:max-w-screen-xl'>
      <Link href='/' className='flex items-center text-lg font-bold'>
        <Image src={company.logo} alt={company.name} width={40} height={40} className='mr-2 h-9 w-9 rounded-lg border border-secondary bg-gradient-to-tr from-primary via-primary/70 to-primary text-white' />
        {company.name}
      </Link>
      {/* <!-- Mobile --> */}
      <div className='flex items-center lg:hidden'>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className='cursor-pointer lg:hidden'
            />
          </SheetTrigger>

          <SheetContent
            side='left'
            className='flex flex-col justify-between rounded-br-2xl rounded-tr-2xl border-secondary bg-card'
          >
            <div>
              <SheetHeader className='mb-4 ml-4'>
                <SheetTitle className='flex items-center'>
                  <Link href='/' className='flex items-center'>
                    <ChevronsDown className='mr-2 h-9 w-9 rounded-lg border border-secondary bg-gradient-to-tr from-primary via-primary/70 to-primary text-white' />
                    {company.name}
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className='flex flex-col gap-2'>
                {navbar.navlist.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant='ghost'
                    className='justify-start text-base'
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                ))}
              </div>
            </div>

            <SheetFooter className='flex-col items-start justify-start sm:flex-col'>
              <Separator className='mb-2' />

              <ToggleTheme />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      <NavigationMenu className='mx-auto hidden lg:block'>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className='bg-card text-base'>
              Features
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className='grid w-[600px] grid-cols-2 gap-5 p-4'>
                <Image
                  src={navbar.featureImage.src}
                  alt={navbar.featureImage.alt}
                  className='h-full w-full rounded-md object-cover'
                  width={600}
                  height={600}
                />
                <ul className='flex flex-col gap-2'>
                  {navbar.featureList.map(({ title, description }) => (
                    <li
                      key={title}
                      className='rounded-md p-3 text-sm hover:bg-muted'
                    >
                      <p className='mb-1 font-semibold leading-none text-foreground'>
                        {title}
                      </p>
                      <p className=' text-muted-foreground'>
                        {description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            {navbar.navlist.map(({ href, label }) => (
              <NavigationMenuLink key={href} asChild>
                <Link href={href} className='px-2 text-base'>
                  {label}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className='hidden lg:flex'>
        <ToggleTheme />

        <Button asChild size='sm' variant='ghost' aria-label='View on Instagram'>
          <Link
            aria-label='View on Instagram'
            href={company.instagram}
            target='_blank'
          >
            <InstagramIcon className='size-5' />
          </Link>
        </Button>
      </div>
    </header>
  );
};
