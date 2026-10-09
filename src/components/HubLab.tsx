import { useEffect, useMemo, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import {
  ArrowRight, ArrowUpRight, Blocks, Bookmark, Check, ChevronRight, CircleCheck,
  Clock3, Copy, Download, ExternalLink, FileJson, Heart, History,
  Lightbulb, ListChecks, Palette, Play, Plus, RefreshCw, RotateCcw,
  Save, Search, Shuffle, Sparkles, Target, Timer, Trash2, Trophy,
  Users, Video, WandSparkles, X,
} from "lucide-react";

export type HubCreator = {
  name: string;
  channel: string;
  initials: string;
  seasons: string;
  tag: "longtime" | "new";
  tone: string;
  blurb: string;
};

type LabTab = "overview" | "creators" | "builds" | "challenges" | "quiz" | "bingo" | "planner" | "names" | "palette";
type StoredTask = { id: string; title: string; done: boolean };
type BuildIdea = { title: string; category: string; difficulty: string; brief: string };
type Challenge = { title: string; category: string; description: string };

const buildIdeas: BuildIdea[] = [
  { title: "Cliffside starter base", category: "Bauen", difficulty: "Easy", brief: "Baue ein kleines Haus direkt in eine Klippe. Nutze maximal drei Hauptmaterialien und verstecke den Eingang in der Landschaft." },
  { title: "Fantasy Baumhaus", category: "Bauen", difficulty: "Medium", brief: "Verbinde drei Baumplattformen mit Brücken, Laternen und einem kleinen Aussichtspunkt." },
  { title: "Automatische Mini-Farm", category: "Redstone", difficulty: "Medium", brief: "Entwirf eine kompakte Farm mit einem klaren Ein-/Aus-Schalter und einem leicht erreichbaren Lager." },
  { title: "Geheime Redstone-Tür", category: "Redstone", difficulty: "Hard", brief: "Baue einen versteckten Eingang, der von außen wie eine normale Wand aussieht und manuell zurückgesetzt werden kann." },
  { title: "Hafen mit Marktplatz", category: "Bauen", difficulty: "Medium", brief: "Plane Lagerhäuser, kleine Stände, Anlegestellen und einen zentralen Platz mit einem auffälligen Wahrzeichen." },
  { title: "Nether-Express", category: "Infrastruktur", difficulty: "Hard", brief: "Baue einen sicheren, ausgeschilderten Tunnel mit Stationen, Beleuchtung und einheitlichem Design." },
  { title: "Community-Museum", category: "Social", difficulty: "Easy", brief: "Gestalte einen Ausstellungsraum mit Schildern, Item-Rahmen und Bereichen für gemeinsame Erinnerungen." },
  { title: "Bergbahn", category: "Redstone", difficulty: "Hard", brief: "Verbinde zwei Höhenstufen mit einer Minecart-Strecke, Abzweigung und einer schön gestalteten Station." },
  { title: "Mini-Golf-Parcours", category: "Social", difficulty: "Medium", brief: "Baue fünf kurze, faire Herausforderungen mit unterschiedlichen Mechaniken und einer Punktetafel." },
  { title: "Aquarium im Glasdom", category: "Bauen", difficulty: "Hard", brief: "Kombiniere einen großen Glaskörper, abgestufte Wasserbecken und einen Rundweg mit Blick auf alle Bereiche." },
  { title: "Starterdorf 2.0", category: "Survival", difficulty: "Easy", brief: "Verbessere ein kleines Dorf, ohne den Grundriss zu zerstören: Wege, Licht, Lager und ein gemeinsamer Treffpunkt." },
  { title: "Elytra-Rennstrecke", category: "Social", difficulty: "Hard", brief: "Baue einen fairen Rundkurs mit klaren Checkpoints, sichtbarer Ziellinie und sicheren Auslaufzonen." },
  { title: "Geheime Schatzkammer", category: "Redstone", difficulty: "Medium", brief: "Plane eine Rätselroute mit drei Hinweisen und einer Belohnungskammer. Keine unlösbaren Zufallsmechaniken." },
  { title: "Waldschutzgebiet", category: "Survival", difficulty: "Easy", brief: "Gestalte ein Gebiet mit Wanderwegen, Aussichtspunkten, kleinen Hütten und respektvoll integrierter Natur." },
  { title: "Modernes Rathaus", category: "Bauen", difficulty: "Medium", brief: "Baue einen zentralen öffentlichen Ort mit Empfang, Sitzungssaal, Pinnwand und einem erkennbaren Dachprofil." },
  { title: "Sortierlager", category: "Redstone", difficulty: "Hard", brief: "Entwirf ein modular erweiterbares Lager mit klaren Labels, Überlaufkiste und einem übersichtlichen Eingang." },
  { title: "Küsten-Leuchtturm", category: "Bauen", difficulty: "Easy", brief: "Baue einen weithin sichtbaren Leuchtturm mit spiralförmigem Innenweg und nutzbarer Aussichtsplattform." },
  { title: "Nether-Lounge", category: "Bauen", difficulty: "Medium", brief: "Verwandle einen sicheren Nether-Knotenpunkt in eine kleine Lounge mit Wegweisern, Sitzbereich und guter Beleuchtung." },
  { title: "Redstone-Reaktionsspiel", category: "Redstone", difficulty: "Hard", brief: "Baue ein kurzes Reaktionsspiel mit zufälligem Startsignal, sichtbarem Ergebnis und einem zuverlässigen Reset." },
  { title: "Gemeinsames Wahrzeichen", category: "Social", difficulty: "Medium", brief: "Entwirf ein großes Symbol für die Community, das aus mehreren kleinen Beiträgen verschiedener Spieler besteht." },
];

const challenges: Challenge[] = [
  { title: "Nur eine Materialpalette", category: "Bauen", description: "Gestalte ein vollständiges kleines Gebäude mit höchstens fünf Baublöcken." },
  { title: "15-Minuten-Microbuild", category: "Bauen", description: "Baue in 15 Minuten einen erkennbaren Ort mit Eingang, Licht und einem Detail, das ihn einzigartig macht." },
  { title: "Hässlich zu hübsch", category: "Bauen", description: "Finde einen langweiligen Bereich und verbessere ihn, ohne seine Funktion zu verändern." },
  { title: "Vertikal statt breit", category: "Bauen", description: "Baue ein funktionierendes Mini-Projekt auf mindestens drei klaren Höhenebenen." },
  { title: "Licht ohne Flutlicht", category: "Bauen", description: "Beleuchte einen Weg so, dass er sicher wirkt, aber die Atmosphäre erhalten bleibt." },
  { title: "Ein Block, drei Ideen", category: "Bauen", description: "Nutze denselben Hauptblock für drei komplett unterschiedliche kleine Designs." },
  { title: "Redstone mit Reset", category: "Redstone", description: "Baue einen Mechanismus, den man nach dem Benutzen ohne Abbau zurücksetzen kann." },
  { title: "Compact Contraption", category: "Redstone", description: "Verkleinere eine bestehende Redstone-Idee, ohne die Bedienung unklar zu machen." },
  { title: "Nützliche Warnlampe", category: "Redstone", description: "Baue eine Anzeige, die einen Zustand klar sichtbar macht und nicht nur dekorativ blinkt." },
  { title: "Automatisierung planen", category: "Redstone", description: "Zeichne zuerst Ein- und Ausgang auf, dann baue den einfachsten funktionierenden Mechanismus." },
  { title: "Sichere Heimkehr", category: "Survival", description: "Verbessere einen gefährlichen Rückweg mit Markierungen, Licht und einem sicheren Zwischenstopp." },
  { title: "Inventar aufräumen", category: "Survival", description: "Ordne die wichtigsten Ressourcen in ein System, das du auch nach einer langen Session verstehst." },
  { title: "Eine Nacht draußen", category: "Survival", description: "Plane einen kleinen Außenposten mit Bett, Licht, Essen und einem klaren Fluchtweg." },
  { title: "Ressourcen mit Plan", category: "Survival", description: "Sammle für ein konkretes Bauziel und vermeide zielloses Farmen." },
  { title: "Handelspunkt", category: "Community", description: "Richte einen fairen Tauschplatz ein, dessen Regeln direkt verständlich sind." },
  { title: "Wegweiser für alle", category: "Community", description: "Beschrifte eine Route zu drei wichtigen Orten mit konsistenten Schildern." },
  { title: "Gemeinsames Projekt", category: "Community", description: "Erledige einen kleinen Teil eines größeren Builds und dokumentiere, was noch fehlt." },
  { title: "Foto-Ecke bauen", category: "Community", description: "Gestalte einen Ort, an dem sich die Community für Screenshots treffen kann." },
  { title: "Geheimnis ohne Frust", category: "Community", description: "Baue ein optionales Rätsel mit Hinweisen, die sich logisch kombinieren lassen." },
  { title: "Ordentliches Lager", category: "Survival", description: "Sortiere eine Kiste-Sammlung nach einem System, das auch Neulinge sofort verstehen." },
  { title: "Brücke mit Charakter", category: "Bauen", description: "Baue eine Brücke, die sich sichtbar an Gelände, Zweck und Umgebung anpasst." },
  { title: "Kleine Nether-Oase", category: "Bauen", description: "Gestalte einen geschützten Halt im Nether mit eindeutigen Wegweisern." },
  { title: "Item-Transport", category: "Redstone", description: "Plane einen Item-Fluss vom Eingang bis zum Lager und finde die größte Fehlerquelle." },
  { title: "Drei-Minuten-Tour", category: "Community", description: "Bereite eine kurze Tour durch dein Projekt vor: Zweck, Lieblingsdetail, nächster Schritt." },
  { title: "Upgrade statt Neubau", category: "Survival", description: "Verbessere ein bestehendes Bauwerk mit drei gezielten Änderungen statt es abzureißen." },
];

const quizQuestions = [
  { q: "Was beschreibt CraftAttack am besten?", answers: ["Ein Solo-Speedrun", "Ein Creator-Minecraft-SMP", "Ein offizielles Minecraft-Update", "Ein reines PvP-Turnier"], correct: 1, explain: "CraftAttack ist vor allem als gemeinsames Minecraft-Projekt vieler Creator bekannt." },
  { q: "Wofür steht SMP üblicherweise?", answers: ["Survival Multiplayer", "Super Mining Pack", "Server Map Preview", "Simple Mod Plugin"], correct: 0, explain: "SMP steht im Minecraft-Kontext für Survival Multiplayer." },
  { q: "Was macht einen guten Community-Build aus?", answers: ["Nur seltene Blöcke", "Keine Wegweiser", "Klare Nutzung und gute Lesbarkeit", "Möglichst viele Partikel"], correct: 2, explain: "Ein Build funktioniert am besten, wenn andere verstehen, was es ist und wie man es benutzt." },
  { q: "Welche Funktion hat ein Redstone-Reset?", answers: ["Er löscht die Welt", "Er bringt einen Mechanismus in den Ausgangszustand", "Er erhöht automatisch FPS", "Er kopiert eine Base"], correct: 1, explain: "Mit einem Reset lässt sich eine Schaltung erneut benutzen." },
  { q: "Was ist bei einer gemeinsamen Serverbasis besonders hilfreich?", answers: ["Unsichtbare Wege", "Beschriftungen und Lagerordnung", "Alle Kisten gleich lassen", "Licht vermeiden"], correct: 1, explain: "Beschriftungen und klare Ordnung sparen allen Beteiligten Zeit." },
  { q: "Welches Feature hilft, ein größeres Projekt planbar zu machen?", answers: ["Zufällige Änderungen", "Eine Aufgabenliste mit Fortschritt", "Jeden Plan vergessen", "Alles gleichzeitig beginnen"], correct: 1, explain: "Kleine überprüfbare Schritte machen größere Projekte leichter planbar." },
  { q: "Wozu dient eine sichere Nether-Route?", answers: ["Zur Orientierung und sichereren Fortbewegung", "Zum Ändern der Spielversion", "Zum Löschen von Chunks", "Zum Ausblenden von Inventaren"], correct: 0, explain: "Beleuchtung, Schutz und Wegweiser machen die Route verständlicher." },
  { q: "Was ist ein guter erster Schritt bei einer Redstone-Idee?", answers: ["Alles sofort verstecken", "Ein- und Ausgang definieren", "Deko vor Funktion", "Ohne Test bauen"], correct: 1, explain: "Wenn Ein- und Ausgang klar sind, lässt sich der Mechanismus besser planen und testen." },
  { q: "Warum sollte ein Fan-Hub echte Datenquellen kennzeichnen?", answers: ["Damit erfundene Werte echt wirken", "Damit Besucher Fakten von Beispielen unterscheiden können", "Damit Links nicht funktionieren", "Damit Suchfelder verschwinden"], correct: 1, explain: "Transparente Quellen machen eine Community-Seite verlässlicher." },
  { q: "Was sollte ein guter Server-Wegweiser tun?", answers: ["Nur dekorativ sein", "Ziele schnell verständlich machen", "In jedem Abschnitt anders aussehen", "Den Weg absichtlich verstecken"], correct: 1, explain: "Ein konsistenter Wegweiser hilft neuen und bestehenden Spielern." },
];

const bingoTasks = [
  "Jemand baut ein Lager", "Eine Brücke entsteht", "Ein Weg wird beleuchtet", "Eine Farm wird geplant", "Ein Haus bekommt ein Dach",
  "Ein Spieler sortiert Kisten", "Ein Projekt wird erweitert", "Redstone wird getestet", "Ein Dorf bekommt Wege", "Ein Nether-Weg wird markiert",
  "Ein Gebäude bekommt Fenster", "Jemand zeigt eine Base", "Ein Schild wird platziert", "Eine kleine Deko entsteht", "Ein Tunnel wird gebaut",
  "Ein Raum bekommt Licht", "Eine Kiste wird beschriftet", "Eine Brücke wird verbessert", "Ein Garten wird angelegt", "Ein geheimer Eingang erscheint",
  "Eine Farm bekommt ein Upgrade", "Ein Aussichtspunkt entsteht", "Jemand plant einen Bau", "Ein Lager wird vergrößert", "Ein Weg bekommt Details",
  "Eine Redstone-Tür wird getestet", "Ein Turm wird höher", "Ein Marktplatz entsteht", "Ein Baum wird gepflanzt", "Ein Build bekommt eine Palette",
  "Ein Gebäude wird abgerissen", "Ein Wegweiser wird gesetzt", "Ein Raum wird dekoriert", "Jemand baut unterirdisch", "Ein Fluss wird überquert",
  "Ein Projekt wird vorgestellt", "Ein Haus bekommt einen Eingang", "Ein Hof wird erweitert", "Ein Portal wird gestaltet", "Ein Kran oder Gerüst entsteht",
  "Ein Dach bekommt Details", "Eine Base bekommt einen Namen", "Ein Weg bekommt Geländer", "Ein Minigame wird geplant", "Ein Aussichtsturm entsteht",
];

const projectWordsA = ["Crispy", "Emerald", "Redstone", "Ender", "Creeper", "Block", "Nether", "Pixel", "Copper", "Moon"];
const projectWordsB = ["Hafen", "Höhle", "Himmel", "Union", "Werk", "Oase", "District", "Chronik", "Campus", "Bastion"];
const accents = [
  { name: "Emerald", value: "#a7f36c" },
  { name: "Arcane", value: "#b8a2ff" },
  { name: "Ocean", value: "#70d6ef" },
  { name: "Sunset", value: "#ffbd70" },
  { name: "Rose", value: "#ff8faa" },
  { name: "Frost", value: "#d1e7f5" },
];

const defaultTasks: StoredTask[] = [
  { id: "prep", title: "Inventar und benötigte Blöcke vorbereiten", done: false },
  { id: "space", title: "Bauplatz markieren und grobe Maße setzen", done: false },
  { id: "shape", title: "Grundform und Silhouette bauen", done: false },
  { id: "detail", title: "Details, Licht und Wegführung ergänzen", done: false },
  { id: "test", title: "Funktion testen und Fehler korrigieren", done: false },
  { id: "share", title: "Screenshot machen und Projekt dokumentieren", done: false },
];

function useStoredState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const saved = window.localStorage.getItem(key);
      return saved === null ? initialValue : (JSON.parse(saved) as T);
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage is optional. */ }
  }, [key, value]);
  return [value, setValue];
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function HubLab({
  creators,
  favorites,
  onToggleFavorite,
  onReplaceFavorites,
  onToast,
}: {
  creators: HubCreator[];
  favorites: string[];
  onToggleFavorite: (creator: HubCreator) => void;
  onReplaceFavorites: (channels: string[]) => void;
  onToast: (message: string) => void;
}) {
  const [tab, setTab] = useState<LabTab>("overview");
  const [pickedCreator, setPickedCreator] = useState<HubCreator | null>(null);
  const [lastPicked, setLastPicked] = useState("");
  const [compareA, setCompareA] = useState(creators[0]?.channel ?? "");
  const [compareB, setCompareB] = useState(creators[1]?.channel ?? "");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [creatorSort, setCreatorSort] = useState<"name" | "season">("name");
  const [idea, setIdea] = useState<BuildIdea>(buildIdeas[0]);
  const [ideaCategory, setIdeaCategory] = useState("Alle");
  const [savedIdeas, setSavedIdeas] = useStoredState<string[]>("ca-lab-saved-ideas-v1", []);
  const [challengeCategory, setChallengeCategory] = useState("Alle");
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(challenges[0]);
  const [savedChallenges, setSavedChallenges] = useStoredState<string[]>("ca-lab-saved-challenges-v1", []);
  const [completedChallenges, setCompletedChallenges] = useStoredState<string[]>("ca-lab-completed-challenges-v1", []);
  const [quizOrder, setQuizOrder] = useState<number[]>(() => quizQuestions.map((_, index) => index));
  const [quizPosition, setQuizPosition] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [bingoBoard, setBingoBoard] = useStoredState<string[]>("ca-lab-bingo-board-v1", bingoTasks.slice(0, 25));
  const [bingoMarked, setBingoMarked] = useStoredState<number[]>("ca-lab-bingo-marked-v1", []);
  const [tasks, setTasks] = useStoredState<StoredTask[]>("ca-lab-planner-v1", defaultTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [timerMode, setTimerMode] = useState<5 | 15 | 25>(25);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [projectName, setProjectName] = useState("Emerald District");
  const [savedNames, setSavedNames] = useStoredState<string[]>("ca-lab-saved-names-v1", []);
  const [paletteAccent, setPaletteAccent] = useStoredState<string>("ca-lab-accent-v1", "#a7f36c");
  const [savedPalettes, setSavedPalettes] = useStoredState<string[][]>("ca-lab-palettes-v1", []);
  const [watchLater, setWatchLater] = useStoredState<string[]>("ca-lab-watch-later-v1", []);
  const [watchedVideos, setWatchedVideos] = useStoredState<string[]>("ca-lab-watched-videos-v1", []);
  const [watchFilter, setWatchFilter] = useState<"all" | "later" | "watched">("all");
  const [searchCreators, setSearchCreators] = useState("");
  const [labReducedMotion, setLabReducedMotion] = useStoredState<boolean>("ca-lab-reduced-motion-v1", false);

  useEffect(() => {
    document.documentElement.style.setProperty("--green", paletteAccent);
    if (labReducedMotion) document.documentElement.classList.add("lab-reduced-motion");
    else document.documentElement.classList.remove("lab-reduced-motion");
    return () => document.documentElement.classList.remove("lab-reduced-motion");
  }, [paletteAccent, labReducedMotion]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setTimerSeconds((previous) => {
        if (previous <= 1) {
          window.setTimeout(() => {
            setTimerRunning(false);
            onToast("Fokuszeit beendet. Gönn dir kurz Pause!");
          }, 0);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, onToast]);

  const filteredCreators = useMemo(() => {
    const q = searchCreators.trim().toLowerCase();
    return creators
      .filter((creator) => !favoriteOnly || favorites.includes(creator.channel))
      .filter((creator) => !q || (creator.name + " " + creator.seasons).toLowerCase().includes(q))
      .sort((a, b) => creatorSort === "name" ? a.name.localeCompare(b.name, "de") : a.seasons.localeCompare(b.seasons, "de"));
  }, [creators, favorites, favoriteOnly, searchCreators, creatorSort]);

  const matchingChallenges = useMemo(
    () => challenges.filter((item) => challengeCategory === "Alle" || item.category === challengeCategory),
    [challengeCategory],
  );

  const matchingIdeas = useMemo(
    () => buildIdeas.filter((item) => ideaCategory === "Alle" || item.category === ideaCategory),
    [ideaCategory],
  );

  const comparedA = creators.find((creator) => creator.channel === compareA) ?? creators[0];
  const comparedB = creators.find((creator) => creator.channel === compareB) ?? creators[1];
  const bingoLines = useMemo(() => {
    const marked = new Set(bingoMarked);
    const lines: number[][] = [];
    for (let row = 0; row < 5; row += 1) lines.push(Array.from({ length: 5 }, (_, col) => row * 5 + col));
    for (let col = 0; col < 5; col += 1) lines.push(Array.from({ length: 5 }, (_, row) => row * 5 + col));
    lines.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);
    return lines.filter((line) => line.every((index) => marked.has(index))).length;
  }, [bingoMarked]);

  const notify = (message: string) => onToast(message);
  const copyText = async (value: string, label = "In die Zwischenablage kopiert") => {
    try {
      await navigator.clipboard.writeText(value);
      notify(label);
    } catch {
      window.prompt("Bitte kopieren:", value);
    }
  };

  const pickCreator = () => {
    const candidates = creators.filter((creator) => creator.channel !== lastPicked);
    const pool = candidates.length ? candidates : creators;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (!chosen) return;
    setPickedCreator(chosen);
    setLastPicked(chosen.channel);
    notify("Creator-Roulette hat gewählt: " + chosen.name);
  };

  const rollIdea = () => {
    const pool = matchingIdeas.length ? matchingIdeas : buildIdeas;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (chosen) setIdea(chosen);
  };

  const rollChallenge = () => {
    const pool = matchingChallenges.filter((item) => item.title !== currentChallenge.title);
    const chosen = (pool.length ? pool : matchingChallenges)[Math.floor(Math.random() * (pool.length || matchingChallenges.length))];
    if (chosen) setCurrentChallenge(chosen);
  };

  const startQuiz = () => {
    setQuizOrder(shuffle(quizQuestions.map((_, index) => index)));
    setQuizPosition(0);
    setQuizAnswers({});
    setQuizFinished(false);
  };

  const setTimerPreset = (minutes: 5 | 15 | 25) => {
    setTimerMode(minutes);
    setTimerSeconds(minutes * 60);
    setTimerRunning(false);
  };

  const generateProjectName = () => {
    const first = projectWordsA[Math.floor(Math.random() * projectWordsA.length)];
    const second = projectWordsB[Math.floor(Math.random() * projectWordsB.length)];
    const next = first + " " + second;
    setProjectName(next);
    notify("Neuer Projektname: " + next);
  };

  const exportFavorites = () => {
    const data = {
      type: "craftattack-hub-favorites",
      version: 1,
      exportedAt: new Date().toISOString(),
      favorites: favorites,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "craftattack-hub-favorites.json";
    link.click();
    URL.revokeObjectURL(url);
    notify("Favoriten exportiert");
  };

  const importFavorites = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text()) as { type?: string; favorites?: unknown };
      if (raw.type !== "craftattack-hub-favorites" || !Array.isArray(raw.favorites)) {
        notify("Diese Datei ist kein gültiger Favoriten-Export");
        return;
      }
      const knownChannels = new Set(creators.map((creator) => creator.channel));
      const valid = [...new Set(raw.favorites.filter((value): value is string => typeof value === "string" && knownChannels.has(value)))];
      onReplaceFavorites(valid);
      notify(valid.length + " Favoriten importiert");
    } catch {
      notify("Datei konnte nicht gelesen werden");
    } finally {
      event.target.value = "";
    }
  };

  const addTask = () => {
    const title = newTaskTitle.trim();
    if (!title) return;
    setTasks((current) => [...current, { id: "task-" + Date.now(), title, done: false }]);
    setNewTaskTitle("");
    notify("Aufgabe hinzugefügt");
  };

  const startSuggestedPlan = () => {
    const plan: StoredTask[] = [
      { id: "suggest-space", title: "Bauplatz und Maße festlegen", done: false },
      { id: "suggest-palette", title: "Blockpalette mit 3–5 Materialien wählen", done: false },
      { id: "suggest-build", title: "Grundform zuerst fertigstellen", done: false },
      { id: "suggest-detail", title: "Licht, Wege und Details ergänzen", done: false },
      { id: "suggest-test", title: "Build aus mehreren Winkeln prüfen", done: false },
      { id: "suggest-share", title: "Screenshot und Notizen speichern", done: false },
    ];
    setTasks(plan);
    notify("Neue Projekt-Checkliste erstellt");
  };

  const videoItems = [
    { id: "highlights", title: "CraftAttack Highlights", description: "Beste Momente und Zusammenschnitte", query: "CraftAttack 13 Highlights" },
    { id: "bases", title: "Base-Touren", description: "Basen, Mega-Builds und Details", query: "CraftAttack 13 Base Tour" },
    { id: "redstone", title: "Redstone & Farms", description: "Technik und automatische Systeme", query: "CraftAttack Redstone Farm" },
    { id: "latest", title: "Neueste CraftAttack-Videos", description: "Aktuelle Uploads über YouTube finden", query: "CraftAttack 14 aktuell" },
    { id: "survival", title: "Survival-Abenteuer", description: "Exploration, Ressourcen und Abenteuer", query: "CraftAttack Survival Abenteuer" },
    { id: "projects", title: "Community-Projekte", description: "Gemeinsame Builds und Aktionen", query: "CraftAttack Community Projekt" },
  ];
  const visibleVideos = videoItems.filter((video) =>
    watchFilter === "all" || (watchFilter === "later" ? watchLater.includes(video.id) : watchedVideos.includes(video.id)),
  );

  const tabs: { id: LabTab; label: string; icon: typeof Sparkles }[] = [
    { id: "overview", label: "Übersicht", icon: Sparkles },
    { id: "creators", label: "Creator Lab", icon: Users },
    { id: "builds", label: "Build Generator", icon: Lightbulb },
    { id: "challenges", label: "Challenge Board", icon: Target },
    { id: "quiz", label: "Craft Quiz", icon: Trophy },
    { id: "bingo", label: "Bingo", icon: CircleCheck },
    { id: "planner", label: "Planer & Timer", icon: ListChecks },
    { id: "names", label: "Namensstudio", icon: WandSparkles },
    { id: "palette", label: "Style Lab", icon: Palette },
  ];

  const savedIdeaObjects = buildIdeas.filter((item) => savedIdeas.includes(item.title));
  const savedChallengeObjects = challenges.filter((item) => savedChallenges.includes(item.title));
  const currentQuestionIndex = quizOrder[quizPosition];
  const currentQuestion = currentQuestionIndex === undefined ? undefined : quizQuestions[currentQuestionIndex];
  const quizScore = Object.entries(quizAnswers).filter(([questionIndex, answer]) => quizQuestions[Number(questionIndex)]?.correct === answer).length;
  const timerLabel = String(Math.floor(timerSeconds / 60)).padStart(2, "0") + ":" + String(timerSeconds % 60).padStart(2, "0");
  const taskProgress = tasks.length ? Math.round((tasks.filter((task) => task.done).length / tasks.length) * 100) : 0;
  const savedPalette = accents.find((item) => item.value.toLowerCase() === paletteAccent.toLowerCase());

  return (
    <section className="hub-lab section-wrap" id="hub-lab">
      <div className="lab-heading">
        <div>
          <div className="eyebrow section-eyebrow"><span className="eyebrow-dot" /> THE COMMUNITY TOOLKIT</div>
          <h2>Willkommen im <span>Hub Lab.</span></h2>
          <p>Generatoren, Mini-Games, Creator-Tools und Projektplanung. Alles direkt im Browser, deine persönlichen Daten bleiben lokal gespeichert.</p>
        </div>
        <div className="lab-heading-mark"><WandSparkles size={29} /><span>LAB / 01</span></div>
      </div>

      <div className="lab-metrics">
        <div><span className="lab-metric-icon"><Heart size={17} /></span><span><strong>{favorites.length}</strong><small>Creator-Favoriten</small></span></div>
        <div><span className="lab-metric-icon violet"><Lightbulb size={17} /></span><span><strong>{savedIdeas.length}</strong><small>Gespeicherte Builds</small></span></div>
        <div><span className="lab-metric-icon amber"><Target size={17} /></span><span><strong>{completedChallenges.length}</strong><small>Erledigte Challenges</small></span></div>
        <div><span className="lab-metric-icon blue"><ListChecks size={17} /></span><span><strong>{taskProgress}%</strong><small>Projektfortschritt</small></span></div>
      </div>

      <div className="lab-layout">
        <aside className="lab-sidebar">
          <span className="lab-sidebar-label">YOUR WORKBENCH</span>
          <nav aria-label="Hub-Lab Werkzeuge">
            {tabs.map((item) => {
              const Icon = item.icon;
              return <button key={item.id} onClick={() => setTab(item.id)} className={tab === item.id ? "lab-tab active" : "lab-tab"}><Icon size={17} /><span>{item.label}</span><ChevronRight size={15} /></button>;
            })}
          </nav>
          <div className="lab-sidebar-note"><span className="lab-live-dot" /><div><strong>Alles lokal gespeichert</strong><small>Favoriten, Bingo, Timer-Einstellungen und Listen bleiben auf diesem Gerät erhalten.</small></div></div>
        </aside>

        <div className="lab-content">
          {tab === "overview" && (
            <div className="lab-panel">
              <div className="lab-panel-head"><div><span className="lab-kicker">PICK YOUR NEXT MOVE</span><h3>Was machen wir heute?</h3><p>Ein Klick genügt, der Rest ist Minecraft-Magie. Na ja, fast.</p></div><span className="lab-panel-icon"><Sparkles size={24} /></span></div>
              <div className="lab-quick-grid">
                <button className="lab-quick-card quick-green" onClick={() => { pickCreator(); setTab("creators"); }}><span><Shuffle size={19} /></span><strong>Creator-Roulette</strong><small>Lass den Zufall entscheiden, wen du als Nächstes schaust.</small><i>STARTEN <ArrowRight size={13} /></i></button>
                <button className="lab-quick-card quick-violet" onClick={() => { rollIdea(); setTab("builds"); }}><span><Lightbulb size={19} /></span><strong>Build-Idee ziehen</strong><small>Eine neue Bauidee inklusive Schwierigkeitsgrad.</small><i>GENERIEREN <ArrowRight size={13} /></i></button>
                <button className="lab-quick-card quick-amber" onClick={() => { rollChallenge(); setTab("challenges"); }}><span><Target size={19} /></span><strong>Challenge starten</strong><small>Mach die nächste Minecraft-Session spannender.</small><i>HERAUSFORDERN <ArrowRight size={13} /></i></button>
                <button className="lab-quick-card quick-blue" onClick={() => setTab("quiz")}><span><Trophy size={19} /></span><strong>Wissen testen</strong><small>10 Quizfragen zu Minecraft, SMP und guten Builds.</small><i>QUIZ STARTEN <ArrowRight size={13} /></i></button>
                <button className="lab-quick-card quick-pink" onClick={() => setTab("bingo")}><span><CircleCheck size={19} /></span><strong>CraftAttack Bingo</strong><small>Erstelle dein Beobachtungs-Bingo für die nächste Folge.</small><i>LOS SPIELEN <ArrowRight size={13} /></i></button>
                <button className="lab-quick-card quick-cyan" onClick={() => setTab("planner")}><span><Timer size={19} /></span><strong>Planer & Fokus-Timer</strong><small>Ein Projekt, klare Schritte und weniger Chaos im Inventar.</small><i>PLANEN <ArrowRight size={13} /></i></button>
              </div>
              <div className="lab-lower-grid">
                <div className="lab-subpanel"><div className="lab-subpanel-title"><Clock3 size={17} /><strong>Quick focus</strong><span>25 MIN</span></div><p>Für eine konzentrierte Bau-Session. Du kannst den Timer auch im Planer steuern.</p><button className="lab-action lab-action-primary" onClick={() => { setTimerPreset(25); setTimerRunning(true); setTab("planner"); notify("25-Minuten-Fokus gestartet"); }}>Fokus starten <Play size={15} fill="currentColor" /></button></div>
                <div className="lab-subpanel"><div className="lab-subpanel-title"><History size={17} /><strong>Dein Fortschritt</strong></div><div className="lab-mini-progress"><span style={{ width: taskProgress + "%" }} /></div><p>{tasks.filter((task) => task.done).length} von {tasks.length} Planer-Aufgaben erledigt. Kleine Schritte, weniger Chaos.</p><button className="lab-action" onClick={() => setTab("planner")}>Planer öffnen <ArrowRight size={15} /></button></div>
              </div>
              <div className="lab-utility-strip"><span><Check size={15} /> 9 Werkzeugbereiche</span><span><Check size={15} /> Offline-freundlich</span><span><Check size={15} /> Keine Anmeldung</span><span><Check size={15} /> Keine Fake-Live-Stats</span></div>
            </div>
          )}

          {tab === "creators" && (
            <div className="lab-panel">
              <div className="lab-panel-head"><div><span className="lab-kicker">CREATOR CONTROL ROOM</span><h3>Creator Lab</h3><p>Profile sortieren, zufällig entdecken, vergleichen und Favoriten sichern.</p></div><span className="lab-panel-icon"><Users size={24} /></span></div>
              <div className="lab-inline-tools">
                <label className="lab-search"><Search size={16} /><input value={searchCreators} onChange={(event) => setSearchCreators(event.target.value)} placeholder="Creator oder Staffel suchen..." /></label>
                <select aria-label="Creator sortieren" value={creatorSort} onChange={(event) => setCreatorSort(event.target.value as "name" | "season")}><option value="name">A–Z sortieren</option><option value="season">Nach Staffelangabe</option></select>
                <button className={favoriteOnly ? "lab-action lab-action-selected" : "lab-action"} onClick={() => setFavoriteOnly((value) => !value)}><Heart size={15} fill={favoriteOnly ? "currentColor" : "none"} /> Nur Favoriten</button>
              </div>
              <div className="lab-roulette">
                <div className="lab-roulette-copy"><span className="lab-kicker">RANDOM DISCOVERY</span><h4>Wer wird als Nächstes geschaut?</h4><p>Der Zufall wählt jemanden aus deinem Creator-Archiv. Der letzte Pick wird möglichst vermieden.</p><button className="lab-action lab-action-primary" onClick={pickCreator}><Shuffle size={15} /> Zufälligen Creator ziehen</button></div>
                {pickedCreator ? <div className="lab-picked-creator"><div className="lab-creator-avatar" style={{ background: pickedCreator.tone }}>{pickedCreator.initials}</div><div><strong>{pickedCreator.name}</strong><small>{pickedCreator.seasons}</small><a href={"https://www.youtube.com/results?search_query=" + encodeURIComponent("CraftAttack " + pickedCreator.name)} target="_blank" rel="noreferrer">Videos suchen <ExternalLink size={12} /></a></div><button className="lab-icon-action" onClick={() => onToggleFavorite(pickedCreator)} title="Favoriten umschalten"><Heart size={17} fill={favorites.includes(pickedCreator.channel) ? "currentColor" : "none"} /></button></div> : <div className="lab-roulette-placeholder"><Shuffle size={28} /><span>Bereit für deinen nächsten Pick?</span></div>}
              </div>
              <div className="lab-creator-results">
                {filteredCreators.map((creator) => <div className="lab-creator-row" key={creator.channel}><div className="lab-creator-avatar" style={{ background: creator.tone }}>{creator.initials}</div><div className="lab-creator-row-info"><strong>{creator.name}</strong><small>{creator.seasons}</small></div><button className={"lab-icon-action " + (favorites.includes(creator.channel) ? "is-loved" : "")} onClick={() => onToggleFavorite(creator)} title={favorites.includes(creator.channel) ? "Favorit entfernen" : "Als Favorit speichern"}><Heart size={16} fill={favorites.includes(creator.channel) ? "currentColor" : "none"} /></button><button className="lab-icon-action" onClick={() => copyText(creator.name, creator.name + " kopiert")} title="Namen kopieren"><Copy size={15} /></button><a className="lab-icon-action" href={"https://www.youtube.com/results?search_query=" + encodeURIComponent("CraftAttack " + creator.name)} target="_blank" rel="noreferrer" title="Videos suchen"><ArrowUpRight size={16} /></a></div>)}
                {!filteredCreators.length && <div className="lab-empty">Keine Creator gefunden. Suchbegriff ändern oder Favoritenfilter ausschalten.</div>}
              </div>
              <div className="lab-divider-title"><span>CREATOR-Vergleich</span><small>Öffentliche Profildaten vergleichen, keine künstlichen Rankings.</small></div>
              <div className="lab-compare-controls"><label>Creator A<select value={compareA} onChange={(event) => setCompareA(event.target.value)}>{creators.map((creator) => <option value={creator.channel} key={creator.channel}>{creator.name}</option>)}</select></label><span className="lab-vs">VS</span><label>Creator B<select value={compareB} onChange={(event) => setCompareB(event.target.value)}>{creators.map((creator) => <option value={creator.channel} key={creator.channel}>{creator.name}</option>)}</select></label></div>
              <div className="lab-compare-grid">{[comparedA, comparedB].filter(Boolean).map((creator) => <div className="lab-compare-card" key={creator.channel}><div className="lab-creator-avatar" style={{ background: creator.tone }}>{creator.initials}</div><h4>{creator.name}</h4><span>{creator.seasons}</span><p>{creator.blurb}</p><button className="lab-action" onClick={() => copyText(creator.name, "Creator-Name kopiert")}><Copy size={14} /> Name kopieren</button></div>)}</div>
              <div className="lab-export-row"><div><FileJson size={18} /><span><strong>Favoriten-Backup</strong><small>Exportiere deine Favoriten als JSON oder importiere eine frühere Datei.</small></span></div><div className="lab-export-actions"><button className="lab-action" onClick={exportFavorites}><Download size={14} /> Export</button><label className="lab-action lab-file-button">Import<input type="file" accept="application/json,.json" onChange={importFavorites} /></label></div></div>
            </div>
          )}

          {tab === "builds" && (
            <div className="lab-panel">
              <div className="lab-panel-head"><div><span className="lab-kicker">GENERATE. BUILD. REPEAT.</span><h3>Build-Ideen Generator</h3><p>Neue Bauideen mit Kategorie, Schwierigkeitsgrad und konkretem Briefing.</p></div><span className="lab-panel-icon"><Lightbulb size={24} /></span></div>
              <div className="lab-inline-tools"><label className="lab-select-label">Kategorie<select value={ideaCategory} onChange={(event) => setIdeaCategory(event.target.value)}><option>Alle</option><option>Bauen</option><option>Redstone</option><option>Infrastruktur</option><option>Social</option><option>Survival</option></select></label><span className="lab-result-count">{matchingIdeas.length} Ideen verfügbar</span></div>
              <div className="lab-idea-card"><div className="lab-idea-top"><span className="lab-idea-icon"><Blocks size={28} /></span><div className="lab-idea-badges"><span>{idea.category}</span><span className={"difficulty difficulty-" + idea.difficulty.toLowerCase()}>{idea.difficulty}</span></div><span className="lab-idea-number">BUILD / {String(buildIdeas.findIndex((item) => item.title === idea.title) + 1).padStart(2, "0")}</span></div><h4>{idea.title}</h4><p>{idea.brief}</p><div className="lab-idea-actions"><button className="lab-action lab-action-primary" onClick={rollIdea}><RefreshCw size={15} /> Neue Idee ziehen</button><button className="lab-action" onClick={() => { setSavedIdeas((current) => current.includes(idea.title) ? current.filter((title) => title !== idea.title) : [...current, idea.title]); notify(savedIdeas.includes(idea.title) ? "Idee entfernt" : "Build-Idee gespeichert"); }}><Bookmark size={15} fill={savedIdeas.includes(idea.title) ? "currentColor" : "none"} /> {savedIdeas.includes(idea.title) ? "Gespeichert" : "Idee merken"}</button><button className="lab-action" onClick={() => copyText(idea.title + "\\n" + idea.brief, "Build-Briefing kopiert")}><Copy size={15} /> Briefing kopieren</button></div></div>
              <div className="lab-divider-title"><span>DEINE MERKLISTE</span><small>{savedIdeaObjects.length} gespeicherte Ideen</small></div>
              {savedIdeaObjects.length ? <div className="lab-saved-list">{savedIdeaObjects.map((item) => <div key={item.title}><span className="lab-list-bullet"><Check size={13} /></span><span><strong>{item.title}</strong><small>{item.category} · {item.difficulty}</small></span><button className="lab-icon-action" onClick={() => { setIdea(item); notify("Idee geladen"); }} title="Idee laden"><ArrowRight size={15} /></button><button className="lab-icon-action" onClick={() => setSavedIdeas((current) => current.filter((title) => title !== item.title))} title="Idee entfernen"><Trash2 size={14} /></button></div>)}</div> : <div className="lab-empty">Noch keine Ideen gespeichert. Merke eine Idee, damit sie hier auftaucht.</div>}
            </div>
          )}

          {tab === "challenges" && (
            <div className="lab-panel">
              <div className="lab-panel-head"><div><span className="lab-kicker">DAILY SIDE QUESTS</span><h3>Challenge Board</h3><p>Kleine Aufgaben für Builds, Survival, Redstone und Community-Projekte.</p></div><span className="lab-panel-icon"><Target size={24} /></span></div>
              <div className="lab-inline-tools"><label className="lab-select-label">Bereich<select value={challengeCategory} onChange={(event) => { setChallengeCategory(event.target.value); }}><option>Alle</option><option>Bauen</option><option>Redstone</option><option>Survival</option><option>Community</option></select></label><span className="lab-result-count">{completedChallenges.length} erledigt · {challenges.length} Challenges</span></div>
              <div className="lab-challenge-feature"><div className="lab-challenge-emblem"><Target size={29} /></div><div className="lab-challenge-copy"><span className="lab-kicker">DEINE AKTUELLE MISSION</span><span className="lab-challenge-tag">{currentChallenge.category}</span><h4>{currentChallenge.title}</h4><p>{currentChallenge.description}</p><div className="lab-idea-actions"><button className="lab-action lab-action-primary" onClick={rollChallenge}><Shuffle size={15} /> Andere Challenge</button><button className="lab-action" onClick={() => copyText(currentChallenge.title + ": " + currentChallenge.description, "Challenge kopiert")}><Copy size={15} /> Kopieren</button><button className="lab-action" onClick={() => { setCompletedChallenges((current) => current.includes(currentChallenge.title) ? current.filter((title) => title !== currentChallenge.title) : [...current, currentChallenge.title]); notify(completedChallenges.includes(currentChallenge.title) ? "Challenge wieder geöffnet" : "Challenge erledigt"); }}><Check size={15} /> {completedChallenges.includes(currentChallenge.title) ? "Erledigt ✓" : "Abschließen"}</button></div></div></div>
              <div className="lab-divider-title"><span>ALLE CHALLENGES</span><small>Filterbar nach Kategorie</small></div>
              <div className="lab-challenge-list">{matchingChallenges.map((item) => { const done = completedChallenges.includes(item.title); const saved = savedChallenges.includes(item.title); return <div key={item.title} className={done ? "lab-challenge-row is-done" : "lab-challenge-row"}><button className="lab-challenge-check" onClick={() => setCompletedChallenges((current) => done ? current.filter((title) => title !== item.title) : [...current, item.title])} aria-label={done ? "Als offen markieren" : "Als erledigt markieren"}>{done && <Check size={14} />}</button><div><strong>{item.title}</strong><small><span>{item.category}</span> · {item.description}</small></div><button className={"lab-icon-action " + (saved ? "is-loved" : "")} onClick={() => setSavedChallenges((current) => saved ? current.filter((title) => title !== item.title) : [...current, item.title])} title={saved ? "Aus Merkliste entfernen" : "Challenge merken"}><Bookmark size={15} fill={saved ? "currentColor" : "none"} /></button></div>; })}</div>
              <div className="lab-saved-challenge-foot"><Bookmark size={15} /> {savedChallengeObjects.length} Challenges gemerkt <span>·</span> {completedChallenges.length} erledigt</div>
            </div>
          )}

          {tab === "quiz" && (
            <div className="lab-panel">
              <div className="lab-panel-head"><div><span className="lab-kicker">TEST YOUR KNOWLEDGE</span><h3>Craft Quiz</h3><p>10 Fragen rund um Minecraft, SMP-Kultur und gutes Projekt-Design.</p></div><span className="lab-panel-icon"><Trophy size={24} /></span></div>
              {!quizFinished && currentQuestion ? <div className="lab-quiz-card"><div className="lab-quiz-progress-head"><span>FRAGE {quizPosition + 1} / {quizOrder.length}</span><span>{quizScore} PUNKTE</span></div><div className="lab-quiz-progress"><span style={{ width: (((quizPosition + 1) / quizOrder.length) * 100) + "%" }} /></div><h4>{currentQuestion.q}</h4><div className="lab-quiz-answers">{currentQuestion.answers.map((answer, index) => { const chosen = quizAnswers[currentQuestionIndex] === index; const revealed = quizAnswers[currentQuestionIndex] !== undefined; const correct = currentQuestion.correct === index; return <button key={answer} className={"lab-quiz-answer" + (chosen ? " chosen" : "") + (revealed && correct ? " answer-correct" : "") + (revealed && chosen && !correct ? " answer-wrong" : "")} disabled={revealed} onClick={() => setQuizAnswers((current) => ({ ...current, [currentQuestionIndex]: index }))}><span>{String.fromCharCode(65 + index)}</span>{answer}{revealed && correct && <Check size={16} />}{revealed && chosen && !correct && <X size={16} />}</button>; })}</div>{quizAnswers[currentQuestionIndex] !== undefined && <div className="lab-quiz-feedback"><strong>{quizAnswers[currentQuestionIndex] === currentQuestion.correct ? "Richtig! +1 Punkt" : "Noch nicht ganz."}</strong><p>{currentQuestion.explain}</p><button className="lab-action lab-action-primary" onClick={() => { if (quizPosition + 1 >= quizOrder.length) setQuizFinished(true); else setQuizPosition((position) => position + 1); }}>{quizPosition + 1 >= quizOrder.length ? "Ergebnis anzeigen" : "Nächste Frage"} <ArrowRight size={15} /></button></div>}</div> : <div className="lab-quiz-result"><span className="lab-quiz-trophy"><Trophy size={32} /></span><span className="lab-kicker">QUIZ ABGESCHLOSSEN</span><h4>{quizScore} / {quizOrder.length}</h4><p>{quizScore >= 8 ? "Starke Leistung. Dein Wissensinventar ist gut sortiert." : quizScore >= 5 ? "Solide! Da ist noch Platz für ein paar neue Craft-Facts." : "Guter Anfang. Noch eine Runde und das Wissen wächst."}</p><button className="lab-action lab-action-primary" onClick={startQuiz}><RotateCcw size={15} /> Quiz neu mischen</button></div>}
              {!quizFinished && quizPosition === 0 && Object.keys(quizAnswers).length === 0 && <div className="lab-quiz-footer"><span><Sparkles size={14} /> Fragen werden pro Runde neu sortiert.</span><button className="lab-action" onClick={startQuiz}><Shuffle size={14} /> Fragen mischen</button></div>}
              {quizFinished && <div className="lab-quiz-footer"><span><CircleCheck size={14} /> Ergebnis nur für diese Runde.</span><button className="lab-action" onClick={() => { setQuizPosition(0); setQuizAnswers({}); setQuizFinished(false); }}><RotateCcw size={14} /> Antworten ansehen</button></div>}
            </div>
          )}

          {tab === "bingo" && (
            <div className="lab-panel">
              <div className="lab-panel-head"><div><span className="lab-kicker">WATCH PARTY MODE</span><h3>CraftAttack Bingo</h3><p>Markiere, was du in einer Folge siehst. Vollständige Reihen zählen als Bingo.</p></div><span className="lab-panel-icon"><CircleCheck size={24} /></span></div>
              <div className="lab-bingo-toolbar"><div><strong>{bingoMarked.length} / 25</strong><small>Felder markiert</small></div><div><strong>{bingoLines}</strong><small>Bingo-Reihen</small></div><button className="lab-action" onClick={() => { setBingoBoard(shuffle(bingoTasks).slice(0, 25)); setBingoMarked([]); notify("Neues Bingo-Feld erstellt"); }}><Shuffle size={14} /> Neues Feld</button><button className="lab-action" onClick={() => setBingoMarked([])}><RotateCcw size={14} /> Reset</button></div>
              <div className="lab-bingo-grid">{bingoBoard.map((item, index) => { const marked = bingoMarked.includes(index); return <button key={item + index} className={marked ? "lab-bingo-tile marked" : "lab-bingo-tile"} onClick={() => setBingoMarked((current) => marked ? current.filter((id) => id !== index) : [...current, index])}><span>{marked ? <Check size={18} /> : String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></button>; })}</div>
              <div className="lab-bingo-footer"><span><Sparkles size={15} /> Tipp: Spiel es mit Freunden und vergleicht, wer zuerst eine Reihe hat.</span><button className="lab-action" onClick={() => copyText("CraftAttack Bingo:\\n" + bingoBoard.map((item, index) => (bingoMarked.includes(index) ? "✓ " : "□ ") + item).join("\\n"), "Bingo-Feld kopiert")}><Copy size={14} /> Feld kopieren</button></div>
            </div>
          )}

          {tab === "planner" && (
            <div className="lab-panel">
              <div className="lab-panel-head"><div><span className="lab-kicker">FROM IDEA TO BUILD</span><h3>Projektplaner & Fokus-Timer</h3><p>Deine Checkliste bleibt gespeichert, auch wenn du die Seite neu lädst.</p></div><span className="lab-panel-icon"><ListChecks size={24} /></span></div>
              <div className="lab-planner-progress"><div><span>PROJEKTFORTSCHRITT</span><strong>{taskProgress}%</strong></div><div className="lab-progress-track"><span style={{ width: taskProgress + "%" }} /></div><small>{tasks.filter((task) => task.done).length} von {tasks.length} Aufgaben abgeschlossen</small></div>
              <div className="lab-task-input"><input value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addTask(); }} placeholder="Eigene Aufgabe hinzufügen..." aria-label="Neue Aufgabe" /><button className="lab-action lab-action-primary" onClick={addTask}><Plus size={15} /> Hinzufügen</button></div>
              <div className="lab-task-list">{tasks.map((task) => <div className={task.done ? "lab-task-row task-done" : "lab-task-row"} key={task.id}><button className="lab-task-check" onClick={() => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))} aria-label={task.done ? "Aufgabe wieder öffnen" : "Aufgabe abhaken"}>{task.done && <Check size={14} />}</button><span>{task.title}</span><button className="lab-icon-action" onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))} title="Aufgabe löschen"><Trash2 size={14} /></button></div>)}</div>
              <div className="lab-planner-actions"><button className="lab-action" onClick={() => setTasks((current) => current.filter((task) => !task.done))}><Trash2 size={14} /> Erledigte entfernen</button><button className="lab-action" onClick={startSuggestedPlan}><RefreshCw size={14} /> Beispielplan laden</button><button className="lab-action" onClick={() => setTasks(defaultTasks.map((task) => ({ ...task, done: false })))}><RotateCcw size={14} /> Zurücksetzen</button></div>
              <div className="lab-divider-title"><span>FOCUS TIMER</span><small>Ein lokaler Timer, keine Datenübertragung</small></div>
              <div className="lab-timer-layout"><div className="lab-timer-face"><span><Timer size={17} /> DEEP FOCUS</span><strong>{timerLabel}</strong><small>{timerSeconds === 0 ? "Zeit ist um!" : timerRunning ? "Konzentrier dich auf eine Sache." : "Bereit, wenn du es bist."}</small></div><div className="lab-timer-controls"><div className="lab-timer-presets">{([25, 5, 15] as const).map((minutes) => <button className={timerMode === minutes ? "preset-active" : ""} key={minutes} onClick={() => setTimerPreset(minutes)}>{minutes} min{minutes === 25 ? " · Fokus" : minutes === 5 ? " · Kurz" : " · Lang"}</button>)}</div><div className="lab-idea-actions"><button className="lab-action lab-action-primary" onClick={() => { if (timerSeconds === 0) setTimerSeconds(timerMode * 60); setTimerRunning((running) => !running); }}><Play size={14} fill="currentColor" /> {timerRunning ? "Pausieren" : "Starten"}</button><button className="lab-action" onClick={() => { setTimerRunning(false); setTimerSeconds(timerMode * 60); }}><RotateCcw size={14} /> Reset</button></div></div></div>
            </div>
          )}

          {tab === "names" && (
            <div className="lab-panel">
              <div className="lab-panel-head"><div><span className="lab-kicker">NAME YOUR NEXT LEGEND</span><h3>Projekt-Namensstudio</h3><p>Ein Generator für Base-Namen, Shops, Teams und kreative Bauprojekte.</p></div><span className="lab-panel-icon"><WandSparkles size={24} /></span></div>
              <div className="lab-name-canvas"><div className="lab-name-decoration"><Blocks size={74} /></div><span className="lab-kicker">GENERATED PROJECT NAME</span><h4>{projectName}</h4><p>Ein guter Name bleibt im Kopf. Ein guter Build auch.</p><div className="lab-idea-actions"><button className="lab-action lab-action-primary" onClick={generateProjectName}><Shuffle size={15} /> Neu generieren</button><button className="lab-action" onClick={() => { setSavedNames((current) => current.includes(projectName) ? current : [projectName, ...current].slice(0, 30)); notify("Name gespeichert"); }}><Save size={15} /> Speichern</button><button className="lab-action" onClick={() => copyText(projectName, "Projektname kopiert")}><Copy size={15} /> Kopieren</button></div></div>
              <div className="lab-divider-title"><span>DEINE NAMENSSAMMLUNG</span><small>{savedNames.length} gespeichert · maximal 30</small></div>
              {savedNames.length ? <div className="lab-name-list">{savedNames.map((name) => <div key={name}><span className="lab-list-bullet"><Sparkles size={13} /></span><strong>{name}</strong><button className="lab-icon-action" onClick={() => { setProjectName(name); notify("Name geladen"); }} title="Namen verwenden"><ArrowRight size={15} /></button><button className="lab-icon-action" onClick={() => copyText(name, "Projektname kopiert")} title="Namen kopieren"><Copy size={14} /></button><button className="lab-icon-action" onClick={() => setSavedNames((current) => current.filter((item) => item !== name))} title="Namen löschen"><Trash2 size={14} /></button></div>)}</div> : <div className="lab-empty">Noch keine Namen gespeichert. Generiere einen und sichere ihn hier.</div>}
              <div className="lab-name-tip"><Sparkles size={16} /><span><strong>Pro-Tipp</strong><small>Kombiniere den generierten Namen mit einem klaren Farbschema und einem wiedererkennbaren Bau-Stil.</small></span></div>
            </div>
          )}

          {tab === "palette" && (
            <div className="lab-panel">
              <div className="lab-panel-head"><div><span className="lab-kicker">MAKE IT YOURS</span><h3>Style Lab</h3><p>Akzentfarbe der Website anpassen, Farbpaletten merken und CSS exportieren.</p></div><span className="lab-panel-icon"><Palette size={24} /></span></div>
              <div className="lab-accent-settings"><div><span className="lab-kicker">ACCENT COLOR</span><h4>Dein persönlicher Vibe</h4><p>Die Akzentfarbe ändert sich direkt auf der ganzen Website und bleibt in diesem Browser gespeichert.</p></div><div className="lab-accent-grid">{accents.map((accent) => <button key={accent.value} className={paletteAccent.toLowerCase() === accent.value.toLowerCase() ? "lab-accent-swatch accent-active" : "lab-accent-swatch"} onClick={() => { setPaletteAccent(accent.value); notify(accent.name + "-Akzent aktiviert"); }}><span style={{ background: accent.value }} />{accent.name}{paletteAccent.toLowerCase() === accent.value.toLowerCase() && <Check size={14} />}</button>)}</div></div>
              <div className="lab-palette-preview"><span className="lab-kicker">LIVE PREVIEW</span><div className="lab-preview-card"><div className="lab-preview-icon" style={{ background: paletteAccent }}><Blocks size={22} /></div><div><strong>CraftAttack Hub</strong><small>Dein Stil, deine Welt.</small></div><span className="lab-preview-pill" style={{ color: paletteAccent, borderColor: paletteAccent + "55" }}>CUSTOM</span></div><div className="lab-palette-colors">{[paletteAccent, "#15201a", "#263b2a", "#f2f6f3", "#91a39a"].map((color) => <button key={color} style={{ background: color }} onClick={() => copyText(color, color + " kopiert")} title={color + " kopieren"}><span>{color}</span><Copy size={13} /></button>)}</div></div>
              <div className="lab-idea-actions"><button className="lab-action lab-action-primary" onClick={() => { setSavedPalettes((current) => [[paletteAccent, "#15201a", "#263b2a", "#f2f6f3", "#91a39a"], ...current].slice(0, 12)); notify("Palette gespeichert"); }}><Bookmark size={15} /> Palette merken</button><button className="lab-action" onClick={() => copyText(":root {\\n  --green: " + paletteAccent + ";\\n  --background: #090e0d;\\n  --panel: #101816;\\n  --text: #f2f6f3;\\n}", "CSS-Palette kopiert")}><Copy size={15} /> CSS kopieren</button><button className="lab-action" onClick={() => setPaletteAccent("#a7f36c")}><RotateCcw size={15} /> Standardfarbe</button></div>
              <div className="lab-divider-title"><span>GESPEICHERTE PALETTEN</span><small>{savedPalettes.length} gesichert</small></div>
              {savedPalettes.length ? <div className="lab-saved-palettes">{savedPalettes.map((palette, index) => <div key={String(palette) + index}>{palette.map((color) => <button key={color} style={{ background: color }} onClick={() => copyText(color, color + " kopiert")} title={color} />)}<button className="lab-action" onClick={() => { setPaletteAccent(palette[0] ?? "#a7f36c"); notify("Gespeicherte Palette geladen"); }}>Anwenden</button><button className="lab-icon-action" onClick={() => setSavedPalettes((current) => current.filter((_, i) => i !== index))} title="Palette entfernen"><Trash2 size={14} /></button></div>)}</div> : <div className="lab-empty">Speichere deine erste Farbpalette, damit du später darauf zurückgreifen kannst.</div>}
              <div className="lab-accessibility"><label><input type="checkbox" checked={labReducedMotion} onChange={(event) => setLabReducedMotion(event.target.checked)} /><span><strong>Reduzierte Animationen</strong><small>Bewegungen auf der Website minimieren.</small></span></label><span><Check size={14} /> {labReducedMotion ? "Aktiv" : "Optional"}</span></div>
              <div className="lab-color-footnote">Aktuelle Farbe: <strong>{savedPalette?.name ?? "Custom"}</strong> · {paletteAccent.toUpperCase()}</div>
            </div>
          )}
        </div>
      </div>

      <div className="lab-watchlist">
        <div className="lab-watchlist-heading"><div><div className="eyebrow section-eyebrow">SAVE FOR LATER</div><h3>Deine Video-Queue.</h3><p>Suchlinks speichern und markieren, was du schon geschaut hast. Die Queue bleibt lokal auf deinem Gerät.</p></div><div className="lab-watch-count"><Video size={17} /><strong>{watchLater.length}</strong><small>für später</small></div></div>
        <div className="lab-watch-tools">{([{ id: "all", label: "Alle" }, { id: "later", label: "Merkliste" }, { id: "watched", label: "Gesehen" }] as const).map((item) => <button key={item.id} className={watchFilter === item.id ? "watch-filter-active" : ""} onClick={() => setWatchFilter(item.id)}>{item.label}</button>)}</div>
        <div className="lab-video-queue">{visibleVideos.map((video, index) => { const later = watchLater.includes(video.id); const watched = watchedVideos.includes(video.id); return <div className={watched ? "lab-video-row video-watched" : "lab-video-row"} key={video.id}><span className={"lab-video-thumb video-thumb-" + index}><Play size={17} fill="currentColor" /></span><div className="lab-video-row-copy"><strong>{video.title}</strong><small>{video.description}</small></div><button className={"lab-icon-action " + (later ? "is-loved" : "")} onClick={() => setWatchLater((current) => later ? current.filter((id) => id !== video.id) : [...current, video.id])} title={later ? "Aus Merkliste entfernen" : "Für später merken"}><Bookmark size={15} fill={later ? "currentColor" : "none"} /></button><button className={"lab-icon-action " + (watched ? "is-loved" : "")} onClick={() => setWatchedVideos((current) => watched ? current.filter((id) => id !== video.id) : [...current, video.id])} title={watched ? "Als ungesehen markieren" : "Als gesehen markieren"}>{watched ? <Check size={16} /> : <CircleCheck size={16} />}</button><a className="lab-icon-action" href={"https://www.youtube.com/results?search_query=" + encodeURIComponent(video.query)} target="_blank" rel="noreferrer" title="YouTube-Suche öffnen"><ArrowUpRight size={16} /></a></div>; })}{!visibleVideos.length && <div className="lab-empty">Hier ist noch nichts gespeichert. Wähle einen anderen Filter oder merke ein Video.</div>}</div>
      </div>
      <div className="lab-bottom-note"><span><Sparkles size={15} /> <strong>Made for the community.</strong> Das Hub Lab ist ein inoffizielles Fan-Tool. Spielstände und persönliche Einstellungen werden nur in deinem Browser gespeichert.</span><button className="lab-action" onClick={() => { setTab("overview"); document.getElementById("hub-lab")?.scrollIntoView({ behavior: "smooth" }); }}>Zur Lab-Übersicht <ArrowRight size={14} /></button></div>
    </section>
  );
}
