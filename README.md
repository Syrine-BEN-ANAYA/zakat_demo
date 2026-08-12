# zakat-erp — Démo visuelle statique

Maquette **statique et cliquable** des écrans principaux de `zakat-erp`
(tableau de bord, sélecteur de rôle, sidebar et thème réels), pour montrer
l'interface à un client **sans base de données ni serveur PHP**.

⚠️ **Ce n'est pas l'application réelle.** Toutes les données (familles, aides,
campagnes, comptes bancaires...) sont fictives et vivent uniquement en
mémoire JavaScript (`app.js`) — rafraîchir la page réinitialise tout. Rien
n'est jamais sauvegardé nulle part. Pour la vraie application (Laravel +
MySQL, données réelles), voir `DEPLOIEMENT-CPANEL.md` dans le zip du projet
complet.

## Ce qui est reproduit fidèlement
- Le vrai design system (`css/zakat-theme.css`, copié tel quel depuis
  `public/css/` du projet Laravel — mêmes couleurs, cartes, badges, tableaux)
- Le vrai logo (`assets/logo.jpg`)
- La sidebar RTL et la structure de navigation par rôle (permissions Spatie
  simplifiées en client-side : change de rôle sur l'écran de connexion pour
  voir la sidebar s'adapter)
- Le workflow d'approbation multi-niveaux (`تسجيل → مراجعة ميدانية → اعتماد
  نائب المدير → صرف`) sur les aides d'urgence et les campagnes de
  distribution — cliquable, avec une modale montrant chaque étape

## Ce qui manque volontairement
- Authentification réelle, base de données, persistance
- Formulaires de saisie (ajout/modification réels) — l'utilisateur voulait
  une démo *visuelle*, pas un outil de saisie
- Génération de PDF, envoi de SMS, exports Excel (fonctionnalités serveur)

## Déployer sur Vercel
Aucune configuration nécessaire — c'est un site 100 % statique.

**Via le dashboard Vercel :**
1. Poussez ce dossier sur un repo GitHub
2. Sur vercel.com → **Add New → Project** → importez le repo
3. Framework Preset : **Other** (ou laissez Vercel l'auto-détecter, il n'y a
   pas de `package.json` donc pas de build à lancer)
4. Déployez — c'est tout

**Via la CLI :**
```bash
npm i -g vercel
cd zakat-demo-static
vercel --prod
```

## Structure
```
index.html   → toutes les vues (login + dashboard + familles + aides +
                distribution + comptabilité + grand livre + colis)
app.js       → données de démo + logique Alpine.js (rôles, workflow, filtres)
css/         → thème réel du projet (copié depuis public/css/zakat-theme.css)
assets/      → logo réel
vercel.json  → désactive l'indexation par les moteurs de recherche (noindex)
```
