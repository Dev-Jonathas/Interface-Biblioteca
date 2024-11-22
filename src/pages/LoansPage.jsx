import React, { useState, useEffect } from "react";
import axios from "axios";

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  // Função para buscar os empréstimos
  const fetchLoans = async () => {
    try {
      const response = await axios.get("http://localhost:8080/Emprestimo/todos");
      setLoans(response.data.content); // Assume que a API retorna `content` com os dados paginados
    } catch (error) {
      console.error("Erro ao buscar empréstimos:", error);
      setMessage("Erro ao carregar os empréstimos.");
    }
  };

  // Registrar empréstimo
  const handleLoan = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/Emprestimo/aluga", {
        usuarioId: userId,
        livroId: bookId,
        dataLimite: dueDate,
      });

      if (response.status === 201) {
        setMessage("Empréstimo registrado com sucesso!");
      }
      setUserId("");
      setBookId("");
      setDueDate("");
      fetchLoans(); // Atualiza a tabela após o registro
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("O usuário atingiu o limite de 5 empréstimos!");
      } else {
        setMessage("Erro ao registrar empréstimo.");
      }
    }
  };

  // Devolução de livro
  const handleReturn = async (loanId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/Emprestimo/devolucao/${loanId}`
      );
      if (response.status === 200) {
        setMessage("Livro devolvido com sucesso!");
      }
      fetchLoans(); // Atualiza a tabela após a devolução
    } catch (error) {
      console.error("Erro ao devolver livro:", error);
      setMessage("Erro ao devolver livro.");
    }
  };

  // Carregar os empréstimos ao montar o componente
  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestão de Empréstimos</h1>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {/* Formulário para registrar empréstimo */}
      <form onSubmit={handleLoan}>
        <div>
          <label>Usuário ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Livro ID:</label>
          <input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Data Limite:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrar Empréstimo</button>
      </form>

      {/* Lista de empréstimos */}
      <h2>Empréstimos Ativos</h2>
      {loans.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID Empréstimo</th>
              <th>Usuário</th>
              <th>Livro</th>
              <th>Data Limite</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{loan.usuarioId}</td>
                <td>{loan.livroId}</td>
                <td>{loan.dataLimite}</td>
                <td>
                  <button onClick={() => handleReturn(loan.id)}>
                    Devolver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum empréstimo ativo encontrado.</p>
      )}
    </div>
  );
};

export default LoansPage;
