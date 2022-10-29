let nome, div, elementoQueQueroQueApareca = '', listaAntiga = [], listaMensagens = [{from: '', text: '', time: '', to: '', type: ''}], ultimaMensagem = '', novaMensagem = '';
function entrar(){
    div = document.querySelector(".telaEntrada");
    if(div.children[1].value !== ''){
        nome = {name : `${div.children[1].value}`};
        div.children[1].value = '';
        const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome);
        div.children[1].classList.add('desabilitada');
        div.children[2].classList.add('desabilitada');
        div.children[3].classList.add('desabilitada');
        div.children[4].classList.remove('desabilitada');
        div.children[5].classList.remove('desabilitada');
        promessa.then(sucesso);
        promessa.catch(falha);
    }
}
function sucesso() {
    div.children[4].classList.add('desabilitada');
    div.children[5].classList.add('desabilitada');
    div.classList.add("desabilitada");
    div.classList.remove("telaEntrada");
    setInterval(mantemConexao, 5000);
	atualizaMensagens();
    setInterval(atualizaMensagens, 3000);
}
function falha() {
    div.children[1].classList.remove('desabilitada');
    div.children[2].classList.remove('desabilitada');
    div.children[3].classList.remove('desabilitada');
    div.children[4].classList.add('desabilitada');
    div.children[5].classList.add('desabilitada');
}
function mantemConexao(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);
}
function atualizaMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(processarMensagens);
}
function processarMensagens(resposta){    
    listaAntiga = listaMensagens;
    listaMensagens = resposta.data;
    ultimaMensagem = listaAntiga[listaAntiga.length-1];
    novaMensagem = listaMensagens[listaMensagens.length-1];
    if(ultimaMensagem.from !== novaMensagem.from || ultimaMensagem.text !== novaMensagem.text || ultimaMensagem.time !== novaMensagem.time || ultimaMensagem.to !== novaMensagem.to || ultimaMensagem.type !== novaMensagem.type){
        const mensagem = document.querySelector(".container");
        mensagem.innerHTML = "";
        for(let i = 0; i < listaMensagens.length; i++){
            if(listaMensagens[i].type === "status"){
                mensagem.innerHTML += `
                    <div class="mensagem status" id="${i}">
                        <span class="horario">(${listaMensagens[i].time})</span>
                        <span class="nome">${listaMensagens[i].from}</span>
                        <span class="texto">${listaMensagens[i].text}</span>
                    </div>
                `;
            } else if(listaMensagens[i].type === "message" && listaMensagens[i].to === "Todos"){
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
        elementoQueQueroQueApareca = document.getElementById(listaMensagens.length-1);
        elementoQueQueroQueApareca.scrollIntoView();
    }
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
        const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);
        rodape.children[0].value = '';
        promessa.then(atualizaMensagens);
        promessa.catch(atualizaPagina);
    }
}
function atualizaPagina(){
    window.location.reload();
}
const inputEle = document.getElementById('placeholder-text');
inputEle.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        let btn = document.querySelector(".bEnviar");
        btn.click();
    }
});