import React, { useEffect, useState } from "react";
import axios from "axios";

const ReportPage = () => {
  const [mostBorrowedBooks, setMostBorrowedBooks] = useState([]);
  const [usersWithPendingLoans, setUsersWithPendingLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados do relatório
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Endpoint para livros mais emprestados
        const booksResponse = await axios.get(
          "http://localhost:8080/relatorio/livros-mais-emprestados"
        );
        setMostBorrowedBooks(booksResponse.data);

        // Endpoint para usuários com empréstimos pendentes
        const usersResponse = await axios.get(
          "http://localhost:8080/relatorio/usuarios-com-emprestimos-pendentes"
        );
        setUsersWithPendingLoans(usersResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar os dados do relatório:", error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <p>Carregando relatórios...</p>;
  }

  return (
    <div className="report-page">
      <h1>Relatórios</h1>

      {/* Relatório de Livros Mais Emprestados */}
      <section>
        <h2>Livros Mais Emprestados</h2>
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Quantidade de Empréstimos</th>
            </tr>
          </thead>
          <tbody>
            {mostBorrowedBooks.length > 0 ? (
              mostBorrowedBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.titulo}</td>
                  <td>{book.autor}</td>
                  <td>{book.qtdEmprestado}</td> {/* Ajustado para `qtdEmprestado` */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Nenhum dado disponível.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Relatório de Usuários com Empréstimos Pendentes */}
      <section>
        <h2>Usuários com Empréstimos Pendentes</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Quantidade de Empréstimos Pendentes</th>
            </tr>
          </thead>
          <tbody>
            {usersWithPendingLoans.length > 0 ? (
              usersWithPendingLoans.map((user) => (
                <tr key={user.id}>
                  <td>{user.nome}</td>
                  <td>{user.email}</td>
                  <td>{user.emprestimosPendentes}</td> {/* Supondo que a API retorne `emprestimosPendentes` */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Nenhum dado disponível.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ReportPage;
