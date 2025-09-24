"use client"
import React from 'react';
import {
    Box, 
    Flex, 
    Text,
    Heading, 
    Button, 
    Avatar, 
    Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td
} from '@chakra-ui/react';

const ProfilePage = () => {
    // Dummy data for demonstration purposes
    const profileData = {
        name: "Aptos User",
        email: "aptosuser@gmail.com",
        address: "0x3d0a...cd9b",
        walletBalance: "100 APT",
        totalDeposits: "1000 USD",
        apy: "10%",
        rewardsEarned: "50 USD",
        totalLotteryRewards: "5 USD",
        history: [
            { date: "2024-08-01", amount: "100 USD", action: "Deposit" },
            { date: "2024-08-02", amount: "50 USD", action: "Withdraw" },
            { date: "2024-08-02", amount: "50 USD", action: "Withdraw" },
            { date: "2024-08-01", amount: "100 USD", action: "Deposit" },
            { date: "2024-08-01", amount: "100 USD", action: "Deposit" },
            { date: "2024-08-02", amount: "50 USD", action: "Withdraw" },
            { date: "2024-08-21", amount: "100 USD", action: "Deposit" },
        ]
    };

    return (
        <Flex direction="column" align="center" p={6} bg="black">
            {/* Profile and Stats Cards */}
            <Flex w="full" maxW="1200px" justify="space-between" mb={8}>
                {/* Profile Card */}
                <Box
                    w="48%"
                    p={6}
                    bg="gray.800"
                    borderRadius="lg"
                    boxShadow="lg"
                    display="flex"
                    alignItems="center"
                >
                    <Avatar size="xl" name={profileData.name} src="/path-to-image.jpg" mr={6} />
                    <Box>
                        <Heading size="md" color="white">{profileData.name}</Heading>
                        <Text color="gray.400">{profileData.email}</Text>
                        <Text color="gray.400">{profileData.address}</Text>
                        <Text color="white" fontSize="lg" mt={2}>Balance: {profileData.walletBalance}</Text>
                    </Box>
                </Box>

                {/* Stats Card */}
                <Box
                    w="48%"
                    p={6}
                    bg="gray.800"
                    borderRadius="lg"
                    boxShadow="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Box>
                        <Heading size="lg" color="white">{profileData.totalDeposits}</Heading>
                        <Text color="gray.400">Total Deposits</Text>
                    </Box>
                    <Button className="bg-blue-600 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        {profileData.apy} APY
                    </Button>
                    <Box textAlign="right">
                        <Text color="white" fontSize="lg">{profileData.rewardsEarned}</Text>
                        <Text color="gray.400">Rewards Earned</Text>
                        <Text color="white" fontSize="lg">{profileData.totalLotteryRewards}</Text>
                        <Text color="gray.400">Lottery Rewards Won</Text>
                    </Box>
                </Box>
            </Flex>

            {/* History Table */}
            <Box w="full" maxW="1200px" bg="gray.800" borderRadius="lg" boxShadow="lg" p={6}>
                <Heading size="md" color="white" mb={4}>Transaction History</Heading>
                <Table variant="simple" colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th color="gray.400">Date</Th>
                            <Th color="gray.400">Amount</Th>
                            <Th color="gray.400">Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {profileData.history.map((item, index) => (
                            <Tr key={index}>
                                <Td color="white">{item.date}</Td>
                                <Td color="white">{item.amount}</Td>
                                <Td color="white">
                                <Text color={item.action == "Deposit" ? "green.400":"red.500"}>{item.action}</Text>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Flex>
    );
}

export default ProfilePage;
