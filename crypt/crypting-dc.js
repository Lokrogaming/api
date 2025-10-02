// vrypting-decoder.js
window.cryptingDecoder = (function() {
  const PBKDF2_ITER = 100000;
  const SALT_LEN = 16;
  const IV_LEN = 12;
  const KEY_LEN = 256;

  function fromBase64(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }

  async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const pwKey = await crypto.subtle.importKey(
      'raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      {name:'PBKDF2', salt, iterations: PBKDF2_ITER, hash:'SHA-256'},
      pwKey,
      {name:'AES-GCM', length: KEY_LEN},
      false,
      ['encrypt','decrypt']
    );
  }

  async function decrypt(password, b64combined) {
    const buf = fromBase64(b64combined);
    const data = new Uint8Array(buf);
    if (data.length < SALT_LEN + IV_LEN + 16) throw new Error("Daten zu kurz / ungültiges Format.");
    const salt = data.slice(0,SALT_LEN).buffer;
    const iv = data.slice(SALT_LEN,SALT_LEN+IV_LEN).buffer;
    const ct = data.slice(SALT_LEN+IV_LEN).buffer;
    const key = await deriveKey(password, salt);
    const plainBuf = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, ct);
    return new TextDecoder().decode(plainBuf);
  }

  return { decrypt };
})();
