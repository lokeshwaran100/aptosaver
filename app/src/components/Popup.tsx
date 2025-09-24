"use client";
import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger, useModal } from "@/components/ui/animated-modal";
import confetti from "canvas-confetti";
import Link from "next/link";
import { Box } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import axios from "axios";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { claimLottery, getLotteryAmount, swapWUsdcToApt } from "@/lib/apiRequests";

export function AnimatedModalDemo({isUserWon}:{isUserWon: Boolean}) {
  const { account, signTransaction } = useWallet();
  const { setOpen, open } = useModal();
  const [revealed, setRevealed] = useState(false);

  const handleClick = () => {
    const end = Date.now() + 3 * 1000;

    const frame = () => {
      if (Date.now() > end) return;

      requestAnimationFrame(frame);
    };

    frame();
  };

  const handleRevealed= async ()=>{
    setRevealed(true);
      if(isUserWon)
      {
        const end = Date.now() + 1 * 1000; // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
     
        const frame = () => {
          if (Date.now() > end) return;
     
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            startVelocity: 60,
            origin: { x: 0, y: 0.5 },
            colors: colors,
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            startVelocity: 60,
            origin: { x: 1, y: 0.5 },
            colors: colors,
          });
     
          requestAnimationFrame(frame);
        };
     
        frame();
      }
    const response = await axios.put("/api/user", {
      params: { address: account?.address, cardScratched: true },
    });    
    console.log("card scratched", response);
  }

  useEffect(() => {
    // if (!open) return;
    handleClick();
    setOpen(true);
  }, []);

  const onClaim = async() => {
    try {
      // Handle the reward claim logic here

      const lotteryAmountInUsd = await getLotteryAmount();
      console.log("lotteryAmountInUsd", lotteryAmountInUsd)

      const claimResponse = await claimLottery(account, signTransaction);
      console.log("claimResponse", claimResponse);

      // console.log("lotteryAmountInUsd", lotteryAmountInUsd)
      const wUsdcSwapResponse = await swapWUsdcToApt((parseInt(lotteryAmountInUsd as string) / 1e6).toString());
      console.log("wUsdcSwapResponseresponse", wUsdcSwapResponse);

      toast({
        variant: "default",
        title: "Sucess!",
        description: "Lottery rewards are claimed successfully",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    catch (ex: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: ex.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      console.log("there was an error", ex.message);
    }
  }

  const images = [
    "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return (
    <>
      <div className="py-40  flex items-center justify-center min-h-full">
        <ModalBody className="bg-gray-900 dark:border-white h-2/4">
            {
              revealed?(isUserWon?(
                <ModalContent className="text-white h-full">
                <p className="text-4xl font-semibold text-center mb-8 bg-[linear-gradient(to_right,#F87AFF,#FB93D0,#FFDD99,#C3F0B2)] text-transparent bg-clip-text [-webkit-background-clip:text]">
                  Hoorah! You won the lottery today!
                </p>
                <div className="flex justify-center items-center h-full text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  $1.33 USD
                </div>
                <button 
                className="mx-auto rounded-full border-2 border-gray-300 py-3 px-5 hover:bg-slate-200 text-xl bg-[linear-gradient(to_right,#F87AFF,#FB93D0,#FFDD99,#C3F0B2)] text-transparent bg-clip-text [-webkit-background-clip:text]"
                onClick={onClaim}
                >
                  Claim
                  </button>
              </ModalContent>
              ):(<ModalContent className="text-white h-full">
                <p className="text-4xl font-bold text-center mb-8 text-gray-400">
                Sorry Better Luck Next Time
              </p>
              </ModalContent>)):(
                <div onClick={()=>handleRevealed()}>
                <ModalContent className=" border-black text-black cursor-pointer" >
                <div>
                    <div className="flex justify-center items-center h-full text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    Reveal
                </div>
                </div>
                </ModalContent>
                </div>
              )
            }

            {/* <div className="py-10 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto">
                <div className="flex  items-center justify-center">
                  <PlaneIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                  <span className="text-neutral-700 dark:text-neutral-300 text-sm">5 connecting flights</span>
                </div>
                <div className="flex items-center justify-center">
                  <ElevatorIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                  <span className="text-neutral-700 dark:text-neutral-300 text-sm">12 hotels</span>
                </div>
                <div className="flex items-center justify-center">
                  <VacationIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                  <span className="text-neutral-700 dark:text-neutral-300 text-sm">69 visiting spots</span>
                </div>
                <div className="flex  items-center justify-center">
                  <FoodIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                  <span className="text-neutral-700 dark:text-neutral-300 text-sm">Good food everyday</span>
                </div>
                <div className="flex items-center justify-center">
                  <MicIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                  <span className="text-neutral-700 dark:text-neutral-300 text-sm">Open Mic</span>
                </div>
                <div className="flex items-center justify-center">
                  <ParachuteIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                  <span className="text-neutral-700 dark:text-neutral-300 text-sm">Paragliding</span>
                </div>
              </div> */}
        </ModalBody>
      </div>
    </>
  );
}
