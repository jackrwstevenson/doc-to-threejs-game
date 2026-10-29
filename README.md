# doc-to-threejs-game

An agent skill that turns a document or presentation into a beautiful, explorable **three.js game**, delivered as a single HTML file.

Give an agent a PDF, DOCX, PPTX or markdown file and ask for a game, 3D world or interactive journey. The skill guides it to:

1. Find the document's spine (for example current state → roadmap → target state).
2. Turn every content unit into a meaningful landmark with a beacon, using the document's own wording.
3. Build a world with a lighting arc, third-person exploration, auto-walk, journal, minimap and generative audio.
4. Test the result headlessly and report honestly what was and wasn't checked.

The output is one `.html` file. It runs in any modern browser with WebGL and an internet connection (three.js and fonts load from a CDN), and it needs no build step for the person opening it.

## Install

Pick the route that matches your tool.

**Claude Code, as a plugin** (recommended; updates with `/plugin update`):

```
/plugin marketplace add jackrwstevenson/doc-to-threejs-game
/plugin install doc-to-threejs-game@doc-to-threejs-game
```

**Claude Code, manually:**

```bash
git clone https://github.com/jackrwstevenson/doc-to-threejs-game.git
cp -r doc-to-threejs-game/skills/doc-to-threejs-game ~/.claude/skills/        # personal
# or: cp -r ... your-project/.claude/skills/                                   # one project
```

**Claude desktop app / Cowork:** download `doc-to-threejs-game.skill` from the [latest release](../../releases/latest), open it, and choose "Save skill".

**Other agents:** copy `skills/doc-to-threejs-game/` to wherever your agent loads skills from. `SKILL.md` is self-contained, and the scripts need only Node 18+.

## Use

Ask in plain language, for example:

> Use the doc-to-threejs-game skill to turn this strategy deck into an explorable 3D journey.

## Repository layout

```
.claude-plugin/
  plugin.json            plugin manifest
  marketplace.json       lets the repo act as its own marketplace
skills/
  doc-to-threejs-game/
    SKILL.md             the skill itself
    scripts/             headless test harness and build template (Node, no npm install)
tools/
  validate.py            checks frontmatter, script syntax and file references
  package.sh             builds dist/<skill>.skill
.github/workflows/
  ci.yml                 validate and package on every push and PR
  release.yml            attach the .skill file to a GitHub release on a v* tag
```

## Develop

```bash
python3 tools/validate.py   # lint the skill
./tools/package.sh          # build dist/doc-to-threejs-game.skill
```

To release, bump the version in both files in `.claude-plugin/`, then `git tag v1.0.1 && git push --tags`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Please keep confidential or real-document content out of the repo.

## Licence

[MIT](LICENSE)
