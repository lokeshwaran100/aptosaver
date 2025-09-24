import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { claimLottery, claimRewards, getLotteryAmount, swapWUsdcToApt } from "@/lib/apiRequests";
import { ToastAction } from "./ui/toast";
import { toast } from "./ui/use-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

function ClaimRewardsDialog({ totalClaim }: { totalClaim: string }) {
  const { account, signTransaction } = useWallet();

  const [isClaimed, setIsClaimed] = useState(false);

  const handleConfirm = async () => {
    try {
      // Handle the reward claim logic here
      console.log(`Claiming ${totalClaim} USDT`);

      const lotteryAmountInUsd = await getLotteryAmount();
      console.log("lotteryAmountInUsd", lotteryAmountInUsd)

      const claimResponse = await claimLottery(account, signTransaction);
      console.log("claimResponse", claimResponse);

      const wUsdcSwapResponse = await swapWUsdcToApt(lotteryAmountInUsd as string);
      console.log("wUsdcSwapResponseresponse", wUsdcSwapResponse);

      toast({
        variant: "default",
        title: "Sucess!",
        description: "Lottery rewards are claimed successfully",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setIsClaimed(true);
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
    // Update state to indicate that the reward has been claimed
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
          {isClaimed ? "Claimed" : "Claim Rewards"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Claim Lottery Rewards</DialogTitle>
        <DialogDescription>
          You have won a total of {totalClaim} USDT in the lottery. Click Confirm to claim your rewards.
        </DialogDescription>
        <div className="mt-4 flex justify-end">
          <Button variant="default" onClick={handleConfirm} disabled={isClaimed}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ClaimRewardsDialog;
