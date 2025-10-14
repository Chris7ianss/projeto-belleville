// ===== script.js (VERSÃO CORRIGIDA / COPIAR & COLAR) =====

// --- Referências DOM (globais) ---
const operacaoSelect = document.getElementById("operacao_mola");
const desvioInput = document.getElementById("desvio");
const desvioLabel = document.getElementById("desvio_label");

// --- NOVO: inputs para "Outro valor" ---
let hSobreTInput = document.getElementById("ht_manual");  // input que o usuário digita h/t
let preloadInput = document.getElementById("preload");    // input do preload
hSobreTInput.style.display = "none";  // começam escondidos
preloadInput.style.display = "none";


const unidadeSelect = document.getElementById("unidade_atual");
const unidadeLabel_forca = document.getElementById("unidade_forca");
const unidadeLabel_Do = document.getElementById("unidade_Do");
const unidadeLabel_Dext = document.getElementById("unidade_diametro_externo");
const unidadeLabel_Dint = document.getElementById("unidade_diametro_interno");
const unidadeLabel_h = document.getElementById("unidade_altura_cone");
const unidadeLabel_t = document.getElementById("unidade_espessura");
const unidadeLabel_c = document.getElementById("unidade_tensao_c");
const unidadeLabel_ti = document.getElementById("unidade_tensao_ti");
const unidadeLabel_to = document.getElementById("unidade_tensao_to");

const selectMontagem = document.getElementById("montagem");
const pPlana = document.getElementById("p_plana");
const aPlana = document.getElementById("a_plana");

// Inputs de saída/edição manual 
const espessuraInput = document.getElementById("espessura");         // campo editável/saida t
const alturaInput = document.getElementById("altura_cone");          // campo editável/saida h
const botaoEspessura = document.getElementById("alterar_espessura");
const botaoAltura = document.getElementById("alterar_altura");

// Flags de modo manual (persistem entre chamadas)
let modoManualEspessura = false;
let modoManualAltura = false;




// Mostrar / esconder input desvio dependendo da operação selecionada
function atualizarDesvio() {
  if (operacaoSelect.value === "forca_constante") {
    desvioInput.style.display = "inline-block";
    desvioLabel.style.display = "inline-block";
  } else {
    desvioInput.style.display = "none";
    desvioLabel.style.display = "none";
  }
}
operacaoSelect.addEventListener("change", atualizarDesvio);
atualizarDesvio(); // inicialização

function atualizarHT() {
    const valor = operacaoSelect.value;

    if (valor === "outro_valor") {
        hSobreTInput.style.display = "inline-block";
        preloadInput.style.display = "inline-block";
        document.getElementById("label_ht_manual").style.display = "inline-block";
        document.getElementById("label_preload").style.display = "inline-block";
    } else {
        hSobreTInput.style.display = "none";
        preloadInput.style.display = "none";
        document.getElementById("label_ht_manual").style.display = "none";
        document.getElementById("label_preload").style.display = "none";
    }
}

// Atualiza quando o select muda
operacaoSelect.addEventListener("change", atualizarHT);

// Inicializa correto ao carregar a página
atualizarHT();

// Atualizar labels de unidade quando troca SI/US
function atualizarLabelsUnidade() {
  if (unidadeSelect.value === "SI") {
    unidadeLabel_Do.textContent = "mm";
    unidadeLabel_forca.textContent = "N";
    unidadeLabel_Dext.textContent = "mm";
    unidadeLabel_Dint.textContent = "mm";
    unidadeLabel_h.textContent = "mm";
    unidadeLabel_t.textContent = "mm";
    unidadeLabel_c.textContent = "Mpa";
    unidadeLabel_ti.textContent = "Mpa";
    unidadeLabel_to.textContent = "Mpa";
  } else {
    unidadeLabel_Do.textContent = "in";
    unidadeLabel_forca.textContent = "lbf";
    unidadeLabel_Dext.textContent = "in";
    unidadeLabel_Dint.textContent = "in";
    unidadeLabel_h.textContent = "in";
    unidadeLabel_t.textContent = "in";
    unidadeLabel_c.textContent = "psi";
    unidadeLabel_ti.textContent = "psi";
    unidadeLabel_to.textContent = "psi";
  }
}
unidadeSelect.addEventListener("change", () => {
  atualizarLabelsUnidade();
  // opcional: recalcular pra já ver as mudanças
  Calcular();
});
atualizarLabelsUnidade();

// Atualizar imagens de montagem
function atualizarImagens() {
  if (selectMontagem.value === "posicao_plana") {
    pPlana.classList.add("selecionada");
    pPlana.classList.remove("nao-selecionada");

    aPlana.classList.add("nao-selecionada");
    aPlana.classList.remove("selecionada");
  } else {
    aPlana.classList.add("selecionada");
    aPlana.classList.remove("nao-selecionada");

    pPlana.classList.add("nao-selecionada");
    pPlana.classList.remove("selecionada");
  }
}
selectMontagem.addEventListener("change", atualizarImagens);
atualizarImagens();


// Atualiza visual dos inputs de espessura/altura conforme flags
function atualizaVisualInputs() {
  if (modoManualEspessura) {
    espessuraInput.removeAttribute("readonly");
    espessuraInput.style.backgroundColor = "#fffbe6";
    if (botaoEspessura) botaoEspessura.textContent = "Usar valor calculado";
  } else {
    espessuraInput.setAttribute("readonly", true);
    espessuraInput.style.backgroundColor = "#f2f2f2";
    if (botaoEspessura) botaoEspessura.textContent = "Alterar manualmente";
  }

  if (modoManualAltura) {
    alturaInput.removeAttribute("readonly");
    alturaInput.style.backgroundColor = "#fffbe6";
    if (botaoAltura) botaoAltura.textContent = "Usar valor calculado";
  } else {
    alturaInput.setAttribute("readonly", true);
    alturaInput.style.backgroundColor = "#f2f2f2";
    if (botaoAltura) botaoAltura.textContent = "Alterar manualmente";
  }
}
atualizaVisualInputs();


// --- Listeners dos botões "Alterar manualmente" (apenas uma vez) ---
if (botaoEspessura) {
  botaoEspessura.addEventListener("click", () => {
    modoManualEspessura = !modoManualEspessura;
    atualizaVisualInputs();
    // recalcula para refletir imediatamente
    Calcular();
  });
}
if (botaoAltura) {
  botaoAltura.addEventListener("click", () => {
    modoManualAltura = !modoManualAltura;
    atualizaVisualInputs();
    Calcular();
  });
}


// ---------- Funções principais: obterEntradas e Calcular ----------

function obterEntradas() {
  // ENTRADAS DO USUÁRIO
  const Do = Number(document.getElementById("diametro_externo").value) || 0;
  const razao_Rd = Number(document.getElementById("Rd").value) || 1;
  const forca_p = Number(document.getElementById("forca_plana").value) || 0;
  const desvio_forca = Number(document.getElementById("desvio").value) || 0;
  const operacao = document.getElementById("operacao_mola").value;
  const material_escolhido = document.getElementById("material").value;
  const ajuste = document.getElementById("ajuste").value;
  const tipo_montagem = document.getElementById("montagem").value;
  const unidade_atual = document.getElementById("unidade_atual").value;
  const Fator_seguranca = document.getElementById("coeficiente_min").value;

  // VARIÁVEIS INICIAIS
  let h_over_t;
  let E;
  let poisson;
  let Sut;
  let percentual_Sut;
  let t;
  let h;
  let yminimo;
  let ymaximo;
  let sigma_c;
  let sigma_to;
  let sigma_ti;

  // ATRIBUIR VALOR A h_over_t A PARTIR DA SELEÇÃO
  switch (operacao) {
    case "operacao_bimodal":
      h_over_t = 2.828;
      break;
    case "forca_constante":
      h_over_t = 1.414;
      break;

    case "constante_mola_constante":
      h_over_t = 0.400;
      break;

    case "outro_valor":
      h_over_t = parseFloat(hSobreTInput.value) || 1; // pega o valor digitado
      break;
  }

  // ---------- CÁLCULO DA ESPESSURA (t) ----------
  if (modoManualEspessura) {
    // usa o valor manual do usuário (verifica NaN)
    t = parseFloat(espessuraInput.value);
    if (isNaN(t) || t <= 0) t = 0;
  } else {
    // calculo automático conforme unidade
    if (unidade_atual === "SI") {
      t = (1 / 10) * Math.pow((forca_p * Math.pow(Do, 2)) / (132.4 * h_over_t), 1 / 4);
    } else if (unidade_atual === "US") {
      t = Math.pow((forca_p * Math.pow(Do, 2)) / (19.2e7 * h_over_t), 1 / 4);
    } else {
      // fallback (assume SI)
      t = (1 / 10) * Math.pow((forca_p * Math.pow(Do, 2)) / (132.4 * h_over_t), 1 / 4);
    }
    // atualiza o campo visível
    if (!isNaN(t)) espessuraInput.value = Number(t).toFixed(2);
  }

  // ---------- CÁLCULO DA ALTURA (h) ----------
  if (modoManualAltura) {
    h = parseFloat(alturaInput.value);
    if (isNaN(h) || h <= 0) h = 0;
  } else {
    h = h_over_t * t;
    if (!isNaN(h)) alturaInput.value = Number(h).toFixed(2);
  }

  // --- NOVO: se for "Outro valor", usar preload para ymax ---
if (operacao === "outro_valor") {
    const preload = parseFloat(preloadInput.value) || 1;
    ymaximo = h * preload;
    yminimo = 0;
}



  // ---------- ESCOLHER YMIN E YMAX ----------
  if (operacao === "operacao_bimodal") {
    if (tipo_montagem === "posicao_plana") {
      yminimo = 0;
      ymaximo = 1 * h;
    } else {
      yminimo = 0;
      ymaximo = 2 * h;
    }
  } else if (operacao === "forca_constante") {
    if (tipo_montagem === "posicao_plana") {
      switch (desvio_forca) {
        case 10: yminimo = 0.53 * h; ymaximo = 1 * h; break;
        case 9: yminimo = 0.55 * h; ymaximo = 1 * h; break;
        case 8: yminimo = 0.57 * h; ymaximo = 1 * h; break;
        case 7: yminimo = 0.59 * h; ymaximo = 1 * h; break;
        case 6: yminimo = 0.60 * h; ymaximo = 1 * h; break;
        case 5: yminimo = 0.625 * h; ymaximo = 1 * h; break;
        case 4: yminimo = 0.65 * h; ymaximo = 1 * h; break;
        case 3: yminimo = 0.68 * h; ymaximo = 1 * h; break;
        case 2: yminimo = 0.725 * h; ymaximo = 1 * h; break;
        case 1: yminimo = 0.79 * h; ymaximo = 1 * h; break;
        case 0: yminimo = 1 * h; ymaximo = 1 * h; break;
        default: yminimo = 0.53 * h; ymaximo = 1 * h; break;
      }
    } else {
      switch (desvio_forca) {
        case 10: yminimo = 0.53 * h; ymaximo = 1.46 * h; break;
        case 9: yminimo = 0.55 * h; ymaximo = 1.45 * h; break;
        case 8: yminimo = 0.57 * h; ymaximo = 1.43 * h; break;
        case 7: yminimo = 0.59 * h; ymaximo = 1.41 * h; break;
        case 6: yminimo = 0.6 * h; ymaximo = 1.39 * h; break;
        case 5: yminimo = 0.625 * h; ymaximo = 1.37 * h; break;
        case 4: yminimo = 0.65 * h; ymaximo = 1.35 * h; break;
        case 3: yminimo = 0.68 * h; ymaximo = 1.32 * h; break;
        case 2: yminimo = 0.725 * h; ymaximo = 1.275 * h; break;
        case 1: yminimo = 0.79 * h; ymaximo = 1.225 * h; break;
        case 0: yminimo = h;     ymaximo = h; break;
        default: yminimo = 0.53 * h; ymaximo = 1.46 * h; break;
      }
    }
  } else if (operacao === "constante_mola_constante") {
    if (tipo_montagem === "posicao_plana") {
      yminimo = 0;
      ymaximo = 1 * h;
    } else {
      yminimo = 0;
      ymaximo = 2 * h;
    }
  }

  // ---------- PROPRIEDADES DO MATERIAL ----------
  if (ajuste === "sim") {
    switch (material_escolhido) {
      case "aco_carbono": Sut = 1700; E = 207e3; poisson = 0.28; percentual_Sut = 2.75; break;
      case "aco_inox_301": Sut = 1300; E = 193e3; poisson = 0.31; percentual_Sut = 1.60; break;
      case "aco_inox_302": Sut = 1300; E = 193e3; poisson = 0.31; percentual_Sut = 1.60; break;
      case "17_7ph_rh950": Sut = 1450; E = 203e3; poisson = 0.34; percentual_Sut = 1.60; break;
      case "17_7ph_cond_c": Sut = 1650; E = 203e3; poisson = 0.34; percentual_Sut = 1.60; break;
      default: Sut = 1300; E = 193e3; poisson = 0.31; percentual_Sut = 1.6; break;
    }
  } else {
    switch (material_escolhido) {
      case "aco_carbono": Sut = 1700; E = 206e3; poisson = 0.3; percentual_Sut = 1.20; break;
      case "aco_inox_301": Sut = 1300; E = 193e3; poisson = 0.31; percentual_Sut = 0.95; break;
      case "aco_inox_302": Sut = 1300; E = 193e3; poisson = 0.31; percentual_Sut = 0.95; break;
      case "17_7ph_rh950": Sut = 1450; E = 203e3; poisson = 0.34; percentual_Sut = 0.95; break;
      case "17_7ph_cond_c": Sut = 1650; E = 203e3; poisson = 0.34; percentual_Sut = 0.95; break;
      default: Sut = 1300; E = 193e3; poisson = 0.31; percentual_Sut = 0.95; break;
    }
  }

  // CONVERSÃO SI -> US (se necessário)
  if (unidade_atual === "US") {
    E = E * 145.038;
    Sut = Sut * 145.038;
  }

  // CONSTANTES K1..K5
  // proteger contra razao_Rd inválida (evitar divisão por zero/log)
  const safeRd = (!isFinite(Math.log(razao_Rd)) || razao_Rd <= 1) ? 1.0001 : razao_Rd;

  const K1 = (6 / (Math.PI * Math.log(safeRd))) * Math.pow(((safeRd - 1) / safeRd), 2);
  const K2 = (6 / (Math.PI * Math.log(safeRd))) * (((safeRd - 1) / Math.log(safeRd)) - 1);
  const K3 = (6 / (Math.PI * Math.log(safeRd))) * ((safeRd - 1) / 2);
  const K4 = ((safeRd * Math.log(safeRd) - (safeRd - 1)) / Math.log(safeRd)) * (safeRd / Math.pow((safeRd - 1), 2));
  const K5 = safeRd / (2 * (safeRd - 1));

  // CÁLCULO DAS TENSÕES 
  // tensao compressao ymin e ymax
  const tensao_compressao_yminimo = -((4 * E * yminimo * (K2 * (h - yminimo / 2) + K3 * t)) / (K1 * Math.pow(Do, 2) * (1 - Math.pow(poisson, 2))));
  const tensao_compressao_ymaximo = -((4 * E * ymaximo) / (K1 * Math.pow(Do, 2) * (1 - Math.pow(poisson, 2))) * (K2 * (h - ymaximo / 2) + K3 * t));

  sigma_c = (Math.abs(tensao_compressao_ymaximo) >= Math.abs(tensao_compressao_yminimo)) ? tensao_compressao_ymaximo : tensao_compressao_yminimo;

  // tensao tracao to
  const tensao_tracao_to_yminimo = ((4 * E * yminimo * (K4 * (h - yminimo / 2) + K5 * t)) / (K1 * Math.pow(Do, 2) * (1 - Math.pow(poisson, 2))));
  const tensao_tracao_to_ymaximo = ((4 * E * ymaximo * (K4 * (h - ymaximo / 2) + K5 * t)) / (K1 * Math.pow(Do, 2) * (1 - Math.pow(poisson, 2))));

  sigma_to = (Math.abs(tensao_tracao_to_ymaximo) >= Math.abs(tensao_tracao_to_yminimo)) ? tensao_tracao_to_ymaximo : tensao_tracao_to_yminimo;

  // tensao tracao ti
  const tensao_tracao_ti_yminimo = ((4 * E * yminimo * (-K2 * (h - yminimo / 2) + K3 * t)) / (K1 * Math.pow(Do, 2) * (1 - Math.pow(poisson, 2))));
  const tensao_tracao_ti_ymaximo = ((4 * E * ymaximo * (-K2 * (h - ymaximo / 2) + K3 * t)) / (K1 * Math.pow(Do, 2) * (1 - Math.pow(poisson, 2))));

  sigma_ti = (Math.abs(tensao_tracao_ti_ymaximo) >= Math.abs(tensao_tracao_ti_yminimo)) ? tensao_tracao_ti_ymaximo : tensao_tracao_ti_yminimo;

  // tensao maxima e coef de seguranca
  const maior_tensao = Math.max(Math.abs(sigma_c || 0), Math.abs(sigma_to || 0), Math.abs(sigma_ti || 0));
  const coeficiente_seguranca = (percentual_Sut * Sut) / (maior_tensao || 1); // evita div/0


  // atualiza status visual
  const statusDiv = document.getElementById("status");
  if (statusDiv) {
    statusDiv.classList.remove("aprovado", "reprovado");
    if (coeficiente_seguranca < Fator_seguranca) {
      statusDiv.textContent = "Projeto Reprovado";
      statusDiv.classList.add("reprovado");
    } else {
      statusDiv.textContent = "Projeto Aprovado";
      statusDiv.classList.add("aprovado");
    }
  }

  // Retorna objeto com resultados
  return {
    Do, razao_Rd, forca_p, desvio_forca, operacao, material_escolhido, ajuste, tipo_montagem,
    h_over_t, t, percentual_Sut, h, yminimo, ymaximo,
    K1, K2, K3, K4, K5,
    sigma_ti, sigma_c, sigma_to, maior_tensao, coeficiente_seguranca, poisson, Sut, E, Fator_seguranca
  };
}


// função que popula os campos de saída no HTML
function Calcular() {
  const entradas = obterEntradas();

  const {
    Do, t, razao_Rd, sigma_c, sigma_ti, sigma_to,
    poisson, Sut, E, material_escolhido, coeficiente_seguranca, h, ymaximo, yminimo
  } = entradas;

  const Di = Do / (razao_Rd || 1);

  const resultados = {
    diametro_externo: Do,
    espessura: t,
    altura_cone: h,
    diametro_interno: Di,
    tensao_compressao: sigma_c,
    tensao_tracao_ti: sigma_ti,
    tensao_tracao_to: sigma_to,
    coeficiente_seguranca: coeficiente_seguranca,
    deflexao_max: ymaximo,
    deflexao_min: yminimo,
  };

  for (const [chave, valor] of Object.entries(resultados)) {
    const element = document.getElementById(chave + "_out") || document.getElementById(chave);
    if (element) {
           if ("value" in element) {
        element.value = (typeof valor === "number" && !isNaN(valor)) ? Number(valor).toFixed(3) : (valor ?? "");
      } else {
        element.textContent = (typeof valor === "number" && !isNaN(valor)) ? Number(valor).toFixed(3) : (valor ?? "");
      }
    }
  }

  // logs para debug
  console.log("=== DEBUG: Entradas ===");
  console.log(entradas);
  console.log("=== RESULTADOS ===");
  console.log(resultados);
}




   




