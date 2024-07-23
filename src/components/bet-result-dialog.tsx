"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import RollHistoryImage from "./payout-histories/image";
import { DiceResult } from "@/types/dice-result";
import Image from "next/image";
import svgClose from "@/assets/img/close.svg";
import { Dispatch, SetStateAction } from "react";
import { getResultText } from "@/lib/utils";

export interface BetResult {
  results: DiceResult[];
  value: number;
  isWin: boolean;
}

export function BetDialog({
  open,
  setOpen,
  result,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  result: BetResult | null;
}) {
  if (!result) {
    return null;
  }

  const { results, value, isWin } = result;

  return (
    <Dialog open={open}>
      <DialogContent
        className={` w-max ${
          isWin
            ? "bg-[#309816] border-[#309816]"
            : "bg-[#F6501B] border-[#F6501B]"
        } rounded-md select-none`}
        hideCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="text-[20px]">
          {isWin ? "Congratulations, you win" : "Sorry, you lose"}
        </DialogTitle>
        <div className="flex flex-col items-center">
          <div className="flex justify-around items-center rounded py-[10px] px-[20px] bg-white text-black gap-10">
            <span className="text-[12px]">Dice results</span>
            <span className="font-bold capitalize">
              {getResultText(results, false)}
            </span>
            <RollHistoryImage results={results} size={24} />
          </div>
          <div className="w-full flex items-center justify-between mt-2">
            <span>11:30 / 13.06</span>
            <span className="font-bold">
              {isWin ? "+ " : "- "}
              {value} Sol
            </span>
          </div>
        </div>
        <DialogClose asChild>
          <Image
            src={svgClose}
            alt="Close button"
            className="absolute bottom-[-30px] left-1/2 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
