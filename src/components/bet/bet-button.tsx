"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { IBetType } from "@/types/bet";
import { BET_TYPE } from "@/const";

type BetButtonProps = {
  bet: IBetType;
  // selectedBet: IBetType | undefined;
  onClick: Dispatch<SetStateAction<IBetType | undefined>>;
};

export default function BetButton({
  bet,
  onClick,
}: BetButtonProps) {
  const betType = BET_TYPE.find(item => item.title === bet);

  return (
    <Button
      className="flex flex-col md:flex-row justify-around h-[78px] md:h-[90px] w-1/2 rounded-xl"
      variant={"outline"}
      onClick={() => onClick(bet)}
    >
      <span className="text-[8px] md:text-sm">Place bet</span>
      <span className="font-bold capitalize md:text-xl">{bet}</span>
      <span className="text-[8px] md:text-sm">
        ({betType?.range[0]}-{betType?.range[1]})
      </span>
    </Button>
  );
}
