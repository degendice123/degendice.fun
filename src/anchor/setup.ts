"use client";

import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import IDL from "./idl.json";
import { PublicKey } from "@solana/web3.js";
import {
  AnchorWallet,
  useConnection,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";

const programID = new PublicKey("CyNWQC4ZdJmhGD1z1KaFhk3ZzubBTjWoDXJ5BUefNr4A");
const housePublicKey = new PublicKey(
  "Hsekeq9rYdqtV27YWecipnoqkzicEH1rd6hRQSWLFi1S"
);

export const useAnchor = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const provider = new AnchorProvider(
    connection,
    wallet as unknown as AnchorWallet,
    {}
  );
  // Initialize the program interface with the IDL, program ID, and connection.
  // This setup allows us to interact with the on-chain program using the defined interface.
  const program = new Program(IDL as Idl, programID, provider);

  const [payoutHistoryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("payout_history"), housePublicKey.toBuffer()],
    program.programId
  );

  const [betListPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("bet_list"), housePublicKey.toBuffer()],
    program.programId
  );

  const [rollHistoryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("roll_history"), housePublicKey.toBuffer()],
    program.programId
  );

  return {
    program,
    housePublicKey,
    connection,
    payoutHistoryPda,
    betListPda,
    rollHistoryPda,
  };
};
