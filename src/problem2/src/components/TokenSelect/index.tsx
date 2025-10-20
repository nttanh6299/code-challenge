import * as Select from "@radix-ui/react-select";
import { Image } from "../Image";

const getTokenIcon = (token: string) => {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`;
};

interface TokenSelectProps {
  tokens: string[];
  selectedToken: string | null;
  onSelect: (token: string) => void;
  excludeToken?: string | null;
}

export const TokenSelect: React.FC<TokenSelectProps> = ({
  tokens,
  selectedToken,
  excludeToken,
  onSelect,
}) => {
  const filteredTokens = tokens.filter((token) => {
    return token !== excludeToken;
  });

  return (
    <Select.Root value={selectedToken || undefined} onValueChange={onSelect}>
      <Select.Trigger className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2 cursor-pointer transition-all hover:bg-white/15 hover:border-white/30 min-w-[120px] outline-none">
        <div className="flex items-center gap-2 flex-1 select-none">
          <Image
            src={getTokenIcon(selectedToken || "")}
            placeholder={selectedToken?.substring(0, 2)}
            alt=""
            loading="lazy"
          />
          <div className="hidden items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-xs font-semibold uppercase">
            {selectedToken?.substring(0, 2)}
          </div>
          <Select.Value asChild>
            <span className="text-sm font-semibold truncate">
              {selectedToken}
            </span>
          </Select.Value>
        </div>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          side="bottom"
          align="end"
          sideOffset={8}
          className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2 min-w-[240px] max-h-80 flex flex-col shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <Select.Viewport className="overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <Select.Item
                  key={token}
                  value={token}
                  className="w-full bg-transparent border-0 rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all text-left hover:bg-white/10 outline-none data-[state=checked]:bg-purple-500/20"
                >
                  <Image
                    src={getTokenIcon(token)}
                    placeholder={token.substring(0, 2)}
                    alt=""
                    loading="lazy"
                  />
                  <div className="hidden items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-xs font-semibold uppercase">
                    {token.substring(0, 2)}
                  </div>
                  <Select.ItemText>
                    <span className="text-base font-semibold">{token}</span>
                  </Select.ItemText>
                </Select.Item>
              ))
            ) : (
              <div className="py-5 text-center text-white/40 text-sm">
                No tokens found
              </div>
            )}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
