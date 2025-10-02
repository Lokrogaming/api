// vrypting-encoder.js
window.cryptingEncoder = (function() {
  const PBKDF2_ITER = 100000;
  const SALT_LEN = 16;
  const IV_LEN = 12;
  const KEY_LEN = 256;

  function toBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  function fromBase64(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }

  function randBytes(len){
    const b = new Uint8Array(len);
    crypto.getRandomValues(b);
    return b;
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

  function generatePassword(length=16){
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i=0;i<length;i++){
      result += chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return result;
  }

  async function encrypt(password, plainText) {
    const salt = randBytes(SALT_LEN);
    const iv = randBytes(IV_LEN);
    const key = await deriveKey(password, salt);
    const enc = new TextEncoder();
    const ct = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, enc.encode(plainText));
    const combined = new Uint8Array(salt.byteLength + iv.byteLength + ct.byteLength);
    combined.set(salt,0);
    combined.set(iv,SALT_LEN);
    combined.set(new Uint8Array(ct), SALT_LEN + IV_LEN);
    return toBase64(combined.buffer);
  }

  function combineOutput(encrypted, password){
    return `${encrypted}:${password}`;
  }

  return { encrypt, combineOutput, generatePassword };
})();
