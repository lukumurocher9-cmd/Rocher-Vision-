export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  try {
    const { idea, platform } = req.body;

    if (!idea) {
      return res.status(400).json({
        error: "Veuillez entrer une idée."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5.6",
          input: `Tu es l'assistant IA de Rocher Vision.

Crée un contenu de qualité pour la plateforme ${platform || "Facebook"}.

Idée de départ :
${idea}

Réponds en français avec :
1. Un titre accrocheur
2. Une accroche
3. Un contenu complet
4. Un appel à l'action
5. Des hashtags

Le contenu doit être clair, utile et adapté à la plateforme choisie.`
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Erreur OpenAI"
      });
    }

    const text =
      data.output_text ||
      data.output?.map(item =>
        item.content?.map(part => part.text || "").join("")
      ).join("") ||
      "";

    return res.status(200).json({
      result: text
    });

  } catch (error) {
    return res.status(500).json({
      error: "Erreur du serveur"
    });
  }
}
