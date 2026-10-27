#!/usr/bin/env python3
"""Gera ZIP instalável de um sistema Foundry a partir da raiz do repositório."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED, ZipInfo
import argparse
import json
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
RUNTIME_DIRS = ("module", "styles", "templates", "assets", "lang", "macros")
RUNTIME_FILES = ("system.json", "brutal.mjs", "README.md")

def build(tag=None):
    manifest = json.loads((ROOT / "system.json").read_text(encoding="utf-8"))
    version = manifest["version"]
    expected_tag = f"v{version}"
    if tag and tag != expected_tag:
        raise ValueError(f"A tag {tag} não corresponde à versão {version} declarada no manifesto")
    filename = f"brutal-rpg-{expected_tag}.zip"
    if not manifest.get("download", "").endswith("/" + filename):
        raise ValueError("O campo download do manifesto não corresponde ao nome do ZIP")
    files = [ROOT / x for x in RUNTIME_FILES]
    for directory in RUNTIME_DIRS:
        files.extend(f for f in (ROOT / directory).rglob("*") if f.is_file())
    missing = [str(f.relative_to(ROOT)) for f in files if not f.exists()]
    if missing:
        raise FileNotFoundError(f"Arquivos obrigatórios ausentes: {missing}")
    out = ROOT / "dist"
    out.mkdir(exist_ok=True)
    target = out / filename
    with ZipFile(target, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for file in sorted(files, key=lambda x: x.as_posix()):
            name = file.relative_to(ROOT).as_posix()
            info = ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = (0o100644 << 16)
            archive.writestr(info, file.read_bytes(), compress_type=ZIP_DEFLATED, compresslevel=9)
    shutil.copy2(ROOT / "system.json", out / "system.json")
    with ZipFile(target) as z:
        if "system.json" not in z.namelist() or "brutal.mjs" not in z.namelist():
            raise RuntimeError("ZIP não contém arquivos fundamentais na raiz")
    print(target)
    return target

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--tag", default=None)
    args = parser.parse_args()
    try:
        build(args.tag)
    except Exception as err:
        print(f"Falha ao criar a Release: {err}", file=sys.stderr)
        sys.exit(1)
