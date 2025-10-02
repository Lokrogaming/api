/* Banner API — Single-file JavaScript Version: 1.2

Änderungen:

Fallback: Wenn ?ad=<id> gesetzt ist, aber im JSON nicht gefunden wird, zeigt das Script eine Meldung "ID nicht gefunden" als Platzhalter an.

Beispiel-JSON mit iframe bleibt enthalten.


Beispiel-JSON (config.json): { "ad_1234567890abcdef1234567890abcdef": { "mode": "iframe", "src": "https://ads.example.com/banner?id=abc123", "width": 728, "height": 90, "sandbox": "allow-scripts allow-same-origin allow-popups", "style": "display:block; width:100%; max-width:728px; height:90px; border:0;", "attrs": {"loading":"lazy"} } }

*/

var BannerAPI = (function () { 'use strict';

var _config = {}; var _defaults = { mode: 'inline', img: null, src: null, style: '', link: null, alt: '', width: null, height: null, attrs: {}, sandbox: 'allow-scripts allow-same-origin', allowFullScreen: false };

function _merge(a, b) { var out = {}; for (var k in a) out[k] = a[k]; for (var k in b) out[k] = b[k]; return out; }

function _applyAttrs(el, attrs) { if (!attrs) return; Object.keys(attrs).forEach(function (k) { try { el.setAttribute(k, attrs[k]); } catch (e) { } }); }

function _createInline(cfg) { var container = document.createElement('div'); container.style.cssText = cfg.style || ''; container.className = 'banner-api-inline'; if (cfg.img) { var img = document.createElement('img'); img.alt = cfg.alt || ''; if (cfg.width) img.width = cfg.width; if (cfg.height) img.height = cfg.height; _applyAttrs(img, cfg.attrs); img.style.cssText = 'display:block; max-width:100%; height:auto;'; img.src = cfg.img; if (cfg.link) { var a = document.createElement('a'); a.href = cfg.link; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.appendChild(img); container.appendChild(a); } else { container.appendChild(img); } } else { container.textContent = cfg.alt || ''; } return container; }

function _createIframe(cfg) { var iframe = document.createElement('iframe'); iframe.width = cfg.width || '100%'; iframe.height = cfg.height || '250'; iframe.style.cssText = cfg.style || 'border:0;'; iframe.src = cfg.src || 'about:blank'; iframe.setAttribute('loading', 'lazy'); if (cfg.sandbox !== undefined) iframe.setAttribute('sandbox', cfg.sandbox); if (cfg.allowFullScreen) iframe.setAttribute('allowfullscreen', ''); _applyAttrs(iframe, cfg.attrs); return iframe; }

function _renderTo(target, element) { var containerEl = null; try { containerEl = (typeof target === 'string') ? document.querySelector(target) : target; } catch (e) { containerEl = null; } if (!containerEl) containerEl = document.body; containerEl.appendChild(element); return element; }

function renderBanner(key, targetSelector) { var cfg = _config[key]; if (!cfg) { console.warn('BannerAPI: Kein Eintrag für', key); var fallback = document.createElement('div'); fallback.textContent = 'Anzeige: ID nicht gefunden (' + key + ')'; fallback.style.cssText = 'display:block; padding:10px; background:#fdd; color:#900; font-family:sans-serif;'; _renderTo(targetSelector || 'body', fallback); return fallback; } var merged = _merge(_defaults, cfg); var el = (merged.mode === 'iframe') ? _createIframe(merged) : _createInline(merged); _renderTo(targetSelector || cfg.target || 'body', el); return el; }

function renderAll() { Object.keys(_config).forEach(function (k) { renderBanner(k); }); }

function initFromObject(obj, opts) { opts = opts || {}; _config = obj || {}; if (opts.autoRender) { var adId = _getAdParam(); if (adId) { setTimeout(function(){ renderBanner(adId); }, 0); } else { setTimeout(renderAll, 0); } } return _config; }

function initFromUrl(url, opts) { opts = opts || {}; return fetch(url, {cache: 'no-cache'}) .then(function (r) { if (!r.ok) throw new Error('Network error'); return r.json(); }) .then(function (json) { initFromObject(json, opts); return json; }); }

function registerBanner(key, cfg) { _config[key] = cfg; } function getConfig() { return _config; }

function _getAdParam() { var params = new URLSearchParams(window.location.search); var adId = params.get('ad'); if (adId && adId.length >= 32) { return adId; } return null; }

return { initFromUrl: initFromUrl, initFromObject: initFromObject, registerBanner: registerBanner, renderBanner: renderBanner, renderAll: renderAll, getConfig: getConfig }; })();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') { module.exports = BannerAPI; } else { window.BannerAPI = BannerAPI; }
