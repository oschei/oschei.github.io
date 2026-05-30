---
permalink: /projects/
title: "Projects · Oliver Scheiwiller"
description: Selected projects — what I've built and shipped.
term_title: "guest@oschei.com — ~/projects — zsh"
---

{% include prompt.html path="~" cmd="<span class='verb'>ls</span> <span class='flag'>-lh</span> <span class='arg'>projects/</span>" %}

<div class="ls-header">total {{ site.projects | size }} — newest first &nbsp;·&nbsp; click to enter</div>

{% assign sorted = site.projects | sort: "date" | reverse %}
{% for p in sorted %}
<a href="{{ p.url | relative_url }}" class="ls-row">
  <span class="perms">drwxr-xr-x</span>
  <span class="size">{{ p.weight | default: "1.0K" }}</span>
  <span class="date">{{ p.date | date: "%b %d %Y" | downcase }}</span>
  <span class="name">{{ p.slug }}/</span>
  <span class="gloss">{{ p.gloss }}</span>
</a>
{% endfor %}
