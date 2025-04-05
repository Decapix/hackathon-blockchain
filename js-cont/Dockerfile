# Utilisez une image de base officielle Node.js
FROM node:20-alpine

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier package.json et package-lock.json (s'il existe)
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Commande pour lancer l'application
CMD ["npm", "start"]
