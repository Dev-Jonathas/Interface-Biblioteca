import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    logradouro: "",
    cep: "",
    bairro: "",
    cidade: "",
    numero: "",
  });

  const [selectedUser, setSelectedUser] = useState(null); // Estado para o usuário selecionado para edição
  const baseUrl = "http://localhost:8080"; // URL da API

  // Função para buscar usuários
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${baseUrl}/Usuario/todos`);
      console.log("Dados recebidos:", response.data); // Inspecione os dados aqui
      setUsuarios(response.data || []); // Garante que sempre será um array
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  // Função para cadastrar um novo usuário
  const cadastrarUsuario = async (userPayload) => {
    try {
      const response = await axios.post(`${baseUrl}/Usuario/cadastra`, userPayload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        const newUser = response.data; // Aqui a resposta deve conter o ID do usuário
        alert(`Usuário cadastrado com sucesso! ID: ${newUser.id}`);
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Erro ao cadastrar usuário.");
    }
  };

  // Função para buscar um usuário específico e preencher o formulário
  const fetchUserToUpdate = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/Usuario/${id}`);
      setSelectedUser(response.data);
      setFormData({
        nome: response.data.nome,
        email: response.data.email,
        telefone: response.data.telefone,
        logradouro: response.data.endereco.logradouro,
        cep: response.data.endereco.cep,
        bairro: response.data.endereco.bairro,
        cidade: response.data.endereco.cidade,
        numero: response.data.endereco.numero,
      });
    } catch (error) {
      console.error("Erro ao buscar usuário para atualização:", error);
    }
  };

  // Função para atualizar o usuário
  const atualizarUsuario = async (userPayload) => {
    try {
      const response = await axios.put(`${baseUrl}/Usuario/${selectedUser.id}`,
        userPayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        alert("Usuário atualizado com sucesso!");
        await fetchUsuarios(); // Recarregar a lista de usuários
        setSelectedUser(null); // Limpar a seleção
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário.");
    }
  };

  // Função para deletar o usuário
  const deletarUsuario = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/Usuario/${id}`);

      if (response.status === 200) {
        alert("Usuário deletado com sucesso!");
        await fetchUsuarios(); // Recarregar a lista de usuários
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      alert("Erro ao deletar usuário.");
    }
  };

  // Manipula as mudanças nos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manipula a submissão do formulário para criar um novo usuário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userPayload = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      endereco: {
        logradouro: formData.logradouro,
        cep: formData.cep,
        bairro: formData.bairro,
        cidade: formData.cidade,
        numero: formData.numero,
      },
    };

    try {
      await cadastrarUsuario(userPayload);
      alert("Usuário cadastrado com sucesso!");
      await fetchUsuarios(); // Recarrega a lista de usuários
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        logradouro: "",
        cep: "",
        bairro: "",
        cidade: "",
        numero: "",
      });
    } catch (error) {
      alert("Erro ao cadastrar usuário.");
    }
  };

  // Manipula a mudança nos inputs para edição de usuário
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  // Manipula a submissão do formulário para editar um usuário
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    const userPayload = {
      nome: selectedUser.nome,
      email: selectedUser.email,
      telefone: selectedUser.telefone,
      endereco: {
        logradouro: selectedUser.endereco.logradouro,
        cep: selectedUser.endereco.cep,
        bairro: selectedUser.endereco.bairro,
        cidade: selectedUser.endereco.cidade,
        numero: selectedUser.endereco.numero,
      },
    };

    atualizarUsuario(userPayload);
  };

  // Chamada inicial para buscar usuários
  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Gerenciar Usuários</h1>
      </header>

      <main>
        {/* Formulário para cadastro ou edição */}
        <form onSubmit={selectedUser ? handleUpdateSubmit : handleSubmit}>
          <h2>{selectedUser ? "Editar Usuário" : "Cadastrar Usuário"}</h2>

          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone:</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              required
            />
          </div>

          <h3>Endereço</h3>

          <div className="form-group">
            <label htmlFor="logradouro">Logradouro:</label>
            <input
              type="text"
              id="logradouro"
              name="logradouro"
              value={formData.logradouro}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cep">CEP:</label>
            <input
              type="text"
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bairro">Bairro:</label>
            <input
              type="text"
              id="bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cidade">Cidade:</label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="numero">Número:</label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit">{selectedUser ? "Atualizar" : "Cadastrar"}</button>
        </form>

        <h2>Lista de Usuários</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(usuarios) && usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefone}</td>
                  <td>{`${usuario.endereco.logradouro}, ${usuario.endereco.numero} - ${usuario.endereco.bairro}, ${usuario.endereco.cidade}`}</td>
                  <td>
                    <button onClick={() => fetchUserToUpdate(usuario.id)}>Editar</button>
                    <button onClick={() => deletarUsuario(usuario.id)}>Deletar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Nenhum usuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default UsersPage;
