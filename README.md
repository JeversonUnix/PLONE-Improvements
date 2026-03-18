Esses códigos separados por pastas devem ser adicionados no tema que está utilizando o plone.

Lembre-se depois de criar as funções no arquivos function.js 

deve-se chamar as funções no $(document).ready(function()){}, fincado assim: 

$(document).ready(function() {
        
    if ($('#lista-vereadores-api').length > 0) {
        carregarVereadoresSapl();
    }
    
    if ($('.placar-produtividade').length > 0) {
        carregarPlacarProdutividade();
    }
    
    if ($('#bloco-proxima-sessao').length > 0) {
        carregarProximaSessao();
    }

});

DASHBOARD:
<p align="center">
  <img src="PLONE-Improvements/SAPL - DASHBOARD/video.gif" width="600" title="Demonstração do App">
</p>
