import { CodeSnippet } from './types';

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'html-nav',
    name: 'Barre de navigation (HTML)',
    category: 'html',
    description: 'Header avec logo et liens de navigation',
    code: `<header class="navbar">
  <div class="logo">MonLogo</div>
  <nav>
    <a href="#home">Accueil</a>
    <a href="#services">Services</a>
    <a href="#contact">Contact</a>
  </nav>
</header>`
  },
  {
    id: 'html-card',
    name: 'Carte de contenu (HTML)',
    category: 'html',
    description: 'Carte avec image, titre, texte et bouton',
    code: `<div class="card">
  <img src="https://picsum.photos/400/200" alt="Image illustrative">
  <div class="card-content">
    <h3>Titre de la carte</h3>
    <p>Description concise et captivante de votre produit ou service.</p>
    <a href="#" class="btn">En savoir plus</a>
  </div>
</div>`
  },
  {
    id: 'html-contact',
    name: 'Formulaire de contact (HTML)',
    category: 'html',
    description: 'Formulaire complet nom, email et message',
    code: `<form class="contact-form">
  <label for="name">Votre Nom</label>
  <input type="text" id="name" required placeholder="Jean Dupont">
  
  <label for="email">Votre Email</label>
  <input type="email" id="email" required placeholder="jean@example.com">
  
  <label for="msg">Votre Message</label>
  <textarea id="msg" rows="4" placeholder="Votre message..."></textarea>
  
  <button type="submit">Envoyer le message</button>
</form>`
  },
  {
    id: 'css-center',
    name: 'Centrage Flexbox parfait (CSS)',
    category: 'css',
    description: 'Centre n’importe quel élément horizontalement et verticalement',
    code: `.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}`
  },
  {
    id: 'css-grid',
    name: 'Grille responsive automatique (CSS)',
    category: 'css',
    description: 'Grille qui s’adapte à toutes les tailles d’écrans sans media queries',
    code: `.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}`
  },
  {
    id: 'css-gradient',
    name: 'Bouton Moderne Dégradé (CSS)',
    category: 'css',
    description: 'Bouton stylé avec effet d’élévation au survol',
    code: `.btn-gradient {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}`
  }
];
