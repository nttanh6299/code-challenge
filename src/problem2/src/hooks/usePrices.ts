import { useState, useCallback } from "react";

interface PriceData {
  currency: string;
  date: string;
  price: number;
}

interface PriceMap {
  [key: string]: number;
}

export const usePrices = () => {
  const [tokens, setTokens] = useState<string[]>([]);
  const [prices, setPrices] = useState<PriceMap>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://interview.switcheo.com/prices.json"
      );
      if (!response.ok) throw new Error("Failed to fetch prices");

      const data: PriceData[] = await response.json();
      const priceMap: PriceMap = {};
      const tokenSet = new Set<string>();

      data.forEach((item) => {
        if (item.price && item.currency) {
          const currency = item.currency.toUpperCase();
          if (!priceMap[currency]) {
            priceMap[currency] = parseFloat(String(item.price));
            tokenSet.add(currency);
          }
        }
      });

      setPrices(priceMap);
      setTokens(Array.from(tokenSet).sort());
    } catch (err) {
      console.error("Error fetching prices:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { tokens, prices, loading, fetchPrices };
};
