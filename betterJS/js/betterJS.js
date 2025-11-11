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
            response = { level:2, contentType:"JSON", content:{msg:"Email required for"} };
            return;
        }
        await autoRegister(user);
    }

    async function autoRegister(user){
        const pw = cryptingEncoder.genPassword(config.pwKeyLength);
        let encryptedUser, encryptedPw;

        // Verschlüsselung von Username UND Passwort
        switch(config.encryptionLevel){
            case "l":
            case "1":
                encryptedUser = cryptingEncoder.encryptBase64(user.username);
                encryptedPw = cryptingEncoder.encryptBase64(user.password);
                break;
            case "m":
            case "2":
                encryptedUser = await cryptingEncoder.encryptRSA(user.username);
                encryptedPw = await cryptingEncoder.encryptRSA(user.password);
                break;
            default:
                encryptedUser = await cryptingEncoder.encryptAES(pw, user.username);
                encryptedPw = await cryptingEncoder.encryptAES(pw, user.password);
        }
        
        const entry = { 
            username: `${encryptedUser}:${btoa(pw)}`,
            password: `${encryptedPw}:${btoa(pw)}`
        };
        userData.push(entry);
        localStorage.setItem("betterJS_userData", JSON.stringify(userData));
        response = { level:1, contentType:"JSON", content:{msg:"User auto-registered"} };
    }

    // === Login ===
    async function loginUser(user){
        for(let entry of userData){
            const [encUser, userKey] = entry.username.split(':');
            const [encPass, passKey] = entry.password.split(':');
            
            let decryptedUser = decryptValue(encUser, userKey, config.encryptionLevel);
            let decryptedPass = decryptValue(encPass, passKey, config.encryptionLevel);
            
            if(decryptedUser === user.username && decryptedPass === user.password){
                if(plain === user.password){
                    response = { level:1, content:{msg:"Login successful"} };
                    if(config.redirectAfterRegisteration && config.loginTarget){
                        setTimeout(()=>window.location.href = config.loginTarget, 500);
                    }
                } else {
                    response = { level:3, content:{error:"Wrong password"} };
                }
                return;
            }
        }
        response = { level:3, content:{error:"User not found"} };
    }

    async function decryptValue(encrypted, key, level){
        switch(level){
            case "l":
            case "1":
                return cryptingEncoder.decryptBase64(encrypted);
            case "m":
            case "2":
                return await cryptingEncoder.decryptRSA(encrypted);
            default:
                return await cryptingEncoder.decryptAES(atob(key), encrypted);
        }
    }

    function latestResponse(){ return response; }

    return { setConfig, setResponseVar, registerUser, loginUser, latestResponse };
})();
