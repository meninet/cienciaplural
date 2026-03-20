/**
 * Ciência Plural — Gestão de Consentimento de Cookies
 * Google Consent Mode v2 + LGPD
 *
 * Fluxo:
 *  1. <head> declara gtag('consent','default', {denied})
 *  2. Este script verifica localStorage
 *  3. Se consentimento salvo → aplica imediatamente
 *  4. Se não → exibe banner e aguarda decisão
 */

(function () {
  'use strict';

  var CONSENT_KEY = 'cp_cookie_consent';
  var GA_ID = 'G-09KM89GPY4';
  var ADSENSE_ID = 'ca-pub-6440630877091956';

  /* ── Utilitários ── */

  function loadScript(src, attrs) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    if (attrs) {
      for (var k in attrs) {
        if (attrs.hasOwnProperty(k)) s.setAttribute(k, attrs[k]);
      }
    }
    document.head.appendChild(s);
  }

  /* ── Carregar GA4 + AdSense ── */

  function loadGoogleScripts() {
    // GA4
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + GA_ID);
    gtag('js', new Date());
    gtag('config', GA_ID);

    // AdSense
    loadScript(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_ID,
      { crossorigin: 'anonymous' }
    );
  }

  /* ── Atualizar consentimento ── */

  function grantConsent() {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted'
    });
    loadGoogleScripts();
  }

  /* ── Banner ── */

  function createBanner() {
    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentimento de cookies');
    banner.innerHTML =
      '<div class="consent-inner">' +
        '<p class="consent-text">' +
          'Este site utiliza cookies do Google Analytics e Google AdSense para melhorar sua experiência e manter o projeto gratuito. ' +
          'Nenhum dado pessoal é coletado diretamente por nós. ' +
          'Ao clicar em "Aceitar", você concorda com o uso desses cookies. ' +
          '<a href="/privacidade/" class="consent-link">Política de Privacidade</a>' +
        '</p>' +
        '<div class="consent-buttons">' +
          '<button id="consent-reject" class="consent-btn consent-btn-reject">Recusar</button>' +
          '<button id="consent-accept" class="consent-btn consent-btn-accept">Aceitar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('consent-accept').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'granted');
      grantConsent();
      hideBanner();
    });

    document.getElementById('consent-reject').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'denied');
      hideBanner();
    });

    /* Exibir com transição */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('consent-visible');
      });
    });
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('consent-visible');
      banner.addEventListener('transitionend', function () {
        banner.remove();
      });
    }
  }

  /* ── Inicialização ── */

  var saved = localStorage.getItem(CONSENT_KEY);

  if (saved === 'granted') {
    grantConsent();
  } else if (saved === 'denied') {
    /* Não carrega nada, não exibe banner */
  } else {
    /* Sem decisão salva → exibe banner */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }

})();
