import React from "react";
import { WalletBalance } from "./types";
import { getPriority, PRIORITY_MAP } from "./helper";

interface Props
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {}

export const WalletPage: React.FC<Props> = ({ ...rest }: Props) => {
  const balances: WalletBalance[] = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > PRIORITY_MAP.Unknown && balance.amount > 0;
      })
      .sort(
        (lhs, rhs) => getPriority(lhs.blockchain) - getPriority(rhs.blockchain)
      );
  }, [balances]);

  return (
    <div {...rest}>
      {sortedBalances.map((balance: WalletBalance) => {
        const formatted = balance.amount.toFixed(2);
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            className={classes.row}
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={formatted}
          />
        );
      })}
    </div>
  );
};
