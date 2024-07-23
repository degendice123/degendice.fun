"use client";

import Image from "next/image";

import Point1Svg from "@/assets/img/dice/1.svg";
import Point2Svg from "@/assets/img/dice/2.svg";
import Point3Svg from "@/assets/img/dice/3.svg";
import Point4Svg from "@/assets/img/dice/4.svg";
import Point5Svg from "@/assets/img/dice/5.svg";
import Point6Svg from "@/assets/img/dice/6.svg";
import { DiceResult } from "@/types/dice-result";
import { FC } from "react";

const mapPointImg = {
  1: Point1Svg,
  2: Point2Svg,
  3: Point3Svg,
  4: Point4Svg,
  5: Point5Svg,
  6: Point6Svg,
};

const PayoutHistoryImage: FC<{ results: DiceResult[]; size?: number }> = ({
  results,
  size = 20,
}) => (
  <div className="flex gap-2">
    {results.map((result, index) => (
      <Image src={mapPointImg[result]} alt="up icon" width={size} key={index} />
    ))}
  </div>
);

export default PayoutHistoryImage;
