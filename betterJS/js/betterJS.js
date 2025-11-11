window.betterJS = (function(){
  let config = {}, response = {};
  let userData = [];

  async function loadUserData(){
    try {
      const r = await fetch(config.userData);
      userData = await r.json();
    } catch(e){ userData = []; }
  }

  function setConfig(cfg){ config = cfg[0]; loadUserData(); }
  function setResponseVar(r){ response = r[0] || {}; }

  // === Registrierung ===
  async function registerUser(user){
    if(config.registerMethod === "manual"){
      document.getElementById("emailBox").style.display = "block";
      response = { level:2, contentType:"JSON", content:{msg:"Email required for manual registration"} };
      return;
    }
    await autoRegister(user);
  }

  async function autoRegister(user){
    const pw = cryptingEncoder.genPassword(config.pwKeyLength);
    let encrypted;
    switch(config.encryptionLevel){
      case "l": case "1": encrypted = cryptingEncoder.encryptBase64(user.password); break;
      case "m": case "2": encrypted = await cryptingEncoder.encryptRSA(user.password); break;
      default: encrypted = await cryptingEncoder.encryptAES(pw, user.password);
    }

    const entry = { username:user.username, password:`${encrypted}:${btoa(pw)}` };
    userData.push(entry);
    localStorage.setItem("betterJS_userData", JSON.stringify(userData));

    response = { level:1, contentType:"JSON", content:{msg:"User auto-registered"} };
  }

  // === Login ===
  async function logInUser(user){
    const list = JSON.parse(localStorage.getItem("betterJS_userData") || "[]");
    const found = list.find(u=>u.username===user.username);
    if(!found){
      response = { level:3, content:{error:"User not found"} };
      return;
    }

    const [enc, pwB64] = found.password.split(":");
    const pw = atob(pwB64);
    let plain;

    try {
      switch(config.encryptionLevel){
        case "l": plain = cryptingEncoder.decryptBase64(enc); break;
        case "m": plain = await cryptingEncoder.decryptRSA(enc); break;
        default: plain = await cryptingEncoder.decryptAES(pw, enc);
      }
    } catch(e){
      response = { level:3, content:{error:"Decryption failed"} };
      return;
    }

    if(plain === user.password){
      response = { level:1, content:{msg:"Login successful"} };
      if(config.redirectAfterRgisteration && config.logInTarget){
        setTimeout(()=>window.location.href = config.logInTarget, 500);
      }
    } else {
      response = { level:3, content:{error:"Wrong password"} };
    }
  }

  function latestResponse(){ return response; }

  return { setConfig, setResponseVar, registerUser, logInUser, latestResponse };
})();
