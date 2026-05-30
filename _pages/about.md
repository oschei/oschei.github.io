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

{% include yaml-card.html %}

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
