"use client";

import Image from "next/image";
import upSvg from "@/assets/img/up.svg";
import downSvg from "@/assets/img/down.svg";
import noDataSvg from "@/assets/img/no-data.svg";
import solanaSvg from "@/assets/img/solana.svg";
import { IBetType } from "@/types/bet";
import { BET_BIG } from "@/const";

export type IBetHistoryProps = {
  typeBet: IBetType;
  betHistories: IBetHistory[];
};

export interface IBetHistory {
  address: string;
  amount: number;
  type: IBetType;
}

export default function BetHistory({
  typeBet,
  betHistories,
}: IBetHistoryProps) {
  const dataBets = betHistories.filter((bet) => bet.type === typeBet);
  const total = dataBets.reduce((total, bet) => total + bet.amount, 0);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <span className="font-bold capitalize">{typeBet}</span>
          <Image
            src={typeBet === BET_BIG ? upSvg : downSvg}
            alt="up icon"
            width={8}
          />
        </div>
        <div>
          <span className="text-[8px] md:text-sm">Total:</span>
          <span className="text-[12px] md:text-base font-bold ml-3">
            {total.toFixed(3)} Sol
          </span>
        </div>
      </div>

      {dataBets.length <= 0 ? (
        <div className="w-full h-[100px] md:h-[150px] flex flex-col justify-center items-center">
          <Image
            src={noDataSvg}
            alt="No data"
            width={22}
            className="md:w-[30px]"
          />
          <span className="text-[12px] md:text-[16px] mt-1">No bets yet</span>
        </div>
      ) : (
        <div className="w-full min-h-[100px] md:min-h-[150px]">
          {dataBets.map((bet, index) => (
            <div className="flex justify-between w-full mt-[10px]" key={index}>
              <span className="w-1/4 truncate text-[12px] md:text-[16px]">
                {bet.address}
              </span>
              <div className="flex items-center justify-between">
                <Image src={solanaSvg} alt="up icon" width={15} />
                <span className="text-[12px] md:text-[16px] w-[60px] md:w-[80px] text-end">
                  {bet.amount.toFixed(3)} Sol
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
