import { useEffect, useState, useCallback } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { formatUnits } from 'viem'
import type { AbiFunction } from 'viem'

// ERC20 标准 ABI（仅需要常用 4 个方法）
const tokenAbi = [
  {
    name: 'name',
    type: 'function' as const,
    stateMutability: 'view' as const,
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
  },
  {
    name: 'symbol',
    type: 'function' as const,
    stateMutability: 'view' as const,
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
  },
  {
    name: 'decimals',
    type: 'function' as const,
    stateMutability: 'view' as const,
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
  },
  {
    name: 'balanceOf',
    type: 'function' as const,
    stateMutability: 'view' as const,
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
  },
] satisfies AbiFunction[]

// 安全转 bigint，兼容 BigNumber / hex / string / number
function toBigIntSafe(value: unknown): bigint {
  if (typeof value === 'bigint') return value
  if (typeof value === 'number') return BigInt(value)
  if (typeof value === 'string') return BigInt(value)
  if (value && typeof (value as any)._hex === 'string') return BigInt((value as any)._hex)
  if (value && typeof (value as any).toString === 'function') return BigInt((value as any).toString())
  return BigInt(0)
}

// Symbol 映射，将合约返回的 symbol 映射为用户友好的显示名称
function mapTokenSymbol(originalSymbol: string): string {
  const symbolMap: Record<string, string> = {
    'USDT0': 'USDT',  // USDT0 是 Tether 的跨链稳定币，映射为 USDT
    // 可以添加更多映射
  }
  return symbolMap[originalSymbol] || originalSymbol
}

export interface TokenInfo {
  address: `0x${string}`
  name: string
  symbol: string
  decimals: number
  balance: bigint
  formattedBalance: string
}

interface UseTokenInfoListResult {
  data: TokenInfo[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * 并发获取多个 ERC20 Token 的 name/symbol/decimals/balance
 */
export function useTokenInfoList(tokenAddresses: string[]): UseTokenInfoListResult {
  const { address: userAddress } = useAccount()
  const client = usePublicClient()

  const [data, setData] = useState<TokenInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!client || !userAddress) {
      setData([])
      setIsLoading(false)
      return
    }
    
    if (tokenAddresses.length === 0) {
      setData([])
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const calls = tokenAddresses.flatMap((token) => [
        { address: token as `0x${string}`, abi: tokenAbi, functionName: 'name' as const },
        { address: token as `0x${string}`, abi: tokenAbi, functionName: 'symbol' as const },
        { address: token as `0x${string}`, abi: tokenAbi, functionName: 'decimals' as const },
        { address: token as `0x${string}`, abi: tokenAbi, functionName: 'balanceOf' as const, args: [userAddress] },
      ])

      const results = await client.multicall({ contracts: calls })

      const parsed = tokenAddresses.map((token, i) => {
        const [name, symbol, decimals, balance] = results.slice(i * 4, i * 4 + 4)
        const dec = Number(decimals.result ?? 18)
        const rawBalance = toBigIntSafe(balance.result)
        const formattedBalance = formatUnits(rawBalance, dec)


        const originalSymbol = String(symbol.result ?? '')
        
        return {
          address: token as `0x${string}`,
          name: String(name.result ?? ''),
          symbol: mapTokenSymbol(originalSymbol),
          decimals: dec,
          balance: rawBalance,
          formattedBalance,
        }
      })

      setData(parsed)
    } catch (err: any) {
      console.error('TokenInfoList error:', err)
      setError(err?.message ?? '未知错误')
    } finally {
      setIsLoading(false)
    }
  }, [client, userAddress, tokenAddresses])

  // 初始化加载
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, isLoading, error, refetch: fetchData }
}
