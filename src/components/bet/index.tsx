import { memo, useCallback, useState } from "react";
import { IBetType } from "@/types/bet";
import PriceBet from "./bet-price";
import BetButton from "./bet-button";
import { BET_BIG, BET_SMALL, GAME_STATUS } from "@/const";
import LabelCustom from "../ui-custom/label-custom";
import { IBetHistory } from "../bet-history";
import { useWallet } from "@solana/wallet-adapter-react";
import { IGameStatus } from "@/types/game-status";

function Bet({
  gameStatus,
  bet,
  showConnectWalletNotification,
}: {
  gameStatus: IGameStatus;
  bet: (betData: IBetHistory) => void;
  showConnectWalletNotification: () => void;
}) {
  const { publicKey } = useWallet();
  const [selectedPrice, setSelectedPrice] = useState<number>(0.2);

  const handleBet = useCallback(
    (typeBet: IBetType) => () => {
      if (publicKey) {
        bet({
          amount: selectedPrice,
          type: typeBet,
          address: publicKey.toBase58(),
        });
      } else {
        showConnectWalletNotification();
      }
    },
    [bet, publicKey, selectedPrice]
  );

  return (
    <div className="relative">
      <div className="flex flex-col gap-[20px]">
        <div className="flex justify-between items-center gap-2 md:gap-10">
          <PriceBet
            price={0.2}
            selectedPrice={selectedPrice}
            onClick={setSelectedPrice}
          />
          <PriceBet
            price={0.4}
            selectedPrice={selectedPrice}
            onClick={setSelectedPrice}
          />
          <PriceBet
            price={0.6}
            selectedPrice={selectedPrice}
            onClick={setSelectedPrice}
          />
          <PriceBet
            price={0.8}
            selectedPrice={selectedPrice}
            onClick={setSelectedPrice}
          />
          <PriceBet
            price={1.0}
            selectedPrice={selectedPrice}
            onClick={setSelectedPrice}
          />
        </div>
        <div className="flex justify-around items-center gap-[20px]">
          <BetButton bet={BET_SMALL} onClick={handleBet(BET_SMALL)} />
          <BetButton bet={BET_BIG} onClick={handleBet(BET_BIG)} />
        </div>
      </div>
      {gameStatus === GAME_STATUS.ROLLING && (
        <div className="absolute w-full h-full flex justify-center items-center bg-[#0B0B1F]/80 top-0 font-bold text-[32px]">
          <LabelCustom className="max-w-[200px] text-center">
            Rolling...
          </LabelCustom>
        </div>
      )}
      {gameStatus === GAME_STATUS.BET_CLOSED && (
        <div className="absolute w-full h-full flex justify-center items-center bg-[#0B0B1F]/80 top-0 font-bold text-[32px]">
          <LabelCustom className="max-w-[400px] text-center">
            Bets Closed
          </LabelCustom>
        </div>
      )}
      {gameStatus === GAME_STATUS.READY && (
        <div className="absolute w-full h-full flex justify-center items-center bg-[#0B0B1F]/80 top-0 font-bold text-[32px]">
          <LabelCustom className="max-w-[500px] text-center">
            <div>Initializing...</div>
            <div>Please Wait</div>
          </LabelCustom>
        </div>
      )}
      {gameStatus === GAME_STATUS.RESULT_THREE_OF_A_KIND && (
        <div className="absolute w-full h-full flex justify-center items-center bg-[#0B0B1F]/80 top-0 font-bold text-[32px]">
          <LabelCustom className="max-w-[400px] text-center">
            Three Of A Kind
          </LabelCustom>
        </div>
      )}
      {gameStatus === GAME_STATUS.RESULT_BIG_WINS && (
        <div className="absolute w-full h-full flex justify-center items-center bg-[#0B0B1F]/80 top-0 font-bold text-[32px]">
          <LabelCustom className="max-w-[400px] text-center">
            Big Wins
          </LabelCustom>
        </div>
      )}
      {gameStatus === GAME_STATUS.RESULT_SMALL_WINS && (
        <div className="absolute w-full h-full flex justify-center items-center bg-[#0B0B1F]/80 top-0 font-bold text-[32px]">
          <LabelCustom className="max-w-[400px] text-center">
            Small Wins
          </LabelCustom>
        </div>
      )}
      {gameStatus === GAME_STATUS.LOADING && (
        <div className="absolute w-full h-full flex justify-center items-center bg-[#0B0B1F]/80 top-0 font-bold text-[32px]">
          <LabelCustom className="max-w-[400px] text-center">
            Loading...
          </LabelCustom>
        </div>
      )}
      {/* <WalletDialog open={open} setOpen={setOpen} /> */}
    </div>
  );
}

export default memo(Bet);
