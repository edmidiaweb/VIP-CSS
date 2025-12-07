document.addEventListener('DOMContentLoaded', () => {
    // 1. Captura de Elementos
    const targetBox = document.getElementById('target-box');
    const targetText = targetBox.querySelector('span'); // Captura o span para text-shadow
    const cssCodeElement = document.getElementById('css-code');
    const copyButton = document.getElementById('copy-button');

    // Lista de IDs dos controles para TODAS as propriedades
    const controls = [
        // Box-Shadow
        'offsetX', 'offsetY', 'blurRadius', 'spreadRadius', 'shadowColor', 'insetToggle',
        // Border-Radius
        'radiusTopLeft', 'radiusTopRight', 'radiusBottomRight', 'radiusBottomLeft',
        // Transform
        'rotateAngle', 'scaleFactor',
        // Filter
        'filterBlur', 'filterBrightness',
        // Opacity & Text-Shadow
        'opacityValue', 'textShadowX', 'textShadowY', 'textShadowColor',
        // Transition
        'transitionDuration', 'transitionTimingFunction'
    ];

    // Objeto para armazenar referências de todos os inputs e selects
    const inputElements = {};
    controls.forEach(id => {
        inputElements[id] = document.getElementById(id);
    });

    /**
     * Função Principal: Constrói e Aplica TODAS as propriedades
     */
    function updateProperties() {
        let boxCssString = '';
        let textCssString = '';

        // --- LÓGICA TRANSITION (DEVE VIR PRIMEIRO NO CSS) ---
        const duration = inputElements.transitionDuration.value;
        const timingFunction = inputElements.transitionTimingFunction.value;

        const transitionString = `all ${duration}s ${timingFunction}`;

        targetBox.style.transition = transitionString;
        targetText.style.transition = transitionString; // Aplica transição ao texto também

        boxCssString += `transition: ${transitionString};\n`; // Adiciona ao código da caixa


        // --- LÓGICA OPACITY ---
        const opacity = inputElements.opacityValue.value;

        targetBox.style.opacity = opacity;
        boxCssString += `opacity: ${opacity};\n`;

        
        // --- LÓGICA BOX-SHADOW ---
        const offsetX = inputElements.offsetX.value;
        const offsetY = inputElements.offsetY.value;
        const blurRadius = inputElements.blurRadius.value;
        const spreadRadius = inputElements.spreadRadius.value;
        const shadowColor = inputElements.shadowColor.value;
        const isInset = inputElements.insetToggle.checked;

        const inset = isInset ? 'inset' : '';
        const shadowString = 
            `${inset} ${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${shadowColor}`.trim();
        
        targetBox.style.boxShadow = shadowString;
        boxCssString += `box-shadow: ${shadowString};\n`;


        // --- LÓGICA BORDER-RADIUS ---
        const tl = inputElements.radiusTopLeft.value;
        const tr = inputElements.radiusTopRight.value;
        const br = inputElements.radiusBottomRight.value;
        const bl = inputElements.radiusBottomLeft.value;

        const radiusString = `${tl}px ${tr}px ${br}px ${bl}px`;

        targetBox.style.borderRadius = radiusString;
        boxCssString += `border-radius: ${radiusString};\n`;
        
        
        // --- LÓGICA TRANSFORM ---
        const rotate = inputElements.rotateAngle.value;
        const scale = inputElements.scaleFactor.value;

        const transformString = `rotate(${rotate}deg) scale(${scale})`;
        
        targetBox.style.transform = transformString;
        boxCssString += `transform: ${transformString};\n`;

        
        // --- LÓGICA FILTER ---
        const blur = inputElements.filterBlur.value;
        const brightness = inputElements.filterBrightness.value;

        const filterString = `blur(${blur}px) brightness(${brightness}%)`;

        targetBox.style.filter = filterString;
        boxCssString += `filter: ${filterString};\n`;

        
        // --- LÓGICA TEXT-SHADOW ---
        const tsX = inputElements.textShadowX.value;
        const tsY = inputElements.textShadowY.value;
        const tsColor = inputElements.textShadowColor.value;

        const textShadowString = `${tsX}px ${tsY}px 0px ${tsColor}`; // Sem desfoque para um efeito sharp
        
        targetText.style.textShadow = textShadowString;
        textCssString += `text-shadow: ${textShadowString};\n`;


        // 3. Atualiza a exibição do código
        // Mostra o código da caixa e o código do texto
        cssCodeElement.textContent = 
            `/* Estilos da Caixa */\n${boxCssString}\n\n/* Estilos do Texto */\n${textCssString}`;

        // 4. Atualiza os valores ao lado dos sliders/selects
        document.getElementById('offsetX-value').textContent = offsetX;
        document.getElementById('offsetY-value').textContent = offsetY;
        document.getElementById('blurRadius-value').textContent = blurRadius;
        document.getElementById('spreadRadius-value').textContent = spreadRadius;
        document.getElementById('shadowColor-value').textContent = shadowColor;
        
        document.getElementById('radiusTopLeft-value').textContent = tl;
        document.getElementById('radiusTopRight-value').textContent = tr;
        document.getElementById('radiusBottomRight-value').textContent = br;
        document.getElementById('radiusBottomLeft-value').textContent = bl;

        document.getElementById('rotateAngle-value').textContent = rotate;
        document.getElementById('scaleFactor-value').textContent = scale;
        
        document.getElementById('filterBlur-value').textContent = blur;
        document.getElementById('filterBrightness-value').textContent = brightness;
        
        document.getElementById('opacityValue-value').textContent = opacity;
        document.getElementById('textShadowX-value').textContent = tsX;
        document.getElementById('textShadowY-value').textContent = tsY;
        document.getElementById('textShadowColor-value').textContent = tsColor;

        document.getElementById('transitionDuration-value').textContent = duration;
        document.getElementById('transitionTimingFunction-value').textContent = timingFunction;
    }

    /**
     * 5. Configuração dos Event Listeners
     */
    controls.forEach(id => {
        const input = inputElements[id];
        // O evento 'input' é ideal para sliders, 'change' funciona bem para selects
        input.addEventListener('input', updateProperties);
    });
    
    // Configura o evento 'change' para o select
    inputElements.transitionTimingFunction.addEventListener('change', updateProperties);


    // Evento para o botão de copiar
    copyButton.addEventListener('click', () => {
        const textToCopy = cssCodeElement.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyButton.textContent = 'Copiado!';
            setTimeout(() => {
                copyButton.textContent = 'Copiar Código';
            }, 1500);
        }).catch(err => {
            console.error('Erro ao copiar: ', err);
            alert('Falha ao copiar o código.');
        });
    });

    // Executa a função na inicialização para aplicar os valores padrão
    updateProperties();
});