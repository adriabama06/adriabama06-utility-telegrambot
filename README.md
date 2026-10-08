# adriabama06-utility-telegrambot
Yeah, a utility bot via telegram <3

## Requisitos

- Node.js >= 20
- pnpm
- Token de bot creado con [@BotFather](https://t.me/BotFather) (`/newbot`)
- Docker + Docker Compose (solo para despliegue)

## Desarrollo (nodejs + pnpm)

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar token (solo la primera vez)
Copy-Item .env.example .env   # Windows PowerShell
# cp .env.example .env        # Linux/macOS
# Edita .env y pon tu TELEGRAM_TOKEN

# 3. Arrancar en dev (reinicio automático con --watch)
pnpm run dev

# Producción local sin docker
pnpm start
```

## Despliegue (docker + compose)

```bash
# Asegúrate de tener .env con el token real
docker compose up -d --build
docker compose logs -f
```

## Añadir comandos

Crea un archivo en `cmds/mi-comando.js`:

```js
/** @type {import('../types').BotCommand} */
module.exports = {
    name: 'mi-comando',
    description: 'What it does...',

    async run(bot, msg, args) {
        await bot.sendMessage(msg.chat.id, `Args: ${args.join(' ')}`);
    },
};
```

Se carga solo al arrancar. Incluye `helloworld`, `ping` y `help` de ejemplo.

## Eventos (todos los mensajes)

Sí, Telegram como Discord entrega al bot **todos** los mensajes, no solo comandos.
Cada archivo en `events/*.js` recibe cada mensaje:

```js
/** @type {import('../types').BotEvent} */
module.exports = {
    name: 'print',
    async run(bot, msg) {
        console.log(msg.text);
    },
};
```

> En grupos solo verás todos los mensajes si desactivas el privacy mode
> con [@BotFather](https://t.me/BotFather) (`/setprivacy` -> `Disable`).
> En chats privados siempre llega todo.

`events/print.js` ya imprime cada mensaje con fecha, usuario, chat y tipo de contenido.

## Transcripción de audio (STT)

`events/stt.js` transcribe las notas de voz y audios adjuntos con `whisper-1`
usando el paquete oficial `openai` y responde con el texto. Solo necesita estas variables en `.env`
(ver `.env.example`):

```bash
STT_OPENAI_HOST=https://tu-api-openai-compatible
STT_OPENAI_KEY=tu-clave
STT_OPENAI_MODEL=whisper-1
```

Sin audio adjunto o sin estas variables el evento se ignora.

## Tipos JSDoc

Los tipos centrales están en `types.js` (`TelegramBot`, `TelegramMessage`,
`BotCommand`, `BotEvent`, ...). VSCode da autocompletado gracias a
`jsconfig.json` (con `checkJs`). Para verificar:

```bash
pnpm run typecheck
```
