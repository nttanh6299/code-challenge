import { useState, useEffect, useCallback } from "react";
import { TokenSelect } from "../TokenSelect";
import { usePrices } from "../../hooks/usePrices";
import { Spinner } from "../Spinner";
import { Input } from "../Input";

const NUMERIC_INPUT_REGEX = /^\d*\.?\d*$/;

const toAmountString = (num: number) => num.toFixed(8);

export const SwapForm: React.FC = () => {
  const { tokens, prices, loading, fetchPrices } = usePrices();

  const [fromToken, setFromToken] = useState<string | null>(null);
  const [toToken, setToToken] = useState<string | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");

  useEffect(() => {
    if (tokens.length >= 2 && !fromToken && !toToken) {
      setFromToken(tokens[0]);
      setToToken(tokens[1]);
    }
  }, [tokens, fromToken, toToken]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const calculateExchangeRate = useCallback((): number | null => {
    if (!fromToken || !toToken || !prices[fromToken] || !prices[toToken]) {
      return null;
    }
    return prices[fromToken] / prices[toToken];
  }, [fromToken, toToken, prices]);

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFrom: (amount: string) => void,
    setTo: (amount: string) => void
  ) => {
    const value = e.target.value;

    if (value === "") {
      setFrom("");
      setTo("");
      return;
    }

    if (!NUMERIC_INPUT_REGEX.test(value)) {
      return;
    }

    setFrom(value);

    if (value && fromToken && toToken) {
      const rate = calculateExchangeRate();
      if (rate) {
        const amount = parseFloat(value);
        const result = amount * rate;
        setTo(toAmountString(result));
      }
    } else {
      setTo("");
    }
  };

  const handleFromAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    handleAmountChange(e, setFromAmount, setToAmount);
  };

  const handleToAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    handleAmountChange(e, setToAmount, setFromAmount);
  };

  const handleSwapTokens = (): void => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleFromTokenChange = (token: string): void => {
    setFromToken(token);

    if (fromAmount && toToken && token) {
      const rate = prices[token] / prices[toToken];
      if (rate) {
        const amount = parseFloat(fromAmount);
        const result = amount * rate;
        setToAmount(toAmountString(result));
      }
    }
  };

  const handleToTokenChange = (token: string): void => {
    setToToken(token);

    if (fromAmount && fromToken && token) {
      const rate = prices[fromToken] / prices[token];
      if (rate) {
        const amount = parseFloat(fromAmount);
        const result = amount * rate;
        setToAmount(toAmountString(result));
      }
    }
  };

  if (loading) {
    return <Spinner message="Loading tokens..." />;
  }

  const exchangeRate = calculateExchangeRate();

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold">Swap</h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all focus-within:bg-white/10 focus-within:border-purple-500/50 focus-within:shadow-lg focus-within:shadow-purple-500/10">
          <div className="flex gap-3 items-center">
            <Input
              type="text"
              placeholder="0.00"
              className="text-xl font-medium"
              value={fromAmount}
              onChange={handleFromAmountChange}
            />
            <TokenSelect
              tokens={tokens}
              selectedToken={fromToken}
              excludeToken={toToken}
              onSelect={handleFromTokenChange}
            />
          </div>
          <div className="h-5 mt-2">
            {fromAmount && fromToken && prices[fromToken] && (
              <div className="text-xs text-white/50">
                ≈ ${(parseFloat(fromAmount) * prices[fromToken]).toFixed(2)} USD
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="bg-white/10 border-2 border-white/10 rounded-xl w-11 h-11 flex items-center justify-center cursor-pointer transition-all text-white/70 hover:bg-white/15 hover:border-purple-500/50 hover:text-white"
            onClick={handleSwapTokens}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 5L8 1L4 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 11L8 15L12 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all focus-within:bg-white/10 focus-within:border-purple-500/50 focus-within:shadow-lg focus-within:shadow-purple-500/10">
          <div className="flex gap-3 items-center">
            <Input
              type="text"
              placeholder="0.00"
              className="text-xl font-medium"
              value={toAmount}
              onChange={handleToAmountChange}
            />
            <TokenSelect
              tokens={tokens}
              selectedToken={toToken}
              excludeToken={fromToken}
              onSelect={handleToTokenChange}
            />
          </div>
        </div>

        {exchangeRate && fromToken && toToken && (
          <div className="bg-white/5 rounded-xl p-3 mt-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">Exchange Rate</span>
              <span className="text-white font-medium">
                1 {fromToken} = {toAmountString(exchangeRate)} {toToken}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
