"use client";

import {
  FC,
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import useSWR from "swr";

const RenderTimer: FC<{ children: ReactNode }> = ({ children }) => (
  <span className="w-[92px] md:w-[150px] h-[18px] md:h-[30px] bg-primary flex justify-center items-center text-[12px] md:text-[16px] rounded-sm font-bold">
    {children}
  </span>
);

const RenderCountDown: FC<CountdownRenderProps> = ({ minutes, seconds }) => (<RenderTimer>
      {minutes.toString().padStart(2, "0")} :{" "}
      {seconds.toString().padStart(2, "0")}
    </RenderTimer>
  );

const Timer = forwardRef((_, ref) => {
  const { data, isLoading } = useSWR("https://worldtimeapi.org/api/timezone/Etc/UTC", { revalidateOnFocus: false });

  const [targetDate, setTargetDate] = useState(0);
  const [isFrozen, setIsFrozen] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);
  const countdownRef = useRef<Countdown | null>(null);

  useImperativeHandle(ref, () => ({
    getRemainingTime: () => {
      if (uiHidden) {
        return 60000;
      } else {
        return countdownRef.current?.calcTimeDelta().total ?? 0;
      }
    },
    extendCountdownByOneMinute: () => extendCountdown(),
    freezeTimer: () => setIsFrozen(true),
    unfreezeTimer: () => setIsFrozen(false),
    hideTimer: () => setUiHidden(true),
    showTimer: () => setUiHidden(false),
  }));

  useEffect(() => {
    if (data) {
      const offset = data.unixtime * 1000 - Date.now();
      const currentTime = Date.now() + offset;
      extendCountdown(currentTime);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const extendCountdown = (currentTime?: number): void => {
    const baseTime = currentTime ?? targetDate;
    const nextMinute = new Date(baseTime);
    nextMinute.setSeconds(0,0);
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);
    setTargetDate(nextMinute.getTime());
  };

  if (isLoading) {
    return <RenderTimer>Loading...</RenderTimer>;
  } else if (isFrozen) {
    return <RenderTimer>00 : 00</RenderTimer>;
  }

  return (
    <Countdown
      ref={countdownRef}
      key={targetDate}
      date={targetDate}
      renderer={RenderCountDown}
      onComplete={() => extendCountdown()}
    >
      </Countdown>
  );
});
Timer.displayName = "Timer";

export default Timer;
