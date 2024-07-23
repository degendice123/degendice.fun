"use client";
import Image from "next/image";
import xSvg from "@/assets/img/x.svg";
import telegramSvg from "@/assets/img/telegram.svg";
import { Button } from "./ui/button";

export function ButtonSocial() {
    return (
        <>
            <a href="https://t.me/DEGENDICE1" target="_blank" rel="noopener noreferrer">
                <Button
                    variant={"outline"}
                    size="icon"
                >
                    <Image src={telegramSvg} alt={"Telegram"} />
                </Button>
            </a>
            <a href="https://x.com/degendice_sol" target="_blank" rel="noopener noreferrer">
                <Button
                    variant={"outline"}
                    size="icon"
                >
                    <Image src={xSvg} alt={"X"} />
                </Button>
            </a>
        </>
    );
}
