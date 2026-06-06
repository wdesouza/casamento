/**
 * Lógica da página de pagamento PIX.
 * Depende de: config.js (PIX_CONFIG), pix.js (gerarPixCopiaECola), qrcode.min.js (QRCode)
 */
(function () {
  // Lê parâmetros da URL
  const params = new URLSearchParams(window.location.search);
  const titulo = params.get("titulo");
  const valorStr = params.get("valor");
  const valor = valorStr ? parseFloat(valorStr) : null;

  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Preenche info do presente
  const infoEl = document.getElementById("payment-info");
  if (infoEl) {
    if (titulo && valor != null) {
      infoEl.innerHTML = `
        <p>Você está presenteando o casal com:</p>
        <h2 class="payment-gift-title">${titulo}</h2>
        <p class="payment-gift-price">${brl.format(valor)}</p>
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

  // Gera payload PIX
  let payload;
  try {
    payload = gerarPixCopiaECola({
      chave: PIX_CONFIG.chave,
      nome: PIX_CONFIG.nomeRecebedor,
      cidade: PIX_CONFIG.cidade,
      valor: valor,
      txid: titulo
        ? titulo.replace(/[^a-zA-Z0-9]/g, "").substring(0, 25)
        : "casamento",
    });
  } catch (e) {
    console.error("Erro ao gerar PIX:", e);
    payload = null;
  }

  // Renderiza QR Code
  const qrContainer = document.getElementById("qrcode");
  if (qrContainer && payload) {
    new QRCode(qrContainer, {
      text: payload,
      width: 220,
      height: 220,
      colorDark: "#2b2b2b",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
  }

  // Exibe campo "Copia e Cola"
  const pixField = document.getElementById("pix-string");
  if (pixField && payload) {
    pixField.value = payload;
  }

  // Botão Copiar
  const copyBtn = document.getElementById("copy-btn");
  const copyFeedback = document.getElementById("copy-feedback");

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
