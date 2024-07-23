"use client";

import Footer from "@/components/Footer";
import Header from "@/components/header";
import LabelCustom from "@/components/ui-custom/label-custom";

export default function About() {
  const about = [
    {
      title: "Game Overview",
      content: `In this game, you place bets on whether the total sum of three dice rolls will be "Big" (11-17) or "Small" (4-10). If you win, you double your bet. But BEWARE, if the dice roll "Three of A Kind" (1-1-1, 2-2-2, 3-3-3, 4-4-4, 5-5-5 or 6-6-6), the house wins all. Here's what makes this game so exciting and unique.`,
    },
    {
      title: "Built on Solana:",
      content: `Enjoy lightning-fast transactions and low fees, thanks to Solana's high-performance blockchain.`,
    },
    {
      title: "Provably Fair with VRF:",
      content: `Our game uses VRF, verifiable random function, to generate truly random and verifiable dice rolls. The randomness is cryptographically secure, ensuring that no one can tamper with the results.`,
    },
    {
      title: "Simple and Rewarding:",
      content: `Place your bets on either "Big" or "Small" and double your wager if you guess correctly. If all three dice show the same number, it's considered "three of a kind," and the house takes all bets.`,
    },
    {
      title: "Transparency:",
      content: `Every roll is recorded on the blockchain, making the entire process transparent and verifiable by anyone. Click on the solana explorer transaction link under payout history section to find details for each roll.`,
    },
    {
      title: "Fairness:",
      content: `Using VRF ensures that the results are truly random and cannot be manipulated by any party, including the house.`,
    },
    {
      title: "Excitement:",
      content: `The anticipation of the roll and the possibility of doubling your bet makes every game thrilling.`,
    },
    {
      title: "Security:",
      content: `Built on Solana, our game leverages the robust security features of one of the most advanced blockchains available.`,
    },
    {
      title: "How to Play:",
      content: `Connect your wallet by clicking on Select Wallet button at the top. Choose the bet size and place your bet on "Big" or "Small". Confirm the transaction to send in your wager.`,
    },
    {
      title: "Wait for the Roll:",
      content: `Watch as the three dice spin and land on their numbers.`,
    },
    {
      title: "Win or Lose:",
      content: `If you guessed correctly, you double your bet! But beware, if the dice show three of a kind, the house takes all.`,
    },
  ];

  return (
    <div className="w-full max-w-5xl">
      <Header isShowSocial isStyled isShowGame />
      {about.map(({ title, content }, index) => (
        <div key={index} className="mt-[20px]">
          <div className={`text-[24px]`}>
            <LabelCustom>{title}</LabelCustom>
          </div>
          <div className="text-[14px] md:text-[20px] text-[#C2C2C2] mt-[4px]">{content}</div>
        </div>
      ))}
      <Footer className="static mt-12" />
    </div>
  );
}
