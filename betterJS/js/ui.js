window.ui = (function(){
    function switchTab(tabId, btn){
        // Hide all tabs
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Remove active class from all buttons
        const buttons = document.querySelectorAll('.tablink');
        buttons.forEach(button => button.classList.remove('tablink-active'));
        
        // Show selected tab
        document.getElementById(tabId).classList.add('active');
        btn.classList.add('tablink-active');
    }

    function loginUser(){
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        if(!username || !password){
            alert('Bitte Benutzername und Passwort eingeben');
            return;
        }
        
        betterJS.loginUser({username, password});
        const response = betterJS.latestResponse();
        
        if(response.level === 1){
            showUnlockSection(username);
        } else {
            alert(response.content?.error || 'Login fehlgeschlagen');
        }
    }

    function registerUser(){
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        
        if(!username || !password){
            alert('Bitte Benutzername und Passwort eingeben');
            return;
        }
        
        betterJS.registerUser({username, password});
        const response = betterJS.latestResponse();
        
        if(response.level === 1){
            alert('Registrierung erfolgreich!');
            document.getElementById('regUsername').value = '';
            document.getElementById('regPassword').value = '';
            toggleRegister();
        }
    }

    function toggleRegister(){
        const loginBox = document.getElementById('loginBox');
        const registerBox = document.getElementById('registerBox');
        
        loginBox.classList.toggle('hidden');
        registerBox.classList.toggle('hidden');
    }

    function showUnlockSection(username){
        document.getElementById('loginBox').classList.add('hidden');
        document.getElementById('registerBox').classList.add('hidden');
        document.getElementById('unlockSection').classList.remove('hidden');
        document.getElementById('unlockedMessage').textContent = `Willkommen, ${username}! Dein Account wurde freigeschaltet.`;
    }

    function logout(){
        document.getElementById('unlockSection').classList.add('hidden');
        document.getElementById('loginBox').classList.remove('hidden');
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        localStorage.removeItem('betterJS_userData');
    }

    function sendApiRequest(){
        const endpoint = document.getElementById('apiEndpoint').value;
        const body = document.getElementById('apiBody').value;
        
        if(!endpoint){
            alert('Bitte API Endpoint eingeben');
            return;
        }
        
        try {
            const requestBody = body ? JSON.parse(body) : {};
            const response = {endpoint, request: requestBody};
            document.getElementById('apiResponse').textContent = JSON.stringify(response, null, 2);
            document.getElementById('apiResponse').classList.remove('hidden');
        } catch(e){
            alert('Fehler beim JSON parsen: ' + e.message);
        }
    }

    function saveConfig(){
        const level = document.getElementById('encryptionLevel').value;
        localStorage.setItem('betterJS_encryptionLevel', level);
        alert('Konfiguration gespeichert!');
    }

    return { switchTab, loginUser, registerUser, toggleRegister, logout, sendApiRequest, saveConfig };
})();
