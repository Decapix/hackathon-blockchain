# Hackathon Blockchain Stack

## Stack Technique

### Application & Intégration

**Frontend**
- Flutter → Interface web/mobile.
- Intégration de Webview + scripts de détection.

**Backend**
- FastAPI (Python) → logique métier + détection vidéo/audio.
- RabbitMQ → gestion des files d’attente.
- Redis → stockage temporaire des états utilisateur.
- SupaBase (self-hosted) → gestion des utilisateurs et des résultats.

**Blockchain Layer**
- Smart contracts Solana → développés en JavaScript via `@solana/web3.js`.
- Enregistrement des certificats sous forme de SBT.

---

## Installation

### Prérequis

- Docker & Docker Compose
- Git
- Node.js & npm (optionnel, uniquement si vous voulez modifier le service Web3Solana)

---

### Cloner le projet

```bash
git clone <URL_DU_REPO>
cd <nom_du_repo>
```

---

### Préparer l'environnement

1. Rendez le script `run.sh` exécutable :

```bash
chmod +x run.sh
```

2. Vérifiez que le fichier `.env-supabase` est bien présent à la racine.

3. Créez un fichier `.env` (déjà prêt) :

```bash
cp .env-supabase .env
```

---

### Lancer la stack

**Mode production (tout en détaché) :**
```bash
./run.sh up-prod
```

**Mode développement (logs visibles) :**
```bash
./run.sh up-dev
```

**Redémarrer uniquement votre projet :**
```bash
./run.sh restart-project
```

**Arrêter tous les services :**
```bash
./run.sh down-all
```

**Arrêter uniquement votre projet :**
```bash
./run.sh down-project
```

**Recuperer les data de git pour Supabase :**
```bash
./run.sh get_table_supasbase
```

---

### Vérifier l’état de la stack

Utilisez le script :
```bash
./status.sh
```

Exemple de sortie :
```
[✅] backend
[✅] frontend
[✅] web3solana
[✅] redis
[✅] rabbitmq
[✅] supabase-db
[✅] supabase-auth
[✅] supabase-rest
[✅] supabase-studio
```

---

## 🚀 Liens utiles

| Service          | URL                                |
|------------------|------------------------------------|
| Backend API     | http://localhost:8502              |
| Frontend App    | http://localhost:8501              |
| Web3Solana      | http://localhost:8503              |
| RabbitMQ        | http://localhost:15672 (user/password) |
| Redis           | localhost:6379                     |
| Supabase Studio | http://localhost:54323             |
| Supabase API    | http://localhost:8000              |
