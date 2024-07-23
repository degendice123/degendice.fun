"use client";

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletSelection() {
  return (
    <div className="rounded-lg border-solid border-2 border-[#0E1528] p-[10px] mt-[20px] [&>div]:w-full [&>div>button]:w-full [&>div>button]:h-[47px] [&>div>button]:justify-center">
      <WalletMultiButton />
    </div>
  );
}
