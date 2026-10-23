import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../src/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }
  // Cette route consomme la clé DeepSeek : jamais joignable sans session.
  // La garde est dans le handler (et non dans middleware.js) car le middleware
  // répond par une redirection 307, inadaptée à un endpoint JSON.
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ ok: false, error: 'Authentification requise.' });
  }
  try {
    const { cvText, jobText } = req.body;
    if (!cvText || !jobText) {
      return res.status(400).json({ error: 'cvText et jobText sont requis' });
    }
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    const prompt = `Tu es un expert en candidature. Ecris une lettre de motivation personnalisee en francais (250-350 mots) pour le poste decrit ci-dessous, basee sur le CV fourni.

Structure :
- Accroche qui montre la comprehension du poste
- 2-3 paragraphes mettant en valeur les competences et experiences du CV qui correspondent aux exigences du poste
- Une phrase sur la valeur ajoutee que le candidat apporterait
- Formule de politesse professionnelle

Regles :
- Utilise uniquement des informations presentes dans le CV (ne rien inventer)
- Reste naturel, pas de jargon
- Pas de tirets em (—)

CV:
${cvText.slice(0, 4000)}

OFFRE D'EMPLOI:
${jobText.slice(0, 4000)}

Retourne UNIQUEMENT le texte de la lettre, sans titre, sans guillemets.`;
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      { model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.7 },
      { headers: { Authorization: `Bearer ${deepseekApiKey}`, 'Content-Type': 'application/json' }, timeout: 30000 }
    );
    const letter = response.data?.choices?.[0]?.message?.content?.trim() || '';
    return res.json({ letter });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
