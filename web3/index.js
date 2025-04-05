const express = require('express');
const Web3 = require('web3');

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à Ganache
const web3 = new Web3('https://rpc1.bahamut.io');

// Add your routes and other logic here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
