/**
 * Geração de payload PIX (BR Code / EMV) com CRC16-CCITT.
 * Especificação: Banco Central do Brasil — Manual de Padrões para Iniciação do PIX.
 */

/**
 * Formata um campo EMV: ID (2 dígitos) + tamanho (2 dígitos) + valor.
 */
function emvField(id, value) {
  const len = String(value.length).padStart(2, "0");
  return `${id}${len}${value}`;
}

/**
 * Calcula CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF).
 * @param {string} str - string de entrada
 * @returns {string} CRC em hexadecimal maiúsculo, 4 caracteres
 */
function crc16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Gera o payload "PIX Copia e Cola" (BR Code EMV).
 *
 * @param {object} opts
 * @param {string} opts.chave        - Chave PIX
 * @param {string} opts.nome         - Nome do recebedor (máx. 25 chars)
 * @param {string} opts.cidade       - Cidade do recebedor (máx. 15 chars)
 * @param {number} [opts.valor]      - Valor em reais; omitir para "qualquer valor"
 * @param {string} [opts.txid]       - ID da transação (máx. 25 chars, alfanum.); default "***"
 * @param {string} [opts.descricao]  - Descrição adicional (máx. 72 chars)
 * @returns {string} Payload EMV pronto para gerar QR Code
 */
function gerarPixCopiaECola({ chave, nome, cidade, valor, txid = "***", descricao = "" }) {
  // Normaliza chave de telefone: adiciona +55 se for só dígitos (DDD + número BR)
  const chaveFinal = /^\d{10,11}$/.test(chave.trim())
    ? "+55" + chave.trim()
    : chave.trim();

  // Remove acentos/diacríticos usando unicode escapes explícitos (U+0300–U+036F)
  const semAcento = (str) =>
    str.normalize("NFD").replace(/[̀-ͯ]/g, "");

  const nomeLimpo   = semAcento(nome).substring(0, 25).trim();
  const cidadeLimpa = semAcento(cidade).toUpperCase().substring(0, 15).trim();
  const txidLimpo   = txid.replace(/[^a-zA-Z0-9]/g, "").substring(0, 25) || "***";

  // Campo 26 — Merchant Account Information (PIX)
  const gui = emvField("00", "br.gov.bcb.pix");
  const chaveField = emvField("01", chaveFinal);
  const descField = descricao
    ? emvField("02", descricao.substring(0, 72))
    : "";
  const merchantInfo = emvField("26", gui + chaveField + descField);

  // Campo 62 — Additional Data Field (txid)
  const additionalData = emvField("62", emvField("05", txidLimpo));

  // Monta payload sem CRC
  let payload =
    emvField("00", "01") +          // Payload Format Indicator
    merchantInfo +                   // Merchant Account Information
    emvField("52", "0000") +         // Merchant Category Code
    emvField("53", "986") +          // Transaction Currency (BRL = 986)
    (valor != null
      ? emvField("54", valor.toFixed(2))  // Transaction Amount
      : "") +
    emvField("58", "BR") +           // Country Code
    emvField("59", nomeLimpo) +      // Merchant Name
    emvField("60", cidadeLimpa) +    // Merchant City
    additionalData +                 // Additional Data Field
    "6304";                          // CRC placeholder (sem valor ainda)

  // Calcula e anexa CRC
  return payload + crc16(payload);
}
