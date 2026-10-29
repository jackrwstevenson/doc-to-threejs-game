#!/usr/bin/env python3
"""Validate every skill under skills/: frontmatter, name/folder match, script syntax."""
import pathlib, re, subprocess, sys

root = pathlib.Path(__file__).resolve().parent.parent
errors = []
skills = sorted(p for p in (root / "skills").iterdir() if p.is_dir())
if not skills:
    errors.append("no skills found under skills/")
for d in skills:
    md = d / "SKILL.md"
    if not md.exists():
        errors.append(f"{d.name}: missing SKILL.md"); continue
    m = re.match(r"---\n(.*?)\n---\n", md.read_text(), re.S)
    if not m:
        errors.append(f"{d.name}: SKILL.md has no YAML frontmatter"); continue
    fm = dict(re.findall(r"^(\w[\w-]*):\s*(.+)$", m.group(1), re.M))
    if fm.get("name") != d.name:
        errors.append(f"{d.name}: frontmatter name {fm.get('name')!r} != folder name")
    if len(fm.get("description", "")) < 40:
        errors.append(f"{d.name}: description missing or too short")
    for js in d.rglob("*.mjs"):
        r = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
        if r.returncode:
            errors.append(f"{js.relative_to(root)}: {r.stderr.strip()}")
    for sh in d.rglob("*.sh"):
        r = subprocess.run(["bash", "-n", str(sh)], capture_output=True, text=True)
        if r.returncode:
            errors.append(f"{sh.relative_to(root)}: {r.stderr.strip()}")
    # no stray references to files that do not exist
    for ref in set(re.findall(r"`((?:scripts|reference)/[\w./-]+)`", md.read_text())):
        if "*" not in ref and "<" not in ref and not (d / ref).exists():
            errors.append(f"{d.name}: SKILL.md references missing file {ref}")
if errors:
    print("\n".join("FAIL " + e for e in errors)); sys.exit(1)
print(f"OK: {len(skills)} skill(s) valid")
