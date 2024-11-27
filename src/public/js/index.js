// Página inicial: redireciona para a página de checkboxes ao clicar no botão "Ir para a página"
function goToCheckboxPage(event)
{
    event.preventDefault(); // Evita o envio padrão do formulário

    // Capturando os valores dos campos
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const sexo = document.getElementById('sexo').value;
    const peso = document.getElementById('peso').value;
    const altura = document.getElementById('altura').value;

    console.log(`Nome: ${nome}, Idade: ${idade}, Sexo: ${sexo}, Peso: ${peso}, Altura: ${altura}`);

    // Redireciona para a página de checkboxes
    window.location.href = "checkbox.html";
}
