import { createContext as _createContext, useContext, ReactNode } from 'react'

export function createContext<T>(useController: () => T, defaultValue?: T) {
  const Context = _createContext<T | undefined>(defaultValue)

  const Provider = ({ children }: { children: ReactNode }) => {
    const value = useController()

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  const useValue = () => {
    const value = useContext(Context)
    if (value === undefined) throw new Error(`useValue must be used within its provider`)

    return value as T
  }

  return { Provider, useValue }
}
