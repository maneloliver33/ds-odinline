document.getElementById("form-cadastro").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const nome= document.getElementById("nome").value;
    const email= document.getElementById("email").value;
    const senha= document.getElementById("senha").value;
  
    const usuario= {
      nome,
      email,
      senha
    };
  
    // Salvar no localStorage (poderia ser um array de usuários, aqui é um único para exemplo)
    localStorage.setItem("usuarioCadastrado", JSON.stringify(usuario));
  
    alert("Cadastro realizado com sucesso!");
    window.location.href = "index.html";
  });  