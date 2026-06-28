/**
 * Lista de presentes do casamento.
 * Edite este arquivo para adicionar, remover ou modificar presentes.
 *
 * Cada presente tem:
 *   id       – identificador único (número)
 *   titulo   – nome do presente
 *   descricao – texto descritivo (pode ter mais de uma linha)
 *   valor    – valor em reais (número, ex: 150.00)
 *   imagem   – caminho da imagem relativo à raiz do site
 *   posicaoImagem – (opcional) foco do recorte, ex: "center 22%" / "center top"
 *   valorEditavel – (opcional) true para o convidado escolher o valor na página de pagamento
 */
const GIFTS = [
  {
    id: 1,
    titulo: "Café Baggio",
    descricao: "Café Baggio para manter o vício dos noivos.",
    valor: 50.00,
    imagem: "assets/images/presentes/cafe.png",
  },
  {
    id: 2,
    titulo: "Corte de cabelo do noivo",
    descricao: "1 ano de corte de cabelo para o noivo.",
    valor: 100.00,
    imagem: "assets/images/presentes/corte.png",
  },
  {
    id: 3,
    titulo: "Boardgame",
    descricao: "Boardgame para o casal se divertir.",
    valor: 150.00,
    imagem: "assets/images/presentes/jogos.png",
  },
  {
    id: 4,
    titulo: "Taxa do Buquê",
    descricao: "Taxa para a noiva não jogar o buquê para a sua namorada.",
    valor: 300.00,
    imagem: "assets/images/presentes/buque.png",
  },
  {
    id: 5,
    titulo: "Taxa do Buquê (reversa)",
    descricao: "Taxa para a noiva jogar o buquê para a sua namorada.",
    valor: 350.00,
    imagem: "assets/images/presentes/jogar-buque.png",
  },
  {
    id: 6,
    titulo: "Ração para as filhotes",
    descricao: "Saco de ração para as filhotes.",
    valor: 500.00,
    imagem: "assets/images/presentes/cachorros.png",
  },
  {
    id: 7,
    titulo: "Alexa",
    descricao: "Alexa para a noiva ter mais alguém pra mandar.",
    valor: 1000.00,
    imagem: "assets/images/presentes/alexa.png",
  },
  {
    id: 8,
    titulo: "GRANDE OPORTUNIDADE!!",
    descricao: "Seja nosso parente favorito.",
    valor: 3000.00,
    imagem: "assets/images/presentes/parente.png",
  },
  {
    id: 9,
    titulo: "O quanto seu coração se sentir tocado",
    descricao: "Contribua com o valor que quiser. Você escolhe quanto presentear.",
    valor: 10.00,
    imagem: "assets/images/presentes/coracao.png",
    valorEditavel: true,
  },
];
