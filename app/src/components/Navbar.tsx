"use client";
// import { usePathname } from 'next/navigation'
// import Image from 'next/image';
// import logoImg from '../assets/images/logo.png';
// import MenuIcon from '../assets/icons/menu.svg';
// import Link from 'next/link';
// import { WalletSelector } from './WalletConnector/WalletSelector';

// export const Navbar = () => {
//   const pathname = usePathname()
//   console.log("the current path", pathname);
//   return (
//     <div className='bg-black text-white'>
//       <div className="container">
//         <div className='py-4 flex items-center justify-between'>
//           <div className='relative'>
//             <div className='absolute w-full top-0 bottom-0 bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] blur-md'></div>
//             <Image src={logoImg} alt="saas logo" className='w-12 h-12 relative' />
//           </div>
//           <div className='border border-white border-opacity-25 h-10 w-10 rounded-lg inline-flex items-center justify-center sm:hidden'>
//             <MenuIcon />
//           </div>
//           {pathname==="/app"?(<nav className='items-center gap-6 hidden sm:flex'>
//               <WalletSelector/>
//           </nav>):(
//           <nav className='items-center gap-6 hidden sm:flex'>
//             <Link href='/' className='text-white text-opacity-60 hover:text-opacity-100 transition'>Features</Link>
//             <Link href='/' className='text-white text-opacity-60 hover:text-opacity-100 transition'>FAQs</Link>
//             <Link href='/' className='text-white text-opacity-60 hover:text-opacity-100 transition'>Get Started</Link>
//             <Link href="/app">
//               <button className='bg-white text-black py-2 px-4 rounded-lg hover:scale-[1.03] transition'>Launch App</button>
//             </Link>
//           </nav>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import Container from "./Container/Container";
import { buttonVariants } from "@/components/ui/button";
import logoImg from "../assets/images/logo.png";
import { usePathname } from "next/navigation";
import { WalletSelector } from "./WalletConnector/WalletSelector";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";
import { checkAndCreateUser } from "@/lib/utils";

const MoonPayProvider = dynamic(() => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayProvider), {
  ssr: false,
});

const MoonPayBuyWidget = dynamic(() => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget), {
  ssr: false,
});

const Navbar = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const {connected, account}=useWallet();
  const [user, setUser] = useState();

  useEffect(() => {
    if (!account?.address) {
      setUser(undefined);
    }
    if (connected && account?.address) {
      checkAndCreateUser(account.address, setUser);
    }
  }, [connected, account?.address]);

  return (
    <>
      <MoonPayProvider apiKey="pk_test_ipsatS3brsLguHTjxgIAa2Y6a6RBqSm" debug>
        <header className="px-4 h-14 sticky top-0 inset-x-0 w-full bg-background/40 backdrop-blur-lg border-b border-border z-50">
          <Container reverse>
            <div className="flex items-center justify-between h-full mx-auto md:max-w-screen-xl">
              <div className="flex items-start">
                <Link href="/" className="flex items-center gap-2">
                  {/* <Icons.logo className="w-8 h-8" /> */}
                  <Image src={logoImg} alt="saas logo" className="w-9 h-9 relative" />
                  <span className="text-lg font-medium">AptoSaver</span>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                {pathname !== "/" ? (
                  <>
                    <nav className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <ul className="flex items-center justify-center gap-8">
                        <Link href="/app" className="hover:text-foreground/80 text-sm">
                          Deposit
                        </Link>
                        <Link href="withdraw" className="hover:text-foreground/80 text-sm">
                          Withdraw
                        </Link>
                        <Link href="/lucky-draw" className="hover:text-foreground/80 text-sm">
                          Lucky Draw
                        </Link>
                      </ul>
                    </nav>
                    <div className="items-center gap-6 hidden sm:flex">
                      <WalletSelector />
                      <MoonPayBuyWidget
                        variant="overlay"
                        baseCurrencyCode="usd"
                        baseCurrencyAmount="100"
                        defaultCurrencyCode="eth"
                        visible={visible}
                      />
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        onClick={() => setVisible(!visible)}
                      >
                        Buy
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <nav className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <ul className="flex items-center justify-center gap-8">
                        <Link href="#" className="hover:text-foreground/80 text-sm">
                          The Process
                        </Link>
                        <Link href="#" className="hover:text-foreground/80 text-sm">
                          Features
                        </Link>
                        <Link href="#" className="hover:text-foreground/80 text-sm">
                          FAQs
                        </Link>
                      </ul>
                    </nav>
                    <Link href="/app" className={buttonVariants({ size: "sm", className: "hidden md:flex" })}>
                      Launch App
                    </Link>
                  </>
                )}
              </div>
            </div>
          </Container>
        </header>
      </MoonPayProvider>
    </>
  );
};

export default Navbar;
