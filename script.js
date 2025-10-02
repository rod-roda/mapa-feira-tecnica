// Mapeamento dos cursos para suas respectivas imagens (array para múltiplas imagens)
const mapaCursos = {
    'administracao': ['/img/(Adm e Pub) mapa-feira-tec_3.png'],
    'analises-clinicas': ['/img/(Ac e Química) mapa-feira-tec_5.png', '/img/(Ac) mapa-feira-tec_6.png'],
    'eletronica': ['/img/(Eletr e Pub) mapa-feira-tec_2.png'],
    'informatica': ['/img/(Info) mapa-feira-tec_4.png'],
    'quimica': ['/img/(Ac e Química) mapa-feira-tec_5.png', '/img/(Ac) mapa-feira-tec_6.png'],
    'publicidade': ['/img/(Adm e Pub) mapa-feira-tec_3.png', '/img/(Eletr e Pub) mapa-feira-tec_2.png']
};

// Variável para controlar se está em modo de curso específico
let modoEspecifico = false;
let cursoAtual = null;
let imagemAtualIndex = 0;

// Função para desabilitar outros hotspots
function desabilitarOutrosHotspots(cursoAtivo) {
    const hotspots = document.querySelectorAll('.hotspot');
    hotspots.forEach(hotspot => {
        const curso = hotspot.getAttribute('data-curso');
        if (curso !== cursoAtivo) {
            hotspot.classList.add('disabled');
        }
    });
}

// Função para habilitar todos os hotspots
function habilitarTodosHotspots() {
    const hotspots = document.querySelectorAll('.hotspot');
    hotspots.forEach(hotspot => {
        hotspot.classList.remove('disabled');
    });
}

// Função para mostrar/ocultar botão de voltar
function mostrarBotaoVoltar(mostrar = true) {
    const botaoVoltar = document.getElementById('botao-voltar');
    if (mostrar) {
        botaoVoltar.classList.add('visible');
    } else {
        botaoVoltar.classList.remove('visible');
    }
}

// Função para trocar o mapa
function trocarMapa(curso) {
    const imagemMapa = document.getElementById('mapa-imagem');
    
    if (mapaCursos[curso]) {
        // Entra no modo específico
        modoEspecifico = true;
        cursoAtual = curso;
        imagemAtualIndex = 0;
        
        // Desabilita outros hotspots
        desabilitarOutrosHotspots(curso);
        
        // Mostra botão de voltar e indicadores se múltiplas imagens
        mostrarBotaoVoltar(true);
        mostrarIndicadoresCarrossel(curso);
        
        // Troca a imagem com animação
        imagemMapa.style.opacity = '0.7';
        setTimeout(() => {
            imagemMapa.src = mapaCursos[curso][0];
            imagemMapa.alt = `Mapa do curso de ${curso.charAt(0).toUpperCase() + curso.slice(1).replace('-', ' ')} (${imagemAtualIndex + 1}/${mapaCursos[curso].length})`;
            imagemMapa.style.opacity = '1';
        }, 150);
        
        // Adiciona gestos de swipe se múltiplas imagens
        if (mapaCursos[curso].length > 1) {
            adicionarGestosSwipe();
        }
    }
}

// Função para mostrar/ocultar indicadores do carrossel
function mostrarIndicadoresCarrossel(curso) {
    const indicadores = document.getElementById('indicadores-carrossel');
    const setas = document.getElementById('setas-navegacao');
    
    if (mapaCursos[curso].length > 1) {
        // Mostra indicadores
        atualizarIndicadores(curso);
        indicadores.classList.add('visible');
        setas.classList.add('visible');
    } else {
        // Oculta indicadores
        indicadores.classList.remove('visible');
        setas.classList.remove('visible');
    }
}

// Função para atualizar indicadores visuais
function atualizarIndicadores(curso) {
    const indicadores = document.getElementById('indicadores-carrossel');
    const totalImagens = mapaCursos[curso].length;
    
    indicadores.innerHTML = '';
    for (let i = 0; i < totalImagens; i++) {
        const ponto = document.createElement('div');
        ponto.className = `indicador-ponto ${i === imagemAtualIndex ? 'ativo' : ''}`;
        ponto.onclick = () => irParaImagem(i);
        indicadores.appendChild(ponto);
    }
}

// Função para navegar entre imagens
function proximaImagem() {
    if (!cursoAtual || !mapaCursos[cursoAtual]) return;
    
    const totalImagens = mapaCursos[cursoAtual].length;
    imagemAtualIndex = (imagemAtualIndex + 1) % totalImagens;
    trocarImagemCarrossel();
}

function imagemAnterior() {
    if (!cursoAtual || !mapaCursos[cursoAtual]) return;
    
    const totalImagens = mapaCursos[cursoAtual].length;
    imagemAtualIndex = (imagemAtualIndex - 1 + totalImagens) % totalImagens;
    trocarImagemCarrossel();
}

function irParaImagem(index) {
    if (!cursoAtual || !mapaCursos[cursoAtual]) return;
    
    imagemAtualIndex = index;
    trocarImagemCarrossel();
}

function trocarImagemCarrossel() {
    const imagemMapa = document.getElementById('mapa-imagem');
    
    imagemMapa.style.opacity = '0.7';
    setTimeout(() => {
        imagemMapa.src = mapaCursos[cursoAtual][imagemAtualIndex];
        imagemMapa.alt = `Mapa do curso de ${cursoAtual.charAt(0).toUpperCase() + cursoAtual.slice(1).replace('-', ' ')} (${imagemAtualIndex + 1}/${mapaCursos[cursoAtual].length})`;
        imagemMapa.style.opacity = '1';
        atualizarIndicadores(cursoAtual);
    }, 150);
}

function voltarMapaInicial() {
    const imagemMapa = document.getElementById('mapa-imagem');
    
    // Sai do modo específico
    modoEspecifico = false;
    cursoAtual = null;
    imagemAtualIndex = 0;
    
    // Remove gestos de swipe
    removerGestosSwipe();
    
    // Oculta indicadores do carrossel
    document.getElementById('indicadores-carrossel').classList.remove('visible');
    document.getElementById('setas-navegacao').classList.remove('visible');
    
    // Habilita todos os hotspots
    habilitarTodosHotspots();
    
    // Oculta botão de voltar
    mostrarBotaoVoltar(false);
    
    // Volta ao mapa inicial com animação
    imagemMapa.style.opacity = '0.7';
    setTimeout(() => {
        imagemMapa.src = '/img/(Página Inicial) mapa-feira-tec_1.png';
        imagemMapa.alt = 'Mapa da Feira';
        imagemMapa.style.opacity = '1';
    }, 150);
}

// Variáveis para gestos de swipe
let startX = 0;
let startY = 0;
let swipeListenerAdded = false;
let swipeHandlers = {
    touchStart: null,
    touchEnd: null
};

// Função para adicionar gestos de swipe
function adicionarGestosSwipe() {
    if (swipeListenerAdded) return;
    
    const imagemMapa = document.getElementById('mapa-imagem');
    
    swipeHandlers.touchStart = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    };
    
    swipeHandlers.touchEnd = function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Verifica se o movimento é mais horizontal que vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe para direita - imagem anterior
                imagemAnterior();
            } else {
                // Swipe para esquerda - próxima imagem
                proximaImagem();
            }
        }
        
        startX = 0;
        startY = 0;
    };
    
    imagemMapa.addEventListener('touchstart', swipeHandlers.touchStart, { passive: true });
    imagemMapa.addEventListener('touchend', swipeHandlers.touchEnd, { passive: true });
    
    swipeListenerAdded = true;
}

// Função para remover gestos de swipe
function removerGestosSwipe() {
    if (!swipeListenerAdded) return;
    
    const imagemMapa = document.getElementById('mapa-imagem');
    if (swipeHandlers.touchStart) {
        imagemMapa.removeEventListener('touchstart', swipeHandlers.touchStart);
    }
    if (swipeHandlers.touchEnd) {
        imagemMapa.removeEventListener('touchend', swipeHandlers.touchEnd);
    }
    
    swipeListenerAdded = false;
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    const imagemMapa = document.getElementById('mapa-imagem');
    imagemMapa.style.transition = 'opacity 0.3s ease-in-out';
    
    // Adiciona funcionalidade de tecla ESC para voltar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modoEspecifico) {
            voltarMapaInicial();
        }
        // Teclas de seta para navegação no carrossel
        if (modoEspecifico && cursoAtual && mapaCursos[cursoAtual].length > 1) {
            if (e.key === 'ArrowLeft') {
                imagemAnterior();
            } else if (e.key === 'ArrowRight') {
                proximaImagem();
            }
        }
    });
});
