#!/usr/bin/env python3
"""Safely compile ModForge Java source into one Minecraft JAR."""
import base64, gzip, json, os, re, shutil, subprocess, sys, tempfile, urllib.parse, urllib.request
from pathlib import Path

run_id = re.sub(r"[^0-9]", "", os.environ.get("GITHUB_RUN_ID", "local")) or "local"
work = Path(tempfile.gettempdir()) / ("modforge-build-" + run_id)
resource_ext = {".json", ".yml", ".yaml", ".txt", ".properties", ".lang", ".toml", ".mcmeta", ".xml"}

def fail(message):
    print("::error title=ModForge Build::" + str(message).replace("\n", " ")[:350])
    raise SystemExit(1)

def get_payload():
    encoded = os.environ.get("MODFORGE_PAYLOAD", "").strip()
    if not encoded or len(encoded) > 65535:
        fail("Build-Daten fehlen oder sind zu groß. Kürze die Idee.")
    try:
        raw = gzip.decompress(base64.b64decode(encoded, validate=True))
        if len(raw) > 2_000_000:
            fail("Das generierte Projekt ist zu groß.")
        data = json.loads(raw.decode("utf-8"))
    except SystemExit:
        raise
    except Exception:
        fail("Die übertragenen Projektdaten sind ungültig.")
    if not isinstance(data, dict) or not isinstance(data.get("config"), dict) or not isinstance(data.get("files"), dict):
        fail("Ungültiges Projektformat.")
    return data

def mc_tuple(value):
    if not isinstance(value, str) or not re.fullmatch(r"\d+\.\d+(?:\.\d+)?", value):
        fail("Bitte eine konkrete Minecraft-Version wie 1.21.11 oder 26.2 auswählen.")
    p = [int(x) for x in value.split(".")]
    return (p[0], p[1], p[2] if len(p) > 2 else 0)

def target_java(v):
    if v[0] >= 26:
        return 25
    if v >= (1, 20, 5):
        return 21
    if v >= (1, 18, 0):
        return 17
    return 8

def slug(value):
    value = re.sub(r"[^a-z0-9_-]+", "-", str(value or "").lower()).strip("-")[:48] or "minecraft-project"
    return value if value[0].isalpha() else "project-" + value

def short(value, limit, fallback):
    value = re.sub(r"[\r\n\x00]", " ", str(value or fallback)).strip()
    return (value or fallback)[:limit]

def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent":"ModForgeAI/1.0", "Accept":"application/json"})
    try:
        with urllib.request.urlopen(req, timeout=25) as res:
            return json.loads(res.read().decode("utf-8"))
    except Exception:
        return None

def loader_version(mc):
    rows = get_json("https://meta.fabricmc.net/v2/versions/loader/" + urllib.parse.quote(mc, safe="."))
    if isinstance(rows, list):
        for row in rows:
            v = row.get("loader", {})
            if v.get("stable") and v.get("version"):
                return str(v["version"])
        if rows and rows[0].get("loader", {}).get("version"):
            return str(rows[0]["loader"]["version"])
    fail("Fabric hat keine passende Loader-Version für Minecraft " + mc + ".")

def yarn_version(mc):
    rows = get_json("https://meta.fabricmc.net/v2/versions/yarn/" + urllib.parse.quote(mc, safe="."))
    if isinstance(rows, list):
        for row in rows:
            if row.get("stable") and row.get("version"):
                return str(row["version"])
    return None

def api_version(mc):
    params = urllib.parse.urlencode({"game_versions":json.dumps([mc]), "loaders":json.dumps(["fabric"])})
    rows = get_json("https://api.modrinth.com/v2/project/fabric-api/version?" + params)
    if isinstance(rows, list):
        for row in rows:
            if mc in row.get("game_versions", []) and row.get("version_number"):
                return str(row["version_number"])
    return None

def collect_files(raw_files, default_pkg):
    if len(raw_files) > 60:
        fail("Zu viele generierte Dateien. Kürze die Idee.")
    total, result = 0, {}
    for raw_path, content in raw_files.items():
        if not isinstance(raw_path, str) or not isinstance(content, str):
            continue
        path = raw_path.replace("\\", "/").lstrip("/")
        if not path or ":" in path or any(p in ("", ".", "..") for p in path.split("/")):
            continue
        total += len(content)
        if len(content) > 180000 or total > 400000:
            fail("Der generierte Quellcode ist zu groß. Kürze die Idee.")
        if path.endswith(".java"):
            match = re.search(r"(?m)^\s*package\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*;", content)
            pkg = match.group(1) if match else default_pkg
            if not all(re.fullmatch(r"[A-Za-z_$][\w$]*", part) for part in pkg.split(".")):
                fail("Eine Java-Datei enthält einen ungültigen Package-Namen.")
            if not match:
                content = "package " + pkg + ";\n\n" + content
            output_path = "src/main/java/" + pkg.replace(".", "/") + "/" + Path(path).name
        elif path.startswith("src/main/resources/") and Path(path).suffix.lower() in resource_ext:
            rel = path[len("src/main/resources/"):]
            if not rel or rel in ("plugin.yml", "fabric.mod.json"):
                continue
            output_path = "src/main/resources/" + rel
        else:
            continue
        if output_path in result:
            fail("Zwei generierte Dateien haben denselben Pfad.")
        result[output_path] = content
    if not any(p.endswith(".java") and p.startswith("src/main/java/") for p in result):
        fail("Die KI hat keine Java-Datei geliefert. Kürze die Idee oder wechsle das Modell.")
    return result

def write(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")

def main_class(files, kind):
    for path, content in files.items():
        if not path.endswith(".java"):
            continue
        pm = re.search(r"(?m)^\s*package\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*;", content)
        pkg = pm.group(1) if pm else ""
        if kind == "plugin":
            pattern = r"\bclass\s+([A-Za-z_$][\w$]*)\b[^{};]*?\bextends\s+([A-Za-z_$][\w$.]*)"
            for m in re.finditer(pattern, content):
                if m.group(2).split(".")[-1] == "JavaPlugin":
                    return (pkg + "." if pkg else "") + m.group(1)
        else:
            pattern = r"\bclass\s+([A-Za-z_$][\w$]*)\b[^{}]*?\bimplements\b([^{}]+)"
            for m in re.finditer(pattern, content):
                if re.search(r"\bModInitializer\b", m.group(2)):
                    return (pkg + "." if pkg else "") + m.group(1)
    if kind == "plugin":
        fail("Die Hauptklasse muss von JavaPlugin erben, damit Paper sie starten kann.")
    fail("Die Hauptklasse muss ModInitializer implementieren, damit Fabric sie starten kann.")

def prepare():
    data = get_payload()
    c, raw_files = data["config"], data["files"]
    kind, platform = str(c.get("kind", "")), str(c.get("platform", ""))
    mc = short(c.get("version"), 20, "")
    v = mc_tuple(mc)
    if not ((kind == "plugin" and platform == "paper") or (kind == "mod" and platform == "fabric")):
        fail("Unterstützt werden Paper-Plugins und Fabric-Mods.")
    project_id = slug(c.get("id"))
    if kind == "mod" and not re.fullmatch(r"[a-z][a-z0-9_-]{0,63}", project_id):
        fail("Die Fabric-Mod-ID muss mit einem Kleinbuchstaben beginnen.")
    name = short(c.get("name"), 48, project_id)
    desc = short(c.get("desc"), 180, "Minecraft-Projekt")
    pkg = str(c.get("pkg") or "com.example.project").strip()
    if not re.fullmatch(r"[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*", pkg):
        pkg = "com.example.project"
    files = collect_files(raw_files, pkg)
    entrypoint = main_class(files, kind)
    if work.exists():
        shutil.rmtree(work)
    work.mkdir(parents=True)
    for rel, content in files.items():
        write(work / rel, content)
    release = target_java(v)
    # Loom 1.16 requires Java 25 to run; `release` still controls the bytecode target for the selected Minecraft version.
    runner = 25 if kind == "mod" or v[0] >= 26 else 21

    if kind == "plugin":
        api = (mc + ".build.+") if v[0] >= 26 else (mc + "-R0.1-SNAPSHOT")
        qname = name.replace("\\", "\\\\").replace('"', '\\"')
        qdesc = desc.replace("\\", "\\\\").replace('"', '\\"')
        commands = set()
        permissions = set()
        for content in files.values():
            commands.update(re.findall(r"""getCommand\s*\(\s*["']([a-zA-Z0-9_-]+)["']\s*\)""", content))
            permissions.update(re.findall(r"""hasPermission\s*\(\s*["']([a-zA-Z0-9_.-]+)["']\s*\)""", content))
            permissions.update(re.findall(r"""allowed\s*\(\s*\w+\s*,\s*["']([a-zA-Z0-9_.-]+)["']\s*\)""", content))
        if not commands:
            commands.add(project_id)
        lines = ['name: "' + qname + '"', 'version: "1.0.0"', "main: " + entrypoint]
        if v >= (1, 13, 0):
            lines.append('api-version: "' + str(v[0]) + "." + str(v[1]) + '"')
        lines += ['description: "' + qdesc + '"', "commands:"]
        for command in sorted(commands):
            command = slug(command)
            lines += ["  " + command + ":", '    description: "Generated command"', "    usage: /" + command]
        if permissions:
            lines.append("permissions:")
            for permission in sorted(permissions):
                default = "op" if permission.endswith(".admin") or ".bypass." in permission or permission.endswith(".multiple") else "true"
                lines += ["  " + permission + ":", '    description: "Generated permission"', '    default: "' + default + '"']
        write(work / "src/main/resources/plugin.yml", "\n".join(lines) + "\n")
        gradle = """plugins {
    id 'java'
}
group = '%s'
version = '1.0.0'
base { archivesName = '%s' }
repositories {
    mavenCentral()
    maven { url = 'https://repo.papermc.io/repository/maven-public/' }
}
dependencies {
    compileOnly 'io.papermc.paper:paper-api:%s'
}
java {
    toolchain { languageVersion = JavaLanguageVersion.of(%d) }
}
tasks.withType(JavaCompile).configureEach {
    options.encoding = 'UTF-8'
    options.release = %d
}
""" % (pkg, project_id, api, runner, release)
        write(work / "build.gradle", gradle)
        write(work / "settings.gradle", "rootProject.name = '" + project_id + "'\n")
    else:
        loader = loader_version(mc)
        modern = v[0] >= 26
        yarn = None if modern else yarn_version(mc)
        if not modern and not yarn:
            fail("Fabric-Mappings für Minecraft " + mc + " sind nicht verfügbar.")
        fabric_api = api_version(mc)
        if not fabric_api and any("net.fabricmc.fabric.api" in f for f in files.values()):
            fail("Für Minecraft " + mc + " wurde keine kompatible Fabric API gefunden.")
        metadata = {"schemaVersion":1, "id":project_id, "version":"1.0.0", "name":name, "description":desc, "environment":"*", "entrypoints":{"main":[entrypoint]}, "depends":{"fabricloader":">="+loader, "minecraft":mc, "java":">="+str(release)}}
        if fabric_api:
            metadata["depends"]["fabric-api"] = "*"
        write(work / "src/main/resources/fabric.mod.json", json.dumps(metadata, ensure_ascii=False, indent=2) + "\n")
        if modern:
            loom_id = "net.fabricmc.fabric-loom"
            deps = ['minecraft "com.mojang:minecraft:${mc_version}"', 'implementation "net.fabricmc:fabric-loader:${loader_version}"']
            if fabric_api:
                deps.append('implementation "net.fabricmc.fabric-api:fabric-api:${fabric_api_version}"')
        else:
            loom_id = "net.fabricmc.fabric-loom-remap"
            deps = ['minecraft "com.mojang:minecraft:${mc_version}"', 'mappings "net.fabricmc:yarn:${yarn_mappings}:v2"', 'modImplementation "net.fabricmc:fabric-loader:${loader_version}"']
            if fabric_api:
                deps.append('modImplementation "net.fabricmc.fabric-api:fabric-api:${fabric_api_version}"')
        settings = """pluginManagement {
    repositories {
        maven { url = 'https://maven.fabricmc.net/' }
        gradlePluginPortal()
        mavenCentral()
    }
}
rootProject.name = '%s'
""" % project_id
        write(work / "settings.gradle", settings)
        properties = "org.gradle.jvmargs=-Xmx3G\norg.gradle.parallel=true\nmc_version=" + mc + "\nloader_version=" + loader + "\n"
        if yarn:
            properties += "yarn_mappings=" + yarn + "\n"
        if fabric_api:
            properties += "fabric_api_version=" + fabric_api + "\n"
        write(work / "gradle.properties", properties)
        gradle = """plugins {
    id '%s' version '1.16-SNAPSHOT'
}
version = '1.0.0'
group = '%s'
base { archivesName = '%s' }
repositories {
    maven { url = 'https://maven.fabricmc.net/' }
    mavenCentral()
}
dependencies {
    %s
}
java {
    toolchain { languageVersion = JavaLanguageVersion.of(%d) }
}
tasks.withType(JavaCompile).configureEach {
    options.encoding = 'UTF-8'
    options.release = %d
}
""" % (loom_id, pkg, project_id, "\n    ".join(deps), runner, release)
        write(work / "build.gradle", gradle)
    output = os.environ.get("GITHUB_OUTPUT")
    if output:
        with open(output, "a", encoding="utf-8") as f:
            f.write("java=" + str(runner) + "\n")
    print("Projekt vorbereitet: " + ("Paper-Plugin" if kind == "plugin" else "Fabric-Mod") + ".")
    
def build():
    if not (work / "build.gradle").is_file():
        fail("Die Projektvorbereitung fehlt. Starte den Build erneut.")
    try:
        res = subprocess.run(["gradle", "--no-daemon", "--console=plain", "build"], cwd=work, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=570)
    except subprocess.TimeoutExpired:
        fail("Der Build hat das Zeitlimit überschritten.")
    except Exception:
        fail("Gradle konnte nicht gestartet werden.")
    if res.returncode:
        out = res.stdout or ""
        if "Could not find" in out or "Could not resolve" in out or "Could not GET" in out or "was not found" in out:
            patterns = re.compile(r"(Could not find|Could not GET|Could not download|Plugin .* was not found|No matching variant|Received status code|Resource missing|failed to resolve)", re.I)
            details = []
            for line in out.splitlines():
                item = line.strip()
                if not item or not patterns.search(item):
                    continue
                # Keep dependency coordinates and high-level URLs, never source or arbitrary build output.
                item = re.sub(r"(https?://[^\\s)]+)", lambda m: re.sub(r"[?#].*$", "", m.group(1)), item)
                item = re.sub(r"(?i)(token|password|secret|authorization)=\\S+", r"\\1=[redacted]", item)
                item = item[:220]
                if item not in details:
                    details.append(item)
            suffix = " Builddiagnose: " + " | ".join(details[-5:]) if details else ""
            fail("Eine Minecraft-, Fabric- oder Paper-Abhängigkeit konnte nicht geladen werden. Prüfe die Version." + suffix)
        if "cannot find symbol" in out or (" does not exist" in out and "package " in out):
            fail("Der Java-Code passt nicht zur ausgewählten Minecraft-API. Ändere die Idee oder generiere den Code neu.")
        fail("Die Kompilierung ist fehlgeschlagen. Java-Code oder API-Version ist inkompatibel. Quellcode wird nicht in Build-Logs ausgegeben.")
    data = get_payload()
    kind = data["config"].get("kind")
    jars = [p for p in (work / "build/libs").glob("*.jar") if not p.name.endswith(("-dev.jar", "-sources.jar", "-javadoc.jar"))]
    if not jars:
        fail("Gradle hat keine auslieferbare JAR erstellt.")
    jars.sort(key=lambda p:(len(p.name), p.name))
    jar = jars[0]
    try:
        import zipfile
        with zipfile.ZipFile(jar) as z:
            members = set(z.namelist())
            required = "plugin.yml" if kind == "plugin" else "fabric.mod.json"
            if required not in members:
                fail("Die JAR enthält keine gültigen Minecraft-Metadaten.")

            metadata_text = z.read(required).decode("utf-8")
            if kind == "plugin":
                match = re.search(r"(?m)^main:\s*['\"]?([A-Za-z_$][A-Za-z0-9_$.]*)['\"]?\s*$", metadata_text)
                if not match:
                    fail("plugin.yml enthält keine gültige Hauptklasse.")
                entrypoint = match.group(1)
                command_names = set()
                for source in (work / "src/main/java").rglob("*.java"):
                    code = source.read_text(encoding="utf-8")
                    command_names.update(re.findall(r"""getCommand\s*\(\s*["']([a-zA-Z0-9_-]+)["']\s*\)""", code))
                if not command_names:
                    command_names.add(slug(data["config"].get("id")))
                lines = metadata_text.splitlines()
                commands_index = next((i for i, line in enumerate(lines) if re.fullmatch(r"commands:\s*", line)), None)
                declared = set()
                if commands_index is not None:
                    for line in lines[commands_index + 1:]:
                        if line and not line[0].isspace():
                            break
                        command_match = re.match(r"^  ([a-z0-9_-]+):\s*$", line)
                        if command_match:
                            declared.add(command_match.group(1))
                missing = sorted(command_names - declared)
                if missing:
                    fail("plugin.yml fehlen registrierte Befehle: " + ", ".join(missing[:8]))
            else:
                try:
                    metadata = json.loads(metadata_text)
                    main_entries = metadata.get("entrypoints", {}).get("main", [])
                    if isinstance(main_entries, str):
                        main_entries = [main_entries]
                    if not isinstance(main_entries, list) or not main_entries or not all(isinstance(item, str) for item in main_entries):
                        fail("fabric.mod.json enthält keinen gültigen Main-Entrypoint.")
                    entrypoint = main_entries[0]
                except SystemExit:
                    raise
                except Exception:
                    fail("fabric.mod.json ist kein gültiges JSON.")

            compiled_entrypoint = entrypoint.replace(".", "/") + ".class"
            if compiled_entrypoint not in members:
                fail("Die JAR enthält keine kompilierte Hauptklasse: " + entrypoint)
    except SystemExit:
        raise
    except Exception:
        fail("Die erzeugte Datei ist keine gültige oder vollständig geprüfte JAR.")
    dist = Path(os.environ.get("GITHUB_WORKSPACE", str(work.parent))) / "dist"
    if dist.exists():
        shutil.rmtree(dist)
    dist.mkdir(parents=True, exist_ok=True)
    shutil.copy2(jar, dist / (slug(data["config"].get("id")) + ".jar"))
    print("JAR erfolgreich erstellt. Nur die fertige JAR wird als Artifact veröffentlicht.")

if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in ("prepare", "build"):
        fail("Ungültiger interner Build-Schritt.")
    prepare() if sys.argv[1] == "prepare" else build()
