"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  aptosPriceInUsd,
  cellTokenPrice,
  swapCellToApt,
  swapWUsdcToApt,
  swapZUsdcToApt,
  unstakeWusdcZusdcPair,
  withdraw,
  wUsdcToAptAmount,
  zUsdcToAptAmount,
} from "@/lib/apiRequests";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Stepper, Step, useSteps } from "@chakra-ui/react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Divider,
  Input,
  Button,
  useColorModeValue,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
} from "@chakra-ui/react";
import { useState } from "react";
import { deposit, getQuotePrice, stakeWusdcZusdcPair, swapAptToWUsdc, swapAptToZUsdc } from "@/lib/apiRequests";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Page = () => {
  const { account, signTransaction } = useWallet();
  const [amount, setAmount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [APTprice, setAPTprice] = useState(0);

  const steps = [
    { title: "Withdraw", description: "Withdrawing " + (amount ? amount : "0") + " USD worth of APT" },
    { title: "Unstake Liquidity", description: "Unstaking liquidity and rewards from Cellana Finance" },
    { title: "Swap", description: "Swapping Stable coins to APT on Panora Swap" },
    { title: "Withdrawn", description: (amount ? amount : "0") + " USD worth of APT withdrawn successfully" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const stepTitleColor = useColorModeValue("gray.300", "white");
  const stepDescriptionColor = useColorModeValue("gray.400", "gray.500");

  const cardBg = useColorModeValue("gray.800", "blackAlpha.900"); // Match black background
  const inputBg = useColorModeValue("gray.700", "blackAlpha.700");

  const handleConfirm = async () => {
    try {
      setLoading(true);
      console.log(`Withdrawing ${amount} USDT`);

      const withdrawResponse = await withdraw(account, BigInt(amount * 100000), signTransaction);
      console.log("withdrawResponse", withdrawResponse);
      setActiveStep(1);

      // const fromTokenAmount = (aptosAmount / 2).toFixed(4).toString();
      // const lpToken = BigInt(0.5 * 100000);
      const lpToken = BigInt(amount * 100000);
      const unstakeResponse = await unstakeWusdcZusdcPair(lpToken);
      console.log("unstakeResponse", unstakeResponse);

      // const fromTokenAmount = "0.01";
      const fromTokenAmount = ((amount / 2) * 0.9).toString();
      const wUsdcSwapResponse = await swapWUsdcToApt(fromTokenAmount);
      console.log("wUsdcSwapResponseresponse", wUsdcSwapResponse);
      const zUsdcSwapResponse = await swapZUsdcToApt(fromTokenAmount);
      console.log("zUsdcSwapResponse", zUsdcSwapResponse);
      setActiveStep(2);

      let totalApt = 0;
      totalApt = totalApt + (await wUsdcToAptAmount(fromTokenAmount));
      totalApt = totalApt + (await zUsdcToAptAmount(fromTokenAmount));

      const userEndPointResponse = await axios.get("/api/user?address=" + account?.address);
      console.log("userEndPointResponse", userEndPointResponse);
      const depositAmount = userEndPointResponse.data.totalDeposits;

      const totalDepositsTenPercentage = depositAmount * 0.1;
      const totalDepositsTenPercentagePerDay = totalDepositsTenPercentage / 365;
      const duration = 1;
      const rewards = totalDepositsTenPercentagePerDay * duration;

      if (rewards > 0) {
        const rewardwUsdcSwapResponse = await swapWUsdcToApt(rewards.toString());
        console.log("rewardwUsdcSwapResponse", rewardwUsdcSwapResponse);
        totalApt = totalApt + (await wUsdcToAptAmount(rewards));
        console.log("totalApt", totalApt);
      }
      setActiveStep(3);

      const depositEndPointResponse = await axios.post("/api/deposit", {
        address: account?.address,
        totalDeposits: depositAmount - amount,
        depositTimestamp: new Date(),
      });
      console.log("depositEndPointResponse", depositEndPointResponse);
      setActiveStep(4);
      toast({
        variant: "default",
        title: "Success!",
        description: "Your Funds withdrawn successfully",
      });
    } catch (ex: any) {
      // Handle the withdrawal logic here
      console.log("There is an Error", ex.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an internal server error please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    async function fetchData() {
      setAPTprice(await aptosPriceInUsd());
    }

    fetchData();
  }, []);

  return (
    <Flex justify={"center"} align={"center"} gap={"20"}>
      <Flex justify="center" align="center" minHeight="100vh" bg="black">
        <MotionBox
          p={6}
          borderRadius="md"
          w="full"
          maxW="500px" // Increased width to make the stepper bigger
          boxShadow="xl"
          transition={{ duration: 0.3 }}
        >
          <Stepper
            index={activeStep}
            orientation="vertical"
            height="500px" // Increased height to make it taller
            gap="4"
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon color="teal.300" />} // Adjust icon color for dark theme
                    incomplete={<StepNumber style={{ color: stepTitleColor }} />}
                    active={<StepNumber style={{ color: stepDescriptionColor }} />}
                  />
                </StepIndicator>

                <MotionBox
                  flexShrink="0"
                  initial={{ opacity: 0, x: -50 }} // Animation effect for step titles and descriptions
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <StepTitle style={{ fontSize: "lg", color: stepTitleColor }}>{step.title}</StepTitle>
                  <StepDescription style={{ fontSize: "lg", color: stepDescriptionColor }}>
                    {step.description}
                  </StepDescription>
                </MotionBox>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        </MotionBox>
      </Flex>
      <Flex justify="center" align="center" minHeight="100vh" bg="black">
        <Box
          maxW="500px"
          maxH={"1000px"}
          h={"full"}
          w="full"
          paddingX={"4"}
          paddingTop={"10"}
          paddingBottom={"6"}
          bg={cardBg}
          borderRadius="lg"
          boxShadow="lg"
          border="1px"
          borderColor="gray.600"
        >
          <Heading size="lg" mb={4} color="white">
            Withdraw
          </Heading>
          <Text fontSize="md" color="gray.400" mb={4}>
            Withdraw deposited amount along with the daily yield in APT
          </Text>

          <Divider borderColor="gray.600" mb={4} />

          <Box m={"5"}>
            <Text fontSize="md" color="gray.400" mb={2}>
              Amount to Withdraw (in USD):
            </Text>
            <div className="relative">
              <Input
                type="number"
                bg={inputBg}
                color="white"
                mb={4}
                height={"10"}
                focusBorderColor="blue.600"
                borderColor="gray.600"
                placeholder="Enter deposit amount"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
              <span className="absolute inset-y-0 right-1 w-30 z-10 text-gray-400 pt-2">
                {isNaN(parseFloat((amount / APTprice).toFixed(3))) ? 0 : parseFloat((amount / APTprice).toFixed(3))} APT
              </span>
            </div>
            <div className=" flex w-full items-center py-4">
              {isLoading ? (
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 w-full text-white px-4 py-3 rounded-md"
                  disabled
                >
                  <div role="status" className="mr-2">
                    <svg
                      aria-hidden="true"
                      className="inline w-4 h-4 text-gray-200 animate-spin dark:text-blue-400 fill-blue-50"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>{" "}
                  Processing...
                </Button>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-full text-white px-4 py-3 rounded-md"
                  variant="default"
                  onClick={handleConfirm}
                >
                  Withdraw
                </Button>
              )}
            </div>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Page;
