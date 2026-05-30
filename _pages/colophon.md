---
permalink: /colophon/
title: About this site
description: Built with Jekyll on GitHub Pages. Tokyo Night, JetBrains Mono. Includes a11y statement.
term_title: "guest@oschei.com — man oschei — zsh"
---

<h1 class="visually-hidden">About this site</h1>

{% include prompt.html cmd="<span class='verb'>man</span> <span class='arg'>oschei</span>" %}

<div class="man-head"><span>OSCHEI(1)</span><span>USER COMMANDS</span><span>OSCHEI(1)</span></div>

<div class="man-section">NAME</div>
<div class="man-body">oschei.com — personal site</div>

<div class="man-section">DESCRIPTION</div>
<div class="man-body">A trail-terminal personal site for Oliver Scheiwiller. Mostly harmless.</div>

<div class="man-section">STACK</div>
<div class="man-body">
Jekyll · GitHub Pages · GoatCounter (cookie-less analytics).<br>
JetBrains Mono · Tokyo Night palette. Self-hosted fonts.<br>
Hand-written. No frameworks. No tracking cookies.
</div>

<div class="man-section">ACCESSIBILITY</div>
<div class="man-body">
Full keyboard navigation. WCAG AA+ color contrast across the palette.
Every command on this site is also a real <code>&lt;a href&gt;</code> link,
so screen readers, keyboard users, and search engines all see the same nav.
Reduced motion is honored. If something doesn't work for you, reach me
via any channel on <a class="inline-cmd" href="/contact/" data-cmd="ssh oliver"><code>ssh oliver</code></a>.
</div>

<div class="man-section">EASTER EGGS</div>
<div class="man-body">
Seven 🥕 scattered across canonical pages.
Type <button type="button" class="inline-cmd" data-cmd="--carrots"><code>--carrots</code></button> to
see your progress. Hidden commands:
<button type="button" class="inline-cmd" data-cmd="--panic"><code>--panic</code></button>,
<button type="button" class="inline-cmd" data-cmd="--soma"><code>--soma</code></button>,
<button type="button" class="inline-cmd" data-cmd="cd shire"><code>cd shire</code></button>.
{% include carrot.html page="colophon" %}

<p style="margin-top: 16px;">
  <button type="button" class="inline-cmd" data-cmd="--reveal"><code># i'm impatient, just reveal the carrots</code></button>
</p>
</div>

<div class="man-section">CREDITS</div>
<div class="man-body">
Source: <a href="{{ site.github_url }}/oschei.github.io">github.com/oschei/oschei.github.io</a>.
Fonts: JetBrains Mono (OFL).
Palette: Tokyo Night by enkia.
Built with coffee, Claude Code, and stubbornness.
</div>

<div class="man-section">SEE ALSO</div>
<div class="man-body">
<button type="button" class="inline-cmd" data-cmd="history"><code>history(1)</code></button>,
<button type="button" class="inline-cmd" data-cmd="--carrots"><code>--carrots(1)</code></button>,
<a class="inline-cmd" href="{{ site.strava_url }}" rel="external noopener"><code>strava(7)</code></a>,
<a class="inline-cmd" href="{{ site.goodreads_url }}" rel="external noopener"><code>goodreads(7)</code></a>
</div>
