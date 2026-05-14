/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Palette, 
  Sun, 
  Cloud, 
  Users, 
  Settings, 
  Wand2, 
  Copy, 
  RefreshCcw, 
  HelpCircle, 
  Film, 
  Monitor,
  CheckCircle2,
  X,
  Languages,
  Zap
} from 'lucide-react';

// --- CONFIG & TRANSLATIONS ---

const HERO_EMOJI = "🎬"; 
const FLAG_BR_EMOJI = "🇧🇷";
const FLAG_US_EMOJI = "🇺🇸";

const TRANSLATIONS = {
  pt: {
    title: 'Geração de Prompts de Vídeo',
    subtitle: 'www.youtube.com/@o_velho_brum',
    theme: 'TEMA PRINCIPAL',
    themeLabel: 'Descreva o tema central do seu vídeo',
    themePlaceholder: 'Ex: Uma mulher caminhando por uma floresta encantada ao amanhecer...',
    style: 'ESTILO VISUAL',
    styleLabel: 'Selecione o estilo visual',
    camera: 'CÂMERA',
    angleLabel: 'Ângulo de Câmera',
    movementLabel: 'Movimento de Câmera',
    lensLabel: 'Tipo de Lente',
    depthLabel: 'Profundidade de Campo',
    lighting: 'ILUMINAÇÃO',
    lightLabel: 'Tipo de Iluminação',
    atmosphere: 'ATMOSFERA E MOOD',
    moodLabel: 'Selecione o clima atmosférico',
    emotionLabel: 'Emoção / Sentimento',
    setting: 'CENÁRIO',
    locationLabel: 'Tipo de Localização',
    timeLabel: 'Hora do Dia',
    weatherLabel: 'Clima / Tempo',
    characters: 'PERSONAGENS / SUJEITOS',
    subjectLabel: 'Descrição do Sujeito Principal',
    subjectPlaceholder: 'Ex: Uma jovem mulher com cabelos ruivos longos...',
    actionLabel: 'Ação / Movimento do Sujeito',
    actionPlaceholder: 'Ex: Caminhando lentamente, virando o rosto...',
    detailsLabel: 'Detalhes Adicionais do Sujeito',
    composition: 'COMPOSIÇÃO E COR',
    colorPaletteLabel: 'Paleta de Cores',
    aspectLabel: 'Proporção de Tela (Proporção)',
    duration: 'DURAÇÃO E TAXA DE QUADROS',
    durLabel: 'Duração (segundos)',
    speedLabel: 'Velocidade de Reprodução',
    quality: 'QUALIDADE E DETALHES TÉCNICOS',
    qualityLabel: 'Nível de Resolução / Qualidade',
    engineLabel: 'Motor de Renderização (Estilo)',
    negativeLabel: 'Prompt Negativo (O que NÃO ter no vídeo)',
    negativePlaceholder: 'Ex: borrão, baixa qualidade, distorcido, feio, marca d\'água...',
    effects: 'EFEITOS VISUAIS ESPECIAIS',
    effectsLabel: 'Selecione os elementos de efeitos',
    references: 'REFERÊNCIAS E ESTILOS DE DIREÇÃO',
    directorLabel: 'Estilo de Diretor Específico',
    generate: 'GERAR PROMPT DE VÍDEO',
    promptResult: 'PROMPT GERADO',
    copy: 'Copiar',
    reset: 'Resetar',
    promptMeta: 'Prompt de vídeo gerado pelo App do Velho Brum',
    promptLangLabel: 'LINGUAGEM DO PROMPT:',
    helpTitle: 'Como Usar',
    close: 'Fechar',
    step1Title: 'Escolha o idioma do App',
    step1Text: 'No topo da tela, clique em PT ou EN para mudar o idioma de todo o aplicativo.',
    step2Title: 'Preencha as opções',
    step2Text: 'Descreva seu vídeo nas caixas de texto e selecione as opções. Não precisa preencher tudo!',
    step3Title: 'Gere o Prompt',
    step3Text: 'Clique no botão "Gerar Prompt de Vídeo". O app vai criar um prompt ultra detalhado para você.',
    step4Title: 'Escolha o idioma do Prompt',
    step4Text: 'No botão inferior, escolha se quer o prompt em Português ou Inglês. Clique para trocar!',
    step5Title: 'Copie e use!',
    step5Text: 'Clique em "Copiar" e cole o prompt no seu gerador de vídeo favorito (Runway, Pika, Sora, etc.).',
    promptLangPt: 'Português',
    promptLangEn: 'English',
    copied: 'Copiado!',
  },
  en: {
    title: 'Video Prompt Generation',
    subtitle: 'www.youtube.com/@o_velho_brum',
    theme: 'MAIN THEME',
    themeLabel: 'Describe the central theme of your video',
    themePlaceholder: 'Ex: A woman walking through an enchanted forest at dawn...',
    style: 'VISUAL STYLE',
    styleLabel: 'Select the visual style',
    camera: 'CAMERA',
    angleLabel: 'Camera Angle',
    movementLabel: 'Camera Movement',
    lensLabel: 'Lens Type',
    depthLabel: 'Depth of Field',
    lighting: 'LIGHTING',
    lightLabel: 'Lighting Type',
    atmosphere: 'ATMOSPHERE & MOOD',
    moodLabel: 'Select the atmospheric mood',
    emotionLabel: 'Emotion / Feeling',
    setting: 'SETTING',
    locationLabel: 'Location Type',
    timeLabel: 'Time of Day',
    weatherLabel: 'Weather',
    characters: 'CHARACTERS / SUBJECTS',
    subjectLabel: 'Main Subject Description',
    subjectPlaceholder: 'Ex: A young woman with long red hair...',
    actionLabel: 'Subject Action / Movement',
    actionPlaceholder: 'Ex: Walking slowly, turning her face...',
    detailsLabel: 'Additional Subject Details',
    composition: 'COMPOSITION & COLOR',
    colorPaletteLabel: 'Color Palette',
    aspectLabel: 'Aspect Ratio',
    duration: 'DURATION & FRAME RATE',
    durLabel: 'Duration (seconds)',
    speedLabel: 'Speed',
    quality: 'QUALITY & TECHNICAL DETAILS',
    qualityLabel: 'Quality Level',
    engineLabel: 'Render Engine',
    negativeLabel: 'Negative Prompt (what to avoid)',
    negativePlaceholder: 'Ex: blur, low quality, distorted, ugly...',
    effects: 'SPECIAL EFFECTS',
    effectsLabel: 'Select desired effects',
    references: 'ARTISTIC REFERENCES',
    directorLabel: 'Director Style / Visual Reference',
    generate: 'GENERATE VIDEO PROMPT',
    promptResult: 'GENERATED PROMPT',
    copy: 'Copy',
    reset: 'Reset',
    promptMeta: 'Video prompt generated by App do Velho Brum',
    promptLangLabel: 'PROMPT LANGUAGE:',
    helpTitle: 'How to Use',
    close: 'Close',
    step1Title: 'Choose App Language',
    step1Text: 'At the top of the screen, click PT or EN to change the language of the entire app.',
    step2Title: 'Fill in the options',
    step2Text: 'Describe your video in the text boxes and select options. You don\'t need to fill everything!',
    step3Title: 'Generate the Prompt',
    step3Text: 'Click the "Generate Video Prompt" button. The app will create an ultra-detailed prompt for you.',
    step4Title: 'Choose Prompt Language',
    step4Text: 'At the bottom button, choose if you want the prompt in Portuguese or English. Click to switch!',
    step5Title: 'Copy and use!',
    step5Text: 'Click "Copy" and paste the prompt into your favorite video generator (Runway, Pika, Sora, etc.).',
    promptLangPt: 'Portuguese',
    promptLangEn: 'English',
    copied: 'Copied!',
  }
};

// --- DATA OPTIONS ---

const STYLES = [
  { id: 'Cinematic', icon: '🎥', pt: 'Cinematográfico', en: 'Cinematic', infoPt: 'Cria uma aparência de filme de cinema, com iluminação dramática e cores ricas.', infoEn: 'Creates a movie theater look, with dramatic lighting and rich colors.' },
  { id: 'Anime', icon: '🌸', pt: 'Anime', en: 'Anime', infoPt: 'Estilo de animação japonesa clássica.', infoEn: 'Classic Japanese animation style.' },
  { id: 'Realistic', icon: '📷', pt: 'Realista', en: 'Realistic', infoPt: 'Imita a falha e realidade da visão humana ou de uma foto comum.', infoEn: 'Mimics the reality of human vision or a standard photo.' },
  { id: '3D Render', icon: '🧊', pt: 'Renderização 3D', en: '3D Render', infoPt: 'Estilo visual de animação digital moderna (tipo Pixar/Disney).', infoEn: 'Modern digital animation visual style (Pixar/Disney type).' },
  { id: 'Pixel Art', icon: '👾', pt: 'Pixel Art', en: 'Pixel Art', infoPt: 'Estilo de jogos antigos, composto por pequenos quadrados coloridos.', infoEn: 'Old game style, made of small colored squares.' },
  { id: 'Watercolor', icon: '🖌️', pt: 'Aquarela', en: 'Watercolor', infoPt: 'Pintura suave com transparências e cores fluidas.', infoEn: 'Soft painting with transparencies and fluid colors.' },
  { id: 'Noir', icon: '🖤', pt: 'Noir', en: 'Noir', infoPt: 'Estilo policial clássico, preto e branco com alto contraste.', infoEn: 'Classic detective style, black and white with high contrast.' },
  { id: 'Fantasy', icon: '🧙', pt: 'Fantasia', en: 'Fantasy', infoPt: 'Mundos mágicos, criaturas míticas e ambientes épicos.', infoEn: 'Magical worlds, mythical creatures, and epic environments.' },
  { id: 'Sci-Fi', icon: '🚀', pt: 'Ficção Científica', en: 'Sci-Fi', infoPt: 'Futurista, tecnologia avançada e exploração espacial.', infoEn: 'Futuristic, advanced technology, and space exploration.' },
  { id: 'Documentary', icon: '📹', pt: 'Documentário', en: 'Documentary', infoPt: 'Estilo de gravação real, informacional e naturalista.', infoEn: 'Real, informational, and naturalistic recording style.' },
  { id: 'Stop Motion', icon: '🎞️', pt: 'Foto a Foto', en: 'Stop Motion', infoPt: 'Animação feita movendo objetos fisicamente e tirando fotos.', infoEn: 'Animation made by physically moving objects and taking photos.' },
  { id: 'Vaporwave', icon: '🌊', pt: 'Vaporwave', en: 'Vaporwave', infoPt: 'Estética dos anos 80/90, luzes neon rosa e azul, nostalgia.', infoEn: '80s/90s aesthetics, pink and blue neon lights, nostalgia.' },
];

const ANGLES = [
  { id: 'Close-up', icon: '🔍', pt: 'Close-up', en: 'Close-up', infoPt: 'Foca bem de perto no rosto ou em um detalhe específico.', infoEn: 'Focuses closely on the face or a specific detail.' },
  { id: 'Medium Shot', icon: '👤', pt: 'Plano Médio', en: 'Medium Shot', infoPt: 'Mostra o sujeito da cintura para cima.', infoEn: 'Shows the subject from the waist up.' },
  { id: 'Wide Shot', icon: '🏔️', pt: 'Plano Aberto', en: 'Wide Shot', infoPt: 'Mostra o sujeito por inteiro e o ambiente ao redor.', infoEn: 'Shows the entire subject and the surrounding environment.' },
  { id: 'Extreme Close-up', icon: '👁️', pt: 'Close-up Extremo', en: 'Extreme CU', infoPt: 'Foca em um detalhe minúsculo, como apenas os olhos.', infoEn: 'Focuses on a tiny detail, like just the eyes.' },
  { id: 'Bird Eye View', icon: '🦅', pt: 'Visão Aérea', en: 'Bird Eye', infoPt: 'Câmera posicionada diretamente acima do sujeito, olhando para baixo.', infoEn: 'Camera positioned directly above the subject, looking down.' },
  { id: 'Low Angle', icon: '⬇️', pt: 'Ângulo Baixo', en: 'Low Angle', infoPt: 'Câmera posicionada abaixo, olhando para cima (transmite poder).', infoEn: 'Camera positioned below, looking up (conveys power).' },
  { id: 'Dutch Angle', icon: '📐', pt: 'Ângulo Holandês', en: 'Dutch Angle', infoPt: 'Câmera inclinada lateralmente (transmite tensão ou confusão).', infoEn: 'Camera tilted sideways (conveys tension or confusion).' },
  { id: 'Over Shoulder', icon: '🫡', pt: 'Sobre o Ombro', en: 'Over Shoulder', infoPt: 'Visto por trás do ombro de outra pessoa.', infoEn: 'Viewed from behind someone else\'s shoulder.' },
];

const MOVEMENTS = [
  { id: 'Static', icon: '⏸️', pt: 'Estático', en: 'Static', infoPt: 'Câmera parada, sem movimento.', infoEn: 'Still camera, no movement.' },
  { id: 'Slow Pan', icon: '🔄', pt: 'Panorama Lento', en: 'Slow Pan', infoPt: 'Movimentação horizontal lenta da esquerda para direita ou vice-versa.', infoEn: 'Slow horizontal movement from left to right or vice versa.' },
  { id: 'Dolly In', icon: '➡️', pt: 'Aproximação Lenta', en: 'Dolly In', infoPt: 'A câmera se move fisicamente em direção ao sujeito.', infoEn: 'The camera physically moves toward the subject.' },
  { id: 'Dolly Out', icon: '⬅️', pt: 'Afastamento Lento', en: 'Dolly Out', infoPt: 'A câmera se move para longe do sujeito.', infoEn: 'The camera moves away from the subject.' },
  { id: 'Tracking Shot', icon: '🏃', pt: 'Acompanhamento', en: 'Tracking', infoPt: 'A câmera segue o sujeito em movimento.', infoEn: 'The camera follows the subject in motion.' },
  { id: 'Crane Shot', icon: '🏗️', pt: 'Plano Grua', en: 'Crane', infoPt: 'Movimento vertical amplo subindo ou descendo.', infoEn: 'Wide vertical movement going up or down.' },
  { id: 'Handheld', icon: '🤳', pt: 'Câmera na Mão', en: 'Handheld', infoPt: 'Simula o tremor natural de quem segura a câmera.', infoEn: 'Simulates the natural shaking of someone holding the camera.' },
  { id: 'Orbit', icon: '🌀', pt: 'Orbital', en: 'Orbit', infoPt: 'Câmera gira em torno do sujeito.', infoEn: 'Camera rotates around the subject.' },
];

const LIGHTING = [
  { id: 'Golden Hour', icon: '🌅', pt: 'Hora Dourada', en: 'Golden Hour', infoPt: 'Luz quente e suave do nascer ou pôr do sol.', infoEn: 'Warm and soft light from sunrise or sunset.' },
  { id: 'Blue Hour', icon: '🌃', pt: 'Hora Azul', en: 'Blue Hour', infoPt: 'Luz azulada e fria logo antes do nascer ou após o pôr do sol.', infoEn: 'Bluish and cool light just before sunrise or after sunset.' },
  { id: 'Dramatic Lighting', icon: '🎭', pt: 'Iluminação Dramática', en: 'Dramatic', infoPt: 'Fortes luzes e sombras para criar tensão.', infoEn: 'Strong lights and shadows to create tension.' },
  { id: 'Natural Light', icon: '☀️', pt: 'Luz Natural', en: 'Natural', infoPt: 'Iluminação que parece vir do sol ou janelas.', infoEn: 'Lighting that seems to come from the sun or windows.' },
  { id: 'Studio Lighting', icon: '💡', pt: 'Luz de Estúdio', en: 'Studio', infoPt: 'Iluminação controlada e profissional.', infoEn: 'Controlled and professional lighting.' },
  { id: 'Neon Lights', icon: '🌈', pt: 'Luzes Neon', en: 'Neon', infoPt: 'Cores vibrantes de letreiros neon.', infoEn: 'Vibrant colors from neon signs.' },
  { id: 'Moonlight', icon: '🌙', pt: 'Luz da Lua', en: 'Moonlight', infoPt: 'Iluminação noturna suave e prateada.', infoEn: 'Soft and silvery night lighting.' },
  { id: 'Volumetric Lighting', icon: '✨', pt: 'Luz Volumétrica', en: 'Volumetric', infoPt: 'Raios de luz visíveis através de neblina ou poeira.', infoEn: 'Beams of light visible through fog or dust.' },
];

const MOODS = [
  { id: 'Fog', pt: 'Neblina', en: 'Fog', infoPt: 'Adiciona neblina para mistério ou isolamento.', infoEn: 'Adds fog for mystery or isolation.' },
  { id: 'Rain', pt: 'Chuva', en: 'Rain', infoPt: 'Cena com chuva para melancolia ou ação.', infoEn: 'Rain scene for melancholy or action.' },
  { id: 'Snow', pt: 'Neve', en: 'Snow', infoPt: 'Atmosfera fria e pacífica com neve caindo.', infoEn: 'Cold and peaceful atmosphere with falling snow.' },
  { id: 'Wind', pt: 'Vento', en: 'Wind', infoPt: 'Movimento de cabelos e roupas pelo vento.', infoEn: 'Movement of hair and clothes by the wind.' },
  { id: 'Dust', pt: 'Poeira', en: 'Poeira', infoPt: 'Partículas de poeira flutuando na luz.', infoEn: 'Dust particles floating in the light.' },
  { id: 'Smoke', pt: 'Fumaça', en: 'Fumaça', infoPt: 'Adiciona fumaça ou vapor à cena.', infoEn: 'Adds smoke or steam to the scene.' },
  { id: 'Mist', pt: 'Névoa', en: 'Mist', infoPt: 'Névoa leve, geralmente ao nível do chão ou água.', infoEn: 'Light mist, usually at ground or water level.' },
  { id: 'Leaves', pt: 'Folhas', en: 'Folhas', infoPt: 'Folhas secas ou verdes voando pela cena.', infoEn: 'Dry or green leaves flying through the scene.' },
];

const EMOTIONS = [
  { id: 'Melancholic', icon: '😢', pt: 'Melancólico', en: 'Melancholic', infoPt: 'Tristeza profunda e contemplativa.', infoEn: 'Deep and contemplative sadness.' },
  { id: 'Joyful', icon: '😊', pt: 'Alegre', en: 'Joyful', infoPt: 'Felicidade e energia positiva.', infoEn: 'Happiness and positive energy.' },
  { id: 'Mysterious', icon: '🔮', pt: 'Misterioso', en: 'Mysterious', infoPt: 'Mistério e curiosidade instigante.', infoEn: 'Mystery and intriguing curiosity.' },
  { id: 'Epic', icon: '⚔️', pt: 'Épico', en: 'Epic', infoPt: 'Grandiosidade, heroísmo e aventura.', infoEn: 'Grandeur, heroism, and adventure.' },
  { id: 'Romantic', icon: '❤️', pt: 'Romântico', en: 'Romantic', infoPt: 'Amor, suavidade e carinho.', infoEn: 'Love, softness, and affection.' },
  { id: 'Dark', icon: '🖤', pt: 'Sombrio', en: 'Dark', infoPt: 'Terror, escuridão ou temas pesados.', infoEn: 'Horror, darkness, or heavy themes.' },
  { id: 'Peaceful', icon: '☮️', pt: 'Pacífico', en: 'Peaceful', infoPt: 'Tranquilidade e calma absoluta.', infoEn: 'Tranquility and absolute calm.' },
  { id: 'Nostalgic', icon: '🕰️', pt: 'Nostálgico', en: 'Nostalgic', infoPt: 'Saudade do passado ou de algo antigo.', infoEn: 'Longing for the past or something old.' },
];

const LOCATIONS = [
  { id: 'Urban City', icon: '🏙️', pt: 'Cidade Urbana', en: 'Urban City', infoPt: 'Rua de cidade, prédios e asfalto.', infoEn: 'City street, buildings, and asphalt.' },
  { id: 'Forest', icon: '🌲', pt: 'Floresta', en: 'Forest', infoPt: 'Natureza densa, árvores e verde.', infoEn: 'Dense nature, trees, and greenery.' },
  { id: 'Beach', icon: '🏖️', pt: 'Praia', en: 'Beach', infoPt: 'Areia, mar e horizonte.', infoEn: 'Sand, sea, and horizon.' },
  { id: 'Mountain', icon: '⛰️', pt: 'Montanha', en: 'Mountain', infoPt: 'Alturas elevadas, pedras ou neve.', infoEn: 'High altitudes, rocks, or snow.' },
  { id: 'Desert', icon: '🏜️', pt: 'Deserto', en: 'Desert', infoPt: 'Dunas de areia e sol forte.', infoEn: 'Sand dunes and strong sun.' },
  { id: 'Space', icon: '🌌', pt: 'Espaço', en: 'Space', infoPt: 'Estrelas, planetas e galáxias.', infoEn: 'Stars, planets, and galaxies.' },
  { id: 'Underwater', icon: '🌊', pt: 'Subaquático', en: 'Underwater', infoPt: 'Abaixo da superfície da água.', infoEn: 'Below the water surface.' },
  { id: 'Cyberpunk', icon: '🤖', pt: 'Cidade Cyberpunk', en: 'Cyberpunk', infoPt: 'Futuro distópico com muito neon e tecnologia.', infoEn: 'Dystopian future with lost of neon and technology.' },
];

const EFFECTS = [
  { id: 'Fire', pt: 'Fogo', en: 'Fire', infoPt: 'Adiciona chamas e brasas à cena.', infoEn: 'Adds flames and embers to the scene.' },
  { id: 'Lightning', pt: 'Raios', en: 'Lightning', infoPt: 'Relâmpagos e efeitos elétricos.', infoEn: 'Lightning and electrical effects.' },
  { id: 'Sparkles', pt: 'Brilhos', en: 'Sparkles', infoPt: 'Pequenas luzes cintilantes e poeira mágica.', infoEn: 'Small twinkling lights and magic dust.' },
  { id: 'Glitch', pt: 'Glitch', en: 'Glitch', infoPt: 'Efeito de interferência digital ou falha de vídeo.', infoEn: 'Digital interference or video glitch effect.' },
  { id: 'Slow motion liquid', pt: 'Líquido Lento', en: 'Liquid', infoPt: 'Simula água ou líquidos em câmera lenta.', infoEn: 'Simulates water or liquids in slow motion.' },
];

const DETAILS = [
  { id: 'Hyper-detailed skin', pt: 'Pele Realista', en: 'Detailed Skin', infoPt: 'Texturas de pele perfeitas, poros e detalhes.', infoEn: 'Perfect skin textures, pores, and details.' },
  { id: 'Intricate clothing', pt: 'Roupas Detalhadas', en: 'Intricate Clothing', infoPt: 'Tecidos com texturas visíveis e costuras.', infoEn: 'Fabrics with visible textures and stitching.' },
  { id: 'Expressive eyes', pt: 'Olhos Expressivos', en: 'Expressive Eyes', infoPt: 'Reflexos e detalhes profundos na íris.', infoEn: 'Deep reflections and details in the iris.' },
];

const DIRECTORS = [
  { id: 'Wes Anderson style', icon: '🎨', name: 'Wes Anderson', infoPt: 'Estilo simétrico, paletas de cores pastéis e enquadramentos centralizados.', infoEn: 'Symmetrical style, pastel color palettes, and centered framing.' },
  { id: 'Christopher Nolan style', icon: '🎬', name: 'C. Nolan', infoPt: 'Estilo épico, grande escala (IMAX), tons frios e atmosfera séria.', infoEn: 'Epic style, large scale (IMAX), cool tones, and serious atmosphere.' },
  { id: 'Studio Ghibli style', icon: '🌿', name: 'Studio Ghibli', infoPt: 'Animação desenhada à mão, ambientes naturais detalhados e sensação mágica.', infoEn: 'Hand-drawn animation, detailed natural environments, and magical feel.' },
  { id: 'Ridley Scott style', icon: '🛡️', name: 'R. Scott', infoPt: 'Iluminação atmosférica (muitas vezes com fumaça/névoa) e visuais ricos em texturas.', infoEn: 'Atmospheric lighting (often with smoke/mist) and texture-rich visuals.' },
  { id: 'Denis Villeneuve style', icon: '🌀', name: 'D. Villeneuve', infoPt: 'Visuais minimalistas, grandiosos, atmosfera contemplativa e paletas de cores marcantes.', infoEn: 'Minimalist, grandiose visuals, contemplative atmosphere, and striking color palettes.' },
  { id: 'Tim Burton style', icon: '🦇', name: 'Tim Burton', infoPt: 'Estética gótica, sombria, personagens excêntricos e ambientes fantásticos.', infoEn: 'Gothic, dark aesthetics, quirky characters, and fantastic environments.' },
  { id: 'Hayao Miyazaki style', icon: '🌸', name: 'H. Miyazaki', infoPt: 'Visuais detalhados da natureza, aviões e uma sensação de maravilha infantil.', infoEn: 'Detailed nature visuals, airplanes, and a sense of childhood wonder.' },
  { id: 'David Fincher style', icon: '🔍', name: 'D. Fincher', infoPt: 'Cores dessaturadas (frequentemente verdes/amarelos), sombras profundas e precisão técnica.', infoEn: 'Desaturated colors (often greens/yellows), deep shadows, and technical precision.' },
];

// --- COMPONENTS ---

const InfoCircle = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="ml-2 w-4 h-4 rounded-full bg-[#222233] text-[#6a6a80] flex items-center justify-center hover:bg-[#f5a623] hover:text-black transition-colors"
  >
    <HelpCircle size={8} />
  </button>
);

const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-[#12121a] border border-[#222233] rounded-xl p-5 mb-4 hover:border-[#f5a6234d] transition-colors"
  >
    <div className="text-[#f5a623] text-sm font-black tracking-widest uppercase mb-4 flex items-center gap-2">
      <Icon size={18} />
      <span>{title}</span>
    </div>
    {children}
  </motion.div>
);

const OptionCard = ({ label, icon, selected, onClick, onInfoClick }: any) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-lg border-2 text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 h-full
        ${selected 
          ? 'border-[#f5a623] bg-[#f5a6231a] text-[#f5a623] shadow-[0_0_12px_rgba(245,166,35,0.2)]' 
          : 'border-[#222233] bg-[#1a1a28] text-[#a0a0b8] hover:border-[#f5a623] hover:text-[#e8e8f0]'
        }`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {label}
    </button>
    {onInfoClick && (
      <button 
        onClick={(e) => { e.stopPropagation(); onInfoClick(); }}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#222233] text-[#6a6a80] flex items-center justify-center hover:bg-[#f5a623] hover:text-black transition-colors"
      >
        <HelpCircle size={10} />
      </button>
    )}
  </div>
);

const CheckboxItem = ({ label, checked, onClick, onInfoClick }: any) => (
  <div className="relative group flex items-center">
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 pr-8
        ${checked 
          ? 'border-[#00b894] bg-[#00b8941a] text-[#00b894]' 
          : 'border-[#222233] bg-[#1a1a28] text-[#a0a0b8] hover:border-[#f5a623] hover:text-[#e8e8f0]'
        }`}
    >
      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[8px]
        ${checked ? 'border-[#00b894] bg-[#00b894] text-white' : 'border-[#6a6a80]'}`}
      >
        {checked && '✓'}
      </div>
      {label}
    </button>
    {onInfoClick && (
      <button 
        onClick={(e) => { e.stopPropagation(); onInfoClick(); }}
        className="absolute right-2 w-4 h-4 rounded-full bg-[#222233] text-[#6a6a80] flex items-center justify-center hover:bg-[#f5a623] hover:text-black transition-colors"
      >
        <HelpCircle size={8} />
      </button>
    )}
  </div>
);

// --- MAIN APP ---

export default function App() {
  const [appLang, setAppLang] = useState<'pt' | 'en'>('pt');
  const [promptLang, setPromptLang] = useState<'pt' | 'en'>('pt');
  const [showSplash, setShowSplash] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  // Form State
  const [theme, setTheme] = useState('');
  const [subject, setSubject] = useState('');
  const [action, setAction] = useState('');
  const [negative, setNegative] = useState('');
  const [style, setStyle] = useState('');
  const [angle, setAngle] = useState('');
  const [camMove, setCamMove] = useState('');
  const [lighting, setLighting] = useState('');
  const [emotion, setEmotion] = useState('');
  const [location, setLocation] = useState('');
  const [director, setDirector] = useState('');
  const [lens, setLens] = useState('');
  const [depth, setDepth] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [weather, setWeather] = useState('');
  const [colorPalette, setColorPalette] = useState('');
  const [aspect, setAspect] = useState('16:9');
  const [duration, setDuration] = useState(5);
  const [fps, setFps] = useState('24fps');
  const [speed, setSpeed] = useState('normal speed');
  const [engine, setEngine] = useState('');
  const [quality, setQuality] = useState('');
  
  const [selectedMoods, setSelectedMoods] = useState<Set<string>>(new Set());
  const [selectedDetails, setSelectedDetails] = useState<Set<string>>(new Set());
  const [selectedEffects, setSelectedEffects] = useState<Set<string>>(new Set());

  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const t = TRANSLATIONS[appLang];

  const handleToggle = (set: Set<string>, val: string, setter: any) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    setter(next);
  };

  const handleReset = () => {
    setTheme(''); setSubject(''); setAction(''); setNegative('');
    setStyle(''); setAngle(''); setCamMove(''); setLighting('');
    setEmotion(''); setLocation(''); setDirector(''); setLens('');
    setDepth(''); setTimeOfDay(''); setWeather(''); setColorPalette('');
    setAspect('16:9'); setDuration(5); setFps('24fps'); setSpeed('normal speed');
    setEngine(''); setQuality('');
    setSelectedMoods(new Set()); setSelectedDetails(new Set()); setSelectedEffects(new Set());
    setGeneratedPrompt(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePrompt = (skipScroll = false) => {
    const moodsArray = Array.from(selectedMoods);
    const detailsArray = Array.from(selectedDetails);
    const effectsArray = Array.from(selectedEffects);

    let prompt = '';

    if (promptLang === 'pt') {
      let p = '';
      if (style) p += `Estilo visual: ${STYLES.find(s => s.id === style)?.pt}\n`;
      if (director) p += `Referência artística: ${director}\n`;
      if (theme) p += `Tema: ${theme}\n`;
      if (subject) p += `Sujeito principal: ${subject}\n`;
      if (action) p += `Ação: ${action}\n`;
      if (location) p += `Cenário: ${LOCATIONS.find(l => l.id === location)?.pt}\n`;
      if (timeOfDay) p += `Hora: ${timeOfDay}\n`;
      if (weather) p += `Clima: ${weather}\n`;
      if (lighting) p += `Iluminação: ${LIGHTING.find(l => l.id === lighting)?.pt}\n`;
      if (angle) p += `Ângulo de câmera: ${ANGLES.find(a => a.id === angle)?.pt}\n`;
      if (camMove) p += `Movimento de câmera: ${MOVEMENTS.find(m => m.id === camMove)?.pt}\n`;
      if (lens) p += `Lente: ${lens}\n`;
      if (depth) p += `Profundidade de campo: ${depth}\n`;
      if (colorPalette) p += `Paleta de cores: ${colorPalette}\n`;
      if (emotion) p += `Atmosfera emocional: ${EMOTIONS.find(e => e.id === emotion)?.pt}\n`;
      if (moodsArray.length) p += `Elementos atmosféricos: ${moodsArray.join(', ')}\n`;
      if (detailsArray.length) p += `Detalhes: ${detailsArray.join(', ')}\n`;
      if (effectsArray.length) p += `Efeitos: ${effectsArray.join(', ')}\n`;
      if (engine) p += `Renderização: ${engine}\n`;
      if (quality) p += `Qualidade: ${quality}\n`;
      p += `Proporção: ${aspect}\n`;
      p += `Duração: ${duration} segundos\n`;
      p += `Taxa de quadros: ${fps}\n`;
      p += `Velocidade: ${speed}\n`;
      if (negative) p += `Evitar: ${negative}\n`;

      p += '\n--- PROMPT FINAL ---\n\n';
      p += `Crie um vídeo ${style ? STYLES.find(s => s.id === style)?.pt + ' de' : ''} mostrando ${theme || subject || 'a cena descrita'}. ${subject ? 'O sujeito principal é: ' + subject + '.' : ''} ${action ? 'A ação é: ' + action + '.' : ''} ${location ? 'Ambientado em ' + LOCATIONS.find(l => l.id === location)?.pt + '.' : ''} ${timeOfDay ? 'Com iluminação de ' + timeOfDay + '.' : ''} ${weather ? 'Clima: ' + weather + '.' : ''} ${lighting ? 'Iluminação ' + LIGHTING.find(l => l.id === lighting)?.pt + '.' : ''} ${angle ? 'Filmado em ' + ANGLES.find(a => a.id === angle)?.pt + '.' : ''} ${camMove ? 'Com movimento de câmera ' + MOVEMENTS.find(m => m.id === camMove)?.pt + '.' : ''} ${lens ? 'Usando lente ' + lens + '.' : ''} ${depth ? 'Profundidade: ' + depth + '.' : ''} ${colorPalette ? 'Paleta de cores ' + colorPalette + '.' : ''} ${emotion ? 'Transmitindo uma sensação ' + EMOTIONS.find(e => e.id === emotion)?.pt + '.' : ''} ${moodsArray.length ? 'Com ' + moodsArray.join(', ') + '.' : ''} ${effectsArray.length ? 'Incluindo efeitos de ' + effectsArray.join(', ') + '.' : ''} ${engine ? 'Renderizado no estilo ' + engine + '.' : ''} ${quality ? 'Com qualidade ' + quality + '.' : ''} Proporção ${aspect}, ${duration}s, ${fps}, ${speed}.`;
      prompt = p;
    } else {
      let p = '';
      if (style) p += `Visual style: ${style}\n`;
      if (director) p += `Artistic reference: ${director}\n`;
      if (theme) p += `Theme: ${theme}\n`;
      if (subject) p += `Main subject: ${subject}\n`;
      if (action) p += `Action: ${action}\n`;
      if (location) p += `Setting: ${location}\n`;
      if (timeOfDay) p += `Time: ${timeOfDay}\n`;
      if (weather) p += `Weather: ${weather}\n`;
      if (lighting) p += `Lighting: ${lighting}\n`;
      if (angle) p += `Camera angle: ${angle}\n`;
      if (camMove) p += `Camera movement: ${camMove}\n`;
      if (lens) p += `Lens: ${lens}\n`;
      if (depth) p += `Depth of field: ${depth}\n`;
      if (colorPalette) p += `Color palette: ${colorPalette}\n`;
      if (emotion) p += `Emotional atmosphere: ${emotion}\n`;
      if (moodsArray.length) p += `Atmospheric elements: ${moodsArray.join(', ')}\n`;
      if (detailsArray.length) p += `Details: ${detailsArray.join(', ')}\n`;
      if (effectsArray.length) p += `Effects: ${effectsArray.join(', ')}\n`;
      if (engine) p += `Render engine: ${engine}\n`;
      if (quality) p += `Quality: ${quality}\n`;
      p += `Aspect ratio: ${aspect}\n`;
      p += `Duration: ${duration} seconds\n`;
      p += `Frame rate: ${fps}\n`;
      p += `Speed: ${speed}\n`;
      if (negative) p += `Negative prompt: ${negative}\n`;

      p += '\n--- FINAL PROMPT ---\n\n';
      let promptText = `Create a ${style ? style + ' ' : ''}video `;
      if (director) promptText += `in the style of ${director} `;
      if (theme) promptText += `showing ${theme}`;
      else if (subject) promptText += `featuring ${subject}`;
      else promptText += `the described scene`;

      if (subject) promptText += `. The main subject is: ${subject}`;
      if (action) promptText += `. Action: ${action}`;
      if (location) promptText += `. Set in ${location}`;
      if (timeOfDay) promptText += `, ${timeOfDay}`;
      if (weather) promptText += `, ${weather}`;
      if (lighting) promptText += `. ${lighting} lighting`;
      if (angle) promptText += `. Shot from a ${angle} perspective`;
      if (camMove) promptText += ` with ${camMove}`;
      if (lens) promptText += `. Filmed with ${lens}`;
      if (depth) promptText += `, ${depth}`;
      if (colorPalette) promptText += `. ${colorPalette} color palette`;
      if (emotion) promptText += `. Evoking a ${emotion} feeling`;
      if (moodsArray.length) promptText += `. Featuring ${moodsArray.join(', ')}`;
      if (effectsArray.length) promptText += `. With ${effectsArray.join(', ')} effects`;
      if (engine) promptText += `. ${engine} style rendering`;
      if (quality) promptText += `. ${quality} quality`;
      promptText += `. Aspect ratio ${aspect}, ${duration} seconds duration, ${fps}, ${speed}.`;
      if (negative) promptText += `\n\nNegative prompt: ${negative}`;
      p += promptText;
      prompt = p;
    }

    setGeneratedPrompt(prompt);
    if (!skipScroll) {
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  useEffect(() => {
    if (generatedPrompt !== null) {
      generatePrompt(true);
    }
  }, [promptLang]);


  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0] pb-32">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[9999] bg-[linear-gradient(135deg,#0a0a12_0%,#1a0a20_50%,#0a0a12_100%)] flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.02, 1], filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-64 h-64 bg-[#1a1a28] rounded-3xl shadow-[0_0_60px_rgba(245,166,35,0.3)] flex items-center justify-center text-8xl"
            >
              {HERO_EMOJI}
            </motion.div>
            <div className="mt-5 text-[#f5a623] text-sm tracking-[3px] uppercase opacity-70">App do Velho Brum</div>
            <div className="w-48 h-1 bg-[#222233] rounded-full mt-8 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-[#f5a623] to-[#ff6b35]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 pt-5 pb-20">
        <header className="flex flex-col sm:flex-row items-center justify-between border-b border-[#222233] py-4 mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1a1a28] border border-[#222233] flex items-center justify-center text-2xl">
              {HERO_EMOJI}
            </div>
            <div>
              <h1 className="text-lg font-black bg-gradient-to-br from-[#f5a623] to-[#ff6b35] bg-clip-text text-transparent">
                {appLang === 'pt' ? 'Geração de Prompts de Vídeo' : 'Video Prompt Generation'}
              </h1>
              <div className="text-[11px] text-[#6a6a80]">www.youtube.com/@o_velho_brum</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#1a1a28] border border-[#222233] rounded-full p-1 shadow-inner">
              <button 
                onClick={() => setAppLang('pt')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${appLang === 'pt' ? 'bg-gradient-to-br from-[#f5a623] to-[#ff6b35] text-white' : 'text-[#a0a0b8]'}`}
              >
                <span>{FLAG_BR_EMOJI}</span> PT
              </button>
              <button 
                onClick={() => setAppLang('en')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${appLang === 'en' ? 'bg-gradient-to-br from-[#f5a623] to-[#ff6b35] text-white' : 'text-[#a0a0b8]'}`}
              >
                <span>{FLAG_US_EMOJI}</span> EN
              </button>
            </div>
            <button 
              onClick={() => setShowHelp(true)}
              className="w-10 h-10 rounded-full border-2 border-[#222233] bg-[#1a1a28] text-[#f5a623] flex items-center justify-center hover:border-[#f5a623] hover:rotate-12 transition-all active:scale-90"
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </header>

        <Section title={t.theme} icon={Film}>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-[#a0a0b8] uppercase tracking-wider mb-2 flex items-center">
                {t.themeLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Descreva o tema central ou o que está acontecendo na cena de forma geral.' : 'Describe the central theme or what is happening in the scene in general.')} />
              </label>
              <textarea 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder={t.themePlaceholder}
                className="w-full bg-[#1a1a28] border border-[#222233] rounded-lg p-3 text-sm focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] outline-none transition-all min-h-[80px]"
              />
            </div>
          </div>
        </Section>

        <Section title={t.style} icon={Palette}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STYLES.map(s => (
              <OptionCard 
                key={s.id} 
                label={appLang === 'pt' ? s.pt : s.en} 
                icon={s.icon} 
                selected={style === s.id}
                onClick={() => setStyle(style === s.id ? '' : s.id)}
                onInfoClick={() => setActiveInfo(appLang === 'pt' ? s.infoPt : s.infoEn)}
              />
            ))}
          </div>
        </Section>

        <Section title={t.camera} icon={Camera}>
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-3 flex items-center">
                {t.angleLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Onde a câmera está posicionada em relação ao sujeito.' : 'Where the camera is positioned relative to the subject.')} />
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ANGLES.map(a => (
                  <OptionCard 
                    key={a.id} 
                    label={appLang === 'pt' ? a.pt : a.en} 
                    icon={a.icon} 
                    selected={angle === a.id}
                    onClick={() => setAngle(angle === a.id ? '' : a.id)}
                    onInfoClick={() => setActiveInfo(appLang === 'pt' ? a.infoPt : a.infoEn)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-3 flex items-center">
                {t.movementLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Como a câmera se move durante a cena.' : 'How the camera moves during the scene.')} />
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MOVEMENTS.map(m => (
                  <OptionCard 
                    key={m.id} 
                    label={appLang === 'pt' ? m.pt : m.en} 
                    icon={m.icon} 
                    selected={camMove === m.id}
                    onClick={() => setCamMove(camMove === m.id ? '' : m.id)}
                    onInfoClick={() => setActiveInfo(appLang === 'pt' ? m.infoPt : m.infoEn)}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                  {t.lensLabel}
                  <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Define a curvatura e zoom da imagem. Lentes wide mostram mais, macro mostram detalhes minúsculos.' : 'Defines image curvature and zoom. Wide lenses show more, macro show tiny details.')} />
                </label>
                <select 
                  value={lens}
                  onChange={(e) => setLens(e.target.value)}
                  className="w-full bg-[#1a1a28] border border-[#222233] rounded-lg p-3 text-sm focus:border-[#f5a623] outline-none"
                >
                  <option value="">Automático</option>
                  <option value="35mm lens">35mm - Grande Angular</option>
                  <option value="50mm lens">50mm - Normal</option>
                  <option value="85mm lens">85mm - Retrato</option>
                  <option value="Macro lens">Lente Macro</option>
                  <option value="Anamorphic lens">Anamórfica</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                  {t.depthLabel}
                  <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Controla o desfoque do fundo. Rasa (Bokeh) destaca o sujeito, Profunda mantém tudo nítido.' : 'Controls background blur. Shallow (Bokeh) highlights the subject, Deep keeps everything sharp.')} />
                </label>
                <select 
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  className="w-full bg-[#1a1a28] border border-[#222233] rounded-lg p-3 text-sm focus:border-[#f5a623] outline-none"
                >
                  <option value="">Automático</option>
                  <option value="shallow depth of field, bokeh background">Rasa (Filtro Bokeh / Desfoque)</option>
                  <option value="deep depth of field, everything in focus">Profunda (Tudo nítido)</option>
                  <option value="tilt-shift effect">Efeito Tilt-shift (Visual Miniatura)</option>
                </select>
              </div>
            </div>
          </div>
        </Section>

        <Section title={t.lighting} icon={Sun}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LIGHTING.map(l => (
              <OptionCard 
                key={l.id} 
                label={appLang === 'pt' ? l.pt : l.en} 
                icon={l.icon} 
                selected={lighting === l.id}
                onClick={() => setLighting(lighting === l.id ? '' : l.id)}
                onInfoClick={() => setActiveInfo(appLang === 'pt' ? l.infoPt : l.infoEn)}
              />
            ))}
          </div>
        </Section>

        <Section title={t.atmosphere} icon={Cloud}>
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-3 flex items-center">
                {t.moodLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Elementos climáticos ou ambientais que mudam o clima da cena.' : 'Weather or environmental elements that change the mood of the scene.')} />
              </label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map(m => (
                  <CheckboxItem 
                    key={m.id} 
                    label={appLang === 'pt' ? m.pt : m.en} 
                    checked={selectedMoods.has(appLang === 'pt' ? m.pt : m.en)}
                    onClick={() => handleToggle(selectedMoods, appLang === 'pt' ? m.pt : m.en, setSelectedMoods)}
                    onInfoClick={() => setActiveInfo(appLang === 'pt' ? m.infoPt : m.infoEn)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-3 flex items-center">
                {t.emotionLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'O sentimento predominante transmitido pelo vídeo.' : 'The predominant feeling conveyed by the video.')} />
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EMOTIONS.map(e => (
                  <OptionCard 
                    key={e.id} 
                    label={appLang === 'pt' ? e.pt : e.en} 
                    icon={e.icon} 
                    selected={emotion === e.id}
                    onClick={() => setEmotion(emotion === e.id ? '' : e.id)}
                    onInfoClick={() => setActiveInfo(appLang === 'pt' ? e.infoPt : e.infoEn)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title={t.setting} icon={Monitor}>
          <div className="space-y-4">
            <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
              {t.locationLabel}
              <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Onde a cena se passa.' : 'Where the scene takes place.')} />
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LOCATIONS.map(l => (
                <OptionCard 
                  key={l.id} 
                  label={appLang === 'pt' ? l.pt : l.en} 
                  icon={l.icon} 
                  selected={location === l.id}
                  onClick={() => setLocation(location === l.id ? '' : l.id)}
                  onInfoClick={() => setActiveInfo(appLang === 'pt' ? l.infoPt : l.infoEn)}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                  {t.timeLabel}
                  <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Define a hora do dia e as cores naturais do céu e da luz.' : 'Sets the time of day and natural colors of the sky and light.')} />
                </label>
                <select 
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="w-full bg-[#1a1a28] border border-[#222233] rounded-lg p-3 text-sm focus:border-[#f5a623] outline-none"
                >
                  <option value="">Automático</option>
                  <option value="dawn, early morning light">Amanhecer</option>
                  <option value="morning, soft sunlight">Manhã</option>
                  <option value="sunset, golden hour">Pôr do Sol / Hora Dourada</option>
                  <option value="twilight, blue hour">Crepúsculo / Hora Azul</option>
                  <option value="night, moonlight">Noite</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                  {t.weatherLabel}
                  <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Condições climáticas presentes na cena.' : 'Weather conditions present in the scene.')} />
                </label>
                <select 
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full bg-[#1a1a28] border border-[#222233] rounded-lg p-3 text-sm focus:border-[#f5a623] outline-none"
                >
                  <option value="">Automático</option>
                  <option value="clear sky">Céu Limpo</option>
                  <option value="cloudy">Nublado</option>
                  <option value="stormy, lightning">Tempestuoso</option>
                  <option value="aurora borealis">Aurora Boreal</option>
                </select>
              </div>
            </div>
          </div>
        </Section>

        <Section title={t.characters} icon={Users}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                {t.subjectLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Descreva o personagem principal ou objeto central da cena.' : 'Describe the main character or central object of the scene.')} />
              </label>
              <textarea 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t.subjectPlaceholder}
                className="w-full bg-[#1a1a28] border border-[#222233] rounded-lg p-3 text-sm focus:border-[#f5a623] outline-none min-h-[60px]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                {t.actionLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'O que o sujeito está fazendo? Defina o movimento e intenção.' : 'What is the subject doing? Define movement and intention.')} />
              </label>
              <textarea 
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder={t.actionPlaceholder}
                className="w-full bg-[#1a1a28] border border-[#222233] rounded-lg p-3 text-sm focus:border-[#f5a623] outline-none min-h-[60px]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                {t.detailsLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Detalhes técnicos que aumentam o realismo do personagem.' : 'Technical details that increase character realism.')} />
              </label>
              <div className="flex flex-wrap gap-2">
                {DETAILS.map(d => (
                  <CheckboxItem 
                    key={d.id}
                    label={appLang === 'pt' ? d.pt : d.en}
                    checked={selectedDetails.has(appLang === 'pt' ? d.pt : d.en)}
                    onClick={() => handleToggle(selectedDetails, appLang === 'pt' ? d.pt : d.en, setSelectedDetails)}
                    onInfoClick={() => setActiveInfo(appLang === 'pt' ? d.infoPt : d.infoEn)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title={t.duration} icon={Settings}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                {t.durLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Quanto tempo o vídeo vai durar (em segundos).' : 'How long the video will last (in seconds).')} />
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="2" max="60" 
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="flex-1 accent-[#f5a623]"
                />
                <span className="text-[#f5a623] font-black w-8">{duration}s</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                  Taxa de Quadros (FPS)
                  <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Fluidez do vídeo. 24 fps é cinematográfico, 60 fps ou mais é para slow motion.' : 'Video fluidity. 24 fps is cinematic, 60 fps or more is for slow motion.')} />
                </label>
                <select 
                  value={fps}
                  onChange={(e) => setFps(e.target.value)}
                  className="w-full bg-[#1a1a28] border border-[#222233] rounded-lg p-3 text-sm focus:border-[#f5a623] outline-none"
                >
                  <option value="24fps">24 FPS (Cinematográfico)</option>
                  <option value="30fps">30 FPS (Padrão)</option>
                  <option value="60fps">60 FPS (Fluido)</option>
                  <option value="120fps">120 FPS (Slow Motion)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                  {t.speedLabel}
                  <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Define se o tempo passa normal ou mais devagar/rápido.' : 'Defines whether time passes normally or slower/faster.')} />
                </label>
                <select 
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  className="w-full bg-[#1a1a28] border border-[#222233] rounded-lg p-3 text-sm focus:border-[#f5a623] outline-none"
                >
                  <option value="normal speed">Normal</option>
                  <option value="slow motion, 0.5x speed">Slow Motion</option>
                  <option value="super slow motion, 0.25x speed">Super Slow Motion</option>
                  <option value="timelapse, accelerated speed">Timelapse</option>
                </select>
              </div>
            </div>
          </div>
        </Section>

        <Section title={t.effects} icon={Zap}>
          <div className="space-y-4">
            <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
              {t.effectsLabel}
              <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Adiciona elementos visuais dinâmicos para aumentar o impacto da cena.' : 'Adds dynamic visual elements to increase the impact of the scene.')} />
            </label>
            <div className="flex flex-wrap gap-2">
              {EFFECTS.map(e => (
                <CheckboxItem 
                  key={e.id}
                  label={appLang === 'pt' ? e.pt : e.en}
                  checked={selectedEffects.has(appLang === 'pt' ? e.pt : e.en)}
                  onClick={() => handleToggle(selectedEffects, appLang === 'pt' ? e.pt : e.en, setSelectedEffects)}
                  onInfoClick={() => setActiveInfo(appLang === 'pt' ? e.infoPt : e.infoEn)}
                />
              ))}
            </div>
          </div>
        </Section>

        <Section title={t.composition} icon={Palette}>
          <div className="space-y-4">
            <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
              {t.colorPaletteLabel}
              <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Define o esquema de cores predominante na imagem.' : 'Defines the predominant color scheme in the image.')} />
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <OptionCard label={appLang === 'pt' ? 'Quente' : 'Warm'} icon="🟠" selected={colorPalette === 'Warm'} onClick={() => setColorPalette(colorPalette === 'Warm' ? '' : 'Warm')} onInfoClick={() => setActiveInfo(appLang === 'pt' ? 'Cores baseadas em laranja, vermelho e amarelo (sensação acolhedora).' : 'Colors based on orange, red, and yellow (cozy feel).')} />
              <OptionCard label={appLang === 'pt' ? 'Frio' : 'Cool'} icon="🔵" selected={colorPalette === 'Cool'} onClick={() => setColorPalette(colorPalette === 'Cool' ? '' : 'Cool')} onInfoClick={() => setActiveInfo(appLang === 'pt' ? 'Cores baseadas em azul e ciano (sensação gelada ou tecnológica).' : 'Colors based on blue and cyan (cold or technological feel).')} />
              <OptionCard label={appLang === 'pt' ? 'Mono' : 'Mono'} icon="⚫" selected={colorPalette === 'Mono'} onClick={() => setColorPalette(colorPalette === 'Mono' ? '' : 'Mono')} onInfoClick={() => setActiveInfo(appLang === 'pt' ? 'Preto e branco ou tons de uma única cor.' : 'Black and white or single color tones.')} />
              <OptionCard label={appLang === 'pt' ? 'Vibrante' : 'Vibrant'} icon="🌈" selected={colorPalette === 'Vibrant'} onClick={() => setColorPalette(colorPalette === 'Vibrant' ? '' : 'Vibrant')} onInfoClick={() => setActiveInfo(appLang === 'pt' ? 'Cores intensas e muito saturadas.' : 'Intense and very saturated colors.')} />
            </div>
            <div>
              <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                {t.aspectLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Formato do vídeo. 16:9 é padrão TV/YouTube, 9:16 é vertical para celular.' : 'Video format. 16:9 is standard TV/YouTube, 9:16 is vertical for mobile.')} />
              </label>
              <select 
                value={aspect}
                onChange={(e) => setAspect(e.target.value)}
                className="w-full bg-[#1a1a28] border border-[#222233] rounded-lg p-3 text-sm focus:border-[#f5a623] outline-none"
              >
                <option value="16:9">{appLang === 'pt' ? '16:9 (Widescreen / Tela Cheia)' : '16:9 (Widescreen)'}</option>
                <option value="9:16">{appLang === 'pt' ? '9:16 (Vertical / Reels)' : '9:16 (Reels/TikTok)'}</option>
                <option value="1:1">{appLang === 'pt' ? '1:1 (Quadrado)' : '1:1 (Square)'}</option>
                <option value="2.35:1">{appLang === 'pt' ? '2.35:1 (Cinema / Ultra-Widescreen)' : '2.35:1 (Cinema)'}</option>
              </select>
            </div>
          </div>
        </Section>

        <Section title={t.quality} icon={Settings}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                {t.qualityLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Garante que o vídeo final tenha alta fidelidade e detalhes nítidos.' : 'Ensures the final video has high fidelity and sharp details.')} />
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <OptionCard label="4K UHD" icon="📺" selected={quality === '4K'} onClick={() => setQuality(quality === '4K' ? '' : '4K')} onInfoClick={() => setActiveInfo(appLang === 'pt' ? 'Resolução ultra-alta.' : 'Ultra-high resolution.')} />
                <OptionCard label="High Dynamic Range" icon="✨" selected={quality === 'HDR'} onClick={() => setQuality(quality === 'HDR' ? '' : 'HDR')} onInfoClick={() => setActiveInfo(appLang === 'pt' ? 'Melhor contraste e cores mais realistas.' : 'Better contrast and more realistic colors.')} />
                <OptionCard label={appLang === 'pt' ? 'Ultra Detalhado' : 'Ultra Detailed'} icon="🔎" selected={quality === '8K'} onClick={() => setQuality(quality === '8K' ? '' : '8K')} onInfoClick={() => setActiveInfo(appLang === 'pt' ? 'Máximo nível de pequenos detalhes visuais.' : 'Maximum level of visual fine details.')} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                {t.engineLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Simula a técnica de criação visual. Unreal é estilo game, Ray Tracing foca em reflexos reais.' : 'Simulates the visual creation technique. Unreal is game style, Ray Tracing focuses on real reflections.')} />
              </label>
              <select 
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                className="w-full bg-[#1a1a28] border border-[#222233] rounded-lg p-3 text-sm focus:border-[#f5a623] outline-none"
              >
                <option value="">{appLang === 'pt' ? 'Automático' : 'Auto'}</option>
                <option value="Unreal Engine 5, octane render">Unreal Engine 5</option>
                <option value="Ray tracing, global illumination">{appLang === 'pt' ? 'Traçado de Raios (Ray Tracing)' : 'Ray Tracing'}</option>
                <option value="V-Ray, production quality">{appLang === 'pt' ? 'Qualidade de Produção (V-Ray)' : 'V-Ray'}</option>
                <option value="CGI, masterwork">{appLang === 'pt' ? 'Obra Maestra em CGI' : 'CGI Masterwork'}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#a0a0b8] uppercase mb-2 flex items-center">
                {t.negativeLabel}
                <InfoCircle onClick={() => setActiveInfo(appLang === 'pt' ? 'Diz à IA o que ela deve tentar NÃO incluir no seu vídeo.' : 'Tells the AI what it should try NOT to include in your video.')} />
              </label>
              <textarea 
                value={negative}
                onChange={(e) => setNegative(e.target.value)}
                placeholder={t.negativePlaceholder}
                className="w-full bg-[#1a1a28] border border-[#222233] rounded-lg p-3 text-sm focus:border-[#f5a623] outline-none min-h-[60px]"
              />
            </div>
          </div>
        </Section>
        <Section title={t.references} icon={Film}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIRECTORS.map(d => (
              <OptionCard 
                key={d.id} 
                label={d.name} 
                icon={d.icon} 
                selected={director === d.id}
                onClick={() => setDirector(director === d.id ? '' : d.id)}
                onInfoClick={() => setActiveInfo(appLang === 'pt' ? d.infoPt : d.infoEn)}
              />
            ))}
          </div>
        </Section>

        <div className="mt-8">
          <button 
            onClick={generatePrompt}
            className="w-full py-4 bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-black font-black uppercase tracking-widest rounded-xl hover:shadow-[0_8px_30px_rgba(245,166,35,0.4)] hover:-translate-y-1 transition-all active:translate-y-0 flex items-center justify-center gap-2"
          >
            <Wand2 size={20} />
            {t.generate}
          </button>
        </div>

        {generatedPrompt && (
          <motion.div 
            ref={outputRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-[#12121a] border border-[#f5a6234d] rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a28] border-b border-[#222233]">
              <h3 className="text-[#f5a623] font-black text-sm tracking-wider uppercase flex items-center gap-2">
                <CheckCircle2 size={16} />
                {t.promptResult}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={handleCopy}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-[10px] font-black uppercase transition-all
                    ${copied ? 'bg-[#00b894] border-[#00b894] text-white' : 'bg-[#12121a] border-[#222233] text-[#a0a0b8] hover:border-[#f5a623] hover:text-[#f5a623]'}
                  `}
                >
                  <Copy size={12} />
                  {copied ? t.copied : t.copy}
                </button>
                <button 
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg border border-[#222233] bg-[#12121a] text-[#a0a0b8] hover:border-[#d63031] hover:text-[#d63031] flex items-center gap-1.5 text-[10px] font-black uppercase transition-all"
                >
                  <RefreshCcw size={12} />
                  {t.reset}
                </button>
              </div>
            </div>
            <div className="p-6">
              <pre className="text-sm font-mono text-[#e8e8f0] whitespace-pre-wrap break-words leading-relaxed bg-[#0a0a0f] p-4 rounded-xl border border-[#222233]">
                {generatedPrompt}
              </pre>
            </div>
            <div className="px-6 py-3 bg-[#1a1a28] border-t border-[#222233] flex items-center justify-between text-[10px] font-bold text-[#6a6a80] uppercase tracking-widest">
              <span>{t.promptMeta}</span>
              <span className={`px-2 py-0.5 rounded ${promptLang === 'pt' ? 'bg-[#00b89426] text-[#00b894]' : 'bg-[#0984e326] text-[#0984e3]'}`}>
                {promptLang === 'pt' ? 'PT-BR' : 'EN-US'}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-[#12121a] border-t border-[#222233] p-4 z-50 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="text-[10px] font-black text-[#6a6a80] uppercase tracking-widest">{t.promptLangLabel}</div>
        <div className="flex bg-[#1a1a28] rounded-full p-1 border border-[#222233]">
          <button 
            onClick={() => setPromptLang('pt')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black transition-all ${promptLang === 'pt' ? 'bg-[#f5a6231a] border-[#f5a623] text-[#f5a623] border' : 'text-[#a0a0b8]'}`}
          >
            <span>{FLAG_BR_EMOJI}</span> {t.promptLangPt}
          </button>
          <button 
            onClick={() => setPromptLang('en')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black transition-all ${promptLang === 'en' ? 'bg-[#f5a6231a] border-[#f5a623] text-[#f5a623] border' : 'text-[#a0a0b8]'}`}
          >
            <span>{FLAG_US_EMOJI}</span> {t.promptLangEn}
          </button>
        </div>
      </footer>

      <AnimatePresence>
        {activeInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveInfo(null)}
            className="fixed inset-0 z-[10001] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a28] border border-[#f5a623] rounded-2xl p-6 max-w-sm shadow-2xl relative"
            >
              <button 
                onClick={() => setActiveInfo(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#f5a623] text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              >
                <X size={16} />
              </button>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f5a6231a] text-[#f5a623] flex items-center justify-center shrink-0">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h4 className="text-[#f5a623] font-black text-xs uppercase tracking-widest mb-2">O que é isso?</h4>
                  <p className="text-sm text-[#e8e8f0] leading-relaxed">
                    {activeInfo}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelp(false)}
            className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#12121a] border border-[#222233] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#222233]">
                <h2 className="text-[#f5a623] text-lg font-black tracking-wider uppercase flex items-center gap-2">
                  <HelpCircle size={20} />
                  {t.helpTitle}
                </h2>
                <button onClick={() => setShowHelp(false)} className="bg-[#1a1a28] p-2 rounded-lg text-[#6a6a80] hover:text-[#e8e8f0]">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {[1,2,3,4,5].map(step => (
                  <div key={step} className="flex gap-4 p-4 bg-[#1a1a28] rounded-xl border border-[#222233]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f5a623] to-[#ff6b35] text-black shrink-0 flex items-center justify-center font-black text-sm">
                      {step}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#e8e8f0] mb-1 uppercase tracking-tight">
                        {TRANSLATIONS[appLang][`step${step}Title` as any] || `Step ${step}`}
                      </h4>
                      <p className="text-xs text-[#a0a0b8] leading-relaxed">
                        {TRANSLATIONS[appLang][`step${step}Text` as any] || `Instruction for step ${step}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FilmingIcon = ({ size }: any) => <Camera size={size} />;
