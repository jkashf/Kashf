export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  try {
    const { text } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `Je bent een professionele vertaler gespecialiseerd in islamitische vrijdagpreken. Vertaal nauwkeurig naar Nederlands. Behoud islamitische termen zoals Alhamdulillah, SubhanAllah, Allahu Akbar, Inshallah, Ummah, Sunnah. Geef ALLEEN de vertaling terug.`,
        messages: [{ role: 'user', content: text }]
      })
    });
    const data = await response.json();
    res.status(200).json({ translation: data.content[0].text });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
