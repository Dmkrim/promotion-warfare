/* 50 human avatars drawn as SVG (no image files needed). */
(function (root) {
  'use strict';
  var SKINS = ['#fbd9bd', '#f1c29b', '#e2a97c', '#c98d60', '#a9704a', '#7d4b2e', '#5c3622', '#ffe3cf'];
  var HAIRS = ['#1d1d1d', '#3a2314', '#6b3e1f', '#a2662b', '#d8a24c', '#b9b9b9', '#8b2f1c', '#e9e2d2'];
  var SHIRTS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b', '#f97316', '#0ea5e9'];
  var BGS = ['#fde68a', '#bfdbfe', '#bbf7d0', '#fecaca', '#ddd6fe', '#fbcfe8', '#99f6e4', '#e2e8f0', '#fed7aa', '#a5f3fc'];
  var LONG = [2, 3, 5, 7];

  function params(i) {
    i = ((i % 50) + 50) % 50;
    var style = (i * 7 + 3) % 10;
    var p = {
      skin: SKINS[(i * 3 + (i >> 3)) % 8],
      hair: HAIRS[(i * 5 + 1 + (i >> 4)) % 8],
      style: style,
      shirt: SHIRTS[i % 10],
      bg: BGS[(i * 3 + 1 + (i >> 3)) % 10],
      glasses: i % 7 === 2 || i % 11 === 5,
      beard: LONG.indexOf(style) < 0 && style !== 4 && (i % 5 === 3 || i % 9 === 0),
      smile: i % 3
    };
    return p;
  }

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    function c(v) { v = Math.max(0, Math.min(255, Math.round(v + amt))); return v; }
    return 'rgb(' + c(r) + ',' + c(g) + ',' + c(b) + ')';
  }

  function svg(i, size) {
    var p = params(i), h = p.hair, s = p.skin, sd = shade(s, -28);
    var back = '', front = '';
    switch (p.style) {
      case 0: front = '<path d="M31 44C29 24 40 17 50 17C62 17 71 25 69 44C66 36 60 30 50 30C40 30 34 36 31 44Z" fill="' + h + '"/>'; break;
      case 1: front = '<path d="M32 42C31 27 40 22 50 22C60 22 69 27 68 42C65 34 58 31 50 31C42 31 35 34 32 42Z" fill="' + h + '" opacity=".85"/>'; break;
      case 2: back = '<path d="M28 46C24 20 38 13 50 13C62 13 76 20 72 46L75 82L25 82Z" fill="' + h + '"/>';
        front = '<path d="M31 43C33 28 42 23 50 23C58 23 67 28 69 43C62 33 38 33 31 43Z" fill="' + h + '"/>'; break;
      case 3: back = '<path d="M29 42C26 20 38 14 50 14C62 14 74 20 71 42L72 63L28 63Z" fill="' + h + '"/>';
        front = '<path d="M31 43C33 27 42 22 50 22C58 22 67 27 69 43C62 34 38 34 31 43Z" fill="' + h + '"/>'; break;
      case 4: front = '<g fill="' + h + '"><circle cx="34" cy="33" r="8"/><circle cx="44" cy="26" r="9"/><circle cx="56" cy="26" r="9"/><circle cx="66" cy="33" r="8"/><circle cx="30" cy="44" r="6"/><circle cx="70" cy="44" r="6"/></g>'; break;
      case 5: back = '<circle cx="50" cy="14" r="8" fill="' + h + '"/>';
        front = '<path d="M31 44C29 25 40 19 50 19C62 19 71 25 69 44C66 36 60 31 50 31C40 31 34 36 31 44Z" fill="' + h + '"/>'; break;
      case 6: front = ''; break;
      case 7: back = '<path d="M67 36C86 36 88 62 74 74C79 58 73 47 66 42Z" fill="' + h + '"/>';
        front = '<path d="M31 44C29 24 40 17 50 17C62 17 71 25 69 44C66 36 60 30 50 30C40 30 34 36 31 44Z" fill="' + h + '"/>'; break;
      case 8: front = '<path d="M31 44L30 26L38 32L42 16L48 28L54 14L58 28L66 18L68 32L70 44C66 36 60 31 50 31C40 31 34 36 31 44Z" fill="' + h + '"/>'; break;
      default: front = '<path d="M31 44C29 22 46 15 58 19C70 23 71 36 69 44C64 32 52 28 40 32C36 35 33 40 31 44Z" fill="' + h + '"/>';
    }
    var mouth = p.smile === 0 ? '<path d="M43 56Q50 62 57 56" stroke="#8a3b3b" fill="none" stroke-width="2" stroke-linecap="round"/>' :
      p.smile === 1 ? '<path d="M44 57Q50 60 56 57" stroke="#8a3b3b" fill="none" stroke-width="2" stroke-linecap="round"/>' :
        '<path d="M43 56Q50 63 57 56Z" fill="#fff" stroke="#8a3b3b" stroke-width="1.6" stroke-linejoin="round"/>';
    var beard = p.beard ? '<path d="M32 50Q33 72 50 72Q67 72 68 50Q62 63 50 63Q38 63 32 50Z" fill="' + h + '" opacity=".95"/>' : '';
    var glasses = p.glasses ? '<g fill="none" stroke="#222" stroke-width="1.6"><circle cx="42.5" cy="47" r="6.2"/><circle cx="57.5" cy="47" r="6.2"/><path d="M48.7 47H51.3"/></g>' : '';
    var brow = '<path d="M37 40Q42 37 47 40M53 40Q58 37 63 40" stroke="' + shade(h.length === 7 ? h : '#333333', -10) + '" fill="none" stroke-width="2" stroke-linecap="round"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="' + (size || 64) + '" height="' + (size || 64) + '" role="img" aria-label="Avatar ' + (i + 1) + '">' +
      '<rect width="100" height="100" fill="' + p.bg + '"/>' + back +
      '<path d="M10 100C10 79 30 70 50 70C70 70 90 79 90 100Z" fill="' + p.shirt + '"/>' +
      '<path d="M40 70L50 80L60 70Z" fill="' + shade(p.shirt, -35) + '" opacity=".55"/>' +
      '<rect x="43" y="58" width="14" height="16" rx="5" fill="' + sd + '"/>' +
      '<circle cx="31" cy="48" r="4" fill="' + s + '"/><circle cx="69" cy="48" r="4" fill="' + s + '"/>' +
      '<ellipse cx="50" cy="46" rx="19" ry="22" fill="' + s + '"/>' +
      front + beard +
      '<circle cx="43" cy="47" r="2.1" fill="#222"/><circle cx="57" cy="47" r="2.1" fill="#222"/>' + brow +
      '<path d="M50 49L48.4 54.5L51.6 54.5" stroke="' + sd + '" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      mouth + glasses + '</svg>';
  }

  function load() { try { return JSON.parse(localStorage.getItem('pw_profile') || '{}') || {}; } catch (e) { return {}; } }
  function save(p) { try { localStorage.setItem('pw_profile', JSON.stringify(p)); } catch (e) { } }

  // returns html for the current profile avatar
  function html(size, profile) {
    var p = profile || load(), sz = size || 40;
    if (p.photo) return '<img src="' + p.photo + '" width="' + sz + '" height="' + sz + '" alt="Profile photo" style="width:100%;height:100%;object-fit:cover">';
    return svg(typeof p.avatar === 'number' ? p.avatar : 0, sz);
  }

  // resize an uploaded photo to a small square jpeg data URL
  function photoFromFile(file, cb) {
    var rd = new FileReader();
    rd.onload = function () {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(img.width, img.height), c = document.createElement('canvas');
        c.width = c.height = 160;
        c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 160, 160);
        cb(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = function () { cb(null); };
      img.src = rd.result;
    };
    rd.onerror = function () { cb(null); };
    rd.readAsDataURL(file);
  }

  root.PWAvatars = { count: 50, svg: svg, html: html, params: params, load: load, save: save, photoFromFile: photoFromFile };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.PWAvatars;
})(typeof window !== 'undefined' ? window : globalThis);
