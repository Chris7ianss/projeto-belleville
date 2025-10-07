// APARECER BOTÃO DE DESVIO DE FORÇA QUANDO CLICAR EM DORCA_CONSTANTE
let operacaoSelect = document.getElementById("operacao_mola");
let desvioInput = document.getElementById("desvio");
let desvioLabel = document.getElementById("desvio_label");

function atualizarDesvio() {
    if (operacaoSelect.value === "forca_constante") {
        // mostrar
        desvioInput.style.display = "inline-block";
        desvioLabel.style.display = "inline-block";
    } else {
        // esconder
        desvioInput.style.display = "none";
        desvioLabel.style.display = "none";
    }
}

// Atualiza quando o usuário muda a seleção
operacaoSelect.addEventListener("change", atualizarDesvio);

// Inicializa na primeira carga da página
atualizarDesvio();





//Função que regasta valores de entrada do HTML
function obterEntradas() {
    let Do = Number(document.getElementById("diametro_externo").value);
    let razao_Rd = Number(document.getElementById("Rd").value);
    let forca_p = Number(document.getElementById("forca_plana").value);
    let desvio_forca = Number(document.getElementById("desvio").value);
    let operacao = document.getElementById("operacao_mola").value;
    let material_escolhido = document.getElementById("material").value;
    let ajuste = document.getElementById("ajuste").value;
    let tipo_montagem = document.getElementById("montagem").value;
    
    let h_over_t = 0;
    let E = 0;
    let poisson = 0;
    let Sut = 0;
    let percentual_Sut = 0;
    let t = 0;
    let h = 0;
    let yminimo = 0; 
    let ymaximo = 0;
    let sigma_c = 0;
    let sigma_to = 0;
     let sigma_ti = 0;




    //ATRIBUIR VALOR A h_over_t A PARTIR DA SELEÇÃO 

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
        }

    //Calcular espessura e altura de cone 
    t = (1/10) * Math.pow((forca_p * Math.pow(Do, 2)) / (132.4 * h_over_t), 1/4);
    h = h_over_t * t;

    //ESCOLHER YMIN E YMAX.

    if (operacao === "operacao_bimodal") {
        if (tipo_montagem === "posicao_plana") {
            yminimo = 0;
            ymaximo = 1 * h;
        } else if (tipo_montagem === "alem_posicao_plana") {
            yminimo = 0;
            ymaximo = 2 * h;
        }
    } else if (operacao === "forca_constante") {
        if (tipo_montagem === "posicao_plana") {
            switch (desvio_forca) {
                case 10:
                    yminimo = 0.53 * h;
                    ymaximo = 1 * h;
                    break;
                case 9:
                    yminimo = 0.55 * h;
                    ymaximo = 1 * h;
                    break;
                case 8:
                    yminimo = 0.57 * h;
                    ymaximo = 1 * h;
                    break;
                case 7:
                    yminimo = 0.59 * h;
                    ymaximo = 1 * h;
                    break;
                case 6:
                    yminimo = 0.60 * h;
                    ymaximo = 1 * h;
                    break;
                case 5:
                    yminimo = 0.625 * h;
                    ymaximo = 1 * h;
                    break;
                case 4:
                    yminimo = 0.65 * h;
                    ymaximo = 1 * h;
                    break;
                case 3:
                    yminimo = 0.68 * h;
                    ymaximo = 1 * h;
                    break;
                case 2:
                    yminimo = 0.725 * h;
                    ymaximo = 1 * h;
                    break;
                case 1:
                    yminimo = 0.79 * h;
                    ymaximo = 1 * h;
                    break;
                case 0:
                    yminimo = 1 * h;
                    ymaximo = 1 * h;
                    break;
                
                default:
                    // comportamento padrão
                    break;
            }
            
        } else if (tipo_montagem === "alem_posicao_plana") {

            switch(desvio_forca){
        
                case 10:
                    yminimo = 0.53 * h;
                    ymaximo = 1.46 * h;
                    break;
                case 9:
                    yminimo = 0.55 * h;
                    ymaximo = 1.45 * h;
                    break;
                case 8:
                    yminimo = 0.57 * h;
                    ymaximo = 1.43 * h;
                    break;
                case 7:
                    yminimo = 0.59 * h;
                    ymaximo = 1.41 * h;
                    break;
                case 6:
                    yminimo = 0.6 * h;
                    ymaximo = 1.39 * h;
                    break;
                case 5:
                    yminimo = 0.625 * h;
                    ymaximo = 1.37 * h;
                    break;
                case 4:
                    yminimo = 0.65 * h;
                    ymaximo = 1.35 * h;
                    break;
                case 3:
                    yminimo = 0.68 * h;
                    ymaximo = 1.32 * h;
                    break;
                case 2:
                    yminimo = 0.725 * h;
                    ymaximo = 1.275 * h;
                    break;
                case 1:
                    yminimo = 0.79 * h;
                    ymaximo= 1.225 * h;
                    break;
                case 0:
                    yminimo = h;
                    ymaximo = h;
                    break;
        default:
            break;
            }
        
        }
    } else if (operacao === "constante_mola_constante") {
        if (tipo_montagem === "posicao_plana") {
            yminimo = 0;
            ymaximo = 1 * h;
        } else if (tipo_montagem === "alem_posicao_plana") {
            yminimo = 0;
            ymaximo = 2 * h;
        }
    }


    
    //ESOLHA DO TIPO DE MATERIAL SEM AJUSTE E COM AJUSTE

    if (ajuste === "sim") {// com ajuste
        switch (material_escolhido) {
            case "aco_carbono":
                Sut = 1700;
                E = 207e3;
                poisson = 0.28;
                percentual_Sut = 2.75;
                break;
            case "aco_inox_301":
                Sut = 1300;
                E = 193e3;
                poisson = 0.31;
                percentual_Sut = 1.60;
                break;
            case "aco_inox_302":
                Sut = 1300;
                E = 193e3;
                poisson = 0.31;
                percentual_Sut = 1.60;
                break;
            case "17_7ph_rh950":
                Sut = 1450;
                E = 203e3;
                poisson = 0.34;
                percentual_Sut = 1.60;
                break;
            case "17_7ph_cond_c":
                Sut = 1650;
                E = 203e3;
                poisson = 0.34;
                percentual_Sut = 1.60;
                break;
            
        }  

        } else {  //sem ajute
            switch (material_escolhido) {
            case "aco_carbono":
                Sut = 1700;
                E = 207e3;
                poisson = 0.28;
                percentual_Sut = 1.20;
                break;
            case "aco_inox_301":
                Sut = 1300;
                E = 193e3;
                poisson = 0.31;
                percentual_Sut = 0.95;
                break;
            case "aco_inox_302":
                Sut = 1300;
                E = 193e3;
                poisson = 0.31;
                percentual_Sut = 0.95;
                break;
            case "17_7ph_rh950":
                Sut = 1450;
                E = 203e3;
                poisson = 0.34;
                percentual_Sut = 0.95;
                break;
            case "17_7ph_cond_c":
                Sut = 1650;
                E = 203e3;
                poisson = 0.34;
                percentual_Sut = 0.95;
                break;


        }
        }

    //CALCULO DAS CONSTANTES 
   

    let K1 = (6 / (Math.PI * Math.log(razao_Rd))) * Math.pow(((razao_Rd - 1) / razao_Rd), 2);

    let K2 = (6 / (Math.PI * Math.log(razao_Rd))) * (((razao_Rd - 1) / Math.log(razao_Rd)) - 1);

    let K3 = (6 / (Math.PI * Math.log(razao_Rd))) * ((razao_Rd - 1) / 2);

    let K4 = ((razao_Rd * Math.log(razao_Rd) - (razao_Rd - 1)) / Math.log(razao_Rd)) * (razao_Rd / Math.pow((razao_Rd - 1), 2));

    let K5 = razao_Rd / (2 * (razao_Rd - 1));

    //TENSÃO DE COMPRESSAO USANDO Y MAX E Y MIN


    
    let tensao_compressao_yminimo = - ( (4 * E * yminimo * (K2 * (h - yminimo / 2) + K3 * t)) / (K1 * Math.pow(Do, 2) * (1 - Math.pow(poisson, 2))) );

    /*let tensao_compressao_ymaximo = - ( (4 * E * ymaximo * (K2 * (h - ymaximo / 2) + K3 * t)) / (K1 * Math.pow(razao_Rd, 2) * (1 - Math.pow(poisson, 2))) );*/
    
let tensao_compressao_ymaximo = - ((4 * E * ymaximo) /( K1*Math.pow(Do,2)*(1-Math.pow(poisson,2)))*(K2*(h-ymaximo/2)+K3*t));
    
    console.log(tensao_compressao_ymaximo);
    console.log(tensao_compressao_yminimo);

    
   

        if (Math.abs(tensao_compressao_ymaximo) >= Math.abs(tensao_compressao_yminimo)) {
            sigma_c = tensao_compressao_ymaximo;

        } else if (Math.abs(tensao_compressao_ymaximo) < Math.abs(tensao_compressao_yminimo)) {
            sigma_c = tensao_compressao_yminimo;

        }
    //TENSÃO DE TRACAO_T0 USANDO Y MAX E Y MIN
    let tensao_tracao_to_yminimo = ( (4 * E * yminimo * (K4 * (h - yminimo / 2) + K5 * t)) / (K1 * Math.pow(Do, 2) * (1 - Math.pow(poisson, 2))) );

    let tensao_tracao_to_ymaximo = ( (4 * E * ymaximo * (K4 * (h - ymaximo / 2) + K5 * t)) / (K1 * Math.pow(Do, 2) * (1 - Math.pow(poisson, 2))) );

        if (Math.abs(tensao_tracao_to_ymaximo) >= Math.abs(tensao_tracao_to_yminimo)) {
            sigma_to = tensao_tracao_to_ymaximo;

        } else if (Math.abs(tensao_tracao_to_ymaximo) < Math.abs(tensao_tracao_to_yminimo)) {
            sigma_to = tensao_tracao_to_yminimo;

        }

    //TENSÃO DE TRACAO_Ti USANDO Y MAX E Y MIN

    let tensao_tracao_ti_yminimo = ( (4 * E * yminimo * (-K2 * (h - yminimo / 2) + K3 * t)) / (K1 * Math.pow(Do, 2) * (1 - Math.pow(poisson, 2))) );

    let tensao_tracao_ti_ymaximo = ( (4 * E * ymaximo * (-K2 * (h - ymaximo / 2) + K3 * t)) / (K1 * Math.pow(Do, 2) * (1 - Math.pow(poisson, 2))) );

     

        if (Math.abs(tensao_tracao_ti_ymaximo) >= Math.abs(tensao_tracao_ti_yminimo)) {
            sigma_ti = tensao_tracao_ti_ymaximo;

        } else if (Math.abs(tensao_tracao_ti_ymaximo) < Math.abs(tensao_tracao_ti_yminimo)) {
            sigma_ti = tensao_tracao_ti_yminimo;

        }

    //TENSAO MAXIMA DE PROJETO
        let maior_tensao = Math.max(Math.abs(sigma_c), Math.abs(sigma_to), Math.abs(sigma_ti));

        //COEFICIENTE DE SEGURAÇA
        let coeficiente_seguranca = (percentual_Sut*Sut)/maior_tensao;

        const statusDiv = document.getElementById("status");

            // Limpa classes anteriores
            statusDiv.classList.remove("aprovado", "reprovado");

            if (coeficiente_seguranca < 1) {
                statusDiv.textContent = "Projeto Reprovado";
                statusDiv.classList.add("reprovado");
            } else {
                statusDiv.textContent = "Projeto Aprovado";
                statusDiv.classList.add("aprovado");
            }



     // Retornar resultados
    return {Do, razao_Rd, forca_p, desvio_forca, operacao, material_escolhido, ajuste, tipo_montagem, h_over_t,t, percentual_Sut, h, yminimo, ymaximo, K1, K2, K3, K4, K5, sigma_ti, sigma_c, sigma_to, maior_tensao, coeficiente_seguranca, poisson, Sut, E,};

    }

   








 function Calcular() {
    const entradas = obterEntradas();

    // Extrair os valores já calculados
    const {
        Do,
        t,       // espessura já calculada
        h,       // altura do cone já calculada
        razao_Rd,
        sigma_c,
        sigma_ti,
        sigma_to,
        poisson, 
        Sut,
        E, 
        material_escolhido,
        coeficiente_seguranca,
    }  = entradas;



    
    const Di = Do / razao_Rd; // diâmetro interno ainda pode ser calculado aqui

    // Objeto com os resultados finais
    const resultados = {
        diametro_externo: Do,
        espessura: t,
        altura_cone: h,
        diametro_interno: Di,
        tensao_compressao: sigma_c,
        tensao_tracao_ti: sigma_ti,
        tensao_tracao_to: sigma_to,
        coeficiente_seguranca: coeficiente_seguranca,
    };

    // Atualiza os campos do HTML automaticamente
    for (const [chave, valor] of Object.entries(resultados)) {
        const element = document.getElementById(chave + "_out") || document.getElementById(chave);
        if (element) element.value = valor.toFixed(3); // arredonda para 3 casas decimais
    }




    // Mostrar todas as variáveis no console para depuração
console.log("=== DEBUG: Variáveis calculadas ===");
console.log(entradas);
console.log("====================================");
console.log("=== RESULTADOS EXIBIDOS ===");
console.log(resultados);
console.log("===========================");
console.log("=== PROPRIEDADES DO MATERIAL ===");
console.log("Material:", material_escolhido);
console.log("E (Módulo de Elasticidade):", E, "MPa");
console.log(" (Coeficiente de Poisson):", poisson);
console.log("Sut (Tensão Última):", Sut, "MPa");
console.log("===============================");

}
   




