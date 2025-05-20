import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/proxy/apdata', async (req, res) => {
  try {
    const { userName, pass, queryId, languageId, items } = req.body;

    if (!userName || !pass || !queryId || !items) {
      return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
    }

    const payload = {
      userName,
      pass,
      queryId,
      languageId: languageId || 0,
      items
    };

    const response = await fetch('https://api-hml.apdata.com.br:22238/REST/API.APDATA.V1/QUERYS', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erro ao consultar Apdata:', error.message);
    res.status(500).json({ error: 'Erro ao consultar API Apdata' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});
