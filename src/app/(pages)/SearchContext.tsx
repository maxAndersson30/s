"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// Skapa kontexten
const SearchContext = createContext<any | null>(null)

// Hook för att använda kontexten
export const useSearch = () => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }

  return context
}

// Provider-komponent för att slå in runt din app
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchKeyword, setSearchKeyword] = useState("")

  return (
    <SearchContext.Provider value={{ searchKeyword, setSearchKeyword }}>
      {children}
    </SearchContext.Provider>
  )
}
