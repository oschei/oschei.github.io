---
permalink: /contact/
title: "Contact · Oliver Scheiwiller"
description: Email, LinkedIn, GitHub, Strava, Goodreads.
term_title: "guest@oschei.com — ssh oliver — zsh"
---

{% include prompt.html cmd="<span class='verb'>ssh</span> <span class='arg'>oliver</span>" %}

<div class="ssh-line">The authenticity of host 'oliver (oschei.com)' can't be established.</div>
<div class="ssh-line">ED25519 key fingerprint: SHA256:carrots–not–fast–not–funny–stay–the–course=</div>
<div class="ssh-line warn">Are you sure you want to continue connecting (yes/no)? <span style="color:var(--success)">yes</span></div>
<div class="ssh-line ok">Connection to oliver.oschei.com established.</div>
<div class="ssh-line">Last login: {{ site.time | date: '%a %d %b %Y' }} from anywhere</div>

<div class="ssh-welcome">Welcome.</div>

<div class="ssh-list">
  <div class="row"><span class="k">email</span><span class="v"><a href="mailto:oliver@oschei.com">oliver@oschei.com</a></span></div>
  <div class="row"><span class="k">linkedin</span><span class="v"><a href="{{ site.linkedin_url }}" rel="me">in/oschei</a></span></div>
  <div class="row"><span class="k">github</span><span class="v"><a href="{{ site.github_url }}" rel="me">@oschei</a></span></div>
  <div class="row"><span class="k">strava</span><span class="v"><a href="{{ site.strava_url }}" rel="me">strava ↗</a></span></div>
  <div class="row"><span class="k">goodreads</span><span class="v"><a href="{{ site.goodreads_url }}" rel="me">goodreads ↗</a></span></div>
  {% if site.calendly_url and site.calendly_url != "" and site.calendly_url contains "calendly" %}
  <div class="row"><span class="k">chat</span><span class="v"><a href="{{ site.calendly_url }}" rel="external">book time ↗</a><span class="optional">— optional</span></span></div>
  {% endif %}
</div>

<div class="ssh-logout">
  <div class="ssh-line">logout</div>
  <div class="ssh-line">Connection to oliver closed.</div>
  <div class="farewell">so long, and thanks for all the fish. <span class="carrot-placeholder" data-page="contact">🥕</span></div>
</div>
