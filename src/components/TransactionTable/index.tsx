import React, { useEffect, useState } from 'react';

import { Container } from './styles';

import { api } from '../../services/api';

interface ITransaction {
  id: string;
  title: string;
  amout: number;
  type: string;
  category: string;
  createdAt: string;
}

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  useEffect(() => {
    api.get('/transactions')
      .then(response => {
        setTransactions(response.data.transactions)
      })
  }, [])


  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td className={transaction.type}>
                {new Intl.NumberFormat('pt-BR', {
                  style: "currency",
                  currency: "BRL",
                }).format(transaction.amout)}
              </td>
              <td>{transaction.category}</td>
              <td>{new Intl.DateTimeFormat().format(new Date(transaction.createdAt))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  )
}

export default TransactionTable;