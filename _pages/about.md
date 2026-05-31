---
permalink: /about/
title: Oliver Scheiwiller
description: Runner and enterprise architect. Currently at Scandit, in Zürich.
term_title: "guest@oschei.com — ~ — zsh"
redirect_from:
  - /
  - /index.html
---

{% include history.html %}

{% include prompt.html cmd="<span class='verb'>cat</span> <span class='arg'>about.md</span>" %}

<div class="yaml-card" role="presentation" aria-label="Profile data card">
  <div class="yaml-card__delim" aria-hidden="true">---</div>
  <dl class="yaml-card__data">
    <dt>runs</dt><dd>marathons and half-marathons</dd>
    <dt>works</dt><dd>Enterprise Architect at <a href="https://www.scandit.com/" rel="external noopener">Scandit</a></dd>
    <dt>worked</dt><dd><a href="https://www.deloitte.com/ch/en/services/consulting/services/technology-strategy-and-transformation.html" rel="external noopener">Deloitte</a>, <a href="https://www.bridgewater.com/" rel="external noopener">Bridgewater</a>, <a href="https://www.ibm.com/cloud/object-storage" rel="external noopener">IBM</a>, <a href="https://www.onsemi.com/" rel="external noopener">onsemi</a>, <a href="https://www.stadt-zuerich.ch/de/politik-und-verwaltung/stadtverwaltung/fd/oiz.html" rel="external noopener">OIZ</a></dd>
    <dt>interests</dt><dd>human-computer interaction, ethics in computing, accessibility, technology-assisted learning</dd>
    <dt>tinkers</dt><dd>coffee, Claude Code</dd>
    <dt>reads</dt><dd>Orwell, Huxley, Adams, Tolkien <a href="{{ site.goodreads_url }}" rel="me">→ goodreads</a></dd>
    <dt>based</dt><dd>Zürich, Switzerland</dd>
  </dl>
  <div class="yaml-card__delim" aria-hidden="true">---</div>
</div>

# Oliver Scheiwiller

<p>The rest of my resume lives in <a class="inline-cmd" href="/experience/" data-cmd="git log experience"><code>git log experience</code></a>. Off the clock, I try and run far.</p>

{% include run-block.html %}

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Oliver Scheiwiller",
  "url": "{{ site.url }}",
  "image": "{{ site.url }}/assets/img/oschei.jpg",
  "jobTitle": "Enterprise Architect",
  "worksFor": { "@type": "Organization", "name": "Scandit" },
  "address": { "@type": "PostalAddress", "addressLocality": "Zürich", "addressCountry": "CH" },
  "sameAs": [
    "{{ site.linkedin_url }}",
    "{{ site.github_url }}",
    "{{ site.strava_url }}",
    "{{ site.goodreads_url }}"
  ]
}
</script>
