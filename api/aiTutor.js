export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { circuit, numQubits } = req.body;

  if (!circuit || !numQubits) {
    return res.status(400).json({ error: 'Missing circuit or numQubits' });
  }

  const circuitDescription = circuit.map((step, idx) => {
    if (step.control !== null) {
      return `Шаг ${idx + 1}: ${step.gate} гейт (control: Q${step.control}, target: Q${step.target})`;
    }
    return `Шаг ${idx + 1}: ${step.gate} гейт на кубит Q${step.target}`;
  }).join('\n');

  const prompt = `Ты — квантовый физик-учитель. Объясни простыми словами, что делает эта квантовая цепь:

Количество кубитов: ${numQubits}

Цепь:
${circuitDescription}

Объясни:
1. Что происходит на каждом шаге
2. Какое итоговое состояние получится
3. Есть ли здесь суперпозиция или запутанность

Ответ должен быть понятен студенту без глубоких знаний квантовой физики.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://quantum-simulator-wheat.vercel.app',
        'X-Title': 'Quantum Simulator'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenRouter API error');
    }

    const explanation = data.choices[0].message.content;
    res.status(200).json({ explanation });

  } catch (error) {
    console.error('AI Tutor error:', error);
    res.status(500).json({ error: error.message || 'Failed to get AI explanation' });
  }
}
