window.ui = (function(){
    function interpretResponse(r){
      const out = document.getElementById("output");
      const cfg = configData[0];
      const colors = {1:cfg.colorSuccess, 2:cfg.colorWarning, 3:cfg.colorError};
      out.style.color = colors[r.level] || "white";
      out.textContent = JSON.stringify(r.content, null, 2);
    }
  
    function switchTab(id, el){
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.tablink').forEach(b=>b.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      el.classList.add('active');
    }
  
    function demoAPI(){
      document.getElementById('apiOutput').textContent = JSON.stringify({
        example: "betterJS.logInUser({username:'demo', password:'demo'})",
        response: {level:1, msg:"Login success"}
      }, null, 2);
    }
  
    function sendUnlockRequest(){
      const cfg = configData[0];
      const email = document.getElementById('emailInput').value;
      const site = document.getElementById('siteInput').value;
      const name = document.getElementById('nameInput').value;
  
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `https://formsubmit.co/${cfg.developerEmail}`;
      form.innerHTML = `
        <input type="hidden" name="name" value="${name}">
        <input type="hidden" name="email" value="${email}">
        <input type="hidden" name="website" value="${site}">
        <input type="hidden" name="requested" value="betterJS unlock code request">
      `;
      document.body.appendChild(form);
      form.submit();
    }
  
    return { interpretResponse, switchTab, demoAPI, sendUnlockRequest };
  })();
  