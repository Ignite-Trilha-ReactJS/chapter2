import { createContext, useState, useEffect, ReactNode } from "react";
import { api } from "./services/api";
import { Omit } from "yargs";

interface ITransaction {
  id: string;
  title: string;
  amout: number;
  type: string;
  category: string;
  createdAt: string;
}

type ICreateTransaction = Omit<ITransaction, 'id' | 'createdAt'>

interface ITransactionProvider {
  children: ReactNode
}

interface ITransactionContext {
  transactions: ITransaction[];
  createNewTransaction(transaction: ICreateTransaction): Promise<void>;
}

export const TransactionsContext = createContext<ITransactionContext>({} as ITransactionContext);

export const TransactionProvider = ({ children }: ITransactionProvider) => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  useEffect(() => {
    api.get('/transactions')
      .then(response => {
        setTransactions(response.data.transactions)
      })
  }, []);

  const createNewTransaction = async (transactionCreate: ICreateTransaction) => {
    await api.post("/transactions", {
      ...transactionCreate,
      createdAt: new Date()
    })
      .then(response => {
        const { transaction } = response.data;
        setTransactions([...transactions, transaction])
      })

  }

  return (
    <TransactionsContext.Provider value={{
      transactions,
      createNewTransaction
    }}>
      {children}
    </TransactionsContext.Provider>
  )
}