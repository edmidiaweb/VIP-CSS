document.addEventListener('DOMContentLoaded', () => {
    // 1. Captura de Elementos
    const targetBox = document.getElementById('target-box');
    const targetText = targetBox.querySelector('span');
    const cssCodeElement = document.getElementById('css-code');
    const copyButton = document.getElementById('copy-button');
    const shadowControlsContainer = document.getElementById('shadow-controls-container');
    const addShadowButton = document.getElementById('addShadowButton');
    const removeShadowButton = document.getElementById('removeShadowButton');

    // Variáveis de estado para as sombras
    let shadowCount = 0;
    const MAX_SHADOWS = 5;

    // Lista de IDs dos controles FIXOS
    const fixedControls = [
        // Border-Radius
        'radiusTopLeft', 'radiusTopRight', 'radiusBottomRight', 'radiusBottomLeft',
        // Transform (Apenas Rotate - Scale é variável)
        'rotateAngle', 
        // Filter
        'filterBlur', 'filterBrightness',
        // Opacity & Text-Shadow
        'opacityValue', 'textShadowX', 'textShadowY', 'textShadowColor', // Note: textShadowColor é mantida fixa para simplificar o uso de var
        // Transition
        'transitionDuration', 'transitionTimingFunction',
        // Gradient (Cores são variáveis)
        'gradientType', 'gradientAngle', 'stop1', 'stop2',
        // Variáveis Customizadas
        'varPrimaryColor', 'varShadowColor', 'varScaleFactor'
    ];

    const inputElements = {};
    fixedControls.forEach(id => {
        inputElements[id] = document.getElementById(id);
    });
    
    // --- LÓGICA DE GESTÃO DE MÚLTIPLAS SOMBRAS ---

    function generateShadowHTML(index, defaults) {
        return `
            <h3 style="grid-column: 1 / -1; margin-top: 15px; border-bottom: 1px dashed #ccc; padding-bottom: 5px;">Sombra ${index}</h3>
            
            <div class="control-group">
                <label for="offsetX-${index}">Deslocamento X (px):</label>
                <input type="range" id="offsetX-${index}" min="-50" max="50" value="${defaults.offsetX}">
                <span id="offsetX-${index}-value">${defaults.offsetX}</span>
            </div>
            
            <div class="control-group">
                <label for="offsetY-${index}">Deslocamento Y (px):</label>
                <input type="range" id="offsetY-${index}" min="-50" max="50" value="${defaults.offsetY}">
                <span id="offsetY-${index}-value">${defaults.offsetY}</span>
            </div>
            
            <div class="control-group">
                <label for="blurRadius-${index}">Desfoque (px):</label>
                <input type="range" id="blurRadius-${index}" min="0" max="50" value="${defaults.blurRadius}">
                <span id="blurRadius-${index}-value">${defaults.blurRadius}</span>
            </div>

            <div class="control-group">
                <label for="spreadRadius-${index}">Espalhamento (px):</label>
                <input type="range" id="spreadRadius-${index}" min="-20" max="20" value="${defaults.spreadRadius}">
                <span id="spreadRadius-${index}-value">${defaults.spreadRadius}</span>
            </div>

            <div class="control-group color-control">
                <label for="shadowColor-${index}">Cor da Sombra:</label>
                <input type="color" id="shadowColor-${index}" value="${defaults.shadowColor}">
                <span id="shadowColor-${index}-value">${defaults.shadowColor}</span>
            </div>

            <div class="control-group">
                <label for="insetToggle-${index}">Sombra Interna (Inset):</label>
                <input type="checkbox" id="insetToggle-${index}" ${defaults.isInset ? 'checked' : ''}>
            </div>
        `;
    }

    function addShadowControls() {
        if (shadowCount >= MAX_SHADOWS) return;

        shadowCount++;
        const index = shadowCount;
        
        // Aplica a variável na cor da primeira sombra, para demonstração
        const defaults = {
            offsetX: 10, 
            offsetY: 10, 
            blurRadius: 10, 
            spreadRadius: 0, 
            shadowColor: (index === 1) ? inputElements.varShadowColor.value : '#505050',
            isInset: false
        };
        // Para as sombras subsequentes, a cor inicial é padronizada ou definida de outra forma.

        const newShadowDiv = document.createElement('div');
        newShadowDiv.id = `shadow-group-${index}`;
        newShadowDiv.className = 'shadow-group';
        newShadowDiv.style.display = 'grid';
        newShadowDiv.style.gridTemplateColumns = 'repeat(4, 1fr)'; 
        newShadowDiv.style.gap = '20px';
        newShadowDiv.innerHTML = generateShadowHTML(index, defaults);
        
        shadowControlsContainer.appendChild(newShadowDiv);

        const shadowControls = ['offsetX', 'offsetY', 'blurRadius', 'spreadRadius', 'shadowColor', 'insetToggle'];
        shadowControls.forEach(name => {
            const id = `${name}-${index}`;
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', updateProperties);
                input.addEventListener('change', updateProperties);
            }
        });
        
        updateButtonStates();
        updateProperties();
    }

    function removeLastShadowControls() {
        if (shadowCount === 0) return;

        const lastShadowGroup = document.getElementById(`shadow-group-${shadowCount}`);
        if (lastShadowGroup) {
            shadowControlsContainer.removeChild(lastShadowGroup);
            shadowCount--;
            updateButtonStates();
            updateProperties(); 
        }
    }
    
    function updateButtonStates() {
        addShadowButton.disabled = shadowCount >= MAX_SHADOWS;
        removeShadowButton.disabled = shadowCount === 0;
    }

    function getShadowCSS() {
        let shadowArray = [];
        
        for (let i = 1; i <= shadowCount; i++) {
            const offsetX = document.getElementById(`offsetX-${i}`).value;
            const offsetY = document.getElementById(`offsetY-${i}`).value;
            const blurRadius = document.getElementById(`blurRadius-${i}`).value;
            const spreadRadius = document.getElementById(`spreadRadius-${i}`).value;
            const shadowColor = document.getElementById(`shadowColor-${i}`).value;
            const isInset = document.getElementById(`insetToggle-${i}`).checked;
            
            // Atualiza os spans
            document.getElementById(`offsetX-${i}-value`).textContent = offsetX;
            document.getElementById(`offsetY-${i}-value`).textContent = offsetY;
            document.getElementById(`blurRadius-${i}-value`).textContent = blurRadius;
            document.getElementById(`spreadRadius-${i}-value`).textContent = spreadRadius;
            document.getElementById(`shadowColor-${i}-value`).textContent = shadowColor;
            
            const inset = isInset ? 'inset' : '';
            const shadowString = 
                `${inset} ${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${shadowColor}`.trim();
            
            shadowArray.push(shadowString);
        }
        
        return shadowArray.join(',\n    ');
    }

    // --- FUNÇÃO PRINCIPAL ---
    
    function updateProperties() {
        let boxCssString = '';
        let textCssString = '';
        let rootCssString = '';

        // ----------------------------------------------------
        // 1. LÓGICA VARIÁVEIS CSS (ROOT) E APLICAÇÃO
        // ----------------------------------------------------
        const rootElement = document.documentElement;
        
        const primaryColor = inputElements.varPrimaryColor.value;
        const shadowColorVar = inputElements.varShadowColor.value;
        const scaleFactorVar = inputElements.varScaleFactor.value;

        // Aplica as variáveis diretamente ao DOM
        rootElement.style.setProperty('--cor-primaria', primaryColor);
        rootElement.style.setProperty('--cor-sombra', shadowColorVar);
        rootElement.style.setProperty('--fator-escala', scaleFactorVar);

        // Constrói o bloco de código :root
        rootCssString += `:root {\n`;
        rootCssString += `    --cor-primaria: ${primaryColor};\n`;
        rootCssString += `    --cor-sombra: ${shadowColorVar};\n`;
        rootCssString += `    --fator-escala: ${scaleFactorVar};\n`;
        rootCssString += `}\n\n`;

        // ----------------------------------------------------
        // 2. APLICAÇÃO DAS VARIÁVEIS NAS PROPRIEDADES
        // ----------------------------------------------------

        // Exemplo: Aplica a variável ao texto (Cor e Escala)
        targetText.style.color = 'var(--cor-primaria)'; 
        textCssString += `color: var(--cor-primaria); /* Ex: ${primaryColor} */\n`; 

        const rotate = inputElements.rotateAngle.value;
        const transformString = `rotate(${rotate}deg) scale(var(--fator-escala))`;
        targetBox.style.transform = transformString;
        boxCssString += `transform: ${transformString};\n`;

        // LÓGICA GRADIENTE: Usa as variáveis
        const type = inputElements.gradientType.value;
        const angle = inputElements.gradientAngle.value;
        const s1 = inputElements.stop1.value;
        const s2 = inputElements.stop2.value;
        const gradientString = `${type}-gradient(${angle}deg, var(--cor-primaria) ${s1}%, var(--cor-sombra) ${s2}%)`;

        targetBox.style.backgroundImage = gradientString;
        boxCssString += `background-image: ${gradientString};\n`;


        // ----------------------------------------------------
        // 3. PROPRIEDADES FIXAS E RESTANTES
        // ----------------------------------------------------

        // LÓGICA BOX-SHADOW (DINÂMICA)
        const shadowCSS = getShadowCSS();
        if (shadowCSS) {
            targetBox.style.boxShadow = shadowCSS;
            boxCssString += `box-shadow: ${shadowCSS};\n`;
        } else {
            targetBox.style.boxShadow = 'none';
            boxCssString += `box-shadow: none;\n`;
        }
        
        // ... (O restante da lógica de outras propriedades) ...
        
        // LÓGICA TRANSITION
        const duration = inputElements.transitionDuration.value;
        const timingFunction = inputElements.transitionTimingFunction.value;
        const transitionString = `all ${duration}s ${timingFunction}`;
        targetBox.style.transition = transitionString;
        targetText.style.transition = transitionString; 
        boxCssString += `transition: ${transitionString};\n`;

        // LÓGICA OPACITY
        const opacity = inputElements.opacityValue.value;
        targetBox.style.opacity = opacity;
        boxCssString += `opacity: ${opacity};\n`;
        
        // LÓGICA BORDER-RADIUS
        const tl = inputElements.radiusTopLeft.value;
        const tr = inputElements.radiusTopRight.value;
        const br = inputElements.radiusBottomRight.value;
        const bl = inputElements.radiusBottomLeft.value;
        const radiusString = `${tl}px ${tr}px ${br}px ${bl}px`;
        targetBox.style.borderRadius = radiusString;
        boxCssString += `border-radius: ${radiusString};\n`;
        
        // LÓGICA FILTER
        const blur = inputElements.filterBlur.value;
        const brightness = inputElements.filterBrightness.value;
        const filterString = `blur(${blur}px) brightness(${brightness}%)`;
        targetBox.style.filter = filterString;
        boxCssString += `filter: ${filterString};\n`;

        // LÓGICA TEXT-SHADOW
        const tsX = inputElements.textShadowX.value;
        const tsY = inputElements.textShadowY.value;
        const tsColor = inputElements.textShadowColor.value;
        const textShadowString = `${tsX}px ${tsY}px 0px ${tsColor}`;
        targetText.style.textShadow = textShadowString;
        textCssString += `text-shadow: ${textShadowString};\n`;


        // 4. Atualiza a exibição dos valores e código
        document.getElementById('rotateAngle-value').textContent = rotate;
        document.getElementById('varScaleFactor-value').textContent = scaleFactorVar; 
        document.getElementById('varPrimaryColor-value').textContent = primaryColor; 
        document.getElementById('varShadowColor-value').textContent = shadowColorVar; 

        document.getElementById('radiusTopLeft-value').textContent = tl;
        document.getElementById('radiusTopRight-value').textContent = tr;
        document.getElementById('radiusBottomRight-value').textContent = br;
        document.getElementById('radiusBottomLeft-value').textContent = bl;

        document.getElementById('filterBlur-value').textContent = blur;
        document.getElementById('filterBrightness-value').textContent = brightness;
        
        document.getElementById('opacityValue-value').textContent = opacity;
        document.getElementById('textShadowX-value').textContent = tsX;
        document.getElementById('textShadowY-value').textContent = tsY;
        document.getElementById('textShadowColor-value').textContent = tsColor;

        document.getElementById('transitionDuration-value').textContent = duration;
        document.getElementById('transitionTimingFunction-value').textContent = timingFunction;
        document.getElementById('gradientType-value').textContent = type.charAt(0).toUpperCase() + type.slice(1);
        document.getElementById('gradientAngle-value').textContent = angle;
        document.getElementById('stop1-value').textContent = s1;
        document.getElementById('stop2-value').textContent = s2;

        // Junta tudo para o código gerado
        cssCodeElement.textContent = 
            `${rootCssString}` +
            `/* Estilos da Caixa */\n.minha-caixa {\n    ${boxCssString}}` +
            `\n\n/* Estilos do Texto (span) */\n.minha-caixa span {\n    ${textCssString}}`;
    }

    // --- Configuração dos Event Listeners ---
    
    fixedControls.forEach(id => {
        const input = inputElements[id];
        input.addEventListener('input', updateProperties);
        input.addEventListener('change', updateProperties);
    });

    addShadowButton.addEventListener('click', addShadowControls);
    removeShadowButton.addEventListener('click', removeLastShadowControls);
    
    copyButton.addEventListener('click', () => {
        const textToCopy = cssCodeElement.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyButton.textContent = 'Copiado!';
            setTimeout(() => {
                copyButton.textContent = 'Copiar Código';
            }, 1500);
        });
    });

    // Inicialização
    addShadowControls();
});