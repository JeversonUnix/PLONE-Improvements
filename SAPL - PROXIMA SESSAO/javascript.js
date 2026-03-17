async function carregarProximaSessao() {
    var anoAtual = new Date().getFullYear();
    try {
        console.log("Buscando agenda de sessões no SAPL...");
        
        var resposta = await $.ajax({
            url: 'https://sapl.fozdoiguacu.pr.leg.br/api/sessao/sessaoplenaria/?data_inicio__year=' + anoAtual + '&get_all=true',
            type: 'GET'
        });

        console.log("Sessoes: ",sessoes);
        
        // O segredo de segurança: Se vier com '.results', usa ele. Se vier direto a lista, usa a própria 'resposta'.
        var sessoes = resposta.results ? resposta.results : (Array.isArray(resposta) ? resposta : []);
        if (sessoes.length === 0) return; // Se não houver sessões cadastradas no ano, não mostra o banner



        // Pegar a data de hoje, zerando a hora para comparação justa
        var hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        var proximaSessao = null;
        var dataProximaObj = null;

        // Varre todas as sessões do ano para achar a mais próxima a partir de hoje
        $.each(sessoes, function(index, sessao) {
            // Converte a data do SAPL (YYYY-MM-DD) para um objeto Date do JavaScript
            var dataSessao = new Date(sessao.data_inicio + 'T00:00:00'); 
            
            // Se a sessão for hoje ou no futuro...
            if (dataSessao >= hoje) {
                // ...e se for a primeira que achamos, ou se estiver mais perto que a anterior
                if (!proximaSessao || dataSessao < dataProximaObj) {
                    proximaSessao = sessao;
                    dataProximaObj = dataSessao;
                }
            }
        });
        
        
        // Se encontrou alguma sessão que ainda não passou
        if (proximaSessao) {
            
            // 1. Preenche o Nome (Ex: "1ª Sessão Ordinária da 4ª Sessão Legislativa")
            $('#sessao-nome').text(proximaSessao.__str__);
            
            // 2. Prepara a Data e Hora
            var dataFormatada = dataProximaObj.toLocaleDateString('pt-BR');
            var horaFormatada = proximaSessao.hora_inicio || "Hora não definida";
            $('#sessao-data').html('<i class="icon-time"></i> ' + dataFormatada + ' às ' + horaFormatada);

            // 3. Verifica o Status (Ao Vivo ou Pauta)
            var linkPauta = 'https://sapl.fozdoiguacu.pr.leg.br/sessao/pauta-sessao/' + proximaSessao.id;
            var linkVideo = proximaSessao.url_audio_video; // Onde o SAPL guarda o link do YouTube

            // É HOJE e a câmara colocou um link do YouTube lá no painel?
            if (dataProximaObj.getTime() === hoje.getTime() && linkVideo) {
                $('#sessao-btn').text('🔴 ASSISTIR AO VIVO')
                                .addClass('ao-vivo')
                                .attr('href', linkVideo);
                $('.sessao-badge').text('SESSÃO ACONTECENDO HOJE');
                $('.sessao-badge').css({'background': '#e74c3c', 'color': '#fff'});
            } else {
                $('#sessao-btn').text('📄 Ver Pauta da Sessão')
                                .removeClass('ao-vivo')
                                .attr('href', linkPauta);
            }

            // Exibe o Banner na tela lindamente
            $('#bloco-proxima-sessao').fadeIn(500);
        }

    } catch (erro) {
        console.error("❌ Erro ao buscar próxima sessão:", erro);
    }
}