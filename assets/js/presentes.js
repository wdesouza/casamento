/**
 * Renderiza os cards de presentes na página presentes.html.
 * Depende de: gifts.js (array GIFTS)
 */
(function () {
  const grid = document.getElementById("gifts-grid");

  if (!grid) return;

  if (!GIFTS || GIFTS.length === 0) {
    grid.innerHTML = "<p class='empty-state'>Nenhum presente cadastrado ainda.</p>";
    return;
  }

  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  GIFTS.forEach(function (gift) {
    const card = document.createElement("article");
    card.className = "gift-card";

    const params = new URLSearchParams({
      gift: gift.id,
      titulo: gift.titulo,
      valor: gift.valor.toFixed(2),
    });
    const url = "pagamento.html?" + params.toString();

    card.innerHTML = `
      <div class="gift-img-wrap">
        <img
          src="${gift.imagem}"
          alt="${gift.titulo}"
          loading="lazy"
          onerror="this.src='assets/img/placeholder.svg'"
        />
      </div>
      <div class="gift-body">
        <h3 class="gift-title">${gift.titulo}</h3>
        <p class="gift-desc">${gift.descricao}</p>
        <p class="gift-price">${brl.format(gift.valor)}</p>
        <a href="${url}" class="btn btn-primary">Comprar</a>
      </div>
    `;

    grid.appendChild(card);
  });
})();
