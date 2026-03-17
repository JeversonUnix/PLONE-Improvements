async function carregarVereadoresSapl() {
    try {
        console.log("1. Buscando Legislatura Atual...");
        var resLegislatura = await $.ajax({
            url: 'https://sapl.fozdoiguacu.pr.leg.br/api/parlamentares/legislatura/',
            type: 'GET'
        });
        var idLegislaturaAtual = resLegislatura.results[0].id;

        console.log("2. Buscando a Mesa Diretora Atual...");
        var resMesas = await $.ajax({
            url: 'https://sapl.fozdoiguacu.pr.leg.br/api/parlamentares/mesadiretora/',
            type: 'GET'
        });
        
        var mesasAtuais = resMesas.results.filter(m => m.__str__.includes('(Atual)'));
        var mesaAtual = mesasAtuais.reduce((prev, current) => (prev.id > current.id) ? prev : current);
        var idMesaAtual = mesaAtual.id;

        console.log("3. Buscando Composição da Mesa (ID: " + idMesaAtual + ")...");
        var resComposicao = await $.ajax({
            url: 'https://sapl.fozdoiguacu.pr.leg.br/api/parlamentares/composicaomesa/?mesa_diretora=' + idMesaAtual,
            type: 'GET'
        });

        var mapaMesa = {};
        $.each(resComposicao.results, function(index, comp) {
            var partes = comp.__str__.split(' - ');
            var nomeCargo = partes.length > 1 ? partes[1] : "Membro da Mesa";
            
            mapaMesa[comp.parlamentar] = {
                cargo: nomeCargo,
                ordem: comp.cargo 
            };
        });

        console.log("4. Buscando todos os Parlamentares...");
        var resParlamentares = await $.ajax({
            url: 'https://sapl.fozdoiguacu.pr.leg.br/api/parlamentares/legislatura/' + idLegislaturaAtual + '/parlamentares/?get_all=true',
            type: 'GET'
        });
        var vereadores = resParlamentares.results ? resParlamentares.results : resParlamentares;

        $.each(vereadores, function(index, v) {
            if (mapaMesa[v.id]) {
                v.cargoMesa = mapaMesa[v.id].cargo;
                v.ordemMesa = mapaMesa[v.id].ordem;
            } else {
                v.cargoMesa = null;
                v.ordemMesa = 999;
            }
        });

        vereadores.sort(function(a, b) {
            if (a.ordemMesa !== b.ordemMesa) {
                return a.ordemMesa - b.ordemMesa;
            }
            var nomeA = a.nome_parlamentar || a.nome_completo;
            var nomeB = b.nome_parlamentar || b.nome_completo;
            return nomeA.localeCompare(nomeB);
        });

        var htmlCards = '';
        $.each(vereadores, function(index, p) {
            
            var fotoUrl = p.fotografia;
            if (fotoUrl && !fotoUrl.startsWith('http')) {
                fotoUrl = 'https://sapl.fozdoiguacu.pr.leg.br' + fotoUrl;
            } else if (!fotoUrl) {
                fotoUrl = 'https://sapl.fozdoiguacu.pr.leg.br/static/img/user.png';
            }

            var nomeVereador = p.nome_parlamentar || p.nome_completo;
            var linkPerfil = 'https://sapl.fozdoiguacu.pr.leg.br/parlamentar/' + p.id;
            
            var partidoSigla = "SEM PARTIDO";
            if (p.partido) {
                partidoSigla = p.partido.sigla ? p.partido.sigla : p.partido;
            }

            var tagCargoHtml = '';
            if (p.cargoMesa) {
                tagCargoHtml = `<span class="cargo">${p.cargoMesa}</span>`;
            }

            htmlCards += `
            <li>
                <div class="card-content">
                    <img alt="${nomeVereador}" src="${fotoUrl}" />
                    <div class="card-overlay">
                        <span class="partido-tag">${partidoSigla}</span>
                        <div class="card-text">
                            <span class="nome">${nomeVereador}</span>
                            ${tagCargoHtml}
                        </div>
                    </div>
                </div>
                <a class="link-mascara" href="${linkPerfil}" rel="noopener noreferrer" target="_blank"></a>
            </li>
            `;
        });

        $('#lista-vereadores-api').html(htmlCards);
        console.log("✅ Parlamentares e Mesa Diretora carregados com sucesso!");

    } catch (erro) {
        console.error("❌ Erro na automação do SAPL:", erro);
        $('#lista-vereadores-api').html('<p style="color: red; text-align: center;">Não foi possível carregar os parlamentares no momento.</p>');
    }
}