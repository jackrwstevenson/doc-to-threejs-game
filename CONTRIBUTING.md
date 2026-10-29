# Contributing

- Skills live in `skills/<name>/` with a `SKILL.md` whose frontmatter `name` matches the folder.
- Run `python3 tools/validate.py` before opening a PR (CI runs it too).
- **Never commit material from a real document** (names, company details, screenshots, generated games built from confidential sources). Examples must use fictional or public content.
- Lessons learned from building a game (new pitfalls, better techniques) belong in `SKILL.md` section 4, with the symptom and the fix.
- To release: bump `version` in `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`, then tag `vX.Y.Z`. The release workflow attaches the `.skill` file.
