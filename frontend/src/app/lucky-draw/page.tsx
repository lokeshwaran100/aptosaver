"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import ClaimRewardsDialog from "@/components/ClaimDeposit";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnimatedModalDemo } from "@/components/Popup";
import { Modal } from "@/components/ui/animated-modal";
import React from 'react';
import { Box, Heading, Text, Divider, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

interface UserData {
  name: string;
  email: string;
  address: string;
  totalDeposits: number;
  depositTimestamp: string;
  rewardsWon: number;
  rewardsClaimable: number;
  wonToday: boolean;
}

const LuckyDrawPage = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const { account, connected } = useWallet();
  const [isUserWon, setIsUserWon] = useState(false);
  const [cardScratched, setCardScratched] = useState(true);

  // useEffect(() => {
  //   async function connect() {
  //     const res = await axios.get("/api/connect");
  //     console.log(res);
  //   }

  //   connect();
  // }, []);

  useEffect(() => {
    // if (!account?.address || !triggerAPI) return;

    async function fetchData() {
      const response = await axios.get("/api/user", {
        params: { getAllAddresses: "true" },
      });

      if (response.status === 200) {
        const response = await axios.get("/api/user", {
          params: { getAllData: "true" },
        });
        console.log(response.data);
        //@ts-ignore
        const filteredData = response.data
          .filter(({ wonToday }: { wonToday: boolean }) => wonToday)
          .map(({ _id, id, __v, ...rest }: any) => rest);
        setUserData(filteredData);
      } else {
        throw new Error("Failed to fetch user rewards");
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!account?.address) return;
    console.log(account?.address);
    async function checkIfWinner() {
      const response = await axios.get("/api/user", {
        params: { address: account?.address },
      });
      console.log("user data fetch", response);
      setIsUserWon(response.data.wonToday);
      setCardScratched(response.data.cardScratched);
    }

    checkIfWinner();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-background/40 text-white px-28 pb-28 pt-16">
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Your Lottery Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">5 USD</div>
            </CardContent>
          </Card>
          <Card className="bg-secondary text-secondary-foreground">
            <CardHeader>
              <CardTitle>Total Rewards Distributed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">20 USD</div>
            </CardContent>
          </Card>
          <Card className="bg-muted text-muted-foreground">
            <CardHeader>
              <CardTitle>Total Lotteries Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">5</div>
            </CardContent>
          </Card>
        </div> */}

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} p={6} bg="black">
          <AnimatedCard number="0 USD" title="Lottery Rewards Won" />
          <AnimatedCard number="0 USD" title="Total Rewards Distributed" />
          <AnimatedCard number="0" title="Number of Lotteries" />
        </SimpleGrid>

        <Table className="mt-9">
            <TableCaption>Lotteries Destributed</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Address</TableHead>
              {/* <TableHead>Name</TableHead> */}
              {/* <TableHead>Method</TableHead> */}
              <TableHead className="text-right">Rewards Won</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData.map((data) => (
              <TableRow key={data.address}>
                <TableCell className="font-medium">{data.address}</TableCell>
                {/* <TableCell>{data.name}</TableCell> */}
                {/* <TableCell>{invoice.paymentMethod}</TableCell> */}
                <TableCell className="text-right">{data.rewardsWon}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
        </Table>
        {
          !cardScratched && (<Modal>
            <AnimatedModalDemo isUserWon={isUserWon} />
          </Modal>)
        }
      </div>
    </>
  );
};

const AnimatedCard = ({ number, title }: { number: string, title: string }) => {
  const cardBg = useColorModeValue('gray.800', 'blackAlpha.900');
  const cardBorderColor = useColorModeValue('gray.700', 'blue.500'); // Glow color
  const headingColor = useColorModeValue('gray.200', 'white');
  const textColor = useColorModeValue('gray.400', 'gray.500');

  return (
    <MotionBox
    cursor={"pointer"}
      p={6}
      bg={cardBg}
      borderRadius="md"
      boxShadow="lg"
      border="1px solid #0062FF"
      borderColor={"#0062FF"}
      transition={{ duration: 0.3 }}
    >
      <Heading size="md" fontSize={"1xl"} mb={2} color={headingColor}>
        {title}
      </Heading>
      <Divider borderColor="gray.600" />
      <Text fontSize="3xl" fontWeight="bold" color={headingColor} mb={4}>
        {number}
      </Text>
    </MotionBox>
  );
};

export default LuckyDrawPage;
// import React from 'react'

// const page = () => {
//   return (
//     <div className=' h-screen flex items-center justify-center text-5xl font-semibold'>
//       <span className="bg-[linear-gradient(to_right,#F87AFF,#FB93D0,#FFDD99,#C3F0B2)] text-transparent bg-clip-text [-webkit-background-clip:text]">Coming Soon</span>
//     </div>
//   )
// }

// export default page
