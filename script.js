// Funções utilitárias para todo o site
class NeuroAppUtils {
    static saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
            return false;
        }
    }

    static loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Erro ao carregar do localStorage:', e);
            return null;
        }
    }

    static generateImageFromText(text, width = 800, height = 400) {
        return new Promise((resolve) => {
            // Cria um canvas para gerar a imagem
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = width;
            canvas.height = height;
            
            // Fundo gradiente
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Texto
            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Quebra o texto em linhas
            const lines = this.wrapText(ctx, text, width - 40);
            const lineHeight = 30;
            const startY = (height - (lines.length * lineHeight)) / 2;
            
            lines.forEach((line, index) => {
                ctx.fillText(line, width / 2, startY + (index * lineHeight));
            });
            
            // Adiciona rodapé
            ctx.font = '14px Arial';
            ctx.fillText('Adaptação Neuropsicológica - Educação Fundamental', width / 2, height - 20);
            
            resolve(canvas.toDataURL('image/png'));
        });
    }

    static wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona comportamento interativo aos cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const link = this.getAttribute('onclick');
            if (link) {
                const url = link.match(/location\.href='([^']+)'/)[1];
                window.location.href = url;
            }
        });
    });

    // Carrega histórico se existir
    const history = NeuroAppUtils.loadFromLocalStorage('imageGenerationHistory') || [];
    if (window.updateHistoryDisplay && history.length > 0) {
        window.updateHistoryDisplay(history);
    }
});