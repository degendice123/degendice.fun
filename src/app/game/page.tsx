"use client";

import { useEffect, useState, useRef } from "react";
import bs58 from "bs58";
import { BN } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";

import BetHistory, { IBetHistory } from "@/components/bet-history";
import Dice from "@/components/dice";
import Header from "@/components/header";
import WalletSelection from "@/components/wallet-selection";
import Container from "@/components/ui-custom/container";
import PayoutHistories from "@/components/payout-histories";
import Bet from "@/components/bet";
import Timer from "@/components/timer/timer";
import LabelCustom from "@/components/ui-custom/label-custom";
import { BetDialog, BetResult } from "@/components/bet-result-dialog";
import { IResultBet } from "@/components/payout-histories/item";

import { BET_BIG, BET_SMALL, GAME_STATUS } from "@/const";
import { IGameStatus } from "@/types/game-status";
import { SolanaProvider } from "@/provider/solana";
import { SWRProvider } from "@/provider/swr";
import { useAnchor } from "@/anchor/setup";
import { DiceResult } from "@/types/dice-result";
import { generateNumbers } from "@/lib/utils";
import { IBetType } from "@/types/bet";
import Footer from "@/components/Footer";
import Notification from '@/components/notification/notification';
import { BorderColor } from '@/components/notification/border-color';

interface NotificationItem {
  id: number;
  message: string;
  borderColor: BorderColor;
}

// Define the mapping object
const betMapping = {
  small: { small: {} },
  big: { big: {} },
};

function Home() {
  const [cycleStatus, setCycleStatus] = useState(0);
  // 1 = bet close , 2 = rolling , 3 = show result, 4 = reset and ready for betting
  const [isOpen, setIsOpen] = useState(false);
  const [gameStatus, setGameStatus] = useState<IGameStatus>(
    GAME_STATUS.BETTING
  );
  const [betHistories, setBetHistories] = useState<IBetHistory[]>([]);
  const [payoutHistories, setPayoutHistories] = useState<IResultBet[]>([]);
  const [result, setResult] = useState<BetResult | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (message: string, borderColor: BorderColor) => {
    const newNotification = { id: Date.now(), message, borderColor };
    setNotifications([...notifications, newNotification]);
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const timerRef = useRef<any>(null);

  const { publicKey } = useWallet();
  const { program, housePublicKey, connection, payoutHistoryPda, betListPda, rollHistoryPda } =
    useAnchor();

  const showConnectWalletNotification = async () => {
    addNotification("Connect to your wallet", BorderColor.ORANGE);
  }

  const handleBet = async (betData: IBetHistory) => {
    try {
      await program.methods
        .placeBet(
          betMapping[betData.type],
          new BN(betData.amount * LAMPORTS_PER_SOL)
        )
        .accounts({
          user: publicKey?.toBase58(),
          house: housePublicKey,
          betList: betListPda,
          userAccount: publicKey!!, // Replace with the actual user's token account public key
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([])
        .rpc();

      addNotification("Placed bet successfully.", BorderColor.GREEN);
    } catch (e) {
      let jsonErr = JSON.stringify(e);
      if (jsonErr.includes("Attempt to debit an account but found no record of a prior credit.")
        || jsonErr.includes("Transfer: insufficient lamports")){
        addNotification("Not enough SOL to place bet.", BorderColor.ORANGE);
      } else if (jsonErr.includes('"name":"WalletSignTransactionError"')) {
        // User rejected the request. Show nothing.
      } else if (jsonErr.includes("Error Code: BetsClosed. Error Number: 6000.")) {
        // Bets closed.
        addNotification("Bets closed. Try next roll.", BorderColor.ORANGE);
      } else if (jsonErr.includes("Error Code: BetListFull. Error Number: 6002.")) {
        // Bet list is full.
        addNotification("Bet list full. Try next roll.", BorderColor.ORANGE);
      } else if (jsonErr.includes("Error Code: InvalidAmount. Error Number: 6004.")) {
        // Invalid Amount
        addNotification("Invalid bet size amount.", BorderColor.ORANGE);
      } else if (jsonErr.includes('{"signature":"')) {
        // Place bet delayed with signature returned, possible success. Show nothing.
      } else if (jsonErr.toString() == "{}") {
        // Empty Error. Show nothing.
      } else {
        addNotification("Unknown Error.", BorderColor.RED);
      }
      // console.log("🚀 ~ handleBet ~ error:", JSON.stringify(e));
    }
  };

  // Use refs for values that don't need to trigger a re-render
  const currentGameStatus = useRef<IGameStatus | null>(null);
  const currentPayoutHistories = useRef<
    { results: DiceResult[]; address: string }[]
  >([]);
  const currentBetHistories = useRef<
    { address: string; amount: number; type: IBetType }[]
  >([]);
  const currentBetType = useRef<IBetType | null>(null);
  const currentRollResult = useRef<DiceResult[]>([]);
  const currentBetsClosed = useRef<boolean>(false);
  const wasBetListEmpty = useRef(true);
  const payoutHistoryUpdated = useRef(false);
  const rollTime = useRef<number>(0);
  const showResultTime = useRef<number>(0);
  const showReadyTime = useRef<number>(0);
  const currentRollHistoryAccount = useRef<any[]>([]);
  const rollHistoryUpdated = useRef(false);
  const prevActiveBetHistoriesLength = useRef<number>(0);

  useEffect(() => {

    if(cycleStatus == 0) {
      // console.log("Betting . . .");
      setGameStatus(GAME_STATUS.BETTING);
    }
    else if(cycleStatus == 1) {
      // console.log("Bet closed");
      handleBetClosed();
    }
    else if(cycleStatus == 2) {
      // console.log("Start Rolling");
      handleRolling();
    }
    else if(cycleStatus == 3) {
      // console.log("Show result");
      handleShowResult();
    }
    else if(cycleStatus == 4) {
      payoutHistoryUpdated.current = false;
      wasBetListEmpty.current = true;
      setCycleStatus(0);
      rollTime.current = 0;
      showResultTime.current = 0;
      rollHistoryUpdated.current = false;
      currentRollHistoryAccount.current = [];
      // console.log("Roll History Updated RESET");
    }
    else if (cycleStatus == 5){
      handleShowReady();
    }
  }, [cycleStatus]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause getRemainingTime to save unnecessary state updates
        timerRef.current.hideTimer();
        // console.log("Timer is hidden");
      } else {
        // Resume getRemainingTime
        timerRef.current.showTimer();
        // console.log("Timer is shown");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = timerRef.current.getRemainingTime();

      if (currentBetHistories.current.length == 0 && !rollHistoryUpdated.current && !currentBetsClosed.current) {
        // Reset prevActiveBetHistoriesLength.current
        prevActiveBetHistoriesLength.current = 0;

        if (remainingTime >= 10000 && remainingTime <= 15000) {
          setCycleStatus(1); // bet close
        }
        else if (remainingTime < 10000 && remainingTime >= 5000) {
          setCycleStatus(2); // rolling and set result
        }
        else if (remainingTime < 5000 && remainingTime > 1000) {
          setCycleStatus(3); // show result
        }
        else if (remainingTime <= 1000) {
          setCycleStatus(4); // reset and ready for betting
        } else {
          setCycleStatus(0);
        }
      } else { // Scenario when there are active bets
        if (currentBetsClosed.current){
          setCycleStatus(1); // bet close
          showReadyTime.current++;
          if (remainingTime <= 1000){
            timerRef.current.freezeTimer();
          }
          if (showReadyTime.current > 25){
            setCycleStatus(5); // Show ready state to fill long delays
          }
        } else if (rollHistoryUpdated.current){
          if (rollTime.current < 5){
            setCycleStatus(2); // rolling and set result
            rollTime.current++;
          } else if (showResultTime.current < 5){
            setCycleStatus(3); // show result
            showResultTime.current++;
          } else {
            setCycleStatus(4); // reset and ready for betting
            timerRef.current.unfreezeTimer();
            showReadyTime.current = 0;
          }
        } else {
          // There are active bets, bets are not closed yet and no roll history updates
          setCycleStatus(0);
          if (remainingTime <= 1000){
            timerRef.current.freezeTimer();
          }
          if (prevActiveBetHistoriesLength.current == 0 && currentBetHistories.current.length != 0) {
            prevActiveBetHistoriesLength.current = currentBetHistories.current.length;
            if (remainingTime <= 17000){
              // Extend the countdown timer by 1 minute
              timerRef.current.extendCountdownByOneMinute();
            }
          }
        }
      }

    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const handleBetClosed = () => {
    setGameStatus(GAME_STATUS.BET_CLOSED);
  };

  const handleShowReady = () => {
    setGameStatus(GAME_STATUS.READY);
  };

  const handleRolling = () => {
    setGameStatus(GAME_STATUS.ROLLING);
    const result = (rollHistoryUpdated.current)
        ? displayCurrentRollResult() : generateResultFromPayoutHistory();
    currentRollResult.current = result.results;
    setResult(result);

  };

  const handleShowResult = () => {

    if (isThreeOfAKind(currentRollResult.current)) {
      setGameStatus(GAME_STATUS.RESULT_THREE_OF_A_KIND);
    } else if (isBigWins(currentRollResult.current)) {
      setGameStatus(GAME_STATUS.RESULT_BIG_WINS);
    } else {
      setGameStatus(GAME_STATUS.RESULT_SMALL_WINS);
    }

  };

  const isThreeOfAKind = (results: number[]) => {
    return results[0] === results[1] && results[1] === results[2];
  };

  const isBigWins = (results: number[]) => {
    return results.reduce((total, item) => total + item, 0) > 10;
  };

  const generateResultFromPayoutHistory = () => {
    const previous_payout_tx = currentPayoutHistories.current[0].address;
    const current_minute = Math.floor(Date.now() / 60000);
    const concatenatedString = `${previous_payout_tx}-${current_minute}`;
    const result = generateNumbers(concatenatedString);
    return {
      results: result as DiceResult[],
      value: 0,
      isWin: false,
    };
  };

  const displayCurrentRollResult = () => {
    return {
      results: currentRollHistoryAccount.current[0],
      value: 0,
      isWin:
        (currentBetType.current === BET_BIG &&
          currentPayoutHistories.current[0].results.reduce(
            (total, item) => total + item,
            0
          ) > 10) ||
        (currentBetType.current === BET_SMALL &&
          currentPayoutHistories.current[0].results.reduce(
            (total, item) => total + item,
            0
          ) <= 10),
    };
  };

  const processNewBetListAccount = (betListAccount: any) => {
    if (betListAccount && Array.isArray(betListAccount.bets)) {
      const bets = betListAccount.bets
        .filter((bet: any) => bet !== null)
        .map(
          (bet: any) =>
            ({
              address: (bet.user as PublicKey).toBase58(),
              amount: bet.amount / LAMPORTS_PER_SOL,
              type: Object.keys(bet.betType)[0],
            } as IBetHistory)
        );
      const newBetHistories = bets.reverse();
      currentBetsClosed.current = betListAccount.betsClosed;
      currentBetHistories.current = newBetHistories;
      setBetHistories(newBetHistories);
    }
  };

  const fetchActiveBetList = async () => {
    try {
      const betListAccount = await program.account.betList.fetch(betListPda);
      processNewBetListAccount(betListAccount);
    } catch (err) {
      console.error("Error fetching active bets:", err);
    }
  };

  useEffect(() => {
    fetchActiveBetList();
    const subscriptionId = connection.onAccountChange(betListPda, (object) => {
      const data = object.data;
      try {
        // Deserialize the data using Anchor
        const betList = program.account.betList.coder.accounts.decode('BetList', data);
        // console.log("Deserialized Bet List: ", betList);
        processNewBetListAccount(betList);
      } catch (error) {
        console.error("Error deserializing Bet List: ", error);
      }
    });

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processNewPayoutHistoryAccount = (payoutHistoryAccount: any) => {
    if (
      payoutHistoryAccount.histories &&
      Array.isArray(payoutHistoryAccount.histories) &&
      payoutHistoryAccount.histories.length > 0
    ) {
      const histories = payoutHistoryAccount.histories.map((history: { txSig: Iterable<number> | ArrayLike<number>; result: Iterable<DiceResult> | ArrayLike<DiceResult>; }) => {
        const txSig: number[] = Array.from(history.txSig);
        return {
          results: Array.from(history.result) as DiceResult[],
          address: bs58.encode(txSig),
        };
      });
      const newPayoutHistory = histories.reverse();
      if (
        currentPayoutHistories.current.length > 0 &&
        currentPayoutHistories.current[0].address !==
          newPayoutHistory[0].address
      ) {
        payoutHistoryUpdated.current = true;
      }
      currentPayoutHistories.current = newPayoutHistory;
      setPayoutHistories(newPayoutHistory);
    } else {
      console.log("No histories found in payoutHistoryAccount.");
    }
  };

  const fetchPayoutHistory = async () => {
    try {
      const payoutHistoryAccount = await program.account.payoutHistory.fetch(
        payoutHistoryPda
      );
      processNewPayoutHistoryAccount(payoutHistoryAccount);
    } catch (err) {
      console.error("Error fetching payout history:", err);
    }
  };

  useEffect(() => {
    fetchPayoutHistory();
    const subscriptionId = connection.onAccountChange(payoutHistoryPda, (object) => {
      const data = object.data;
      try {
        // Deserialize the data using Anchor
        const payoutHistoryAccount = program.account.payoutHistory.coder.accounts.decode('PayoutHistory', data);
        // console.log("Deserialized Payout History: ", payoutHistoryAccount);
        processNewPayoutHistoryAccount(payoutHistoryAccount);
      } catch (error) {
        console.error("Error deserializing Payout History: ", error);
      }
    });

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processNewRollHistoryAccount = (rollHistoryAccount: any) => {
    if (
      rollHistoryAccount.results &&
      Array.isArray(rollHistoryAccount.results) &&
      rollHistoryAccount.results.length > 0
    ) {
      const newRollHistory = rollHistoryAccount.results.reverse();
      if (
        currentRollHistoryAccount.current.length == 0 && newRollHistory[0] != null
      ) {
        rollHistoryUpdated.current = true;
        // console.log("Roll History Updated");
      }
      currentRollHistoryAccount.current = newRollHistory;
    }
  };

  useEffect(() => {
    const subscriptionId = connection.onAccountChange(rollHistoryPda, (object) => {
      const data = object.data;
      try {
        // Deserialize the data using Anchor
        const rollHistoryAccount = program.account.rollHistory.coder.accounts.decode('RollHistory', data);
        // console.log("Deserialized Roll History: ", rollHistoryAccount);
        processNewRollHistoryAccount(rollHistoryAccount);
      } catch (error) {
        console.error("Error deserializing Roll History: ", error);
      }
    });

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="w-full max-w-5xl">
      <Header isShowSocial isStyled />
      <WalletSelection />
      <div
        className={`bg-[#0B0B1F] h-[130px] md:h-[200px] flex justify-center items-center text-center mt-[20px] text-[32px] md:text-[45px]`}
      >
        <LabelCustom>大 Big & Small 細</LabelCustom>
      </div>
      <Container className={`flex flex-col mt-5 gap-[20px]`}>
        <div className="flex justify-between items-center">
          <LabelCustom className="text-[12px] md:text-[25px]">
            Time left until the next game:
          </LabelCustom>
          <Timer ref={timerRef} />
        </div>
        <div className="flex items-center justify-center rounded-[10px] border-solid border border-[#344EAD]">
          <Dice
            rolling={gameStatus === GAME_STATUS.ROLLING}
            results={result?.results}
            timerRef={timerRef}
          />
        </div>
        <Bet gameStatus={gameStatus} bet={handleBet} showConnectWalletNotification={showConnectWalletNotification}/>
      </Container>
      <div className="grid grid-cols-1 gap-4 mt-[30px]">
        <div>
          <LabelCustom classNameContainer="md:text-[24px]">
            Active Bets
          </LabelCustom>
          <Container className="mt-[20px]">
            <BetHistory typeBet={BET_BIG} betHistories={betHistories} />
          </Container>
          <Container className="mt-[20px]">
            <BetHistory typeBet={BET_SMALL} betHistories={betHistories} />
          </Container>
        </div>

        <div>
          <div className="flex justify-between items-center mt-[30px] md:mt-0">
            <LabelCustom classNameContainer="md:text-[24px]">
              Payout History
            </LabelCustom>
            <LabelCustom classNameContainer="md:text-[24px]">
              Solana Explorer Link
            </LabelCustom>
          </div>
          <PayoutHistories data={payoutHistories} />
        </div>
      </div>
      <div>
        {notifications.map((notification, index) => (
          <Notification
            key={notification.id}
            id={notification.id}
            message={notification.message}
            onClose={removeNotification}
            index={index}
            borderColor={notification.borderColor}
          />
        ))}
      </div>
      <Footer className="static mt-6" />
      <BetDialog open={isOpen} setOpen={setIsOpen} result={result} />
    </div>
  );
}

export default function Game() {
  return (
    <SWRProvider>
      <SolanaProvider>
        <Home />
      </SolanaProvider>
    </SWRProvider>
  );
}
