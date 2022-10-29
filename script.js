let nome, div;
function entrar(){
    div = document.querySelector(".telaEntrada");
    if(div.children[1].value !== ''){
        nome = {name : `${div.children[1].value}`};
        div.children[1].value = '';
        const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome);
        promessa.then(sucesso);
        promessa.catch(falha);
    }
}
function sucesso(resposta) {
    div.classList.add("desabilitada");
    div.classList.remove("telaEntrada");
    setInterval(mantemConexao, 5000);
	atualizaMensagens();
    setInterval(atualizaMensagens, 3000);
}
function falha(erro) {
    document.querySelector('.nomeInvalido').classList.remove('desabilitada');
}
function mantemConexao(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);
}
function atualizaMensagens(){
    const mensagem = document.querySelector(".container");
    mensagem.innerHTML = "";
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(processarMensagens);
}
function processarMensagens(resposta){
    let listaMensagens = resposta.data;
    const mensagem = document.querySelector(".container");
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
        }else if((listaMensagens[i].type === "private_message" && listaMensagens[i].to === nome.name) || (listaMensagens[i].type === "private_message" && listaMensagens[i].from === nome.name)){
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
    elementoQueQueroQueApareca.scrollIntoView();
}
function enviarMensagem(botaoEnviar){
    const rodape = botaoEnviar.parentNode;
    let texto = rodape.children[0].value;
    if(texto !== ''){
        let mensagem = {
            from: nome.name,
            to: "Todos",
            text: texto,
            type: "message"
        }
        axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);
        rodape.children[0].value = '';
    }
}