// Alterna entre texto escondido e visível
function mostrarSenha() {
  let inputSenha = document.getElementById("password");
  let btnOlho = document.getElementById("btn-olho");

  if (inputSenha.type === "password") {
    inputSenha.type = "text";
    btnOlho.innerText = "🙈"; // Troca o emoji
  } else {
    inputSenha.type = "password";
    btnOlho.innerText = "👁️";
  }
}

const supabaseUrl = "https://mscexjamdkbdydbysrxy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zY2V4amFtZGtiZHlkYnlzcnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzE3MjksImV4cCI6MjA4OTg0NzcyOX0.Q79BW24Ron3giOrMeTduh1TzjkrnEQxgXdGOZORZwLI";
const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

async function fazerLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("mensagem");
  const btn = document.getElementById("btn-entrar");

  // Efeito de carregamento (Feedback visual)
  btn.innerText = "Verificando...";
  btn.disabled = true;

  // Comando que tenta logar no Supabase
  const { data, error } = await banco.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    msg.innerText = "Acesso Negado: " + error.message;
    msg.style.color = "red";
    btn.innerText = "Entrar no Painel";
    btn.disabled = false; // Libera o botão novamente
  } else {
    msg.innerText = "Acesso concedido! Carregando painel...";
    msg.style.color = "green";
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const campoSenha = document.getElementById("password");

    campoSenha.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // evita comportamento estranho
        fazerLogin();
      }
    });
  });

  async function verificarLoginExistente() {
    const {
      data: { user },
    } = await banco.auth.getUser();

    if (user) {
      // Já está logado → manda direto pro painel
      window.location.href = "admin.html";
    }
  }

  // Executa assim que a página carregar
  verificarLoginExistente();
}
