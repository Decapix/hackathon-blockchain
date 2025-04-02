const express = require('express');
const solanaWeb3 = require('@solana/web3.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à Solana
const connection = new solanaWeb3.Connection(
  solanaWeb3.clusterApiUrl('devnet'),
  'confirmed'
);

// Endpoint de test
app.get('/slot', async (req, res) => {
  try {
    const slot = await connection.getSlot();
    res.json({ slot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Web3Solana API up on port ${PORT}`);
});
