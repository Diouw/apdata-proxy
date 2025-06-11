import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "https://85d28128-b7d3-4dd7-9da0-ac78ac235719.zappsusercontent.com",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options('*', cors());
app.use(express.json());

app.post('/proxy/apdata', async (req, res) => {
  try {
    const { body, endpoint } = req.body;

    if (!body || !endpoint) {
      return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
    }

    console.log(`Enviando payload para: ${endpoint}`);
    console.log('Payload:', body);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
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
