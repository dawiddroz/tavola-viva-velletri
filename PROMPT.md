# PROMPT DEFINITIVO: Tavola viva di Federico Bastianelli

> **Score:** 77.6/100 🟠 PRIORITÀ | **Categoria:** Ristorante (x1.4) | **Citta:** Velletri RM
> **Stack:** Astro 5 + GSAP + Lenis + Leaflet | **Data:** 29/07/2026
> **Dati disponibili:** lead-data.json, brief.json, design-suggestion.json, competition-analysis.json, outreach.json

---

## DATI DEL PROGETTO (caricare PRIMA di iniziare)

| File | Contenuto | Priorita |
|---|---|---|
| `lead-data.json` | Nome, indirizzo, telefono, rating, social, score | OBBLIGATORIO |
| `brief.json` | Brand profile, keywords, servizi, social links | OBBLIGATORIO |
| `design-suggestion.json` | Palette reale, typography, vibe, target | Importante |
| `competition-analysis.json` | Quanti competitor hanno il sito, posizionamento | Importante |
| `outreach.json` | Pitch di vendita, messaggi WhatsApp, call script | Consultare |

---

## EFFETTO WOW — PERCHE' QUESTO SITO VENDERA' DA SOLO

Ogni effetto e' stato scelto in base alla categoria e ai dati reali del business. La combinazione di questi effetti NON esiste su nessun altro sito di ristorante a Velletri.

- [ ] Mask Reveal: Il titolo hero esce da una maschera come alzando un telo. Effetto cinematografico.
- [ ] Image Reveal: Le foto dei piatti vengono 'scoperte' da un overlay che scivola via con lo scroll.
- [ ] Stagger Menu: Ogni voce del menu appare con effetto 'scritta col gesso', una dopo l'altra.
- [ ] Parallax Multi-Strato: Hero con 3 layer (sfondo, tavolo, testo) a velocita diverse.
- [ ] Pinning: Sezione 'Lo Chef' bloccata mentre scrolli la storia.
- [ ] Counter Animato: Recensioni, stelle e prezzi che salgono animati da 0.
- [ ] Glassmorphism: Card menu semi-trasparenti con backdrop-blur, effetto vetro.
- [ ] Social Embed: Video TikTok/IG embedded con animazione di caricamento.

**Vantaggio competitivo:** Il  dei Ristorante a Velletri non ha un sito. Questo sara il migliore.

---

## DESIGN SYSTEM

### Palette (da design-suggestion.json)

```css
:root {
  --color-primary: #C67B4B;
  --color-secondary: #2F3E2B;
  --color-accent: #C9A96E;
  --color-background: #FFFAF5;
  --color-text_dark: #2C2416;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --space-unit: 0.5rem;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

### Font
- **Display:** Playfair Display (Google Fonts) — per titoli H1-H3
- **Body:** Inter (Google Fonts) — per testi, paragrafi, label
- **Vibe:** warm, intimate, rustic-elegant, editorial
- **Stile:** Terracotta + Olive Green

### Spacing & Layout
- **8px grid system** — tutti i padding/margin sono multipli di 8px
- **Container max-width:** 1200px (desktop), fluid sotto
- **Breakpoint:** 375 / 768 / 1024 / 1440
- **Mobile-first:** scrivere CSS per mobile, poi `@media (min-width: 768px)` per espandere

---

## STRUTTURA PAGINA

```
1. NAVBAR (sticky, glassmorphism su scroll)
2. HERO (full-viewport, con WOW effect principale)
3. CHI SIAMO / LA STORIA
4. SERVIZI / MENU (con stagger animation)
5. GALLERIA (con lightbox o scroll orizzontale)
6. RECENSIONI (carousel o grid)
7. CTA CENTRALE (prenota / contattaci)
8. MAPPA (Leaflet interattiva)
9. CONTATTI + FORM
10. FOOTER (indirizzo, telefono, orari, social)
```

---

## ANIMAZIONI — CODICE PRONTO ALL'USO

### CDN Imports (in BaseLayout.astro)

```html
<!-- GSAP + ScrollTrigger -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>

<!-- Leaflet -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer></script>

<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
```

### Boilerplate `animations.js`

```javascript
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Smooth scroll vellutato
const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);

// Rispetta prefers-reduced-motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll Reveal (tutte le sezioni)
if (!prefersReduced) {
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      y: 40, opacity: 0, duration: 0.7, ease: 'power2.out'
    });
  });
}

// Navbar scroll
ScrollTrigger.create({
  start: 'top -100',
  onEnter: () => document.querySelector('.navbar').classList.add('scrolled'),
  onLeaveBack: () => document.querySelector('.navbar').classList.remove('scrolled')
});

// Progress bar
gsap.to('.progress-bar', {
  scaleX: 1, transformOrigin: 'left center', ease: 'none',
  scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.5 }
});

// Counter animati
document.querySelectorAll('[data-counter]').forEach(el => {
  const target = parseInt(el.dataset.counter);
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%' },
    textContent: 0, duration: 2, snap: { textContent: 1 },
    onUpdate: function() { this.targets()[0].textContent = Math.round(this.targets()[0].textContent); }
  });
});
```

---

## COMPONENTI OBBLIGATORI

### 1. WhatsApp Float Button

```html
<a href="https://wa.me/393464144878" class="whatsapp-float" aria-label="Chat su WhatsApp" target="_blank" rel="noopener">
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>
```

```css
.whatsapp-float {
  position: fixed; bottom: 24px; right: 24px; z-index: 999;
  width: 60px; height: 60px; background: #25D366;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 25px rgba(37,211,102,0.4); transition: transform 0.2s;
}
.whatsapp-float:hover { transform: scale(1.1); }
```

### 2. Leaflet Map

```javascript
const map = L.map('map').setView([41.68, 12.78], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
L.marker([41.68, 12.78]).addTo(map)
  .bindPopup('<b>Tavola viva di Federico Bastianelli</b><br>Via del Comune, 22, 00049 Velletri RM').openPopup();
```

---

## PRINCIPI DI QUALITA (non checklist, ma bussola)

Il sito e' pronto quando:

1. **Si vende da solo.** Il cliente lo apre e capisce in 3 secondi che e' il miglior investimento possibile. Non servono spiegazioni.

2. **Ha un'anima.** Palette, tipografia, spaziature e ritmo delle animazioni formano un TUTTO coerente. Non e' un collage di sezioni — e' un'esperienza unica.

3. **Funziona dove serve.** Mappa, WhatsApp, form contatti: tutto testato e funzionante. Nessun link rotto, nessun pulsante morto.

4. **E' veloce da sentire, non da misurare.** Non serve Lighthouse per capire se un sito e' lento. Se scrolli e scatta, se le immagini appaiono a scatti, e' rotto. Aggiustalo.

5. **Rispetta il business.** Ogni scelta di design (colore, font, animazione) e' motivata da CHI e' il cliente e COSA vuole comunicare. Niente effetti "perche' si", niente caroselli "perche' li fanno tutti".

## TECH STACK COMPLETO

| Tecnologia | Versione | Via | Ruolo |
|---|---|---|---|
| **Astro** | 5.x | npx create-astro | Framework, routing, build |
| **GSAP** | 3.12.5 | CDN | Animazioni scroll, parallax, stagger |
| **ScrollTrigger** | 3.12.5 | CDN (plugin GSAP) | Trigger animazioni su scroll |
| **Lenis** | 1.x | npm | Smooth scroll vellutato |
| **Leaflet** | 1.9.4 | CDN | Mappa OpenStreetMap interattiva |
| **Google Fonts** | — | CDN | Playfair Display + Inter |
| **CSS Custom Properties** | — | nativo | Design system (colori, spaziature) |
| **Flask** (opzionale) | 3.x | pip | Backend form contatti (solo se serve) |

### Setup Rapido

```bash
cd "C:\Users\dawid\OneDrive\Desktop\Business\Leads\tavola-viva-federico-bastianelli"
npm create astro@latest . -- --template minimal --skip-houston
npm install @studio-freight/lenis
npm run dev     # http://localhost:4321
npm run build   # /dist/ pronto per il deploy
```

---

## DATI REALI DEL BUSINESS

| **Nome** | Tavola viva di Federico Bastianelli |
| **Indirizzo** | Via del Comune, 22, 00049 Velletri RM |
| **Telefono** | 346 414 4878 |
| **Categoria** | Ristorante (x1.4) |
| **Rating** | 4.9/5 (27 recensioni) |
| **Prezzo** | 20-30€ |
| **Instagram** | instagram.com/ristorantetavolaviva_velletri (3700 follower) |
| **Facebook** | facebook.com/Tavola viva |
| **Piattaforme** | Deliveroo |

**Descrizione:** Ristorante intimo nel cuore di Velletri. Cucina tradizionale italiana reinterpretata con creatività. Ingredienti freschi e stagionali.
**Note:** IG 3.700 follower. Chef/owner @federico.bastianelli.9. Forte presenza social ma nessun sito.

---

## REGOLE DEL GIOCO

1. **Dati reali dove esistono.** Nome, indirizzo e telefono sono nei JSON. Se manca un dato, `[DA INSERIRE]`, non indovinare.
2. **Placeholder = `[DA INSERIRE]`**. Se un dato manca (menu preciso, prezzi esatti), usare questo placeholder.
3. **Personalita' sopra tutto.** Il design deve riflettere l'identita' UNICA di Tavola viva di Federico Bastianelli.
4. **Performance first.** Il sito deve caricarsi in < 2 secondi. Immagini WebP, lazy loading.
5. **Mobile-first.** Il 70% del traffico sara da telefono. Progettare per 375px, espandere per desktop.
6. **Leggero per scelta.** Astro produce HTML statico puro. JS solo dove serve davvero.
7. **Testa cio' che conta.** Mappa, form, WhatsApp, link social. Il resto si vede a occhio.

---

## OBIETTIVO FINALE

Consegnare un sito che, quando il cliente lo apre, **non deve dire una parola**. Il design, le animazioni, la cura dei dettagli devono parlare da soli. Deve capire immediatamente che questo e' il miglior investimento che potesse fare per la sua attivita.

**Un sito web professionale che mostri i tuoi piatti e permetta prenotazioni dirette, senza pagare commissioni a TheFork/Deliveroo.**

---

*Prompt generato da dati reali: lead-data.json, brief.json, design-suggestion.json, competition-analysis.json, outreach.json*
