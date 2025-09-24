import EcosystemIcon from "../assets/icons/ecosystem.svg";
import { Feature } from "./Feature";

const features = [
  {
    title: "Maximize Your Earnings",
    description:
      "Deposit fiat and get a fixed interest.",
  },
  {
    title: "Daily Reward Management",
    description:
      "Enjoy daily rewards when luck favors you.",
  },
  {
    title: "Win Big Every Day",
    description:
      "Participate in our daily lotteries, where the longer you deposit, the higher your chances of winning additional rewards.",
  },
];

export const Features = () => {
  return (
    <div className="bg-black text-white py-[38px] sm:py-24">
      <div className="container">
        <h2 className="text-center font-bold text-5xl sm:text-6xl tracking-tighter">Powerful Features</h2>
        <div className="max-w-xl mx-auto">
          <p className="text-center mt-5 text-xl text-white/70">
            Experience the best of decentralized finance with our platform. From high-yield staking to daily rewards and exciting lotteries.
          </p>
        </div>
        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          {
            features.map((feature, index) => (
              <Feature key={index} title={feature.title} description={feature.description} />
            ))
          }
        </div>
      </div>
    </div>
  );
};