import { useCallback } from "react"
import { atom, SetStateAction, useAtom, WritableAtom } from "jotai"
import type { Address } from "viem"

type TokenType = Address | undefined

const DEFAULT_VALUE: TokenType = undefined

let strAtom: WritableAtom<TokenType, SetStateAction<TokenType>>
strAtom = atom<TokenType>(DEFAULT_VALUE)
if (typeof window !== "undefined") {
  strAtom = atom<TokenType>(
    window?.localStorage.getItem("erc721-token")
      ? (JSON.parse(
          window?.localStorage?.getItem("erc721-token") || ""
        ) as Address)
      : DEFAULT_VALUE
  )
} else {
  strAtom = atom<TokenType>(DEFAULT_VALUE)
}

export const tokensWatching = atom(
  (get) => get(strAtom),
  (get, set, newStr: TokenType) => {
    set(strAtom, newStr)
    localStorage.setItem("erc721-token", JSON.stringify(newStr))
  }
)

export const useErc721TokenStorage = () => {
  const [token, set] = useAtom(tokensWatching)
  const setToken = useCallback(
    (tokenNew: TokenType) => {
      set(tokenNew)
    },
    [set]
  )
  return [token, setToken] as const
}
