
async function carregarPlacarProdutividade() {

    var anoAtual = new Date().getFullYear();
    $('#placar-ano').text(anoAtual);

    try {
        console.log("Buscando dados cirúrgicos do SAPL para " + anoAtual + "...");

        var reqIndicacoes   = $.ajax({ url: 'https://sapl.fozdoiguacu.pr.leg.br/api/materia/materialegislativa/?ano=' + anoAtual + '&tipo=1', type: 'GET' });
        var reqRequerimentos= $.ajax({ url: 'https://sapl.fozdoiguacu.pr.leg.br/api/materia/materialegislativa/?ano=' + anoAtual + '&tipo=2', type: 'GET' });
        var reqMocoes       = $.ajax({ url: 'https://sapl.fozdoiguacu.pr.leg.br/api/materia/materialegislativa/?ano=' + anoAtual + '&tipo=3', type: 'GET' });
        var reqNormas       = $.ajax({ url: 'https://sapl.fozdoiguacu.pr.leg.br/api/norma/normajuridica/?ano=' + anoAtual, type: 'GET' });

        var [resInd, resReq, resMoc, resNormas] = await Promise.all([
            reqIndicacoes, reqRequerimentos, reqMocoes, reqNormas
        ]);

        var totalInd = resInd.pagination ? resInd.pagination.total_entries : 0;
        var totalReq = resReq.pagination ? resReq.pagination.total_entries : 0;
        var totalMoc = resMoc.pagination ? resMoc.pagination.total_entries : 0;
        var totalNor = resNormas.pagination ? resNormas.pagination.total_entries : 0;


        animarContador('num-indicacoes', totalInd);
        animarContador('num-requerimentos', totalReq);
        animarContador('num-mocoes', totalMoc);
        animarContador('num-normas', totalNor);

    } catch (erro) {
        console.error("❌ Erro ao buscar dados do placar:", erro);
        $('#num-indicacoes, #num-requerimentos, #num-mocoes, #num-normas').text('-');
    }
}

function animarContador(idElemento, valorFinal) {
    $({ contador: 0 }).animate({ contador: valorFinal }, {
        duration: 2000,
        easing: 'swing',
        step: function() { $('#' + idElemento).text(Math.ceil(this.contador)); },
        complete: function() { $('#' + idElemento).text(valorFinal); }
    });
}