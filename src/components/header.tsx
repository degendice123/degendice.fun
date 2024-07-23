"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import LabelCustom from "@/components/ui-custom/label-custom";
import logo from "@/assets/img/logo.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ButtonSocial } from "./buttons-social";

const routes = [
  { title: "About", link: "/about", isDisable: false },
  { title: "Roadmap", link: "/roadmap", isDisable: false },
  { title: "Game", link: "/game", isDisable: false },
];

export default function Header({
  isShowSocial = false,
  isStyled = false,
  isShowGame = false,
}: {
  isShowSocial?: boolean;
  isStyled?: boolean;
  isShowGame?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="w-full flex items-center justify-between ">
      <Link href="/">
        <Image
          src={logo}
          alt={"logo"}
          width={150}
          className="min-w-[120px] md:w-[220px]"
        />
      </Link>
      <div className="flex gap-8">
        {isShowSocial && (
          <div className="hidden md:inline-flex gap-4">
            <ButtonSocial />
          </div>
        )}
        <NavigationMenu>
          <NavigationMenuList>
            {routes.map(({ title, link }, index) => {
              if (title === "Game" && !isShowGame) {
                return "";
              }
              const isActive = pathname === link;

              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle())}
                    active={isActive}
                    asChild
                  >
                    <Link
                      href={link}
                      className="data-[active]:border-b-2 data-[active]:bg-inherit data-[active]:rounded-none"
                    >
                      {isStyled ? (
                        <LabelCustom classNameContainer="text-[16px] md:text-[24px]">
                          {title}
                        </LabelCustom>
                      ) : (
                        title
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
