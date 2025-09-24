"use client";
import React, { useEffect } from "react";
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
import {
  aptosPriceInUsd,
  deposit,
  getQuotePrice,
  stakeWusdcZusdcPair,
  swapAptToWUsdc,
  swapAptToZUsdc,
} from "@/lib/apiRequests";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useSteps } from "@chakra-ui/react";
import { Stepper, Step } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Page = () => {
  const { account, signTransaction } = useWallet();
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [APTprice, setAPTprice] = useState(0);

  // Using Chakra's color mode to adjust colors for dark theme
  const stepTitleColor = useColorModeValue("gray.300", "white");
  const stepDescriptionColor = useColorModeValue("gray.400", "gray.500");

  const cardBg = useColorModeValue("gray.800", "blackAlpha.900"); // Match black background
  const inputBg = useColorModeValue("gray.700", "blackAlpha.700");

  const handleConfirm = async () => {
    try {
      setLoading(true);

      // Validate amount before proceeding
      if (!amount || amount <= 0 || !isFinite(amount)) {
        console.error("Invalid deposit amount:", amount);
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid deposit amount greater than 0",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log(`Depositing ${amount} USD`);
      
      // Get Aptos price with error handling and fallback
      let aptosPrice;
      try {
        aptosPrice = await aptosPriceInUsd();
        // If price is 0, null, undefined, or not a valid number, use fallback
        if (!aptosPrice || aptosPrice <= 0 || !isFinite(aptosPrice)) {
          throw new Error("Invalid price returned");
        }
      } catch (error) {
        console.warn("Failed to get Aptos price from Panora, using fallback price:", error);
        // Fallback to approximate Aptos price (update this periodically with current market price)
        aptosPrice = 10.0; // Approximate APT price in USD - update this as needed
      }
      
      const aptosAmount = amount / aptosPrice;
      console.log(`Depositing ${aptosAmount} APTOS (at $${aptosPrice} per APT)`);

      const depositReponse = await deposit(account, BigInt(amount * 100000), signTransaction);
      console.log("depositReponse", depositReponse);
      setActiveStep(1);

      // const fromTokenAmount = "0.001";
      const fromTokenAmount = (aptosAmount / 2).toFixed(4).toString();
      const wUsdcSwapResponse = await swapAptToWUsdc(fromTokenAmount);
      console.log("wUsdcSwapResponseresponse", wUsdcSwapResponse);
      const zUsdcSwapResponse = await swapAptToZUsdc(fromTokenAmount);
      console.log("zUsdcSwapResponse", zUsdcSwapResponse);
      setActiveStep(2);

      // const wUSDC = BigInt(0.9 * 100000);
      const wUSDC = BigInt((amount / 2) * 0.95 * 100000);
      const zUSDC = await getQuotePrice(wUSDC);
      const stakeResponse = await stakeWusdcZusdcPair(wUSDC, zUSDC);
      console.log("stakeResponse", stakeResponse);
      setActiveStep(3);

      // const depositReponse = await deposit(account, BigInt(amount * 100000), signTransaction);
      // console.log("depositReponse", depositReponse);

      const userEndPointResponse = await axios.get("/api/user?address=" + account?.address);
      console.log("userEndPointResponse", userEndPointResponse);
      const depositAmount = userEndPointResponse.data.totalDeposits;

      const depositEndPointResponse = await axios.post("/api/deposit", {
        address: account?.address,
        totalDeposits: depositAmount + amount,
        depositTimestamp: new Date(),
      });
      console.log("depositEndPointResponse", depositEndPointResponse);
      setActiveStep(4);
      setAmount(0);

      toast({
        variant: "default",
        title: "Success!",
        description: "Your Funds are deposited successfully",
      });
      setLoading(false);
      setOpen(false);
    } catch (ex: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: ex.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      console.log("there was an error", ex);
    }
    setLoading(false);
    setOpen(false);
  };

  const steps = [
    { title: "Deposit", description: "Depositing " + (amount ? amount : "0") + " USD worth of APT" },
    { title: "Swap", description: "Swapping APT to Stable coins(s) on Panora Swap" },
    { title: "Stake Liquidity", description: "Staking liquidity on Cellana Finance" },
    { title: "Deposited", description: (amount ? amount : "0") + " USD worth of APT deposited successfully" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const price = await aptosPriceInUsd();
        setAPTprice(price);
      } catch (error) {
        console.warn("Failed to fetch APT price, using fallback:", error);
        setAPTprice(10.0); // Fallback price
      }
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
                    active={<StepNumber style={{ color: stepTitleColor }} />}
                  />
                </StepIndicator>

                <MotionBox
                  flexShrink="0"
                  initial={{ opacity: 0, x: -50 }} // Animation effect for step titles and descriptions
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <StepTitle style={{ fontSize: "lg", color: stepTitleColor }}>{step.title}</StepTitle>
                  <StepDescription style={{ fontSize: "sm", color: stepDescriptionColor }}>
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
            Deposit
          </Heading>
          <Text fontSize="md" color="gray.400" mb={4}>
            Deposit APT to earn fixed APY without any lock-in period!
          </Text>

          <Divider borderColor="gray.600" mb={4} />

          <Box m={"5"}>
            <Text fontSize="md" color="gray.400" mb={2}>
              Amount to Deposit (in USD):
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
                  Deposit
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
