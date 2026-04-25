declare module 'viem' {
  export function parseUnits(value: string | number, decimals: number): bigint
  export function formatUnits(value: bigint, decimals: number): string
}
