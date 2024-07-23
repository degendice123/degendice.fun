"use client";

import Footer from "@/components/Footer";
import Header from "@/components/header";
import LabelCustom from "@/components/ui-custom/label-custom";
import { TimelineElement, TimelineLayout } from "@/components/ui/timeline/timeline-layout";

const timelineData: TimelineElement[] = [
  {
    id: 1,
    title: "Q2: First Ideation of the project",
    date: "2024",
    description: "Building the core team + investors. Building the first decentralized, on-chain, verifiable gamblefi project on solana. Launch of initial proof of concept product in form of the game BIG & SMALL. Website launch",
  },
  {
    id: 2,
    title: "Q3: DEGEN token generation event/pump.fun launch",
    date: "2024",
    description: " Marketing P1 - gathering KOL resources and promotion. Dexscanner prepayment.",
  },
  {
    id: 3,
    title: "Q3: Launch in pump.fun",
    date: "2024",
    description: "Dev hold 30%. Allocation as follows: Dev wallet 3%, Team 7%, Marketing 10%, Casino OPEX capital 10%",
  },
  {
    id: 4,
    title: "Q3: This is a long term project",
    date: "2024",
    description: "Dex paid at king of hill. Dex trending ads will be paid. Will burn 10milion supply at Raydium launch. Also paying for asia ads and select influencers/KOLs (before launch).",
  },
  {
    id: 5,
    title: "Q4: Expansion of further fully on-chain trackable gambling games",
    date: "2024",
    description: "Introducing Roulette/Baccarat. CMC listing/CEX listing. Approach VCs for further funding and project expansion",
  },
  {
    id: 6,
    title: "Q1: TBC",
    date: "2025",
    description: "TBC",
  },
];

export default function Roadmap() {
  return (
    <div className="w-full max-w-5xl">
      <Header isShowSocial isStyled isShowGame />
      <div className="flex flex-col items-center justify-center mt-4">
        <LabelCustom classNameContainer="mt-4 text-[32px]">
          Company Roadmap
        </LabelCustom>
        <TimelineLayout items={timelineData} />
      </div>
      <Footer className="static landscape:[@media(hover:none)]:static mt-6" />
    </div>
  );
}
