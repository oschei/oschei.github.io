---
permalink: /contact/
title: Contact
description: How to reach me — LinkedIn, GitHub, Strava, Goodreads.
term_title: "guest@oschei.com — ssh oliver — zsh"
---

<h1 class="visually-hidden">Contact — Oliver Scheiwiller</h1>

{% include prompt.html cmd="<span class='verb'>ssh</span> <span class='arg'>oliver</span>" %}

<div class="ssh-line">The authenticity of host 'oliver (oschei.com)' can't be established.</div>
<div class="ssh-line">ED25519 key fingerprint: SHA256:<span id="ssh-fingerprint">carrots-not-fast-not-funny-stay-the-course</span>=</div>
<div class="ssh-line warn">Are you sure you want to continue connecting (yes/no)? <span style="color:var(--success)">yes</span></div>
<div class="ssh-line ok">Connection to oliver.oschei.com established.</div>
<div class="ssh-line">Last login: {{ site.time | date: '%a %d %b %Y' }} from <span id="ssh-login-from">anywhere</span></div>

<div class="ssh-welcome">Welcome.</div>

<div class="ssh-list">
  <div class="row"><span class="k">linkedin</span><span class="v"><a href="{{ site.linkedin_url }}" rel="me">in/oschei</a></span></div>
  <div class="row"><span class="k">github</span><span class="v"><a href="{{ site.github_url }}" rel="me">@oschei</a></span></div>
  <div class="row"><span class="k">strava</span><span class="v"><a href="{{ site.strava_url }}" rel="me">athletes/guapito</a></span></div>
  <div class="row"><span class="k">goodreads</span><span class="v"><a href="{{ site.goodreads_url }}" rel="me">oschei</a></span></div>
  {% if site.calendly_url and site.calendly_url != "" and site.calendly_url contains "calendly" %}
  <div class="row"><span class="k">chat</span><span class="v"><a href="{{ site.calendly_url }}" rel="external">book time ↗</a><span class="optional">— optional</span></span></div>
  {% endif %}
</div>

<div class="ssh-logout">
  <div class="ssh-line">logout</div>
  <div class="ssh-line">Connection to oliver closed.</div>
  <div class="farewell">so long, and thanks for all the fish. {% include carrot.html page="contact" %}</div>
</div>

<script>
  // Easter eggs: rotate the SSH "from <location>" and the key fingerprint
  // through a small pool of literary / developer in-jokes on each page load.
  (function () {
    var LOCATIONS = [
      '127.0.0.1',
      'milliways',
      'the shire',
      'magrathea',
      '42.42.42.42',
      'airstrip one',
      'rivendell',
      'the restaurant at the end of the universe',
      'sector zz9 plural z alpha',
      'mostly harmless',
      'tatooine',
      'oceania'
    ];
    var FINGERPRINTS = [
      'carrots-not-fast-not-funny-stay-the-course',
      'so-long-and-thanks-for-all-the-fish-42',
      'mostly-Harmless/dont-Panic/towel-CARROTS',
      'Not-All-Who-Wander-Are-Lost/Shire/42',
      'big-Brother-is-watching/community-Identity-Stability',
      'There-And-Back-Again/cd-Shire/42-carrots',
      'The-Cake-Is-A-Lie/42-Is-The-Answer'
    ];
    var loc = document.getElementById('ssh-login-from');
    if (loc) loc.textContent = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    var fp = document.getElementById('ssh-fingerprint');
    if (fp) fp.textContent = FINGERPRINTS[Math.floor(Math.random() * FINGERPRINTS.length)];
  })();
</script>
