# 📦 GH Pages API / Assets Repository

Dies ist eine kleine **API- / Assets-Seite**, die über **GitHub Pages** gehostet wird.  
Der Zweck ist es, hier **externe Ressourcen** wie Skripte, Stylesheets, Bilder oder Snippets bereitzustellen, auf die andere Projekte zugreifen können.  

## 🔧 Verwendung

Alle Dateien in diesem Repository können direkt über GitHub Pages abgerufen werden.  
Beispiel:

```html
<!-- Externes Script einbinden -->
<script src="https://lokrogaming.github.io/api/projektName/script.js"></script>

<!-- Externes Stylesheet einbinden -->
<link rel="stylesheet" href="https://lokrogaming.github.io/api/projektName/style.css">

```
Optional muss auch ein

```html
<div id="jenachdemWelcheAPIDuVerwendest"></div>
```
integriert werden.
