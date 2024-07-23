import { FC, ReactNode } from "react";
import { SWRConfig } from "swr";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const SWRProvider: FC<{ children: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 3600000,
      }}
      {...props}
    >
      {children}
    </SWRConfig>
  );
};
