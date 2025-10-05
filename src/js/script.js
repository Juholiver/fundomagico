// criando a funcao do loading
function setLoading(isLoading) {
    // Pegando o Button pelo id e colocando na const btnSpan
    const btnSpan = document.getElementById('generate-btn');
    // Criando a condiconal para o loading
    if (isLoading) {
        // Trocando o HTML do Button
        btnSpan.innerHTML = 'Gerando Background...';
    } else {
        btnSpan.innerHTML = 'Gerar Background Magico';
    }


}

document.addEventListener('DOMContentLoaded', function () {
    // 1 Passo: No JJavaScript, pegar o evento do submit do formulario, para evitar o recarregamento da pagina.

    // Buscando o formulario pelo nome da classe
    const form = document.querySelector('.form-group');

    // Buscando a textarea pelo id
    const textArea = document.getElementById('description');

    // Pegando os elementos onde o codigo sera exibido
    const htmlCode = document.getElementById('html-code');
    const cssCode = document.getElementById('css-code');

    const preview = document.getElementById('preview-section');

    // Adicionando o evento de submit ao formulario
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        // 2. Obter os valores digitado pelo usuario
        const description = textArea.value.trim(); // Pega o valor digitado na textarea

        // Validação simples para evitar erros
        if (!description) {
            alert('Por favor, insira uma descrição para gerar o background.');
            return; // Sai da função se a descrição estiver vazia
        }

        //3. exibir um indicador de carregamento enquanto a requisicao esta sendo processada
        setLoading(true);

        //4. Fazer a requisicao HTTP (Post) para api do n8n, enviando o texto formulario no corpo da requisicao em formato JSON
        // Tratamento de erros com try catch
        try {
            // tentando fazer a requisicao, para api N8N, usando fetch,precisa da api, precisa de Method, Headers e Body
            const response = await fetch('https://juholiver3.app.n8n.cloud/webhook/gerador-fundo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description })
            });

            const data = await response.json(); // Espera a resposta e converte para JSON

            htmlCode.textContent = data.code || ""; // Exibe o codigo HTML
            cssCode.textContent = data.style || ""; // Exibe o codigo CSS

            preview.style.display = 'block'; // Mostra a seção de preview
            preview.innerHTML = data.code || ""; // Insere o código HTML no preview

            let styleTag = document.getElementById('dynamic-styles');
            if (styleTag) styleTag.remove(); // Remove a tag de estilo existente, se houver

            if (data.style) {
                styleTag = document.createElement('style');
                styleTag.id = 'dynamic-styles';

                styleTag.textContent = data.style;
                document.head.appendChild(styleTag);
            }


        } catch (error) {
            console.error('Erro ao gerar o background:', error);
            htmlCode.textContent = "Nao consegui gerar o codigo HTML. Tente novamente.";
            cssCode.textContent = "Nao consegui gerar o codigo CSS. Tente novamente.";
            preview.innerHTML = "";
        } finally {
            setLoading(false);
        }


    });
});
