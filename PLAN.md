# GetFlatbed — Plan Maestro de Producto
_Última actualización: 2026-03-28_

---

## 1. VISIÓN DEL PRODUCTO

**Qué es:** Servicio de alertas de vuelos en business class a precios excepcionales (error fares, canjes de millas, flash sales, upgrades).

**Para quién:** Viajeros hispanohablantes que vuelan business o quieren hacerlo — profesionales, empresarios, viajeros frecuentes.

**Diferenciador:** El único servicio de este tipo en español, enfocado en rutas desde España/Latinoamérica, con educación sobre millas y puntos integrada.

**Modelo de negocio:**
- Tier gratuito (lista de espera / deals con 48h delay)
- Premium €9/mes o €79/año (real-time, Telegram, playbooks)
- Monetización secundaria: afiliación de tarjetas de crédito y aerolíneas

---

## 2. ARQUITECTURA DE PÁGINAS

### Páginas públicas (sin login)
```
/                    → Landing principal
/deals               → Feed de deals activos (versión limitada)
/how-it-works        → Cómo funciona el servicio
/pricing             → Planes y precios
/guides              → Hub de guías y artículos
/guides/[slug]       → Artículo individual
/about               → Quiénes somos
/legal/privacy       → Política de privacidad
/legal/terms         → Términos de uso
```

### Páginas de auth
```
/login               → Iniciar sesión
/register            → Crear cuenta (con plan selection)
/forgot-password     → Recuperar contraseña
/verify-email        → Verificación de email
```

### Dashboard (login requerido)
```
/dashboard           → Home del usuario (mis deals, estado)
/dashboard/alerts    → Mis alertas configuradas
/dashboard/guides    → Guías premium desbloqueadas
/dashboard/settings  → Perfil, preferencias, notificaciones
/dashboard/billing   → Plan activo, facturas, cancelar
```

---

## 3. DISEÑO GLOBAL — SISTEMA DE DISEÑO

### Paleta de colores
| Token | Valor | Uso |
|---|---|---|
| bg-primary | #0a0a0f | Fondo global |
| bg-card | rgba(255,255,255,0.04) | Tarjetas |
| gold | #F5C842 | Acento principal, CTAs |
| gold-dark | #E8A800 | Hover estados |
| text-primary | #FFFFFF | Títulos |
| text-secondary | #9CA3AF | Texto secundario |
| text-muted | #4B5563 | Textos terciarios |
| green | #4ADE80 | Precios en oferta, ahorro |
| red | #F87171 | Badges "error fare" |
| blue | #60A5FA | Badges "miles deal" |

### Tipografía
- **Font:** Inter
- H1: 64px / font-black / tracking-tight
- H2: 48px / font-black
- H3: 24px / font-bold
- Body: 16px / font-normal / leading-relaxed
- Small: 12–14px

### Componentes globales
- **Navbar** — logo + links + CTA "Get early access"
- **Footer** — logo + links legales + sociales + newsletter mini
- **Deal Card** — componente reutilizable en /deals, landing, dashboard
- **Alert Badge** — tipo de deal (error fare / miles / flash sale / voucher)
- **CTA Button** — gold gradient, full-width en mobile
- **Input Email** — dark style, validación inline
- **Modal** — success, confirmation, login wall

---

## 4. PÁGINA POR PÁGINA — ESPECIFICACIÓN COMPLETA

---

### 4.1 LANDING PAGE `/`

**Objetivo:** Convertir visitante → suscriptor gratuito / trial premium

#### Secciones (en orden):

**[NAV]**
- Logo GetFlatbed (izquierda)
- Links: How it works · Deals · Pricing (centro, hidden en mobile)
- CTA: "Get early access" botón gold (derecha)
- Sticky, blur backdrop

**[HERO]**
- Badge animado: "🟡 200+ early members — limited spots"
- H1: "Stop paying full price for Business Class"
- Subheadline: "Get instant alerts for error fares, miles deals, and upgrades — curated for Spanish speakers"
- Ejemplo social proof: "Madrid → NYC Business. Listed: €3,200 · Found by members: €340"
- Form email + CTA "Get alerts free →"
- Microcopy: "Free forever · No credit card · Unsubscribe anytime"
- Emoji flotante animado: 🛋️
- Stats row: 87% avg savings · 3-5 deals/week · 24h alert window

**[LOGOS DE CONFIANZA]**
- "Deals encontrados en:" Iberia, Emirates, Turkish, Air Europa, Lufthansa
- Logos en gris, no invasivos

**[HOW IT WORKS — MINI]**
- 3 columnas: Error fares · Miles hacks · Upgrades
- Cada una: icono + título + 2 líneas de descripción
- Link "Learn more →" a /how-it-works

**[SAMPLE DEALS — 4 CARDS]**
- 4 deals reales o representativos
- Badge de tipo, ruta, precio tachado, precio real, % ahorro
- CTA al final: "See all deals →" (linked a /deals, con login wall)

**[TESTIMONIOS — 3]**
- 5 estrellas + quote + nombre + ciudad
- Foco en cifras concretas de ahorro

**[PRICING — MINI]**
- Solo 2 tiers: Explorer (gratis) vs Premium (€9/mes)
- Link a /pricing para más detalle
- CTA principal: "Start 7-day free trial"

**[CTA FINAL]**
- Headline: "Your next flight doesn't have to cost a fortune"
- Form email repetido
- Microcopy de confianza

**[FOOTER]**
- Logo + tagline
- Links: Deals · Guides · Pricing · About · Legal
- Redes: Instagram · Twitter/X · Telegram channel
- © 2026 GetFlatbed

---

### 4.2 DEALS PAGE `/deals`

**Objetivo:** Mostrar deals activos y actuales. Login wall para deals en tiempo real.

#### Layout:
- **Sidebar izquierda (desktop):** Filtros
  - Tipo: Error fare / Miles deal / Flash sale / Voucher
  - Origen: Todos / Madrid / Barcelona / Bogotá / CDMX / Buenos Aires / Miami
  - Destino: Todos / Europa / EEUU / Asia / Latam / Oriente Medio
  - Aerolínea: filtro multiselect
  - Ahorro mínimo: slider (50% / 70% / 80% / 90%+)

- **Contenido principal:**
  - Header: "Current Deals" + contador "24 active deals"
  - Badge: "🟡 Updated 3 minutes ago"
  - Grid de Deal Cards

- **Deal Card (detalle):**
  - Badge tipo (color por tipo)
  - Ruta: MAD → JFK (con flags)
  - Aerolínea + clase
  - Precio tachado vs precio deal
  - % ahorro (verde, bold)
  - Fechas disponibles
  - Tiempo restante estimado ("Lasted ~4h historically")
  - Estado: ✅ Verified / ⚡ Act fast / 🔒 Premium only
  - CTA: "Book now" (affiliate link) o "View details"

- **Login wall:**
  - Los primeros 4 deals visibles para todos
  - El resto: blur + "Unlock all deals — Join free"

---

### 4.3 HOW IT WORKS `/how-it-works`

**Objetivo:** Educar y generar confianza. Reducir fricción para sign-up.

#### Secciones:

**[HERO]**
- H1: "How we find deals nobody else does"
- Subheadline breve

**[3 FUENTES — DETALLE]**

Sección 1: Error Fares
- Qué es un error fare
- Por qué son legales (en la mayoría de casos)
- Cuánto duran (2-6h generalmente)
- Cómo actuamos cuando encontramos uno
- Ejemplo real con capturas

Sección 2: Miles & Points Hacks
- Las mejores alianzas: Oneworld, SkyTeam, Star Alliance
- Los programas secretos: Turkish M&S, Flying Blue, Avios
- Cómo acumular sin volar: tarjetas, partners
- Tabla de conversión: programa vs rutas vs valor

Sección 3: Upgrades & Vouchers
- Companion certificates
- Bid upgrades (Plusgrade)
- Last-minute counters
- Status match

**[PROCESO — TIMELINE]**
1. Monitorizamos 200+ fuentes 24/7
2. Verificamos manualmente cada deal
3. Enviamos alerta instantánea (Premium) o diaria (Free)
4. Tú reservas directamente en la aerolínea

**[FAQ — 8 preguntas]**
- ¿Son legales los error fares?
- ¿Qué pasa si la aerolínea cancela el billete?
- ¿Puedo confiar en los deals de millas?
- ¿Necesito una tarjeta de crédito específica?
- ¿Las alertas son personalizadas?
- ¿Cómo de rápido tengo que actuar?
- ¿Envías spam?
- ¿Puedo cancelar en cualquier momento?

**[CTA]**
- "Ready to fly business for less?" + form email

---

### 4.4 PRICING `/pricing`

**Objetivo:** Convertir free → premium. Eliminar objeciones de precio.

#### Secciones:

**[HEADER]**
- H1: "One deal pays for 10 years of membership"
- Toggle: Mensual / Anual (con badge "Save 26%")

**[TABLA COMPARATIVA — 2 tiers]**

| Feature | Explorer (Free) | Premium (€9/mes · €79/año) |
|---|---|---|
| Deals por semana | 2 (48h delay) | Todos en tiempo real |
| Email newsletter | Semanal | Diaria |
| Canal Telegram | ❌ | ✅ (alertas instantáneas) |
| Error fares | ❌ | ✅ |
| Guía de millas | Básica | Completa (50+ páginas) |
| Guía de upgrades | ❌ | ✅ |
| Alertas personalizadas | ❌ | ✅ (destino, precio max) |
| Soporte | ❌ | Prioritario |
| Garantía | — | 7 días devolución |

**[SOCIAL PROOF]**
- "Average member saves €1,400 on their first Premium booking"
- Testimonios breves x3

**[FAQ PRECIO]**
- ¿Puedo cancelar en cualquier momento?
- ¿Hay contrato o permanencia?
- ¿Qué métodos de pago aceptáis?
- ¿Hay descuento para empresas o grupos?

**[CTA FINAL]**
- Premium: "Start 7-day free trial" + microcopy
- Free: "Or start with the free plan"

---

### 4.5 GUIDES HUB `/guides`

**Objetivo:** SEO + educar usuarios + generar confianza = tráfico orgánico

#### Layout:
- Header: "The Business Class Playbook"
- Subheadline: "Everything you need to fly flatbed for less"
- Grid de artículos con categorías filtrables

#### Categorías:
- 🎯 Error Fares
- ✈️ Miles & Points
- 💳 Credit Cards
- 🔼 Upgrades
- 🗺️ Routes (rutas específicas con estrategias)
- 📚 Beginners

#### Artículos prioritarios (SEO):
1. "Qué es un error fare y cómo aprovecharlo"
2. "Los 5 mejores programas de millas para volar business desde España"
3. "Turkish Miles&Smiles: la guía completa"
4. "Cómo conseguir un upgrade a business en el aeropuerto"
5. "Las mejores tarjetas de crédito para acumular millas en España"
6. "Madrid - Nueva York en Business por menos de 400€: guía paso a paso"
7. "Companion certificates: qué son y cómo usarlos"
8. "Cómo usar Flying Blue para volar en business con Delta"

#### Deal Card en sidebar:
- "Deal activo ahora" — 1 deal destacado
- CTA para suscribirse

---

### 4.6 ARTÍCULO INDIVIDUAL `/guides/[slug]`

#### Layout:
- Header: título + categoría + fecha + tiempo de lectura
- Imagen de portada
- Tabla de contenidos (sticky en desktop)
- Contenido del artículo
- CTA incrustado a mitad: "¿No quieres perderte el próximo deal? →"
- Artículos relacionados (3)
- CTA final

---

### 4.7 REGISTRO `/register`

#### Flujo:
1. **Paso 1 — Email + contraseña**
   - O "Continuar con Google"
   - Microcopy: "Gratis para siempre. Sin tarjeta de crédito."

2. **Paso 2 — Personalización**
   - Aeropuertos de origen (multiselect)
   - Destinos soñados (multiselect o texto libre)
   - Tipos de deal preferidos (checkboxes)
   - "¿Conoces los programas de millas?" (nivel básico/intermedio/experto)

3. **Paso 3 — Plan**
   - Explorer (gratis) vs Premium (7-day trial)
   - Si elige Premium: Stripe checkout integrado
   - Si elige Free: va directo al dashboard

4. **Confirmación**
   - "¡Bienvenido al club!" + próximos pasos

---

### 4.8 DASHBOARD `/dashboard`

**Objetivo:** Retención. Que el usuario vea valor inmediato.

#### Layout:
- Sidebar izquierda: navegación
- Contenido principal: widgets

#### Widgets home:
- **"Deals activos ahora"** — 3 cards más recientes
- **"Tu próximo viaje"** — si ha configurado alerta
- **"Tu nivel de millas"** — quiz/tracker básico
- **"Guía recomendada"** — basada en su nivel declarado

#### Sidebar links:
- 🏠 Home
- ✈️ Deals activos
- 🔔 Mis alertas
- 📚 Guías premium
- ⚙️ Configuración
- 💳 Mi plan

---

### 4.9 MIS ALERTAS `/dashboard/alerts`

- Lista de alertas configuradas
- Toggle on/off por alerta
- Form para nueva alerta:
  - Origen (aeropuerto)
  - Destino (aeropuerto o región)
  - Precio máximo
  - Fechas (flexibles o rango)
  - Tipo de deal
  - Canal de notificación: email / Telegram / ambos
- Historial de deals que activaron esta alerta

---

### 4.10 CONFIGURACIÓN `/dashboard/settings`

- **Perfil:** Nombre, email, foto
- **Preferencias:** Idioma, aeropuertos, destinos favoritos
- **Notificaciones:** Email (frecuencia), Telegram (conectar bot), push browser
- **Privacidad:** Borrar cuenta, exportar datos

---

### 4.11 BILLING `/dashboard/billing`

- Plan actual + próxima renovación
- Botón "Upgrade to Premium" (si free)
- Historial de facturas (descargables)
- Botón "Cancel subscription" (con retención: oferta 1 mes gratis)
- Gestión de método de pago (Stripe portal)

---

## 5. COMPONENTES TRANSVERSALES

### Deal Card (reutilizable)
```
[Badge tipo] [Timestamp]
[Origen] → [Destino]   [Aerolínea]
[Precio tachado] [Precio deal] [% off]
[Fechas] [Duracion histórica] [Estado]
[CTA: Book now / View / Locked]
```

### Login Wall
- Aparece sobre deals bloqueados
- Fondo blur + modal centrado
- "Unlock X more deals — Join free" + form email
- "Already a member? Log in"

### Telegram CTA (para premium)
- Card especial en dashboard y pricing
- "Connect your Telegram" con instrucciones paso a paso
- QR code o link directo al bot

### Email Templates
1. Welcome (free)
2. Welcome (premium)
3. Deal alert diaria (free — 2 deals)
4. Deal alert instantánea (premium)
5. Error fare urgente (premium — máxima prioridad)
6. Weekly digest (free)
7. Upgrade reminder (free usuarios después de 2 semanas)
8. Cancellation + retención

---

## 6. STACK TÉCNICO

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Estilos | Tailwind CSS |
| Auth | Supabase Auth |
| Base de datos | Supabase (PostgreSQL) |
| Pagos | Stripe (Checkout + Portal) |
| Email | Resend (transaccional) + newsletter |
| Notificaciones | Telegram Bot API |
| Hosting | Vercel |
| Dominio | getflatbed.com |
| Analytics | Plausible (privacidad) o Vercel Analytics |
| CMS para guides | MDX local o Notion API |

---

## 7. BASE DE DATOS — ESQUEMA BÁSICO

```sql
users
  id, email, name, plan (free/premium), created_at, stripe_customer_id

deals
  id, type (error/miles/flash/voucher), origin, destination,
  airline, price_original, price_deal, savings_pct,
  dates_available, status (active/expired), verified_at,
  expires_at, affiliate_url, is_premium_only

alerts (user alerts config)
  id, user_id, origin, destination, max_price, date_from,
  date_to, deal_types[], channels (email/telegram/both), active

notifications
  id, user_id, deal_id, channel, sent_at, opened

guides
  id, slug, title, category, content, published_at, is_premium

subscriptions
  id, user_id, stripe_subscription_id, plan, status,
  current_period_end, canceled_at
```

---

## 8. FASES DE CONSTRUCCIÓN

### Fase 1 — MVP (2-3 semanas)
- [ ] Landing page completa (ya hecha en HTML estático)
- [ ] /how-it-works
- [ ] /pricing
- [ ] Form de email → Resend → lista de espera
- [ ] Despliegue en Vercel con dominio getflatbed.com

### Fase 2 — Auth + Deals (3-4 semanas)
- [ ] Next.js app con Supabase Auth
- [ ] /register y /login
- [ ] /deals con filtros y login wall
- [ ] Dashboard básico
- [ ] Stripe checkout (free + premium)
- [ ] Email automático de bienvenida

### Fase 3 — Alertas + Telegram (2-3 semanas)
- [ ] Sistema de alertas configurables
- [ ] Telegram bot para notificaciones premium
- [ ] Cron de búsqueda de deals (manual + semi-automático)
- [ ] Email digest automático

### Fase 4 — Contenido + SEO (ongoing)
- [ ] 8 artículos iniciales en /guides
- [ ] SEO on-page completo
- [ ] Blog system con MDX
- [ ] Links de afiliación

### Fase 5 — Automatización (mes 3+)
- [ ] Scrapers de error fares (Google Flights, Kayak alerts)
- [ ] Monitor de disponibilidad de millas (ITA Matrix)
- [ ] Dashboard de analytics para admin

---

## 9. COPY MAESTRO — FRASES CLAVE

**Tagline principal:**
> "Fly Business Class for Less Than You Think"

**Tagline alternativo:**
> "The Business Class You Deserve — Without the Price Tag"

**Value prop en una frase:**
> "We find the deals. You book the flight. That's it."

**Para el tier premium:**
> "One deal pays for 10 years of membership"

**Urgencia:**
> "Error fares disappear in hours. We alert you in minutes."

**Credibilidad:**
> "Verified by humans. Never automated noise."

---

## 10. MÉTRICAS DE ÉXITO

| Métrica | Objetivo mes 1 | Objetivo mes 3 |
|---|---|---|
| Emails capturados | 500 | 2,000 |
| Tasa conversión free→premium | — | 8-12% |
| MRR | €0 | €800 |
| Deals publicados | 20/mes | 60/mes |
| Open rate email | — | >40% |
| Artículos publicados | 0 | 8 |

---

_Documento vivo — actualizar conforme avanza el proyecto._
