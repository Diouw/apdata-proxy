import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Configura CORS para permitir chamadas do seu widget Zoho Creator
app.use(cors({
  origin: "https://85d28128-b7d3-4dd7-9da0-ac78ac235719.zappsusercontent.com",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ Responde requisições preflight OPTIONS
app.options('*', cors());

app.use(express.json());

// ✅ Endpoint principal
app.post('/proxy/apdata', async (req, res) => {
  try {
    const { username, pass, queryId, value, paramName, endpoint } = req.body;

    if (!username || !pass || !queryId || !value || !paramName || !endpoint) {
      return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
    }

    // Monta o payload final da APDATA
    const payload = {
      userName: username,
      pass: pass,
      queryId: queryId,
      languageId: 0,
      items: [
        {
          value: value,
          paramName: paramName
        }
      ]
    };

    console.log(`Enviando payload para: ${endpoint}`);
    console.log(JSON.stringify(payload, null, 2));

    const response = await fetch(endpoint, {
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
