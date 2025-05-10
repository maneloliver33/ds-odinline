
const usuario= JSON.parse(localStorage.getItem('usuarioLogado'));
if (!usuario || !usuario.chave) {
  alert("Você precisa estar logado.");
  window.location.href= 'index.html';
}

const listaCompras= document.getElementById('lista-compras');
const tabelaCompras= document.getElementById('tabela-compras');
const semCompras= document.getElementById('sem-compras');

function carregarCompras() {
  const compras= JSON.parse(localStorage.getItem('compras')) || [];
  
  listaCompras.innerHTML= '';
  
  if (compras.length=== 0) {
    tabelaCompras.style.display= 'none';
    semCompras.style.display= 'block';
    return;
  }
  
  tabelaCompras.style.display= 'table';
  semCompras.style.display= 'none';
  
  compras.forEach(compra => {
    const linha= document.createElement('tr');
    
    const data= new Date();
    const dataFormatada= data.toLocaleDateString('pt-BR') + ' ' + 
                       data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
    
    const valorFormatado= "R$" + parseFloat(compra.valor).toFixed(2).replace('.', ',');
    
    linha.innerHTML= `
      <td>${compra.idProduto || '-'}</td>
      <td>${compra.descricao}</td>
      <td>${valorFormatado}</td>
      <td>${dataFormatada}</td>
    `;
    
    listaCompras.appendChild(linha);
  });
}

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', carregarCompras);