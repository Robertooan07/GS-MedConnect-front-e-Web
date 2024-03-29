import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../scss/Form.scss';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';

export default function Login() {

  document.title = "hAppVida Fitness | Login";
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const history = useNavigate();

  const checkPreviousLogin = () => {
  const isLoggedIn = sessionStorage.getItem('userToken');

    if (isLoggedIn) {
      toast.error('Ocorreu um erro: Você já está logado.');
      history('/');
      return true;
    }
    return false;
  };

  

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSenhaChange = (event) => {
    setSenha(event.target.value);
  };

  const handleLogin = async () => {
    const isAlreadyLoggedIn = checkPreviousLogin();

    if (isAlreadyLoggedIn) {
      return;
    }

    function gerarToken(email) {
      // Gera a hash SHA-256 do email
      const hashEmail = CryptoJS.SHA256(email).toString();

      return hashEmail.substring(0, 15);
    }


    // Fetch dados da API
    try {
      const response = await fetch('http://localhost:7000/users');
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários.');
      }
      const users = await response.json();
      const user = users.find(user => user.email === email.trim() && user.senha === senha.trim());

      if (user) {
        const token = gerarToken(); // Guardar os dados do usuário no storage
        sessionStorage.setItem('userToken', token);
        sessionStorage.setItem('userName', user.nome);
        sessionStorage.setItem('userMail', user.email);
        toast.success("Login concluido! Bem-vindo(a) " + user.nome + "!");
        history('/');

      } else {
        toast.error("Login não encontrado, verifique suas informações ou se tem cadastro.");
      }
    } catch (error) {
      toast.error("Erro ao autentificar o login: " + error.message);
    }
  };
  //painel principal de login 
  return (
    <>

      <h1>Login</h1>

      <form>
        <label htmlFor="loginPassword">Email:</label> 
        <input type="text" placeholder="Digite seu email" value={email} onChange={handleEmailChange} />
        <br />

        <label htmlFor="loginPassword">Senha:</label>
        <input type="password" id="loginPassword" placeholder="Digite sua senha" value={senha} onChange={handleSenhaChange} />
        <br />
        <div className='containerLoginButton'>
          <button type="button" id='loginButton' onClick={handleLogin}>Login</button>

        </div>
        <h2>Ainda não tem conta? <Link to="/cadastro">Clique aqui para fazer seu cadastro</Link></h2>
      </form>

    </>
  );
}


