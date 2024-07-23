"use client";

import { FC } from "react";
import { DiceResult } from "@/types/dice-result";
import Container from "../ui-custom/container";
import PayoutHistoryImage from "./image";
import { getResultText } from "@/lib/utils";
import Link from "next/link";
import { SOLANA_NETWORK } from "@/const";

export type IResultBet = {
  address: string;
  results: DiceResult[];
};

type PayoutHistoryItemProps = {
  result: IResultBet;
};

const PayoutHistoryItem: FC<PayoutHistoryItemProps> = ({ result }) => {
  const refLink = `https://explorer.solana.com/tx/${result.address}?cluster=${SOLANA_NETWORK}`;

  return (
    <Container className="flex justify-between items-center text-[12px] md:text-[16px] mt-[20px]">
      <span className="font-bold capitalize w-[60px] h-[23px] flex items-center">
        {getResultText(result.results)}
      </span>
      <PayoutHistoryImage results={result.results} />
      <Link
        href={refLink}
        className="text-[#C9C9C9] w-[150px] md:w-[240px] truncate"
        target="_blank"
      >
        TX: {result.address}
      </Link>
    </Container>
  );
};

export default PayoutHistoryItem;
