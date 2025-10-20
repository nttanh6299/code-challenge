### Type issues

#### 1.

```ts
const getPriority = (blockchain: any): number => {
```

Using `any` removes type safety => the function accepts any type of `blockchain`.

**How to fix**

```ts
// Provide blockchain parameter type
const getPriority = (blockchain: WalletBalance['blockchain']): number => { ... }
```

---

#### 2.

```ts
interface WalletBalance {
  currency: string;
  amount: number;
}
return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain); // <== `WalletBalance` doesn't define this field
```

`WalletBalance` doesn't define `blockchain` property, so it will cause type mismatch.

**How to fix**

```ts
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // <=
}
```

---

#### 3.

```ts

interface Props extends BoxProps {}
...
const { children, ...rest } = props;
...
return (
    <div {...rest}>
      {rows}
    </div>
  )

```

If `BoxProps` !== DOM props `(HTMLDivElement)`, then spreading `...rest` onto a `<div>` is incorrect.
That means if `BoxProps` includes non DOM props (sx, as, variant, ...), React will forward unknown attributes to the DOM,
which can create invalid attributes or unexpected behaviors.

**How to fix**
If we intend to render a `div`, we extend DOM props so Typescript guarantees `...rest` is valid

```ts
interface Props extends React.HTMLAttributes<HTMLDivElement> {}
```

If `BoxProps` belongs to a `Box` component from a design system, use that component rather than a raw `div`

```ts
// import { Box } from 'design-system';
interface Props extends BoxProps {}

<Box {...rest}>{rows}</Box>;
```

**Also**, we never use `children`, yet destructure it.
We can remove it from type declaration and props destructuring.

```ts
interface Props extends Omit<BoxProps, "children"> {}
```

### Logic issues

#### 4.

```ts
 return balances.filter((balance: WalletBalance) => {
	const balancePriority = getPriority(balance.blockchain);
	if (lhsPriority > -99) {
```

`lhsPriority` is not defined inside the filter function => it should be `balancePriority`.

**How to fix**

```ts
if (balancePriority > -99) {
```

---

#### 5.

```ts
if (balance.amount <= 0) {
  return true;
}
```

It only keeps balances where `amount <= 0`, i.e zero or negative amounts.
But logically we want to show wallet balances with positive amount (greater than 0)

**How to fix**

```ts
if (balance.amount > 0) {
  return true;
}
```

---

#### 6.

```ts
if (leftPriority > rightPriority) return -1;
else if (rightPriority > leftPriority) return 1;
```

The comparator is verbose and incomplete (no return `0`).

**How to fix**

```ts
// Can be replaced with a simple numeric subtraction
.sort((a, b) => leftPriority - rightPriority)
```

---

#### 7.

```ts
// It will return a number with no digits after the decimal point
formatted: balance.amount.toFixed();
```

`toFixed()` requires a parameter (default `0`) may not format correctly for currency.

**How to fix**

```ts
formatted: balance.amount.toFixed(2);
```

---

### Readability, Performance enhancement

#### 8.

```ts
const sortedBalances = useMemo(() => {...}, [balances, prices]);
```

Inside the memo, the dependency `prices` is included but it is never used in the computation.
It causes unnecessary re-render every time `prices` changes.

**How to fix**

```ts
const sortedBalances = useMemo(() => {...}, [balances]);
```

---

#### 9.

```ts
<WalletRow
  key={index}
  className={classes.row}
  amount={balance.amount}
  usdValue={usdValue}
  formattedAmount={formatted}
/>
```

Using the array index as a key can cause rendering bugs when the component order changes.

**How to fix**

Use a stable one:

```ts
key={balance.currency}
```

or

```ts
key={${balance.blockchain}-${balance.currency}} // for more details if necessary
```

---

#### 10.

```ts
const formattedBalances = sortedBalances.map(...)
const rows = sortedBalances.map(...)
```

There are two `.map()` operations the same `sortedBalances`. That is redundant and cost extra iterations.

**How to fix**

Combine mapping into one

```ts
const rows = sortedBalances.map((balance, index) => {
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
});
```

---

#### 11.

```ts
const getPriority = (blockchain: WalletBalance["blockchain"]): number => number;
```

The `getPriority` is not depended on any component's states.
It will be re-computed every time the component re-render.

**How to fix**
Move the logic out of the component or use `useCallback` for memorizing.

---

#### 12.

```ts
switch (blockchain) {
  case "Osmosis":
    return 100;
  case "Ethereum":
    return 50;
  case "Arbitrum":
    return 30;
  case "Zilliqa":
    return 20;
  case "Neo":
    return 20;
  default:
    return -99;
}
```

Those numbers are hard to read and maintain, because they don't describe what they mean.
Using those numbers just in `switch case` are fine, but that is not okay if we also use it in other places (e.g `if(balancePriority > -99)`)

**How to fix**

```ts
const PRIORITY_MAP: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: WalletBalance["blockchain"]): number =>
  PRIORITY_MAP[blockchain] ?? -99;
```
