# Strava → oschei.github.io · producer spec

This document tells a coding agent in your separate Strava project how
to publish your latest run to **oschei.com**. The site rebuilds itself
automatically once you push.

---

## Goal

Write a single JSON file describing your latest Strava run, commit it
to the personal-site repo on the `master` branch, and push. GitHub Pages
will rebuild the site (~30s) and the home page's "latest run" block
will reflect the new data.

---

## Target

| | |
|---|---|
| Repo | `git@github.com:oschei/oschei.github.io.git` |
| Branch | **`master`** (this is the only branch GitHub Pages builds from for this repo) |
| File path | `_data/latest_run.json` |
| Trigger | Your choice — cron, post-activity webhook, or Strava polling. After a typical run, the JSON should land within a few minutes. |
| Effect | Any commit pushed to `master` triggers a GitHub Pages rebuild. No further action needed. |

> **Important:** This repo uses `master` (the legacy default), not `main`.
> GitHub Pages rebuilds *only on push to `master`*. Pushing to any other
> branch (including `main`) deploys nothing. Make sure your push command
> targets `master` explicitly: `git push origin HEAD:master`.

---

## JSON shape

`_data/latest_run.json`:

```json
{
  "schema_version": 1,
  "generated_at": "2026-05-24T08:42:00Z",
  "activity": {
    "id": "14258372165",
    "url": "https://www.strava.com/activities/14258372165",
    "date_label": "sat 24 may",
    "description": "Some humid loop around the hills. Legs felt like sand by km 15.",
    "distance_km": 21.2,
    "duration_human": "1h 54",
    "pace_human": "5:23/km",
    "elevation_gain_m": 412,
    "ascii_map": "●━━━╮          ╭━━━━╮\n    ╰━━━━━━━━━━╯    ╰━━━╮\n                        ╰━━━╮\n                            ╰━━━●"
  }
}
```

### Field rules

| field | type | rule |
|---|---|---|
| `schema_version` | int | Always `1` until a breaking change. |
| `generated_at` | ISO 8601 UTC | Timestamp of when *your job* ran (not the run itself). Used by the site to flag stale data (>30 days). |
| `activity.id` | string | Strava activity ID. |
| `activity.url` | string | Direct link to the activity on strava.com. Target of the site's `↗ open in strava` link. |
| `activity.date_label` | string | Pre-formatted, lowercase, English weekday + day + month. Examples: `"sat 24 may"`, `"tue 28 jan"`. No year. Source: Strava `start_date_local`. |
| `activity.description` | string | Pulled from the Strava activity's description field. Trim to **~240 chars** max; the site won't truncate. Plain text only. Empty string or `null` = caption omitted gracefully. |
| `activity.distance_km` | number | One decimal place. Source: `distance` (meters) / 1000. |
| `activity.duration_human` | string | `"Xh YY"` when ≥ 1 hour, else `"YYm SS"`. Source: `moving_time` (seconds). |
| `activity.pace_human` | string | Always `"M:SS/km"`. Source: `moving_time / distance_km`, then format as M:SS. |
| `activity.elevation_gain_m` | int | Whole meters. Source: `total_elevation_gain`. Send `0` if missing. |
| `activity.ascii_map` | string | Pre-rendered route as unicode box characters. Newlines as `\n` in JSON. **Max ~50 chars wide × ~10 lines tall.** See ASCII map section below. |

---

## ASCII map generation

The site renders the `ascii_map` string verbatim inside `<pre>`. Producer does
all the work.

### Approach

1. **Decode the polyline.** Strava's API returns `map.summary_polyline`
   (Google encoded polyline format) on every activity. Decode to a list
   of `(lat, lng)` points.
2. **Project to a character grid.** Pick a grid (e.g. 44 cols × 7 rows).
   Normalize coordinates to grid space; round to integer cells.
3. **Walk the path.** For each cell on the path, look at the previous
   and next cells to pick a box-drawing character based on direction:
   - Horizontal: `━`
   - Vertical: `│`
   - Corners: `╮ ╯ ╰ ╭` (and double-line variants if you want emphasis)
   - The first point: `●` (rendered green by CSS via search/replace at render time)
   - The last point: `●` (rendered orange by CSS — but since both are the same character, CSS targets first/last `●` occurrence)
4. **Join rows with `\n`.** Trim trailing whitespace from each row to keep
   the JSON compact.

### Character palette

```
━ │ ╮ ╯ ╰ ╭ ┓ ┛ ┗ ┏ ─ ┃
●
```

Avoid double-line characters (`═ ║`) — they don't render consistently in
all monospace fonts.

### Width discipline

- Desktop comfortably shows ~50 chars wide.
- Mobile narrows to ~30. Anything wider scrolls horizontally inside `<pre>`.
- For mobile-readable maps, target ~40 chars wide.

---

## Description handling

Producer responsibilities:

- Pull `activity.description` from the Strava API.
- If `null`, empty, or only whitespace → emit `""` (or omit the field).
- If longer than 240 chars → truncate at the last sentence boundary
  before 240, then append `…`. Strava's UI shows the full text one
  click away.
- Do not transform the text otherwise. The site escapes HTML on render.

---

## Date label formatting

Use Strava's `start_date_local` (an ISO string in the athlete's TZ).

```python
# Python example
from datetime import datetime
d = datetime.fromisoformat(activity["start_date_local"].replace("Z", ""))
date_label = d.strftime("%a %-d %b").lower()   # → "sat 24 may"
```

Notes:
- Lowercase the whole thing.
- No leading zero on the day (`%-d` on Linux/macOS; on Windows use `%#d`).
- No year (the `generated_at` timestamp captures freshness for staleness checks).

---

## Authentication & push

You have two reasonable options:

### Option A · fine-grained Personal Access Token (recommended)

1. On GitHub: create a fine-grained PAT scoped to **only the
   `oschei/oschei.github.io` repo**, with `Contents: read and write`.
2. Store the PAT as a secret in your Strava-producer project's CI
   (e.g. `OSCHEI_SITE_PAT`).
3. In the job:

```bash
git clone "https://x-access-token:${OSCHEI_SITE_PAT}@github.com/oschei/oschei.github.io.git" site
cd site
mkdir -p _data
cp /tmp/latest_run.json _data/latest_run.json
git config user.name  "Strava bot"
git config user.email "strava-bot@oschei.com"
git add _data/latest_run.json
git diff --quiet --cached && echo "No changes." && exit 0
git commit -m "chore(strava): update latest run"
git push origin master
```

### Option B · deploy key

1. Generate an SSH key pair, add the **public** key to
   `oschei/oschei.github.io` as a deploy key with write access.
2. Store the **private** key as a secret in your Strava project's CI.
3. Same `git` flow as above but cloning via SSH.

Either works. Option A is easier to rotate.

---

## Idempotency

Don't push when the JSON content hasn't changed. The pattern in the
shell snippet above (`git diff --quiet --cached`) handles this — if there's
nothing to commit, the job exits cleanly with no rebuild triggered.

This matters because each push causes a GitHub Pages rebuild, which
takes ~30s and counts against monthly build minutes (generous for
public repos but not infinite).

---

## What NOT to do

- ❌ Don't modify any file other than `_data/latest_run.json`.
- ❌ Don't push to any branch other than `master` (no rebuild trigger).
- ❌ Don't include Strava OAuth tokens or any other secrets in the JSON.
- ❌ Don't add markdown or HTML to the `description` — plain text only.
- ❌ Don't render the ASCII map wider than ~50 chars (mobile layout breaks).

## What's OK

- ✅ Multiple pushes per day if the data legitimately changes.
- ✅ Adding fields you'd like to use later — the site will ignore unknown
  keys (just bump `schema_version` when adding required ones).
- ✅ Pushing a JSON with `"activity": null` if you have no recent run to
  feature — the site silently hides the block.
- ✅ Manual one-off edits to the JSON in the GitHub UI for testing.

---

## Test

1. Write a stub JSON matching the shape above (use real-ish numbers).
2. `git commit && git push origin master`.
3. Watch the GitHub Pages build at
   `https://github.com/oschei/oschei.github.io/actions` — should
   complete in ~30s.
4. Open `https://oschei.com/about` — the "latest run" block should
   show your stub data.

If it doesn't appear: check that `_data/latest_run.json` is valid JSON
(`jq . _data/latest_run.json`), that the file is on `master`, and that
the GitHub Pages build succeeded.
