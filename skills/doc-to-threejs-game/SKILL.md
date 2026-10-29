---
name: doc-to-threejs-game
description: Turn a document or presentation (PDF, DOCX, PPTX, markdown) into a beautiful, explorable three.js game delivered as a single HTML file. Use when the user asks to make a doc/deck/strategy/report into a game, 3D world, interactive journey or explorable experience.
---

# Document → three.js explorable game

Turn a document or slide deck into a single self-contained HTML file. The reader walks a small character through a 3D world, and every landmark opens a panel with the document's own words. The goal is a *beautiful* experience that stays faithful to the source. It should not be a tech demo.

Bundled with this skill: `scripts/`, a headless verification harness and build template (see sections 3 and 5).

## 0. Before building

Read the source in full.

- PDF: `pdftotext -layout file.pdf -`. Rasterise the diagram pages with `pdftoppm -r 60 -png` and view them, because diagrams often hold the visual language worth borrowing.
- PPTX/DOCX: extract the text (and slide images where possible) with the pptx/docx skills.
- The same file may be uploaded twice. Check the md5 hashes before treating copies as different documents.

Use AskUserQuestion only if the request lacks a structure to build around. If the user names one (for example "current state → road → end state"), proceed without asking.

## 1. Map content to a world (the most important step)

Find the document's spine, the 2–4 big sections a reader moves through. Common spines:

| Document shape | World metaphor |
|---|---|
| Current state → roadmap → target state | Village → winding road → city (Oz-style) |
| Problem → options → recommendation | Crossroads with branching paths that meet at a summit |
| Phases / timeline | River or railway with stations |
| Pillars / capabilities | Districts around a central plaza |
| Risks & mitigations | Fortress walls and gates |
| Deck with N slides | A gallery or island chain, one island per section |

Then map *every* content unit to a landmark with a beacon. Units include table rows, key findings, numbered steps, ideas and capabilities.

- **Make each landmark's form mean something.** Tools become signs around a lighthouse. Blockers become a striped barricade with labelled planks. People named in the text become small figures with name tags around a campfire. Agents become little robots. A pipeline becomes a conveyor with check gates.
- **Show certainty visually**, which is usually the most insightful touch. Things already known are solid, warm-lit buildings. Things partly known sit under scaffolding. Things "not yet discovered" are ghostly translucent wireframes in drifting mist, with floating "?" markers.
- **Ordered items** (next steps, milestones) become numbered milestone stones along the path (I, II, III…). Horizons such as Now/Next/Later become gates the path passes through.
- **Proposals and "ideas to explore"** get their own beacon colour.
- **Use one colour per zone** for the beacons, HUD accent and minimap. Change beacons to gold once visited.

Keep the document's wording in the panels, lightly trimmed. Do not invent facts, numbers, owners or commitments. Every caveat in the source ("illustrative only", "not agreed", "draft") must appear in the matching panel, on the title screen, and on any in-world sign showing that content.

## 2. Experience design checklist

- **Title screen:** eyebrow (org · doc title · status), big serif title, a one-line lede, the spine as chips (e.g. "1 Where are we now?"), a Begin button that stays disabled until the world is built, a controls row, and the caveat line. Make it semi-transparent with a slow cinematic camera orbit behind it.
- **Lighting arc:** change the environment with progress. Interpolate sky gradient, fog, sun colour/elevation, hemisphere light, exposure, bloom, stars, clouds and water between keyframes based on the player's position along the spine. A good arc runs morning → golden hour with a rainbow → starlit neon city. This arc does most of the emotional work.
- **Zone entry banner:** fades in once per zone with the section's question and a one-sentence summary from the doc.
- **Beacons:** additive light pillar, spinning gem, ground ring with a pulse, halo sprite. Show a proximity prompt ("E Explore *title*") and keep an invisible larger hit sphere for clicking.
- **Info card:** right-side glass panel with kicker, title, landmark name, status chip, body HTML, and Close plus "Next stop ›" buttons (the button names the next zone at boundaries), plus a "k / N" counter.
- **Navigation:** WASD relative to the camera, Shift to run, drag to orbit, wheel to zoom, click the ground to walk, click a beacon to auto-walk there.
  - **F** follows the path to the next unvisited stop and **B** goes back.
  - **J** opens a journal grouped by zone that fast-travels to any stop (fade to black, then teleport).
  - Clicking the minimap travels to a stop. **M** toggles sound, **?** shows help, **Esc** closes panels.
- **Companion** (a little dog, robot or bird) that follows the player, plus ambient life: birds, sparks, flickering fire, drifting motes, animated machinery.
- **Generative WebAudio:** a drone pad, wind noise, pentatonic notes whose scale changes per zone, and birdsong chirps in natural zones. Add chimes when a stop is visited, a fanfare on reaching the final zone, and soft footsteps. Start audio only after a user gesture.
- **Completion:** show a toast when a zone is finished. When everything has been visited, show a finale banner whose message comes from the doc's next steps, plus fireworks.
- **Floating labels:** canvas-texture sprites that fade by camera distance.

## 3. Architecture (single HTML, ES module)

Load three.js through an import map from unpkg (`three@0.160.0` with `three/addons/` for EffectComposer, RenderPass, UnrealBloomPass and OutputPass). Use a dynamic `await import('three')` inside try/catch so a CDN failure shows a friendly error screen. Bloom is optional: if its import fails, fall back to `renderer.render`.

Write the code in separate files and join them with a build script into one `<script type="module">` (`scripts/build_example.sh` is a template):

1. `a_head.html`: CSS, title, HUD, minimap canvas, prompt, card, banner, dock, journal, help, toast, fade and error overlays.
2. `b_data.js`: `ZONES` and `STOPS` content. Each stop has id, zone, kind, title, landmark, body HTML, plus layout hints.
3. `c_core.js`: renderer (ACES tone mapping, sRGB, PCF soft shadows, pixel ratio ≤ 1.75), seeded RNG, value-noise fbm, layout constants, path spline, terrain, sky shader, stars, clouds, lights, environment keyframes.
4. `d_helpers.js`: material/mesh helpers, labels, sign planes, ghostify, mist, beacons, `registerStop`, people, lanterns, cottages.
5. One file per zone.
6. `h_nature.js`: instanced vegetation and rocks via rejection scattering, birds, collider spatial grid.
7. `i_player.js`: character, companion, camera rig, movement, collision, route planning.
8. `j_ui.js`: audio, cards, journal, banners, finale, minimap.
9. `k_loop.js`: input, post-processing, `applyEnv`, main loop, start button.

Key techniques:

- **Path:** use Catmull-Rom through control points and resample by arc length into arrays (`RX, RZ, RTX, RTZ`). Provide `roadAt(u)` (position, tangent, normal) and `nearestRoad(x,z)` (coarse then fine search). The road is a ribbon mesh with a canvas brick texture and UVs along its arc length, plus raised kerb strips (include a ground-level edge vertex so the kerb isn't open). Roadside stops are placed with `roadside(u, side, offset)` and rotated to face the path.
- **Terrain:** a heightfield grid from fbm with mountains rising at the edges, multiplied by a *flat mask* that is zero near zone centres and along the road. Use vertex colours lerped by zone progress, rock/snow by height, and sand near the water. Expose `ground(x,z)` as a bilinear lookup. Add a water plane at a fixed height.
- **Sky:** a BackSide sphere with a ShaderMaterial (top/mid/bottom gradient plus sun glow). Use a normal `gl_Position`, *not* the `.xyww` trick, and include the `tonemapping_fragment` and `colorspace_fragment` chunks.
- **Vegetation:** use InstancedMesh with per-instance colour only where intended (pass a flag, or trunks get leaf colours). Keep things out of `keepClear` circles and off the path. Add colliders only for trees near the path.
- **Collisions:** circles `{x,z,r}` in an 8-unit spatial hash, resolved with iterative push-out. Blocks are walkable only above water and below a slope height.
- **Route planning:** if source and destination are in different regions, walk along the path's arc length in 3-unit steps. Around central obstacles, follow an arc of ring points. Add stuck detection: if the player isn't getting closer, skip the waypoint, and open the card anyway if within 8 units. Teleport with a fade when the trip is over 140 units.
- **Camera:** third person with yaw, pitch and distance, smoothed with an exponential lerp and clamped above the ground. While auto-walking it gently swings behind the player. Opening a card frames the landmark.
- **Labels:** canvas sprites with `depthTest:false`, `toneMapped:false` and `center(0.5,0)`.

## 4. Pitfalls already hit (avoid them)

- **Fonts:** canvas text renders before web fonts load. `await document.fonts.load(...)` for each face/weight, raced against a 2.5 s timeout, *before* building any canvas textures.
- **Metallic look:** with no environment map, `metalness > 0.4` turns gold and ruby nearly black. Keep metalness around 0.3 and add a little emissive.
- **Overlap:** after layout, check that no collider overlaps the path, that no landmarks overlap each other, and that every beacon sits in open, walkable ground.
- **Movement:** strafe is `right = (-fwdZ, fwdX)` where forward points from the camera toward the player. Test that W moves forward and A/D strafe the right way.
- **Labels:** sprite labels on everything turn into clutter. Use near/far fades (about 26/58 for landmarks, 12/26 for name tags).
- **Performance:** keep shadow casters under about 700 and meshes under about 2000, using instancing for anything repeated. Have the shadow camera follow the player (±55 units).
- **Audio:** WebAudio gain ramps need a `setValueAtTime` anchor first, and toggling should cancel scheduled values.

## 5. Verify (required)

Usually the sandbox can't reach the CDN and has no browser, so test headlessly with a stub THREE. Everything needed is in `scripts/`:

- `stub.mjs` is a minimal THREE replacement. It has a real `Vector3` and `Color` that throw on NaN or bad hex, and a renderer that asserts finite positions as it walks the scene. If your game uses a THREE feature the stub lacks, add a class for it. Unknown members are already harmless no-ops.
- `run.mjs` loads the game against the stub. Usage: `node scripts/run.mjs /path/to/all.js scripts/<test>.mjs`. `all.js` is the game's JS parts concatenated. It makes the bloom import throw, stubs `document` and `window`, and exposes `__step(n)` to advance frames.
  - **Edit the `G={...}` line it appends** so it exports your game's own names, such as the stops, player, UI state, colliders and travel functions. The bundled tests expect these names: `STOPS`, `P` (player), `UI`, `colliders`, `ORDERED`, `ground`, `nearestRoad`, `roadAt`, `ROAD_LEN`, `travelTo`, `keys`, `landmarkSpots`, `VC`, `CC`. Use them in your build or adapt the tests.
- `test_walk_all_stops.mjs` auto-walks to every stop in order and fails if any card never opens.
- `test_layout.mjs` reports colliders sitting on the path and overlapping landmarks.
- `test_teleport_and_keys.mjs` checks fast travel, WASD movement and keyboard shortcuts.

Also check that the final HTML's module script parses, and that every beacon has a position, sits on walkable ground and clears all colliders.

This harness proves the logic and catches NaNs and crashes. It cannot show how the game looks.

## 6. Delivering

- Save one file, `outputs/<slug>.html`, and delete the build folder and scratch images.
- Present the file and keep the message short: how to open it (a modern browser with internet, since three.js and fonts load from CDN), the zones and how content maps to landmarks, and the controls.
- Be honest about what was tested: if you couldn't look at it in a browser, say so plainly and name what to check on first run (frame rate, brightness and bloom in dark zones, label sizes). Offer to tune them.
