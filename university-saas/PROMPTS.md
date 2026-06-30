# PROMPTS.md — Journal des prompts complexes

## Contexte du projet
University SaaS est une plateforme multi-tenant de gestion universitaire pilotée par IA.

---

## Prompt 1 — Architecture Multi-Tenant & Sécurité Firebase

**Objectif :** Concevoir une architecture de base de données Firebase Realtime Database garantissant l'isolation totale des données entre universités.

**Prompt :**
> "Génère les règles de sécurité Firebase Realtime Database pour une application SaaS multi-tenant universitaire avec 5 rôles distincts (super_admin_plateforme, admin_universite, teacher, student, parent). Chaque université doit être totalement isolée. Les règles doivent vérifier que l'utilisateur authentifié appartient bien à l'université qu'il essaie d'accéder, via la valeur stockée dans /users/{uid}/universityId. Le super_admin a accès à un noeud /platform pour le monitoring global."

**Résultat :** Fichier `database.rules.json` avec isolation par `$universityId` vérifié via `root.child('users').child(auth.uid).child('universityId').val() === $universityId`.

---

## Prompt 2 — Système RBAC & Route Guards React

**Objectif :** Implémenter un système de contrôle d'accès basé sur les rôles (RBAC) pour protéger les routes React Router v6.

**Prompt :**
> "Crée un composant ProtectedRoute en React TypeScript qui protège les routes selon le rôle de l'utilisateur stocké dans Zustand. Le composant doit : (1) afficher un loader pendant la vérification de session Firebase, (2) rediriger vers /connexion si non authentifié, (3) rediriger vers le dashboard approprié si le rôle ne correspond pas. Crée également un RoleRedirect qui redirige automatiquement l'utilisateur vers son dashboard selon son rôle après connexion."

**Résultat :** Composants `ProtectedRoute.tsx` et `RoleRedirect.tsx` avec gestion complète des 5 rôles et redirections intelligentes.

---

## Prompt 3 — Tunnel d'Onboarding Multi-Étapes avec Stripe Sandbox

**Objectif :** Créer un flux d'inscription auto-service complet permettant à une université de s'inscrire, configurer son compte admin et souscrire à un plan Stripe en sandbox.

**Prompt :**
> "Génère un composant React Onboarding.tsx avec 4 étapes : (1) inscription de l'université avec génération automatique du slug, (2) récapitulatif des informations, (3) paiement Stripe sandbox avec simulation de transaction, (4) import optionnel de données CSV. L'étape 3 doit créer simultanément l'entrée /universities/{id} et /users/{uid} dans Firebase Realtime Database avec le rôle admin_universite. Utilise React Hook Form + Zod pour la validation et du state React pour la progression entre étapes."

**Résultat :** `Onboarding.tsx` avec stepper visuel, validation en temps réel, simulation Stripe et création atomique des données Firebase.

---

## Prompt 4 — Interface de Saisie des Notes avec Calcul GPA Automatique

**Objectif :** Développer une interface tableau pour la saisie des notes par les enseignants avec calcul en temps réel des mentions et du GPA.

**Prompt :**
> "Crée une interface de saisie de notes enseignant en React TypeScript avec : (1) sélection du cours parmi les cours assignés à l'enseignant, (2) tableau des étudiants inscrits avec champ input numérique pour la note sur 20, (3) calcul en temps réel de la mention lettre (A+, A, B+... F) et des points GPA selon l'échelle standard, (4) bouton de sauvegarde batch qui enregistre toutes les notes dans /universities/{id}/grades et crée un audit log pour chaque note saisie. Le calcul doit être réactif : dès que l'enseignant tape un chiffre, la mention s'affiche instantanément."

**Résultat :** `TeacherDashboard.tsx` > `GradeEntry` avec calcul temps réel, interface tableau et audit logging automatique.

---

## Prompt 5 — Export RGPD & Conformité des Données Personnelles

**Objectif :** Implémenter une fonctionnalité d'export RGPD permettant à un étudiant de télécharger toutes ses données personnelles au format JSON-LD.

**Prompt :**
> "Implémente dans le dashboard étudiant un bouton 'Export RGPD' qui génère et télécharge un fichier JSON-LD contenant toutes les données personnelles de l'étudiant : profil utilisateur (/users/{uid}), dossier académique (matricule, programme, historique), toutes les notes publiées, historique des paiements. Le fichier doit suivre le standard Schema.org avec @context et @type, inclure la date d'export, et être déclenché côté client (sans appel serveur) via URL.createObjectURL(). Ajouter également un bouton de suppression de compte avec double confirmation."

**Résultat :** Fonctionnalité `exportData()` dans `StudentDashboard.tsx` générant un JSON-LD conforme Schema.org téléchargeable directement depuis le navigateur.

---

## Notes techniques importantes

- **Multi-tenancy** : Chaque donnée est préfixée par `/universities/{universityId}/` dans Firebase pour garantir l'isolation
- **Performance** : Utilisation de `Promise.all()` pour charger les données en parallèle
- **Zustand** : State global partagé entre composants sans prop drilling
- **Audit Trail** : Chaque action critique (création étudiant, saisie note) génère un AuditLog immuable
- **TypeScript strict** : Tous les types sont définis dans `src/types/index.ts` et utilisés de manière cohérente
