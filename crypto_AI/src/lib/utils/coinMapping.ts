/**
 * Symbol to CoinGecko ID mapping for all supported cryptocurrencies
 * Maps the symbols used in the signup form to CoinGecko API IDs
 */
const SYMBOL_TO_COINGECKO_ID = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum', 
  'SOL': 'solana',
  'ADA': 'cardano',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink'
} as const;

export type SupportedSymbol = keyof typeof SYMBOL_TO_COINGECKO_ID;
export type CoinGeckoId = typeof SYMBOL_TO_COINGECKO_ID[SupportedSymbol];

/**
 * Maps user's selected assets (symbols) to CoinGecko IDs
 * @param selectedAssets Array of asset symbols (e.g., ['BTC', 'ETH'])
 * @returns Array of CoinGecko IDs (e.g., ['bitcoin', 'ethereum'])
 */
export function mapAssetsToCoinGeckoIds(selectedAssets: string[]): string[] {
  return selectedAssets
    .map(asset => SYMBOL_TO_COINGECKO_ID[asset as SupportedSymbol])
    .filter(Boolean); // Remove undefined values for unmapped assets
}

/**
 * Gets unmapped assets for warning display
 * @param selectedAssets Array of asset symbols
 * @returns Array of unmapped asset symbols
 */
export function getUnmappedAssets(selectedAssets: string[]): string[] {
  return selectedAssets.filter(asset => !SYMBOL_TO_COINGECKO_ID[asset as SupportedSymbol]);
}

/**
 * Gets the CoinGecko ID for a specific symbol
 * @param symbol Asset symbol (e.g., 'BTC')
 * @returns CoinGecko ID or undefined if not found
 */
export function getCoinGeckoId(symbol: string): string | undefined {
  return SYMBOL_TO_COINGECKO_ID[symbol as SupportedSymbol];
}

/**
 * Gets all supported symbols
 * @returns Array of all supported asset symbols
 */
export function getSupportedSymbols(): string[] {
  return Object.keys(SYMBOL_TO_COINGECKO_ID);
}

/**
 * Checks if a symbol is supported
 * @param symbol Asset symbol to check
 * @returns True if symbol is supported
 */
export function isSymbolSupported(symbol: string): boolean {
  return symbol in SYMBOL_TO_COINGECKO_ID;
}
