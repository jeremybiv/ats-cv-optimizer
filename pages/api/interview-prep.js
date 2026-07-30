import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  try {
    const { cvText, jobText } = req.body;
    
    if (!cvText || !jobText) {
      return res.status(400).json({ error: 'cvText et jobText sont requis' });
    }

    const deepseekApiKey = process.env.DEEPSEEK_API_KEY || 'sk-ats-cv-interview-prep-key';

    const prompt = `Based on the CV and job description provided below, generate 10 potential interview questions focusing on the gaps between the CV and the job requirements.

Return ONLY a valid JSON array (no markdown, no code fences) with exactly 10 objects, each with:
- "question": string (the interview question in French)
- "type": string (the category: "technique", "comportemental", "motivation", "gap")
- "conseil": string (a short preparation tip in French)

CV:
${cvText.slice(0, 4000)}

OFFRE D'EMPLOI:
${jobText.slice(0, 4000)}`;

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-v4-flash',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en recrutement et préparation aux entretiens. Tu analyses les CV et offres d\'emploi pour générer des questions pertinentes.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      },
      {
        headers: {
          'Authorization': `Bearer ${deepseekApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    let questions = [];
    const content = response.data.choices?.[0]?.message?.content || '';

    try {
      // Try to parse as JSON directly
      questions = JSON.parse(content);
    } catch {
      // Fallback: extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          questions = JSON.parse(jsonMatch[0]);
        } catch {
          throw new Error('Impossible de parser la réponse de DeepSeek');
        }
      } else {
        throw new Error('Format de réponse inattendu de DeepSeek');
      }
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('DeepSeek n\'a pas généré de questions valides');
    }

    res.json({ questions: questions.slice(0, 10) });
  } catch (err) {
    console.error('Interview prep error:', err);
    res.status(500).json({
      error: 'Erreur lors de la génération des questions',
      details: err.message,
    });
  }
}
