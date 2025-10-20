// -------------------- LOKROHOOK VANILLA JS API --------------------

/**
 * Erstellt eine konfigurierbare Nachricht
 * @param {string} hookURL - Discord Webhook URL
 * @param {object} msgJSON - {content: string, embed: {title, desc, color, image}}
 * @returns {object} - {url, payload}
 */
export function configMsg(hookURL, msgJSON) {
  const payload = {};

  if(msgJSON.content) payload.content = msgJSON.content;

  if(msgJSON.embed) {
    payload.embeds = [{
      title: msgJSON.embed.title || "",
      description: msgJSON.embed.desc || "",
      color: msgJSON.embed.color ? parseInt(msgJSON.embed.color.replace('#',''),16) : 16777215,
      image: msgJSON.embed.image ? {url: msgJSON.embed.image} : undefined
    }];
  }

  return { url: hookURL, payload: payload };
}

/**
 * Sendet eine konfigurierte Nachricht an einen oder mehrere Webhooks
 * @param {object} configuredMsg - Rückgabe von configMsg()
 * @param {string[] | string} hooksArray - Webhook(s)
 */
export async function sendMsg(configuredMsg, hooksArray) {
  const hooks = Array.isArray(hooksArray) ? hooksArray : [hooksArray];

  for(const hook of hooks){
    try {
      const res = await fetch(hook, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(configuredMsg.payload)
      });
      if(!res.ok) console.error('Fehler beim Senden an', hook);
    } catch(e) {
      console.error('Fehler beim Senden an', hook, e);
    }
  }
}
