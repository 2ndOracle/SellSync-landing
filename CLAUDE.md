# SellSync Landing

Лендинг для SellSync — Google Workspace Add-on для аналитики WB и Ozon в Google Sheets.

## Контекст продукта

Бизнес-контекст, фичи, позиционирование, SEO-ключевики — в основном репо:

- `../SellSync/CLAUDE.md` — общие инструкции
- `../SellSync/SEO.md` — структура лендинга, конкуренты, ключевые слова
- `../SellSync/GTM.md` — план продвижения
- `../SellSync/ROADMAP.md` — план развития продукта

## Стек

- Статический HTML/CSS/JS
- GitHub Pages
- Домен: `sellsync.bobot.click`

## Структура

```
/                   → главная
/wb-google-sheets   → SEO-страница WB
/ozon-google-sheets → SEO-страница Ozon
/how-to             → инструкция по подключению
/privacy            → Privacy Policy
/terms              → Terms of Service
```

## Аналитика (Umami)

Self-hosted Umami обслуживает все микро-SaaS (живёт в Railway-проекте Propose). Подключён ко всем 6 страницам через `<script src="https://umami.bobot.click/script.js">` + `/analytics.js` (общий обработчик событий).

**События (Tier 1):**

- `cta_install` (props: `location` = `hero` / `final`, `page`) — клик на «Установить» / «Установить SellSync»
- `external_telegram` (props: `location` = `header` / `footer`, `page`) — клик на Telegram
- `faq_open` (props: `question`, `page`) — открытие `<details>` в FAQ
- `scroll_depth` (props: `depth` = `50` / `75` / `100`, `page`) — глубина прокрутки

**Реализация:** через `data-event="..."` + `data-event-*` атрибуты на элементах. Один обработчик в `analytics.js` навешивает клики, FAQ toggle и scroll depth. Для новой страницы достаточно добавить в `<head>` Umami snippet + `<script defer src="/analytics.js">`, на `<body>` поставить `data-page="..."`, на CTA/ссылках/`<details>` расставить `data-event-*`.

**Privacy section §11.2** упоминает Umami как обезличенную веб-аналитику без cookies — при добавлении новых типов событий (например, форм) обновлять и этот раздел.

**Будущий перенос Umami:** инстанс может переехать в свой Railway-проект; чтобы не править `<script src>` во всех HTML — хост указан как `umami.bobot.click`, переключение = смена CNAME.
