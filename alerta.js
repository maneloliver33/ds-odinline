
const usuario= JSON.parse(localStorage.getItem('usuarioLogado'));
if (!usuario || !usuario.chave) {
  alert("Você precisa estar logado.");
  window.location.href= 'index.html';
}

const listaProdutos= document.getElementById('lista-produtos');
const formAlerta= document.getElementById('form-alerta');
const inputProduto= document.getElementById('produto-id');
const inputValor= document.getElementById('valor-desejado');
const selectAcao= document.getElementById('acao');

function carregarProdutos() {
  fetch(`https://api-odinline.odiloncorrea.com/produto/${usuario.chave}/usuario`)
    .then(response => response.json())
    .then(produtos => {
      listaProdutos.innerHTML= '';
      if (produtos.length=== 0) {
        listaProdutos.innerHTML = '<li class="list-group-item">Nenhum produto cadastrado.</li>';
      } else {
        produtos.forEach(produto => {
          const item= document.createElement('li');
          item.className= 'list-group-item d-flex justify-content-between align-items-center';
          item.innerHTML= `
            <div>
              <strong>${produto.descricao}</strong><br>
              ID: ${produto.id} | Valor: R$${produto.valor}
            </div>
            <img src="${produto.urlImagem}" alt="Imagem" width="60">
          `;
          listaProdutos.appendChild(item);
        });
      }
    });
}

formAlerta.addEventListener('submit', function (e) {
  e.preventDefault();

  const idProduto= parseInt(inputProduto.value);
  const valorDesejado= parseFloat(inputValor.value);
  const acao= selectAcao.value;

  let alertas= JSON.parse(localStorage.getItem('alertas')) || [];

  if (alertas.some(a => a.idProduto=== idProduto && a.status=== 'ativo')) {
    alert("Você já cadastrou um alerta ativo para este produto.");
    return;
  }

  const novoAlerta= {
    idProduto,
    valorDesejado,
    acao,
    status: 'ativo'
  };

  alertas.push(novoAlerta);
  localStorage.setItem('alertas', JSON.stringify(alertas));

  alert("Alerta cadastrado com sucesso!");
  formAlerta.reset();
});

setInterval(() => {
  let alertas= JSON.parse(localStorage.getItem('alertas')) || [];

  alertas.forEach(async (alerta, index) => {
    if (alerta.status!== 'ativo') return;

    const resposta= await fetch(`https://api-odinline.odiloncorrea.com/produto/${alerta.idProduto}`);
    const produto= await resposta.json();
    const precoAtual= parseFloat(produto.valor);

    if (precoAtual<= alerta.valorDesejado) {
      if (alerta.acao=== 'notificar') {
        alert(`🔔 Alerta: O produto ${produto.descricao} está por R$${precoAtual}`);
      } else if (alerta.acao=== 'comprar') {
        let compras = JSON.parse(localStorage.getItem('compras')) || [];
        compras.push({
          idProduto: alerta.idProduto,
          descricao: produto.descricao,
          valor: precoAtual
        });
        localStorage.setItem('compras', JSON.stringify(compras));
        alert(`🛒 Compra registrada: ${produto.descricao} por R$${precoAtual}`);
      }

      alertas[index].status= 'executado';
      localStorage.setItem('alertas', JSON.stringify(alertas));
    }
  });
}, 10000);

carregarProdutos();

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href= 'index.html';
}