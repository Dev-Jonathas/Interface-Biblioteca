import React, { useState, useEffect } from "react";

const LoansPage = () => {
  const baseUrl = "http://localhost:8080/Emprestimo"; // Substitua pela URL do seu backend

  const [loans, setLoans] = useState([]);
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  // Função para buscar empréstimos
  const fetchLoans = async () => {
    try {
      const response = await fetch(`${baseUrl}/todos`);
      const data = await response.json();

      // Verificar se 'content' existe e é um array
      if (response.ok && Array.isArray(data.content)) {
        setLoans(data.content); // Atualiza o estado com os empréstimos
      } else {
        setLoans([]); // Se a resposta não tiver 'content' ou se não for um array
        setMessage("Erro ao buscar empréstimos. Dados inesperados.");
      }
    } catch (error) {
      console.error("Erro ao buscar empréstimos:", error);
      setLoans([]); // Limpa a lista de empréstimos se houver erro
      setMessage("Erro ao carregar os empréstimos.");
    }
  };

  // Função para registrar empréstimo
  const handleLoan = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/aluga`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: userId,
          livroId: bookId,
          dataLimite: dueDate,
        }),
      });

      if (response.ok) {
        setMessage("Empréstimo registrado com sucesso!");
      } else if (response.status === 400) {
        setMessage("O usuário atingiu o limite de 5 empréstimos!");
      } else {
        throw new Error("Erro ao registrar empréstimo.");
      }

      setUserId("");
      setBookId("");
      setDueDate("");
      fetchLoans(); // Atualiza a lista de empréstimos após o registro
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Função para devolver livro
  const handleReturn = async (loanId) => {
    try {
      const response = await fetch(`${baseUrl}/devolucao/${loanId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Livro devolvido com sucesso!");
        fetchLoans(); // Atualiza a lista de empréstimos após a devolução
      } else {
        throw new Error("Erro ao devolver livro.");
      }
    } catch (error) {
      console.error("Erro ao devolver livro:", error);
      setMessage("Erro ao devolver livro.");
    }
  };

  // Carregar empréstimos ao montar o componente
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
              <th>Status</th>
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
                <td>{loan.status}</td>
                <td>
                  {loan.status === "PENDENTE" && (
                    <button onClick={() => handleReturn(loan.id)}>
                      Devolver
                    </button>
                  )}
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
