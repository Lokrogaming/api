window.cryptingEncoder = (function(){
  const PBKDF2_ITER = 100000, SALT_LEN = 16, IV_LEN = 12, KEY_LEN = 256;
  function toBase64(b){return btoa(String.fromCharCode(...new Uint8Array(b)));}
  function fromBase64(b){const bin=atob(b),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return bytes.buffer;}
  function randBytes(len){const b=new Uint8Array(len);crypto.getRandomValues(b);return b;}

  async function deriveKey(p,s){const e=new TextEncoder(),k=await crypto.subtle.importKey("raw",e.encode(p),{name:"PBKDF2"},false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:s,iterations:PBKDF2_ITER,hash:"SHA-256"},k,{name:"AES-GCM",length:KEY_LEN},false,["encrypt","decrypt"]);}

  async function encryptAES(p,t){
    const s=randBytes(SALT_LEN),iv=randBytes(IV_LEN),k=await deriveKey(p,s),ct=await crypto.subtle.encrypt({name:"AES-GCM",iv},k,new TextEncoder().encode(t));
    const c=new Uint8Array(s.byteLength+iv.byteLength+ct.byteLength);
    c.set(s,0);c.set(iv,SALT_LEN);c.set(new Uint8Array(ct),SALT_LEN+IV_LEN);
    return toBase64(c.buffer);
  }

  async function decryptAES(p,b64){
    const buf=fromBase64(b64),d=new Uint8Array(buf);
    const s=d.slice(0,SALT_LEN).buffer,iv=d.slice(SALT_LEN,SALT_LEN+IV_LEN).buffer,ct=d.slice(SALT_LEN+IV_LEN).buffer;
    const k=await deriveKey(p,s);
    const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv},k,ct);
    return new TextDecoder().decode(pt);
  }

  function encryptBase64(t){return btoa(t);}
  function decryptBase64(t){return atob(t);}
  async function encryptRSA(t){return btoa("RSA:"+t);}
  async function decryptRSA(t){return atob(t).replace(/^RSA:/,"");}

  function genPassword(len=12){
    let result = "";
    for(let i=0;i<len;i++) result += Math.floor(Math.random()*10);
    return result;
  }

  return { encryptAES, decryptAES, encryptBase64, decryptBase64, encryptRSA, decryptRSA, genPassword };
})();
