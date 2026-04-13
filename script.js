// 1. CONFIGURAÇÃO DO BANCO DE DADOS
const supabaseUrl = "https://mscexjamdkbdydbysrxy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zY2V4amFtZGtiZHlkYnlzcnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzE3MjksImV4cCI6MjA4OTg0NzcyOX0.Q79BW24Ron3giOrMeTduh1TzjkrnEQxgXdGOZORZwLI";

// Tenta carregar o carrinho salvo no navegador, ou começa um vazio []
let carrinho = JSON.parse(localStorage.getItem("meu_carrinho")) || [];
// Inicia a conexão
const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. FUNÇÃO PARA BUSCAR E DESENHAR OS PRODUTOS
async function carregarCatalogo() {
  // Faz um SELECT * FROM produtos na nuvem
  let { data: produtos, error } = await banco.from("produtos").select("*");

  if (error) {
    console.error("Erro ao buscar dados:", error);
    return;
  }

  let vitrine = document.getElementById("vitrine");
  vitrine.innerHTML = ""; // Limpa a tela

  // Loop para desenhar cada produto na tela
  produtos.forEach((item) => {
    // Cria a máscara de moeda Brasileira
    let precoFormatado = Number(item.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    let div = document.createElement("div");
    div.className = "card-produto";
    div.innerHTML = `
        <img src="${item.imagem_url}" width="150">
        <h3>${item.nome}</h3>
        <p class="preco-destaque">${precoFormatado}</p>
        <h4>${item.categoria}</h4>
        <button onclick="adicionarAoCarrinho('${item.nome}', ${item.preco})">
                Adicionar ao Carrinho
            </button>
    `;
    vitrine.appendChild(div);
  });
}

// 1. ADICIONAR ITEM
function adicionarAoCarrinho(nome, preco) {
  const item = { nome, preco };
  carrinho.push(item);
  atualizarCarrinho();
}

// 2. ATUALIZAR A TELA E O LOCALSTORAGE (mantendo o código original)
function atualizarCarrinho() {
  const listaHtml = document.getElementById("lista-carrinho");
  const totalHtml = document.getElementById("valor-total");

  listaHtml.innerHTML = "";
  let somaTotal = 0;

  carrinho.forEach((item, index) => {
    somaTotal += item.preco;
    // Aqui adicionamos apenas o botão ❌ sem mudar o resto
    listaHtml.innerHTML += `
          <li>
              ${item.nome} - R$ ${item.preco.toFixed(2)}
              <button onclick="removerItem(${index})" class="btn-remover">❌</button>
          </li>
      `;
  });

  totalHtml.innerText = somaTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  localStorage.setItem("meu_carrinho", JSON.stringify(carrinho));
}

// 3. FUNÇÃO REMOVER ITEM (novo)
function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

// 4. LIMPAR TUDO
function esvaziarCarrinho() {
  carrinho = [];
  atualizarCarrinho();
}

// Inicializa o carrinho
atualizarCarrinho();

// Roda a função assim que o site abrir
carregarCatalogo();
