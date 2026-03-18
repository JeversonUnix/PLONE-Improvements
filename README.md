## 🛠️ Como Integrar ao Tema Plone

Os arquivos organizados nas pastas deste repositório devem ser incorporados diretamente ao seu tema atual do Plone.

### Inicialização do JavaScript
Após adicionar o escopo das funções no seu arquivo principal de scripts `function.js`. 

Para isso, insira as chamadas de inicialização dentro do bloco `$(document).ready()`. Utilizamos uma verificação de segurança (`.length > 0`) para garantir que a requisição à API só aconteça se o componente existir na página atual:

```javascript
$(document).ready(function() {
    
    // 1. Carrega a listagem e o modal interativo dos Parlamentares
    if ($('#lista-vereadores-api').length > 0) {
        carregarVereadoresSapl();
    }
    
    // 2. Carrega o Placar de Produtividade Legislativa em tempo real
    if ($('.placar-produtividade').length > 0) {
        carregarPlacarProdutividade();
    }
    
    // 3. Carrega o Banner Dinâmico da Próxima Sessão Plenária
    if ($('#bloco-proxima-sessao').length > 0) {
        carregarProximaSessao();
    }

});

📸 Demonstração das Funcionalidades
Veja abaixo como os componentes funcionam na prática após a integração:

📊 Placar de Produtividade (Dashboard)
<p align="center">
<img src="SAPL - DASHBOARD/video.gif" width="600" alt="Demonstração do Dashboard de Produtividade">
</p>

🧑‍💼 Perfil e Modal dos Vereadores
<p align="center">
<img src="SAPL - VEREADORES/video.gif" width="600" alt="Demonstração dos Cards e Modal de Vereadores">
</p>

🔴 Alerta de Próxima Sessão
<p align="center">
<img src="SAPL - PROXIMA SESSAO/image.png" width="600" alt="Demonstração do Alerta de Próxima Sessão">
</p>
