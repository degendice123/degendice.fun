"use client";

import Image from "next/image";
import Link from "next/link";

import Header from "@/components/header";
import LabelCustom from "@/components/ui-custom/label-custom";
import diceSvg from "@/assets/img/dice.svg";
import { Button } from "@/components/ui/button";
import { ButtonSocial } from "@/components/buttons-social";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="w-full max-w-5xl relative">
      <Header isShowSocial isStyled />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)]">
        <Image src={diceSvg} alt={"Dice icon"} className="md:w-[200px]" />
        <LabelCustom classNameContainer="mt-4 text-[32px] md:text-[55px]">
          大 Big & Small 細
        </LabelCustom>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10 w-4/5">
          <Button
            className="rounded w-full max-w-[310px] font-bold md:h-[50px]"
            asChild
          >
            <Link href="/game">ENTER GAME</Link>
          </Button>
          <Button
            className="rounded w-full max-w-[310px] font-bold md:h-[50px]"
            variant="outline"
            asChild
          >
            <Link href="/roadmap">ROAD MAP</Link>
          </Button>
        </div>
        <div className="flex gap-6 mt-24 md:hidden">
          <ButtonSocial />
        </div>
      </div>
      <Footer className="landscape:[@media(hover:none)]:static" />
    </div>
  );
}
