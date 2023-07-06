class Validators {
  validaNomeCedente(nome){
    if (nome == "") {
      return false;
    }
    return nome;
  }

  validaTaxa(taxa) {
    const regex = /[a-zA-Z]/;
    if (taxa == "") {
      return false;
    }
    if (regex.test(taxa)) {
      return false;
    }
    return taxa;
  }

  checkboxValidator() {
    if (checkboxClienteAntigo.checked) {
      return "Antigo";
    }
    if (checkboxClienteNovo.checked) {
      return "Novo";
    }

    if (!checkboxClienteAntigo.checked && !checkboxClienteNovo.checked) {
      return false;
    }
  }

  validaNotas(contador) {
    let arrElementos = [];
    for (let i = 1; i <= contador; i++) {
      let puxaInput = document.getElementById(`nota-${i}`);
      let valorInput = puxaInput.value;
      arrElementos.push(valorInput);
    }
    return arrElementos;
  }

  validaVencimentoNotas(contador) {
    let arrElementos = [];
    for (let i = 1; i <= contador; i++) {
      let puxaInput = document.getElementById(`nota-vencimento-${i}`);
      let valorInput = puxaInput.value;
      arrElementos.push(valorInput);
    }
    return arrElementos;
  }

  validaSacados(sacados) {
    const regex = /[a-zA-Z]/;
    if (sacados == "") {
      return false;
    }
    if (regex.test(sacados)) {
      return false;
    }
    if (sacados <= 0) {
      return false;
    }
    return sacados;
  }

  validaOperacao(operacao) {
    let taxaAtual =parseFloat(operacao.taxa);
    const notasArr = operacao.notas;
    const notasVencimentoArr = operacao.vencimento;
    let contadorRisco = 0;
    let riscoOperacao = "";
    let valorBruto=0
    let valorFinal=0

    // Avalia o tipo de cliente
    if (operacao.cliente === "Novo") {
      taxaAtual += 0.5;
      contadorRisco += 2;
    } else {
      taxaAtual += 0.05;
      contadorRisco += 0.05;
    }

    // Verifica quantidade de notas
    const quantidadeNotas = notasArr.length;
    if (quantidadeNotas < 2) {
      taxaAtual += 0.2;
      contadorRisco += 2;
    } else if (quantidadeNotas >= 2 && quantidadeNotas <= 4) {
      taxaAtual += 0.1;
      contadorRisco += 0.5;
    } else {
      taxaAtual += 0.05;
      contadorRisco += 0.05;
    }

    // Verifica valores das notas
    notasArr.forEach((nota) => {
      let valornota=parseFloat(nota)
      valorBruto+=valornota
      if (nota >= 15000) {
        taxaAtual += 0.08;
        contadorRisco += 2;
      } else {
        taxaAtual += 0.05;
        contadorRisco += 0.05;
      }
    });

    // Verifica média de vencimento das notas
    const somaVencimento = notasVencimentoArr.reduce(
      (total, vencimento) => total + vencimento,
      0
    );
    const mediaVencimento = somaVencimento / notasVencimentoArr.length;
    if (mediaVencimento >= 30 && mediaVencimento <= 45) {
      taxaAtual += 0.05;
      contadorRisco += 0.05;
    } else {
      taxaAtual += 0.15;
      contadorRisco += 2;
    }

    // Verifica quantidade de sacados
    const quantidadeSacados = operacao.sacados;
    if (quantidadeSacados < 2) {
      taxaAtual += 0.2;
      contadorRisco += 2;
    } else if (quantidadeSacados >= 2 && quantidadeSacados <= 5) {
      taxaAtual += 0.1;
      contadorRisco += 0.5;
    } else {
      taxaAtual += 0.05;
      contadorRisco += 0.05;
    }

    // Avalia o risco da operação
    if (contadorRisco >= 1 && contadorRisco <= 3) {
      riscoOperacao = "Baixo";
    } else if (contadorRisco > 3 && contadorRisco <= 5) {
      riscoOperacao = "Médio";
    } else {
      riscoOperacao = "Alto";
    }

    // Calcula o valor final (valor líquido)
    let conta1=(valorBruto*taxaAtual)/100
    valorFinal=valorBruto-conta1.toFixed(2)

    return {taxa:taxaAtual.toFixed(2),risco:riscoOperacao,cedente:operacao.nomeCedente,ValorBruto:valorBruto,ValorFinal:valorFinal}
  }
}

class Operacao {
  nomeCedente
  cliente;
  taxa;
  notas;
  vencimento;
  sacados;

  constructor(nomeCedente,cliente, taxa, notas, vencimento, sacados) {
    this.nomeCedente=nomeCedente
    this.cliente = cliente;
    this.taxa = taxa;
    this.notas = notas;
    this.vencimento = vencimento;
    this.sacados = sacados;
  }
}

const validators = new Validators();
//Campos do formulário
const nomeCedente=document.getElementById('nome-cedente')

const clienteH5 = document.getElementById("cliente-h5");

const checkboxClienteNovo = document.getElementById("cliente_novo");
const checkboxClienteAntigo = document.getElementById("cliente_antigo");

const valorTaxa = document.getElementById("taxa");

//Lógica de inserir as notas
function criarNota(contador01){
  const box=document.createElement("div")
  box.id = 'box-nota';
  box.className='box-nota'

  const btnapagar=document.createElement('button')
  btnapagar.id='btn-apagar'
  btnapagar.className='btn btn-danger'
  btnapagar.innerHTML='Apagar'

  box.innerHTML=`<input id="nota-${contador01}" type="text" placeholder="Insira o valor da nota">`
  campoNotas.appendChild(box)
  box.appendChild(btnapagar)

  btnapagar.addEventListener('click',(e)=>{
    contador--
    box.innerHTML=``
    box.remove()
  })

}

const botaoInserirNotas = document.getElementById("btn_notas");
const botaoDeletarNota = document.getElementById("deletarNota");
const campoNotas = document.getElementById("campos-notas");
const msgNotas = document.getElementById("mesg-notas");
let contador = 0;
let contador02 = 0;
botaoInserirNotas.addEventListener("click", () => {
  msgNotas.innerText = "Primeiro insira as notas e depois preencha os valores";
  contador++;
  criarNota(contador)
});

//Lógica de inserir os vencimentos das notas
function criarVencimentoNota(contador){
  const box=document.createElement("div")
  box.id = 'box-nota';
  box.className='box-nota'

  const btnapagar=document.createElement('button')
  btnapagar.id='btn-apagar'
  btnapagar.className='btn btn-danger'
  btnapagar.innerHTML='Apagar'

  box.innerHTML=`<input id="nota-vencimento-${contador}" type="text" placeholder="Insira os dias">`
  campoVencimentoNotas.appendChild(box)
  box.appendChild(btnapagar)

  btnapagar.addEventListener('click',(e)=>{
    contador02--
    box.innerHTML=``
    box.remove()
  })
}

const btnInserirVencimentoNotas = document.getElementById("btn_vencimento_notas");
const campoVencimentoNotas = document.getElementById("campos-vencimento-notas");
const msgVencimentoNotas = document.getElementById("mesg-vencimento-notas");
btnInserirVencimentoNotas.addEventListener("click", () => {
  contador02++;
  msgVencimentoNotas.innerText ="Coloque os dias corridos.Ex: 30,60,120 dias";
  criarVencimentoNota(contador02)
});

//Valores sobre sacado
const qntdSacados = document.getElementById("sacados");

//Div erro e resultado
const erroMesage = document.getElementById("errorAlert");
const resultadoMessage=document.getElementById("resultado-div")

const botaoSimular = document.getElementById("btn-simular");
//Validando nome cedente
botaoSimular.addEventListener("click", () => {

  const nomeCedenteValido = validators.validaNomeCedente(nomeCedente.value);
  const clienteValido = validators.checkboxValidator();
  const taxaValida = validators.validaTaxa(valorTaxa.value);
  const notasValidas = validators.validaNotas(contador);
  const vencimentoNotasValido = validators.validaVencimentoNotas(contador02);
  const sacadosValidos = validators.validaSacados(qntdSacados.value);

  if (nomeCedenteValido !== false &&
    clienteValido !== false &&
    taxaValida !== false &&
    notasValidas.length > 0 &&
    vencimentoNotasValido.length > 0 &&
    sacadosValidos !== false) {
    erroMesage.style.display = "none";
    const operacao = new Operacao(
      validators.validaNomeCedente(nomeCedente.value),
      validators.checkboxValidator(),
      validators.validaTaxa(valorTaxa.value),
      validators.validaNotas(contador),
      validators.validaVencimentoNotas(contador02),
      validators.validaSacados(qntdSacados.value)
    );
    const realizarSimulacao=validators.validaOperacao(operacao)
    resultadoMessage.style.display='flex'
    resultadoMessage.style.flexDirection='column'
    resultadoMessage.innerHTML=`
    <h3>Risco da operação: ${realizarSimulacao.risco}</h3>
    <h2>Cedente: ${realizarSimulacao.cedente}</h2>
    <h3>Valor bruto:R$ ${realizarSimulacao.ValorBruto}</h3>
    <h3>Valor líquido:R$ ${realizarSimulacao.ValorFinal}</h3>
    <h4>Taxa final: ${realizarSimulacao.taxa}%</h4>`
    resultadoMessage.scrollIntoView({ behavior: 'smooth' });
  } else {
    resultadoMessage.style.display='none'
    erroMesage.style.display = "block";
    erroMesage.innerText ="Preencha os campos novamente e verifique as informações fornecidas";
    erroMesage.scrollIntoView({ behavior: 'smooth' });
  }
});

// Impede que o usuário marque dois checkbox
checkboxClienteNovo?.addEventListener("click", function () {
  checkboxClienteAntigo.checked = false;
});

checkboxClienteAntigo?.addEventListener("click", function () {
  checkboxClienteNovo.checked = false;
});
