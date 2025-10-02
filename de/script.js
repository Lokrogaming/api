(function(){
  const container = document.getElementById("deutschland-ad");
  if(!container) return;

  container.innerHTML = `
    <div class="banner" onclick="window.open('https://dcs.lol/deutschland','_blank')">
      <img src="https://lokrogaming.github.io/src/assets/de-logo.png" alt="Logo">
      <div class="typing" id="typing"></div>
    </div>
  `;

  const text = "Komme jetzt auf .lol/deutschland!";
  let i = 0;
  let deleting = false;

  function typeEffect() {
    const typingEl = document.getElementById("typing");
    if (!typingEl) return;

    if (!deleting) {
      typingEl.textContent = text.substring(0, i+1);
      i++;
      if (i === text.length) {
        deleting = true;
        setTimeout(typeEffect, 1500); // kurze Pause am Ende
        return;
      }
    } else {
      typingEl.textContent = text.substring(0, i-1);
      i--;
      if (i === 0) {
        deleting = false;
      }
    }
    setTimeout(typeEffect, deleting ? 50 : 100);
  }

  typeEffect();
})();
