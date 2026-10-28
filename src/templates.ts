import { WebTemplate } from './types';

export const TEMPLATES: WebTemplate[] = [
  {
    id: 'portfolio',
    name: 'Portfolio Développeur & Créatif',
    category: 'Personnel',
    badge: 'Populaire',
    description: 'Site vitrine personnel avec hero dynamique, grille de projets, compétences et contact.',
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mon Portfolio Web</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
</head>
<body>

  <!-- Navigation principale -->
  <header class="navbar">
    <div class="logo">⚡ Alex.dev</div>
    <nav>
      <a href="#about">À propos</a>
      <a href="#projects">Projets</a>
      <a href="#skills">Compétences</a>
      <a href="#contact" class="btn-primary">Me contacter</a>
    </nav>
  </header>

  <!-- Section Hero -->
  <section class="hero" id="about">
    <div class="badge">Disponible pour de nouveaux projets</div>
    <h1>Créateur d'expériences web <span class="gradient-text">élégantes & rapides</span>.</h1>
    <p>Je conçois et développe des sites internet sur-mesure en pur HTML, CSS et JavaScript moderne.</p>
    <div class="hero-actions">
      <a href="#projects" class="btn-primary">Découvrir mes projets</a>
      <a href="#contact" class="btn-secondary">Télécharger mon CV</a>
    </div>
  </section>

  <!-- Grille de Projets -->
  <section class="projects-section" id="projects">
    <div class="section-header">
      <h2>Mes Dernières Réalisations</h2>
      <p>Sélection de projets récents conçus avec passion</p>
    </div>
    
    <div class="projects-grid">
      <article class="card">
        <div class="card-img" style="background: linear-gradient(135deg, #4f46e5, #06b6d4);">
          <span>💻 Web App</span>
        </div>
        <div class="card-body">
          <span class="tag">HTML / CSS / JS</span>
          <h3>Studio Dashboard</h3>
          <p>Tableau de bord statistique avec interface sombre responsive et graphiques interactifs.</p>
          <a href="#" class="card-link">Voir la démo &rarr;</a>
        </div>
      </article>

      <article class="card">
        <div class="card-img" style="background: linear-gradient(135deg, #ec4899, #f43f5e);">
          <span>🛍️ E-commerce</span>
        </div>
        <div class="card-body">
          <span class="tag">Vitrine & Panier</span>
          <h3>Boutique Botanique</h3>
          <p>Boutique en ligne moderne pour plantes d'intérieur avec panier dynamique et paiement fluide.</p>
          <a href="#" class="card-link">Voir la démo &rarr;</a>
        </div>
      </article>

      <article class="card">
        <div class="card-img" style="background: linear-gradient(135deg, #10b981, #059669);">
          <span>☕ Gastronomie</span>
        </div>
        <div class="card-body">
          <span class="tag">Site Restaurant</span>
          <h3>Café Lumière</h3>
          <p>Site vitrine épuré avec menu du jour, réservation de table en direct et avis clients.</p>
          <a href="#" class="card-link">Voir la démo &rarr;</a>
        </div>
      </article>
    </div>
  </section>

  <!-- Compétences -->
  <section class="skills-section" id="skills">
    <div class="section-header">
      <h2>Technologies Maîtrisées</h2>
      <p>Des standards du web aux outils les plus récents</p>
    </div>
    <div class="skills-list">
      <div class="skill-item">🌐 HTML5 Sémantique</div>
      <div class="skill-item">🎨 CSS3 & Flexbox / Grid</div>
      <div class="skill-item">⚡ JavaScript ES6+</div>
      <div class="skill-item">📱 Responsive Web Design</div>
      <div class="skill-item">✨ Animations CSS</div>
      <div class="skill-item">🚀 Optimisation SEO</div>
    </div>
  </section>

  <!-- Formulaire de contact -->
  <section class="contact-section" id="contact">
    <div class="contact-box">
      <h2>Un projet en tête ? Discutons-en !</h2>
      <p>Envoyez-moi un message pour donner vie à votre prochain site web.</p>
      <form class="contact-form" onsubmit="event.preventDefault(); alert('Message envoyé avec succès !');">
        <div class="form-row">
          <input type="text" placeholder="Votre nom" required>
          <input type="email" placeholder="Votre adresse email" required>
        </div>
        <textarea rows="4" placeholder="Décrivez brièvement votre projet..." required></textarea>
        <button type="submit" class="btn-primary btn-submit">Envoyer le message ✨</button>
      </form>
    </div>
  </section>

  <!-- Pied de page -->
  <footer>
    <p>© 2026 Alex.dev — Tous droits réservés. Construit avec passion en HTML & CSS.</p>
  </footer>

</body>
</html>`,
    css: `/* Variables de couleurs et typographie */
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #1e293b;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --accent: #38bdf8;
  --accent-purple: #818cf8;
  --btn-bg: #2563eb;
  --btn-hover: #1d4ed8;
  --font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}

/* Réinitialisation de base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
  color: var(--text-main);
  line-height: 1.6;
}

/* Barre de navigation */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background-color: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(90deg, var(--accent), var(--accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar a {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.navbar a:hover {
  color: var(--text-main);
}

/* Boutons */
.btn-primary {
  background: linear-gradient(135deg, var(--btn-bg), #6366f1);
  color: #ffffff !important;
  padding: 0.65rem 1.4rem;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: inline-block;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.5);
}

.btn-secondary {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-main) !important;
  padding: 0.65rem 1.4rem;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* Hero */
.hero {
  padding: 5rem 2rem 4rem;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.badge {
  display: inline-block;
  background: rgba(56, 189, 248, 0.12);
  color: var(--accent);
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(56, 189, 248, 0.25);
}

.hero h1 {
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(135deg, #38bdf8, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 1.15rem;
  color: var(--text-muted);
  max-width: 650px;
  margin: 0 auto 2rem;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Sections communes */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.section-header p {
  color: var(--text-muted);
}

/* Projets */
.projects-section {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.card {
  background: var(--bg-card);
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.card:hover {
  transform: translateY(-6px);
  border-color: rgba(56, 189, 248, 0.4);
}

.card-img {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
}

.card-body {
  padding: 1.5rem;
}

.tag {
  display: inline-block;
  background: rgba(255, 255, 255, 0.08);
  color: var(--accent);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.card p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
}

.card-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

/* Compétences */
.skills-section {
  padding: 4rem 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.skill-item {
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s;
}

.skill-item:hover {
  border-color: var(--accent);
  transform: scale(1.05);
}

/* Contact */
.contact-section {
  padding: 4rem 2rem 6rem;
  max-width: 800px;
  margin: 0 auto;
}

.contact-box {
  background: linear-gradient(180deg, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  text-align: center;
}

.contact-form {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  color: white;
  font-family: inherit;
  outline: none;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: var(--accent);
}

.btn-submit {
  width: 100%;
  padding: 0.9rem;
  font-size: 1rem;
}

/* Footer */
footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Adaptabilité mobile */
@media (max-width: 640px) {
  .hero h1 {
    font-size: 2.2rem;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }
}`
  },
  {
    id: 'restaurant',
    name: 'Bistrot & Restaurant Gourmand',
    category: 'Commerce',
    badge: 'Chic',
    description: 'Site élégant pour la gastronomie avec carte des plats, horaires et réservations.',
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>L'Atelier des Saveurs — Bistrot Moderne</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>

  <header class="top-bar">
    <div class="brand">L'Atelier des Saveurs</div>
    <nav class="nav-links">
      <a href="#concept">Notre Histoire</a>
      <a href="#menu">La Carte</a>
      <a href="#booking" class="btn-gold">Réserver une table</a>
    </nav>
  </header>

  <section class="hero-bistro">
    <div class="hero-overlay">
      <span class="sub-title">Cuisine de Saison & Vins Fins</span>
      <h1>Une gastronomie authentique au cœur de la ville</h1>
      <p>Produits frais du terroir, créativité culinaire et ambiance chaleureuse.</p>
      <div class="hero-buttons">
        <a href="#menu" class="btn-gold">Découvrir la carte</a>
        <a href="#booking" class="btn-outline">Nos Horaires</a>
      </div>
    </div>
  </section>

  <section class="menu-section" id="menu">
    <div class="header-center">
      <h2>Les Suggestions du Chef</h2>
      <div class="gold-line"></div>
      <p>Des saveurs renouvelées chaque semaine au rythme des saisons</p>
    </div>

    <div class="menu-grid">
      <div class="menu-card">
        <div class="menu-item-header">
          <h3>Velouté de Potimarron & Éclats de Châtaignes</h3>
          <span class="price">14 €</span>
        </div>
        <p>Crémeux infusé à la truffe noire et graines de courge torréfiées.</p>
      </div>

      <div class="menu-card">
        <div class="menu-item-header">
          <h3>Filet de Bar Rôti sur Peau</h3>
          <span class="price">28 €</span>
        </div>
        <p>Émulsion au yuzu, mousseline de panais et jeunes pousses croquantes.</p>
      </div>

      <div class="menu-card">
        <div class="menu-item-header">
          <h3>Magret de Canard Caramélisé au Miel</h3>
          <span class="price">26 €</span>
        </div>
        <p>Pommes grenailles sautées au romarin et réduction de jus corsé.</p>
      </div>

      <div class="menu-card">
        <div class="menu-item-header">
          <h3>Sphère Chocolat Grand Cru & Cœur Framboise</h3>
          <span class="price">12 €</span>
        </div>
        <p>Chocolat noir 70%, coulis acidulé et glace artisanale à la vanille bourbon.</p>
      </div>
    </div>
  </section>

  <section class="reservation-section" id="booking">
    <div class="reserve-box">
      <h2>Réserver votre Table</h2>
      <p>Pour un dîner intime ou une célébration de groupe</p>
      <form class="booking-form" onsubmit="event.preventDefault(); alert('Votre demande de réservation a été transmise !');">
        <input type="text" placeholder="Nom complet" required>
        <input type="date" required>
        <select required>
          <option value="2">2 Personnes</option>
          <option value="4">4 Personnes</option>
          <option value="6">6 Personnes ou plus</option>
        </select>
        <button type="submit" class="btn-gold">Confirmer ma table</button>
      </form>
    </div>
  </section>

  <footer>
    <p>📍 12 Rue des Artisans, Paris | 📞 01 45 67 89 00 | Ouvert du Mardi au Samedi</p>
  </footer>

</body>
</html>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: #12100e;
  color: #f7f3ee;
  line-height: 1.6;
}

h1, h2, h3, .brand {
  font-family: 'Playfair Display', serif;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  background-color: rgba(18, 16, 14, 0.95);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  position: sticky;
  top: 0;
  z-index: 50;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links a {
  color: #e2d9cf;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #d4af37;
}

.btn-gold {
  background: linear-gradient(135deg, #d4af37, #aa820a);
  color: #12100e !important;
  font-weight: 700;
  padding: 0.65rem 1.4rem;
  border-radius: 4px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-gold:hover {
  opacity: 0.9;
}

.btn-outline {
  border: 1px solid #d4af37;
  color: #d4af37 !important;
  padding: 0.65rem 1.4rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
}

.hero-bistro {
  padding: 7rem 2rem 6rem;
  text-align: center;
  background: radial-gradient(circle at center, #26201b, #12100e);
}

.sub-title {
  color: #d4af37;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
}

.hero-bistro h1 {
  font-size: 3.2rem;
  max-width: 800px;
  margin: 0 auto 1.5rem;
  line-height: 1.2;
}

.hero-bistro p {
  color: #a89f91;
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
}

.menu-section {
  max-width: 960px;
  margin: 0 auto;
  padding: 5rem 2rem;
}

.header-center {
  text-align: center;
  margin-bottom: 3.5rem;
}

.header-center h2 {
  font-size: 2.4rem;
}

.gold-line {
  width: 60px;
  height: 2px;
  background: #d4af37;
  margin: 0.8rem auto 1rem;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.menu-card {
  background: #1c1815;
  border: 1px solid rgba(212, 175, 55, 0.15);
  padding: 1.5rem;
  border-radius: 6px;
}

.menu-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px dashed rgba(212, 175, 55, 0.3);
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
}

.menu-item-header h3 {
  font-size: 1.15rem;
  color: #fff;
}

.price {
  color: #d4af37;
  font-weight: 700;
  font-size: 1.2rem;
}

.menu-card p {
  color: #9c9284;
  font-size: 0.9rem;
}

.reservation-section {
  padding: 4rem 2rem 6rem;
  max-width: 700px;
  margin: 0 auto;
}

.reserve-box {
  background: #1c1815;
  border: 1px solid #d4af37;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
}

.booking-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
}

.booking-form input,
.booking-form select {
  padding: 0.8rem;
  background: #12100e;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: white;
  border-radius: 4px;
}

.booking-form button {
  grid-column: span 2;
  padding: 0.9rem;
}

footer {
  text-align: center;
  padding: 2.5rem;
  border-top: 1px solid rgba(212, 175, 55, 0.15);
  color: #8c8274;
  font-size: 0.9rem;
}`
  },
  {
    id: 'startup',
    name: 'Vitrine Tech & SaaS Modern',
    category: 'Startup',
    badge: 'Nouveau',
    description: 'Landing page technologique épurée avec grille d’avantages, pricing et call-to-action.',
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NovaFlow — Plateforme Cloud</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
</head>
<body>

  <header class="navbar">
    <div class="logo">🚀 NovaFlow</div>
    <nav>
      <a href="#features">Fonctionnalités</a>
      <a href="#pricing">Tarifs</a>
      <a href="#faq">FAQ</a>
      <a href="#cta" class="btn-highlight">Essai Gratuit</a>
    </nav>
  </header>

  <main>
    <section class="hero-tech">
      <div class="pill">✨ Version 2.0 disponible maintenant</div>
      <h1>Automatisez vos workflows avec une simplicité déconcertante</h1>
      <p>La solution tout-en-un pour les équipes modernes qui souhaitent accélérer leur productivité sans complexité technique.</p>
      <div class="cta-group">
        <a href="#cta" class="btn-highlight">Commencer gratuitement (14 jours)</a>
        <a href="#features" class="btn-ghost">Voir la vidéo de démo ▶</a>
      </div>
    </section>

    <section class="features" id="features">
      <div class="section-title">
        <h2>Pourquoi choisir NovaFlow ?</h2>
        <p>Pensé pour offrir des performances maximales et une expérience intuitive.</p>
      </div>

      <div class="feature-grid">
        <div class="feat-card">
          <div class="icon">⚡</div>
          <h3>Ultra Rapide</h3>
          <p>Temps de réponse inférieur à 50ms grâce à notre infrastructure distribuée mondiale.</p>
        </div>
        <div class="feat-card">
          <div class="icon">🔒</div>
          <h3>Sécurité Renforcée</h3>
          <p>Chiffrement de bout en bout de toutes vos données et conformité RGPD totale.</p>
        </div>
        <div class="feat-card">
          <div class="icon">📊</div>
          <h3>Analyses en Temps Réel</h3>
          <p>Visualisez chaque action et optimisez vos processus grâce aux rapports prédictifs.</p>
        </div>
      </div>
    </section>

    <section class="pricing" id="pricing">
      <div class="section-title">
        <h2>Des tarifs clairs et transparents</h2>
        <p>Sans engagement, résiliable en un clic à tout moment.</p>
      </div>

      <div class="pricing-cards">
        <div class="price-box">
          <h3>Starter</h3>
          <div class="amount">0€ <span>/mois</span></div>
          <p>Idéal pour tester et créer ses premiers projets.</p>
          <ul>
            <li>✓ Jusqu'à 3 projets</li>
            <li>✓ Support communautaire</li>
            <li>✓ 1 Go de stockage cloud</li>
          </ul>
          <button class="btn-ghost-full">Choisir Starter</button>
        </div>

        <div class="price-box popular">
          <div class="ribbon">Recommandé</div>
          <h3>Pro Studio</h3>
          <div class="amount">29€ <span>/mois</span></div>
          <p>Pour les créateurs et équipes en pleine croissance.</p>
          <ul>
            <li>✓ Projets illimités</li>
            <li>✓ Support prioritaire 24/7</li>
            <li>✓ Intégrations API complètes</li>
            <li>✓ Domaines personnalisés</li>
          </ul>
          <button class="btn-highlight-full">Activer l'offre Pro</button>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <p>© 2026 NovaFlow Inc. Propulsé par du code HTML5 sémantique et du CSS moderne.</p>
  </footer>

</body>
</html>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #0b0f19;
  color: #e2e8f0;
  line-height: 1.6;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
  font-weight: 800;
  font-size: 1.3rem;
  color: #ffffff;
}

.navbar nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
}

.navbar a:hover {
  color: #ffffff;
}

.btn-highlight {
  background: #3b82f6;
  color: white !important;
  padding: 0.65rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-highlight:hover {
  background: #2563eb;
}

.btn-ghost {
  color: #ffffff !important;
  text-decoration: none;
  font-weight: 600;
  padding: 0.65rem 1.4rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.05);
}

.hero-tech {
  text-align: center;
  padding: 5rem 2rem 4rem;
  max-width: 850px;
  margin: 0 auto;
}

.pill {
  display: inline-block;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.hero-tech h1 {
  font-size: 3.2rem;
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  letter-spacing: -0.03em;
}

.hero-tech p {
  font-size: 1.15rem;
  color: #94a3b8;
  margin-bottom: 2rem;
}

.cta-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title h2 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.section-title p {
  color: #94a3b8;
}

.features {
  padding: 5rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feat-card {
  background: #131b2e;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feat-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.feat-card p {
  color: #94a3b8;
  font-size: 0.95rem;
}

.pricing {
  padding: 5rem 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.price-box {
  background: #131b2e;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.price-box.popular {
  border-color: #3b82f6;
  background: linear-gradient(180deg, #18233c, #111827);
}

.ribbon {
  position: absolute;
  top: -12px;
  right: 20px;
  background: #3b82f6;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.amount {
  font-size: 2.8rem;
  font-weight: 900;
  margin: 1rem 0;
}

.amount span {
  font-size: 1rem;
  color: #94a3b8;
  font-weight: normal;
}

.price-box ul {
  list-style: none;
  margin: 1.5rem 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-ghost-full, .btn-highlight-full {
  width: 100%;
  padding: 0.85rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-ghost-full {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.btn-highlight-full {
  background: #3b82f6;
  color: white;
}

footer {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}`
  },
  {
    id: 'starter',
    name: 'Feuille Blanche / Débutant',
    category: 'Minimal',
    description: 'Une structure minimale propre en HTML5 et CSS pour démarrer votre propre création.',
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur mon nouveau site</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <main class="container">
    <h1>Bonjour le Monde ! 👋</h1>
    <p>Ce site est codé directement avec du pur <strong>HTML</strong> et <strong>CSS</strong>.</p>
    
    <div class="box">
      <h2>Modifiez-moi à volonté</h2>
      <p>Changez le texte dans l'onglet <code>HTML</code> et appliquez vos styles dans l'onglet <code>CSS</code>.</p>
      <button onclick="alert('Bravo ! Vous avez interagi avec le site !')">Cliquez-moi !</button>
    </div>
  </main>

</body>
</html>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f1f5f9;
  color: #0f172a;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.container {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 550px;
  text-align: center;
}

h1 {
  font-size: 2.2rem;
  color: #2563eb;
  margin-bottom: 0.5rem;
}

p {
  color: #475569;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.box {
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  padding: 1.5rem;
  border-radius: 12px;
}

.box h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

code {
  background: #e2e8f0;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-weight: bold;
  color: #0f172a;
}

button {
  margin-top: 1rem;
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s;
}

button:hover {
  background: #1d4ed8;
  transform: scale(1.03);
}`
  }
];
