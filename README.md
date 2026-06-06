# Site de Casamento — Ana Carolina & Welliton

Site estático para hospedagem no GitHub Pages.

## Como editar os presentes

Abra o arquivo **`assets/js/gifts.js`** e edite o array `GIFTS`. Cada presente é um objeto:

```js
{
  id: 1,                                   // identificador único (não repita)
  titulo: "Nome do presente",              // título exibido no card
  descricao: "Descrição do presente...",   // texto descritivo
  valor: 150.00,                           // valor em reais
  imagem: "assets/img/nome-da-imagem.jpg", // caminho da imagem
}
```

Salve suas imagens na pasta `assets/img/`.

---

## Como configurar o PIX

Abra o arquivo **`config.js`** e preencha:

```js
const PIX_CONFIG = {
  chave: "sua-chave-pix-real",            // CPF, e-mail, telefone ou chave aleatória
  nomeRecebedor: "Ana Carolina Welliton", // máx. 25 caracteres, sem acentos
  cidade: "LOUVEIRA",                     // máx. 15 caracteres, maiúsculas, sem acentos
};
```

> **Dica:** após alterar a chave, abra `pagamento.html` localmente, escaneie o QR Code
> com o aplicativo do seu banco e confirme que os dados aparecem corretamente antes de publicar.

---

## Como testar localmente

```bash
cd casamento
python3 -m http.server 8000
# Abra http://localhost:8000 no navegador
```

---

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub (pode ser público ou privado com Pages habilitado).
2. Faça o commit e push de todos os arquivos:
   ```bash
   git init
   git add .
   git commit -m "Site de casamento"
   git remote add origin https://github.com/SEU-USUARIO/casamento.git
   git push -u origin main
   ```
3. No repositório, vá em **Settings → Pages**.
4. Em *Source*, selecione **Deploy from a branch** → **main** → **/ (root)**.
5. Aguarde alguns minutos e acesse `https://SEU-USUARIO.github.io/casamento/`.

---

## Estrutura de arquivos

```
casamento/
├── index.html          ← Página inicial (nomes, data, local, contador)
├── presentes.html      ← Lista de presentes em cards
├── pagamento.html      ← QR Code PIX + chave para copiar
├── config.js           ← ⚙️  Configuração PIX (edite aqui)
├── assets/
│   ├── css/style.css   ← Estilo do site
│   ├── js/
│   │   ├── gifts.js        ← 🎁 Lista de presentes (edite aqui)
│   │   ├── presentes.js    ← Renderiza os cards
│   │   ├── pagamento.js    ← Lógica de pagamento
│   │   ├── pix.js          ← Geração do BR Code PIX (CRC16)
│   │   └── qrcode.min.js   ← Biblioteca de QR Code
│   └── img/
│       └── placeholder.svg ← Imagem padrão (substitua pelas fotos reais)
└── .nojekyll           ← Evita processamento Jekyll no GitHub Pages
```
