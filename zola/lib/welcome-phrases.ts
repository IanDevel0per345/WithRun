import type { Mode } from "@/lib/modes"

/**
 * Welcome phrases shown on the empty chat screen.
 * `{nome}` is replaced by the user's first name (or removed for guests).
 */

export type DayPeriod = "morning" | "afternoon" | "night" | "dawn"

/** 1–30: saudações naturais e amigáveis */
const FRIENDLY = [
  "Olá, {nome}! Tudo tranquilo por aí?",
  "E aí, {nome}, como estamos hoje?",
  "Opa, {nome}! Que bom te ver.",
  "Olá de novo, {nome}! Tudo certo?",
  "Ei, {nome}! O que vamos fazer hoje?",
  "Como vão as coisas, {nome}?",
  "Olha quem apareceu! Oi, {nome}.",
  "Tudo na paz por aí, {nome}?",
  "Oi, {nome}! Alguma novidade?",
  "Que bom ter você por aqui, {nome}.",
  "E aí, {nome}? Me conta.",
  "Olá, {nome}. Por onde começamos?",
  "Ei, {nome}, tudo em ordem?",
  "Pronto para mais uma, {nome}?",
  "Oi, {nome}! Qual é a boa?",
  "Tudo certo desse lado, {nome}?",
  "Olá, {nome}! Que bom que voltou.",
  "E aí, {nome}? No que está pensando?",
  "Opa! Como está seu dia, {nome}?",
  "Chegou na hora certa, {nome}.",
  "Ei, {nome}! Vamos conversar?",
  "Olá! Como posso facilitar seu dia, {nome}?",
  "Tudo bem com você, {nome}?",
  "Que bom te encontrar aqui, {nome}.",
  "E aí, {nome}? Bora começar?",
  "Olá, {nome}! Tem algo em mente?",
  "Ei! Como anda a vida, {nome}?",
  "Opa, {nome}, por onde andava?",
  "Olá! O que trouxe você aqui hoje?",
  "E aí, {nome}? Tudo de boa?",
]

/** 31–50: manhã */
const MORNING = [
  "Bom dia, {nome}! Dormiu bem?",
  "Olá, {nome}! Vamos começar bem o dia?",
  "Bom dia! Qual é o plano de hoje?",
  "Acordou inspirado, {nome}?",
  "Mais um dia, novas possibilidades.",
  "Bom dia, {nome}! Café já saiu?",
  "Ei, {nome}! Pronto para começar?",
  "O dia está só começando, {nome}.",
  "Bom dia! O que vamos criar hoje?",
  "Olá, {nome}! Como começou sua manhã?",
  "Bom dia! Uma ideia nova hoje?",
  "Ei, {nome}, que tal algo interessante?",
  "Bom dia, {nome}! Vamos fazer acontecer?",
  "Oi! Algum plano especial para hoje?",
  "Manhã nova, ideias novas, {nome}.",
  "Bom dia! O que está na sua cabeça?",
  "O mundo acordou. E suas ideias?",
  "Olá, {nome}! Vamos aproveitar a manhã?",
  "Bom dia! Por onde começamos?",
  "Ei, {nome}! Que sua manhã seja leve.",
]

/** 51–70: tarde */
const AFTERNOON = [
  "Boa tarde, {nome}! Como vai o dia?",
  "E aí, {nome}? Tudo certo nesta tarde?",
  "Boa tarde! Ainda temos muito pela frente.",
  "Olá, {nome}! Como está indo?",
  "Boa tarde! Que tal uma ideia diferente?",
  "Ei, {nome}! A tarde está tranquila?",
  "Opa! Hora de colocar as ideias em prática?",
  "Boa tarde, {nome}! O que temos para hoje?",
  "Olá! Como anda sua produtividade?",
  "E aí, {nome}? Vamos tirar algo do papel?",
  "Boa tarde! Alguma coisa para resolver?",
  "Ei, {nome}, como foi a manhã?",
  "O dia continua, e as ideias também.",
  "Boa tarde! Vamos criar alguma coisa?",
  "Olá, {nome}! Precisa de uma mão?",
  "E aí! Sua tarde está rendendo?",
  "Boa tarde, {nome}! Qual é o próximo passo?",
  "Opa, {nome}! Hora de uma boa conversa?",
  "Boa tarde! O que você anda imaginando?",
  "Ei, {nome}! Vamos aproveitar o resto do dia?",
]

/** 71–85: noite */
const NIGHT = [
  "Boa noite, {nome}! Tudo tranquilo?",
  "E aí, {nome}? Noite de ideias?",
  "Boa noite! Como foi seu dia?",
  "Olá, {nome}. Ainda acordado?",
  "Boa noite! O que vamos descobrir?",
  "Ei, {nome}! O dia foi longo?",
  "Noite calma, mente cheia de ideias?",
  "Boa noite, {nome}! Vamos conversar?",
  "Opa! Algum projeto para esta noite?",
  "Boa noite! Que tal criar algo novo?",
  "Olá, {nome}! A criatividade não dorme?",
  "E aí, {nome}? Pensando em alguma coisa?",
  "Boa noite! Hora de organizar as ideias?",
  "Ei, {nome}! Como está a noite?",
  "O dia terminou, mas as ideias continuam.",
]

/** 86–95: madrugada */
const DAWN = [
  "Boa madrugada, {nome}! Ainda por aqui?",
  "Ei, {nome}! Virando a noite?",
  "Boa madrugada! Alguma ideia tirando seu sono?",
  "Olá, {nome}. A mente não desligou?",
  "Madrugada criativa por aí, {nome}?",
  "O mundo está quieto. Sua mente também?",
  "E aí, {nome}? O que te mantém acordado?",
  "Boa madrugada! Vamos resolver alguma coisa?",
  "Ei, {nome}! Uma conversa antes de dormir?",
  "Até tarde por aqui, hein, {nome}?",
]

/** 96–120: criativas e inteligentes */
const CREATIVE = [
  "Qual ideia está esperando para nascer, {nome}?",
  "E se a gente pensasse diferente hoje?",
  "Algo interessante passando pela sua cabeça?",
  "Grandes ideias começam com perguntas simples.",
  "O que você gostaria de inventar hoje?",
  "Tem alguma ideia maluca, {nome}?",
  "Vamos transformar curiosidade em descoberta?",
  "O que ainda não tentamos, {nome}?",
  "Um pensamento pode mudar tudo.",
  "Que tal explorar uma nova possibilidade?",
  "Qual pergunta merece uma boa resposta hoje?",
  "Sua próxima grande ideia pode começar aqui.",
  "O que vamos imaginar juntos, {nome}?",
  "Às vezes, basta fazer a pergunta certa.",
  "Pronto para olhar por outro ângulo?",
  "Tem alguma coisa que sempre quis entender?",
  "Vamos dar forma a uma ideia?",
  "O que você criaria sem limitações?",
  "Sua curiosidade trouxe você até aqui?",
  "E se tentássemos algo completamente novo?",
  "O que merece ser explorado hoje?",
  "Uma ideia pequena pode ir muito longe.",
  "Vamos descobrir algo surpreendente?",
  "Qual é a sua próxima grande pergunta?",
  "Ei, {nome}! Me surpreenda com uma ideia.",
]

/** 121–140: suaves, elegantes e minimalistas */
const MINIMAL = [
  "Olá, {nome}. Estou por aqui.",
  "Por onde começamos?",
  "O que está em sua mente?",
  "Vamos pensar juntos?",
  "Algo novo hoje, {nome}?",
  "O que você gostaria de explorar?",
  "Olá novamente.",
  "Tudo começa com uma ideia.",
  "O que vamos construir?",
  "Uma pergunta de cada vez.",
  "Qual é o plano, {nome}?",
  "Tem algo que queira compartilhar?",
  "Vamos encontrar um caminho?",
  "Oi, {nome}. Pode falar.",
  "O que gostaria de fazer agora?",
  "Um espaço para suas ideias.",
  "Vamos dar o próximo passo?",
  "Estou aqui para conversar.",
  "Qual é a novidade de hoje?",
  "Seu próximo pensamento começa aqui.",
]

/** 141–150: descontraídas e com personalidade */
const PLAYFUL = [
  "Ei, {nome}! Sentiu minha falta?",
  "Opa, olha quem voltou!",
  "E aí, {nome}? Muitas abas abertas na cabeça?",
  "Hoje vai ser produtivo ou criativo?",
  "Qual problema vamos descomplicar hoje?",
  "E aí, {nome}? Inventando moda de novo?",
  "Uma ideia genial ou só uma perguntinha?",
  "Olha só, {nome}! Mais uma aventura?",
  "Bora fazer algo que valha a pena?",
  "Ei, {nome}! Conta o que está acontecendo.",
]

/** Frases do Modo code */
export const CODE_PHRASES: string[] = [
  "Qual código vamos escrever hoje, {nome}?",
  "Pronto para codar, {nome}?",
  "Bug rebelde? Me mostra o erro.",
  "Cole seu código e eu dou uma olhada.",
  "O que vamos construir hoje?",
  "Uma função, uma API ou um app inteiro?",
  "Compilou de primeira? Duvido. Me conta.",
  "Vamos transformar essa ideia em código?",
  "Qual linguagem vamos usar hoje, {nome}?",
  "Me diga o problema, eu cuido do código.",
  "Refatorar, testar ou criar do zero?",
  "Console cheio de erros? Vamos resolver.",
  "Seu próximo commit começa aqui.",
  "Descreva o que você quer e eu escrevo o código.",
  "Vamos depurar juntos, {nome}?",
  "Código limpo, ideia clara. Por onde começamos?",
  "Tem algum erro estranho para me mostrar?",
  "Hora de codar. O que você precisa, {nome}?",
  "Do rascunho ao deploy: vamos nessa?",
  "Qual desafio de código vamos vencer hoje?",
]

/** Frases válidas em qualquer horário (1–30 e 96–150). */
export const GENERAL_PHRASES: string[] = [
  ...FRIENDLY,
  ...CREATIVE,
  ...MINIMAL,
  ...PLAYFUL,
]

export const PERIOD_PHRASES: Record<DayPeriod, string[]> = {
  morning: MORNING,
  afternoon: AFTERNOON,
  night: NIGHT,
  dawn: DAWN,
}

export const ALL_PHRASES: string[] = [
  ...FRIENDLY,
  ...MORNING,
  ...AFTERNOON,
  ...NIGHT,
  ...DAWN,
  ...CREATIVE,
  ...MINIMAL,
  ...PLAYFUL,
]

export function getDayPeriod(date: Date = new Date()): DayPeriod {
  const h = date.getHours()
  if (h < 5) return "dawn"
  if (h < 12) return "morning"
  if (h < 18) return "afternoon"
  return "night"
}

/**
 * Picks a phrase template. Half of the time it uses a phrase made for the
 * current period of the day, otherwise one of the general phrases.
 */
export function pickWelcomeTemplate(
  mode: Mode = "chat",
  date: Date = new Date()
): string {
  if (mode === "code") {
    return CODE_PHRASES[Math.floor(Math.random() * CODE_PHRASES.length)]
  }
  const period = PERIOD_PHRASES[getDayPeriod(date)]
  const pool = Math.random() < 0.5 ? period : GENERAL_PHRASES
  return pool[Math.floor(Math.random() * pool.length)]
}

/** Replaces `{nome}`; without a name, drops it together with its comma. */
export function fillWelcomeTemplate(template: string, name?: string): string {
  if (name) return template.replace(/\{nome\}/g, name)
  return template.replace(/,?\s*\{nome\}/g, "")
}
