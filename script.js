let nome;
function inicializaPagina(){
    nome = {name : prompt("Qual o seu nome?")};
    // while(){
    //     nome = prompt("Qual o seu nome?");
    // }
    atualizaMensagens();
}
inicializaPagina();
function atualizaMensagens(){
    const mensagem = document.querySelector(".container");
    mensagem.innerHTML = "";
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(processarMensagens);
}
setInterval(atualizaMensagens, 3000);
function processarMensagens(resposta){
    let listaMensagens = resposta.data;
    console.log(listaMensagens);
    const mensagem = document.querySelector(".container");
    console.log(mensagem);
    for(let i = 0; i < listaMensagens.length; i++){
        if(listaMensagens[i].type === "status"){
            mensagem.innerHTML += `
                <div class="mensagem status" id="${i}">
                    <span class="horario">(${listaMensagens[i].time})</span>
                    <span class="nome">${listaMensagens[i].from}</span>
                    <span class="texto">${listaMensagens[i].text}</span>
                </div>
            `;
        } else if(listaMensagens[i].type === "message"){
            mensagem.innerHTML += `
                <div class="mensagem" id="${i}">
                    <span class="horario">(${listaMensagens[i].time})</span>
                    <span class="nome">${listaMensagens[i].from}</span>
                    <span class="texto">para</span>
                    <span class="nome">${listaMensagens[i].to} </span>
                    <span class="texto">${listaMensagens[i].text}</span>
                </div>
            `;
        }else if(listaMensagens[i].to === nome){
            mensagem.innerHTML += `
                <div class="mensagem reservadas" id="${i}">
                    <span class="horario">(${listaMensagens[i].time})</span>
                    <span class="nome">${listaMensagens[i].from}</span>
                    <span class="texto">reservadamente para</span>
                    <span class="nome">${listaMensagens[i].to} </span>
                    <span class="texto">${listaMensagens[i].text}</span>
                </div>
            `;
        }
    }
    const elementoQueQueroQueApareca = document.getElementById(`${listaMensagens.length-1}`);
    console.log(elementoQueQueroQueApareca);
    elementoQueQueroQueApareca.scrollIntoView();
}