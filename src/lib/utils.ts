import { BET_BIG, BET_SMALL } from "@/const";
import { DiceResult } from "@/types/dice-result";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createHash } from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getResultText = (
  results: DiceResult[],
  isCheckThree: boolean = true
) => {
  const totalResult = results.reduce((total, item) => total + item, 0);

  let resultText: string = totalResult <= 10 ? BET_SMALL : BET_BIG;
  if (isCheckThree) {
    if (results.every((val, _, arr) => val === arr[0])) {
      resultText = "Three of a kind";
    }
  }

  return resultText;
};

export function randomInt(min: number, max: number): DiceResult {
  return Math.floor(Math.random() * (max - min + 1) + min) as DiceResult;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function hashStringToSeed(input: string): string {
  // Create a SHA-256 hash of the input string
  return createHash('sha256').update(input).digest('hex');
}

export function generateNumbers(input: string): number[] {
  const seed = hashStringToSeed(input);
  let utf8Encode = new TextEncoder();
  const array = utf8Encode.encode(seed);
  return [array[0] % 6 + 1, array[1] % 6 + 1, array[2] % 6 + 1];
}
