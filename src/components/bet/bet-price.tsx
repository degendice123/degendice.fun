"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

type PriceBetProps = {
    price: number;
    selectedPrice: number;
    onClick: Dispatch<SetStateAction<number>>;
}

export default function PriceBet({ price, selectedPrice, onClick }: PriceBetProps) {
    return (
      <Button
        variant={selectedPrice === price ? "default" : "outline"}
        onClick={() => onClick(price)}
        className="grow text-[10px] font-bold md:text-base h-[32px] md:h-[46px] px-[auto]"
      >
        {price.toFixed(1)} Sol
      </Button>
    );
}
