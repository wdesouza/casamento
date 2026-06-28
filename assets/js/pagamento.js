/**
 * Lógica da página de pagamento PIX.
 * Depende de: config.js (PIX_CONFIG), pix.js (gerarPixCopiaECola), qrcode.min.js (QRCode)
 */
(function () {
  // Lê parâmetros da URL
  const params = new URLSearchParams(window.location.search);
  const titulo = params.get("titulo");
  const valorStr = params.get("valor");
  const valorInicial = valorStr ? parseFloat(valorStr) : null;
  const editavel = params.get("editavel") === "1";

  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const txid = titulo
    ? titulo.replace(/[^a-zA-Z0-9]/g, "").substring(0, 25)
    : "casamento";

  // Elementos
  const infoEl = document.getElementById("payment-info");
  const qrContainer = document.getElementById("qrcode");
  const pixField = document.getElementById("pix-string");
  const copyBtn = document.getElementById("copy-btn");
  const copyFeedback = document.getElementById("copy-feedback");

  // Preenche info do presente
  if (infoEl) {
    if (titulo && valorInicial != null) {
      const precoHtml = editavel
        ? `
          <label class="payment-valor-label" for="valor-input">Escolha o valor do presente (R$)</label>
          <input
            type="number"
            id="valor-input"
            class="payment-valor-input"
            min="1"
            step="1"
            value="${valorInicial.toFixed(2)}"
            inputmode="decimal"
          />
        `
        : `<p class="payment-gift-price">${brl.format(valorInicial)}</p>`;

      infoEl.innerHTML = `
        <p>Você está presenteando o casal com:</p>
        <h2 class="payment-gift-title">${titulo}</h2>
        ${precoHtml}
      `;
    } else {
      infoEl.innerHTML = `
        <p class="payment-no-gift">
          Acesse esta página a partir da lista de
          <a href="presentes.html">Presentes</a> para selecionar um item.
        </p>
      `;
    }
  }

  // Cria a instância do QR Code (atualizada via makeCode)
  let qrcode = null;
  if (qrContainer && typeof QRCode !== "undefined") {
    qrcode = new QRCode(qrContainer, {
      text: " ",
      width: 220,
      height: 220,
      colorDark: "#2b2b2b",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
  }

  let payload = null;

  // Gera o payload PIX para um dado valor e atualiza QR + campo copia e cola
  function atualizar(valor) {
    if (valor == null || isNaN(valor) || valor <= 0) {
      payload = null;
      if (pixField) pixField.value = "";
      if (qrcode) qrcode.clear();
      return;
    }

    try {
      payload = gerarPixCopiaECola({
        chave: PIX_CONFIG.chave,
        nome: PIX_CONFIG.nomeRecebedor,
        cidade: PIX_CONFIG.cidade,
        valor: valor,
        txid: txid,
      });
    } catch (e) {
      console.error("Erro ao gerar PIX:", e);
      payload = null;
    }

    if (qrcode) {
      if (payload) {
        qrcode.makeCode(payload);
      } else {
        qrcode.clear();
      }
    }
    if (pixField) pixField.value = payload || "";
  }

  // Render inicial
  atualizar(valorInicial);

  // Campo de valor editável
  if (editavel) {
    const valorInput = document.getElementById("valor-input");
    if (valorInput) {
      valorInput.addEventListener("input", function () {
        const v = parseFloat(valorInput.value.replace(",", "."));
        atualizar(isNaN(v) ? null : v);
      });
    }
  }

  // Botão Copiar
  if (copyBtn && pixField) {
    copyBtn.addEventListener("click", function () {
      if (!payload) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(payload).then(showCopied).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }

  function showCopied() {
    if (copyFeedback) {
      copyFeedback.textContent = "Copiado!";
      copyFeedback.classList.add("visible");
      setTimeout(function () {
        copyFeedback.classList.remove("visible");
        copyFeedback.textContent = "";
      }, 2500);
    }
  }

  function fallbackCopy() {
    pixField.select();
    pixField.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy");
      showCopied();
    } catch (e) {
      console.error("Falha ao copiar:", e);
    }
  }
})();
