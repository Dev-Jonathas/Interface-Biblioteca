import React, { useState, useEffect } from 'react';

const UsersPage = () => {
  // Estado para armazenar os dados dos usuários
  const [usuarios, setUsuarios] = useState([]);
  
  // Estado para o cadastro de novo usuário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [numero, setNumero] = useState('');

  // Estado para editar um usuário
  const [userId, setUserId] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [novoLogradouro, setNovoLogradouro] = useState('');
  const [novoCep, setNovoCep] = useState('');
  const [novoBairro, setNovoBairro] = useState('');
  const [novoCidade, setNovoCidade] = useState('');
  const [novoNumero, setNovoNumero] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Função para obter usuários da API
  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/Usuario/todos');  // Substitua pela URL correta da sua API
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  // Efeito para carregar usuários na primeira renderização
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Função para cadastrar usuário
  const cadastrarUsuario = async (event) => {
    event.preventDefault();
    const novoUsuario = {
      nome,
      email,
      telefone,
      endereco: {
        logradouro,
        cep,
        bairro,
        cidade,
        numero,
      }
    };

    try {
      const response = await fetch('http://localhost:8080/Usuario/cadastra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoUsuario),
      });
      
      if (response.ok) {
        fetchUsuarios(); // Atualizar a lista de usuários após o cadastro
        setNome('');
        setEmail('');
        setTelefone('');
        setLogradouro('');
        setCep('');
        setBairro('');
        setCidade('');
        setNumero('');
      } else {
        alert("Erro ao cadastrar usuário");
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  };

  // Função para atualizar o usuário
  const atualizarUsuario = async (event) => {
    event.preventDefault();
    const updatedUsuario = {
      nome: novoNome,
      email: novoEmail,
      telefone: novoTelefone,
      endereco: {
        logradouro: novoLogradouro,
        cep: novoCep,
        bairro: novoBairro,
        cidade: novoCidade,
        numero: novoNumero,
      }
    };

    try {
      const response = await fetch(`http://localhost:8080/Usuario/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUsuario),
      });
      
      if (response.ok) {
        fetchUsuarios(); // Atualizar a lista de usuários após a atualização
        setShowModal(false);
      } else {
        alert("Erro ao atualizar usuário");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  // Função para deletar o usuário
  const deletarUsuario = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/Usuario/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchUsuarios(); // Atualizar a lista de usuários após a exclusão
      } else {
        alert("Erro ao deletar usuário");
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    }
  };

  // Abrir o modal de atualização
  const abrirModal = (id) => {
    const usuario = usuarios.find((user) => user.id === id);
    setUserId(usuario.id);
    setNovoNome(usuario.nome);
    setNovoEmail(usuario.email);
    setNovoTelefone(usuario.telefone);
    setNovoLogradouro(usuario.endereco.logradouro);
    setNovoCep(usuario.endereco.cep);
    setNovoBairro(usuario.endereco.bairro);
    setNovoCidade(usuario.endereco.cidade);
    setNovoNumero(usuario.endereco.numero);
    setShowModal(true);
  };

  // Fechar o modal de atualização
  const fecharModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
      <h1>Gerenciador de Biblioteca</h1>

      {/* Formulário de Cadastro */}
      <div className="form-container">
        <h2>Cadastro de Usuário</h2>
        <form onSubmit={cadastrarUsuario}>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="telefone">Telefone:</label>
          <input
            type="tel"
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
          <h3>Endereço</h3>
          <label htmlFor="logradouro">Logradouro:</label>
          <input
            type="text"
            id="logradouro"
            value={logradouro}
            onChange={(e) => setLogradouro(e.target.value)}
            required
          />
          <label htmlFor="cep">CEP:</label>
          <input
            type="text"
            id="cep"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            required
          />
          <label htmlFor="bairro">Bairro:</label>
          <input
            type="text"
            id="bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            required
          />
          <label htmlFor="cidade">Cidade:</label>
          <input
            type="text"
            id="cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
          />
          <label htmlFor="numero">Número:</label>
          <input
            type="text"
            id="numero"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />
          <button type="submit">Cadastrar</button>
        </form>
      </div>

      {/* Lista de Usuários */}
      <div className="user-list-container">
        <h2>Lista de Usuários</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{usuario.telefone}</td>
                <td>{`${usuario.endereco.logradouro}, ${usuario.endereco.bairro}, ${usuario.endereco.cidade}`}</td>
                <td>
                  <button onClick={() => abrirModal(usuario.id)}>Editar</button>
                  <button onClick={() => deletarUsuario(usuario.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edição */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Usuário</h2>
            <form onSubmit={atualizarUsuario}>
              <label htmlFor="novoNome">Nome:</label>
              <input
                type="text"
                id="novoNome"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                required
              />
              <label htmlFor="novoEmail">Email:</label>
              <input
                type="email"
                id="novoEmail"
                value={novoEmail}
                onChange={(e) => setNovoEmail(e.target.value)}
                required
              />
              <label htmlFor="novoTelefone">Telefone:</label>
              <input
                type="tel"
                id="novoTelefone"
                value={novoTelefone}
                onChange={(e) => setNovoTelefone(e.target.value)}
                required
              />
              <h3>Endereço</h3>
              <label htmlFor="novoLogradouro">Logradouro:</label>
              <input
                type="text"
                id="novoLogradouro"
                value={novoLogradouro}
                onChange={(e) => setNovoLogradouro(e.target.value)}
                required
              />
              <label htmlFor="novoCep">CEP:</label>
              <input
                type="text"
                id="novoCep"
                value={novoCep}
                onChange={(e) => setNovoCep(e.target.value)}
                required
              />
              <label htmlFor="novoBairro">Bairro:</label>
              <input
                type="text"
                id="novoBairro"
                value={novoBairro}
                onChange={(e) => setNovoBairro(e.target.value)}
                required
              />
              <label htmlFor="novoCidade">Cidade:</label>
              <input
                type="text"
                id="novoCidade"
                value={novoCidade}
                onChange={(e) => setNovoCidade(e.target.value)}
                required
              />
              <label htmlFor="novoNumero">Número:</label>
              <input
                type="text"
                id="novoNumero"
                value={novoNumero}
                onChange={(e) => setNovoNumero(e.target.value)}
                required
              />
              <button type="submit">Salvar</button>
              <button type="button" onClick={fecharModal}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
