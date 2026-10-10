import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Bookmark,
  Check, ChevronDown, ChevronRight, CircleHelp, CloudSun, Code2, Compass,
  Copy, Database, ExternalLink, Film, Flame, Gamepad2, Globe2, Heart,
  Image, Layers3, Menu, Moon, Music2, Palette, Play, Search, Sparkles,
  Star, Sun, Telescope, Terminal, Utensils, X, Zap, MonitorPlay, SlidersHorizontal, RefreshCcw, Link2, Eye, type LucideIcon
} from "lucide-react";
import "./ApiVerse.css";

type DemoId = "brawl" | "weather" | "pokemon" | "tvmaze" | "country" | "dog" | "catfact" | "jikan" | "github" | "dictionary" | "recipe" | "joke" | "currency" | "nasa" | "qr" | "swapi" | "randomuser" | "httpcat" | "itunes";
type ApiItem = {
  id: string; name: string; category: string; subcategory: string; description: string;
  endpoint: string; docs: string; auth: "Keine" | "API-Key" | "OAuth" | "Optional";
  cors: "Ja" | "Unklar" | "Nein"; tags: string[]; icon: string; color: string;
  demo?: DemoId; featured?: boolean; status?: string;
};

const apis: ApiItem[] = [
  {id:"brawl",name:"Brawl Stars API",category:"Gaming",subcategory:"Brawl Stars",description:"Brawler, Seltenheiten, Gadgets und Star Powers ansehen. Eine Community-API liefert öffentliche Spieldaten.",endpoint:"https://api.brawlapi.com/v1/brawlers",docs:"https://brawlapi.com/",auth:"Keine",cors:"Unklar",tags:["Brawler","Meta","Community"],icon:"⚡",color:"#ffb84f",demo:"brawl",featured:true,status:"Community API"},
  {id:"pokeapi",name:"PokéAPI",category:"Gaming",subcategory:"Pokémon",description:"Fast das komplette Pokémon-Universum: Pokémon, Typen, Attacken, Fähigkeiten und Items.",endpoint:"https://pokeapi.co/api/v2/pokemon/pikachu",docs:"https://pokeapi.co/docs/v2",auth:"Keine",cors:"Ja",tags:["Pokémon","Datenbank","Sprites"],icon:"◉",color:"#f7cf56",demo:"pokemon",featured:true},
  {id:"minecraft",name:"Minecraft Wiki API",category:"Gaming",subcategory:"Minecraft",description:"Community-Wissen rund um Blöcke, Items, Mobs und Spielmechaniken. Gut für eigene Server-Tools.",endpoint:"https://minecraft.wiki/",docs:"https://minecraft.wiki/",auth:"Keine",cors:"Unklar",tags:["Minecraft","Wiki","Items"],icon:"⛏",color:"#7ed17a"},
  {id:"steam",name:"Steam Web API",category:"Gaming",subcategory:"PC-Gaming",description:"Spielbibliotheken, Profile und Statistiken. Für viele Endpunkte brauchst du einen eigenen Steam API-Key.",endpoint:"https://api.steampowered.com/",docs:"https://steamcommunity.com/dev",auth:"API-Key",cors:"Unklar",tags:["Steam","Profile","Games"],icon:"🎮",color:"#90a9ff"},
  {id:"rawg",name:"RAWG Video Games",category:"Gaming",subcategory:"PC-Gaming",description:"Große Videospiel-Datenbank mit Genres, Plattformen, Bewertungen und Coverbildern.",endpoint:"https://api.rawg.io/api/games",docs:"https://rawg.io/apidocs",auth:"API-Key",cors:"Unklar",tags:["Spiele","Reviews","Cover"],icon:"🕹️",color:"#a89bff"},
  {id:"valorant",name:"HenrikDev Valorant API",category:"Gaming",subcategory:"Shooter & E-Sport",description:"Community-Endpunkte für Valorant-Status, Spielerinformationen und Ranglisten. Verfügbarkeit kann wechseln.",endpoint:"https://api.henrikdev.xyz/",docs:"https://docs.henrikdev.xyz/",auth:"Optional",cors:"Unklar",tags:["Valorant","Rank","Community"],icon:"🎯",color:"#ff8585"},
  {id:"weather",name:"Open-Meteo",category:"Wetter & Geo",subcategory:"Wetter",description:"Wettervorhersage für Orte weltweit, inklusive Temperatur, Wind und stündlicher Prognosen. Kein Schlüssel nötig.",endpoint:"https://api.open-meteo.com/v1/forecast",docs:"https://open-meteo.com/en/docs",auth:"Keine",cors:"Ja",tags:["Live-Daten","Prognose","Weltweit"],icon:"☁️",color:"#74d9e8",demo:"weather",featured:true},
  {id:"countries",name:"REST Countries",category:"Wetter & Geo",subcategory:"Länder & Geografie",description:"Flaggen, Hauptstädte, Regionen, Einwohnerzahlen und Währungen zu Ländern der Welt.",endpoint:"https://restcountries.com/v3.1/name/germany",docs:"https://restcountries.com/",auth:"Keine",cors:"Ja",tags:["Länder","Flaggen","Geografie"],icon:"🌍",color:"#71d8a8",demo:"country",featured:true},
  {id:"geocoding",name:"Open-Meteo Geocoding",category:"Wetter & Geo",subcategory:"Karten & Orte",description:"Wandelt Ortsnamen in Koordinaten um, damit deine Apps Standorte finden können.",endpoint:"https://geocoding-api.open-meteo.com/v1/search?name=Berlin",docs:"https://open-meteo.com/en/docs/geocoding-api",auth:"Keine",cors:"Ja",tags:["Geocoding","Standort","Suche"],icon:"📍",color:"#71d8a8"},
  {id:"opencage",name:"OpenCage Geocoding",category:"Wetter & Geo",subcategory:"Karten & Orte",description:"Vorwärts- und Rückwärts-Geocoding für Kartenprojekte. Nutzung mit kostenlosem Schlüssel und Kontingent.",endpoint:"https://api.opencagedata.com/geocode/v1/json",docs:"https://opencagedata.com/api",auth:"API-Key",cors:"Ja",tags:["Karten","Koordinaten","Adressen"],icon:"🧭",color:"#76cbb9"},
  {id:"jikan",name:"Jikan",category:"Entertainment",subcategory:"Anime & Manga",description:"Inoffizielle MyAnimeList-API für Anime-Suche, Bewertungen, Figuren und Staffeln.",endpoint:"https://api.jikan.moe/v4/anime?q=naruto",docs:"https://docs.api.jikan.moe/",auth:"Keine",cors:"Ja",tags:["Anime","Manga","Suche"],icon:"🌸",color:"#f6a6cd",demo:"jikan",featured:true},
  {id:"anilist",name:"AniList GraphQL",category:"Entertainment",subcategory:"Anime & Manga",description:"Anime- und Manga-Metadaten über GraphQL. Ideal für Watchlists und Entdeckungs-Apps.",endpoint:"https://graphql.anilist.co",docs:"https://anilist.gitbook.io/anilist-apiv2-docs/",auth:"Optional",cors:"Unklar",tags:["Anime","GraphQL","Listen"],icon:"🎴",color:"#f6a6cd"},
  {id:"tvmaze",name:"TVmaze",category:"Entertainment",subcategory:"Filme & Serien",description:"Durchsuche Serien mit Genres, Bildern, Sendeterminen und kurzen Infos. Direkte Browser-Abfragen möglich.",endpoint:"https://api.tvmaze.com/search/shows?q=doctor",docs:"https://www.tvmaze.com/api",auth:"Keine",cors:"Ja",tags:["Serien","Episoden","Suche"],icon:"📺",color:"#f6a6cd",demo:"tvmaze",featured:true},
  {id:"swapi",name:"Star Wars API",category:"Entertainment",subcategory:"Filme & Serien",description:"Planeten, Figuren, Raumschiffe und Filme aus dem Star-Wars-Universum.",endpoint:"https://www.swapi.tech/api/people/1",docs:"https://www.swapi.tech/",auth:"Keine",cors:"Ja",tags:["Star Wars","Sci-Fi","Datenbank"],icon:"🚀",color:"#f6a6cd",demo:"swapi"},
  {id:"itunes",name:"iTunes Search",category:"Entertainment",subcategory:"Musik & Audio",description:"Suche Musik, Künstler, Alben und Podcast-Episoden samt Vorschau-Links.",endpoint:"https://itunes.apple.com/search?term=daft+punk&entity=song",docs:"https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/",auth:"Keine",cors:"Ja",tags:["Musik","Podcasts","Künstler"],icon:"🎧",color:"#f6a6cd",demo:"itunes"},
  {id:"openlibrary",name:"Open Library",category:"Entertainment",subcategory:"Bücher",description:"Buchkatalog mit Titeln, Autoren, Ausgaben und Coverbildern.",endpoint:"https://openlibrary.org/search.json?q=tolkien",docs:"https://openlibrary.org/developers/api",auth:"Keine",cors:"Unklar",tags:["Bücher","Lesen","Cover"],icon:"📚",color:"#c8b2ff"},
  {id:"dog",name:"Dog CEO",category:"Tiere & Natur",subcategory:"Hunde",description:"Zufällige Hundefotos und Rasse-Endpunkte. Praktisch für kleine Spiele und Bild-Demos.",endpoint:"https://dog.ceo/api/breeds/image/random",docs:"https://dog.ceo/dog-api/",auth:"Keine",cors:"Ja",tags:["Hunde","Bilder","Zufall"],icon:"🐕",color:"#e2b57c",demo:"dog"},
  {id:"catfact",name:"Cat Fact Ninja",category:"Tiere & Natur",subcategory:"Katzen",description:"Zufällige Katzen-Fakten als JSON. Perfekt für kleine Widgets oder Tages-Fakten.",endpoint:"https://catfact.ninja/fact",docs:"https://catfact.ninja/",auth:"Keine",cors:"Ja",tags:["Katzen","Fakten","Zufall"],icon:"🐈",color:"#e2b57c",demo:"catfact"},
  {id:"randomdog",name:"Random Dog",category:"Tiere & Natur",subcategory:"Hunde",description:"Noch mehr zufällige Hundefotos für kleine Demos und kreative Projekte.",endpoint:"https://random.dog/woof.json",docs:"https://random.dog/",auth:"Keine",cors:"Unklar",tags:["Hunde","Fotos","Random"],icon:"🐶",color:"#e2b57c"},
  {id:"nasa",name:"NASA Open APIs",category:"Wissenschaft & Weltraum",subcategory:"Astronomie",description:"Astronomie-Bild des Tages und weitere offene NASA-Datensätze. Der Demo-Key hat ein begrenztes Kontingent.",endpoint:"https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",docs:"https://api.nasa.gov/",auth:"Optional",cors:"Ja",tags:["NASA","Weltraum","Bilder"],icon:"🪐",color:"#a89bff",demo:"nasa",featured:true},
  {id:"dnd",name:"D&D 5e API",category:"Wissenschaft & Weltraum",subcategory:"Fantasy & Wissen",description:"Zauber, Monster, Klassen und Ausrüstung aus dem Dungeons-&-Dragons-Regelwerk.",endpoint:"https://www.dnd5eapi.co/api/2014/monsters",docs:"https://5e-bits.github.io/docs/",auth:"Keine",cors:"Unklar",tags:["Fantasy","Monster","RPG"],icon:"🐉",color:"#c39aff"},
  {id:"artic",name:"Art Institute of Chicago",category:"Wissenschaft & Weltraum",subcategory:"Kunst & Museen",description:"Durchsuche öffentliche Museumsdaten und Kunstwerke für kreative Galerie-Projekte.",endpoint:"https://api.artic.edu/api/v1/artworks",docs:"https://api.artic.edu/docs/",auth:"Keine",cors:"Ja",tags:["Kunst","Museum","Bilder"],icon:"🖼️",color:"#c39aff"},
  {id:"github",name:"GitHub REST API",category:"Entwicklung & Code",subcategory:"Developer Tools",description:"Öffentliche Profile, Repositories, Issues und mehr. Nicht authentifiziert gelten API-Limits.",endpoint:"https://api.github.com/users/octocat",docs:"https://docs.github.com/en/rest",auth:"Optional",cors:"Ja",tags:["GitHub","Repos","Developer"],icon:"⌘",color:"#a7b7ff",demo:"github",featured:true},
  {id:"jsonplaceholder",name:"JSONPlaceholder",category:"Entwicklung & Code",subcategory:"Testdaten & JSON",description:"Fake Posts, Kommentare, Nutzer und Todos zum Testen von Frontends und HTTP-Anfragen.",endpoint:"https://jsonplaceholder.typicode.com/posts/1",docs:"https://jsonplaceholder.typicode.com/",auth:"Keine",cors:"Ja",tags:["JSON","Mock-Daten","Tests"],icon:"{ }",color:"#76cbb9"},
  {id:"dummyjson",name:"DummyJSON",category:"Entwicklung & Code",subcategory:"Testdaten & JSON",description:"Demo-Produkte, Nutzer, Rezepte und Suchendpunkte für Prototypen.",endpoint:"https://dummyjson.com/products/search?q=phone",docs:"https://dummyjson.com/docs",auth:"Keine",cors:"Ja",tags:["Produkte","Mock-Daten","REST"],icon:"🧪",color:"#76cbb9"},
  {id:"dictionary",name:"Free Dictionary API",category:"Entwicklung & Code",subcategory:"Text & Sprache",description:"Wortdefinitionen, Aussprache, Bedeutungen und Beispiele für englische Begriffe.",endpoint:"https://api.dictionaryapi.dev/api/v2/entries/en/hello",docs:"https://dictionaryapi.dev/",auth:"Keine",cors:"Ja",tags:["Wörterbuch","Sprache","Text"],icon:"📖",color:"#76cbb9",demo:"dictionary"},
  {id:"randomuser",name:"Random User Generator",category:"Entwicklung & Code",subcategory:"Testdaten & JSON",description:"Generiert zufällige Demo-Profile für Login-, Kontakt- und UI-Prototypen. Keine echten Nutzerdaten.",endpoint:"https://randomuser.me/api/",docs:"https://randomuser.me/documentation",auth:"Keine",cors:"Ja",tags:["Profile","Mock-Daten","Avatare"],icon:"👤",color:"#76cbb9",demo:"randomuser"},
  {id:"httpcat",name:"HTTP Cats",category:"Kreativ & Tools",subcategory:"Bilder & QR",description:"Jeder wichtige HTTP-Statuscode bekommt eine Katzen-Illustration. Ja, wirklich.",endpoint:"https://http.cat/200",docs:"https://http.cat/",auth:"Keine",cors:"Ja",tags:["HTTP","Katzen","Bilder"],icon:"🐱",color:"#ff9bc8",demo:"httpcat"},
  {id:"qr",name:"QR Server",category:"Kreativ & Tools",subcategory:"Bilder & QR",description:"Erzeuge direkt einen QR-Code aus Text oder einer URL. Kein eigener Server nötig.",endpoint:"https://api.qrserver.com/v1/create-qr-code/",docs:"https://goqr.me/api/",auth:"Keine",cors:"Ja",tags:["QR-Code","Generator","Bilder"],icon:"▦",color:"#ff9bc8",demo:"qr",featured:true},
  {id:"emoji",name:"EmojiHub",category:"Kreativ & Tools",subcategory:"Kreativ-Generatoren",description:"Emoji-Daten nach Kategorien und Gruppen für Picker oder kleine kreative Apps.",endpoint:"https://emojihub.yurace.pro/api/all",docs:"https://github.com/cheatsnake/emojihub",auth:"Keine",cors:"Ja",tags:["Emoji","Design","Text"],icon:"✨",color:"#ff9bc8"},
  {id:"recipe",name:"TheMealDB",category:"Essen & Alltag",subcategory:"Rezepte",description:"Suche Rezepte nach Namen und erhalte Zutaten, Anleitungen und Bilder.",endpoint:"https://www.themealdb.com/api/json/v1/1/search.php?s=chicken",docs:"https://www.themealdb.com/api.php",auth:"Optional",cors:"Ja",tags:["Rezepte","Zutaten","Küche"],icon:"🍜",color:"#f3b86d",demo:"recipe"},
  {id:"jokes",name:"JokeAPI",category:"Essen & Alltag",subcategory:"Fun & Zufall",description:"Liefert harmlose Witze und Programmierhumor mit Safe-Mode.",endpoint:"https://v2.jokeapi.dev/joke/Programming?safe-mode",docs:"https://jokeapi.dev/",auth:"Keine",cors:"Ja",tags:["Witze","Fun","Programmieren"],icon:"😄",color:"#f3b86d",demo:"joke"},
  {id:"currency",name:"Frankfurter",category:"Finanzen & Daten",subcategory:"Währungen",description:"Wechselkurse auf Basis veröffentlichter Referenzdaten. Kein Schlüssel nötig; nicht für Finanzberatung.",endpoint:"https://api.frankfurter.dev/v1/latest?base=EUR",docs:"https://frankfurter.dev/",auth:"Keine",cors:"Ja",tags:["Euro","Kurse","Währungen"],icon:"💱",color:"#80d9a5",demo:"currency",featured:true},
  {id:"coingecko",name:"CoinGecko API",category:"Finanzen & Daten",subcategory:"Krypto & Märkte",description:"Kryptowährungsdaten, Marktkapitalisierung und Preishistorie. Öffentliche Nutzung ist limitiert und kann Schlüssel erfordern.",endpoint:"https://api.coingecko.com/api/v3/coins/markets",docs:"https://docs.coingecko.com/",auth:"Optional",cors:"Unklar",tags:["Krypto","Marktdaten","Preise"],icon:"₿",color:"#80d9a5"},
  {id:"randomfacts",name:"Useless Facts",category:"Finanzen & Daten",subcategory:"Zufallsdaten",description:"Zufällige Fakten für kleine Karten, tägliche Funfacts und API-Demos.",endpoint:"https://uselessfacts.jsph.pl/api/v2/facts/random?language=en",docs:"https://uselessfacts.jsph.pl/",auth:"Keine",cors:"Unklar",tags:["Fakten","Random","Widget"],icon:"💡",color:"#80d9a5"},
];

const groups: {name:string; icon:LucideIcon; sub:string[]; tint:string}[] = [
  {name:"Gaming",icon:Gamepad2,sub:["Brawl Stars","Pokémon","Minecraft","PC-Gaming","Shooter & E-Sport"],tint:"#ffb84f"},
  {name:"Wetter & Geo",icon:Globe2,sub:["Wetter","Länder & Geografie","Karten & Orte"],tint:"#74d9e8"},
  {name:"Entertainment",icon:Film,sub:["Anime & Manga","Filme & Serien","Musik & Audio","Bücher"],tint:"#f6a6cd"},
  {name:"Tiere & Natur",icon:Heart,sub:["Hunde","Katzen","Wildtiere"],tint:"#e2b57c"},
  {name:"Wissenschaft & Weltraum",icon:Telescope,sub:["Astronomie","Fantasy & Wissen","Kunst & Museen"],tint:"#a89bff"},
  {name:"Entwicklung & Code",icon:Code2,sub:["Developer Tools","Testdaten & JSON","Text & Sprache"],tint:"#76cbb9"},
  {name:"Kreativ & Tools",icon:Palette,sub:["Bilder & QR","Kreativ-Generatoren"],tint:"#ff9bc8"},
  {name:"Essen & Alltag",icon:Utensils,sub:["Rezepte","Fun & Zufall"],tint:"#f3b86d"},
  {name:"Finanzen & Daten",icon:Database,sub:["Währungen","Krypto & Märkte","Zufallsdaten"],tint:"#80d9a5"},
];

type KeyMode = "header" | "query";
type ApiKeyConfig = { value: string; mode: KeyMode; field: string; prefix: string };
function readApiKeys(): Record<string, ApiKeyConfig> {
  try {
    const value = localStorage.getItem("apiverse-api-keys-v1");
    return value ? JSON.parse(value) as Record<string, ApiKeyConfig> : {};
  } catch { return {}; }
}
function getKeyDefaults(apiId: string): Omit<ApiKeyConfig, "value"> {
  if (apiId === "nasa") return { mode: "query", field: "api_key", prefix: "" };
  if (["rawg", "steam", "opencage"].includes(apiId)) return { mode: "query", field: "key", prefix: "" };
  if (apiId === "coingecko") return { mode: "header", field: "x-cg-demo-api-key", prefix: "" };
  if (apiId === "github") return { mode: "header", field: "Authorization", prefix: "Bearer " };
  return { mode: "header", field: "Authorization", prefix: "" };
}
function getKeyFieldForMode(apiId: string, mode: KeyMode): string {
  const defaults = getKeyDefaults(apiId);
  if (mode === defaults.mode) return defaults.field;
  return mode === "query" ? "api_key" : "Authorization";
}
function readSaved(key:string, fallback:string[]) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as string[] : fallback; }
  catch { return fallback; }
}
function prettyNum(value:number) {
  return new Intl.NumberFormat("de-DE", {notation:value > 999999 ? "compact" : "standard", maximumFractionDigits:1}).format(value);
}
function ApiVerse() {
  const [search,setSearch] = useState("");
  const [category,setCategory] = useState("Alle APIs");
  const [subcategory,setSubcategory] = useState("");
  const [view,setView] = useState<"discover"|"favorites"|"playground"|"overlays">("discover");
  const [overlayApiId,setOverlayApiId] = useState("weather");
  const [favorites,setFavorites] = useState<string[]>(() => readSaved("apiverse-favorites",[]));
  const [expanded,setExpanded] = useState<string[]>(["Gaming"]);
  const [active,setActive] = useState<ApiItem|null>(null);
  const [dark,setDark] = useState(() => localStorage.getItem("apiverse-theme") !== "light");
  const [mobile,setMobile] = useState(false);
  const [demoInput,setDemoInput] = useState("");
  const [demoLoading,setDemoLoading] = useState(false);
  const [demoError,setDemoError] = useState("");
  const [demoResult,setDemoResult] = useState<any>(null);
  const [copied,setCopied] = useState(false);
  const [apiKeys,setApiKeys] = useState<Record<string, ApiKeyConfig>>(() => readApiKeys());
  const [keyDraft,setKeyDraft] = useState("");
  const [keyMode,setKeyMode] = useState<KeyMode>("header");
  const [keyField,setKeyField] = useState("Authorization");
  const [keyPrefix,setKeyPrefix] = useState("");
  const [keyVisible,setKeyVisible] = useState(false);
  const [keyNotice,setKeyNotice] = useState("");
  const [customEndpoint,setCustomEndpoint] = useState("");
  const [customLoading,setCustomLoading] = useState(false);
  const [customError,setCustomError] = useState("");
  const [customResult,setCustomResult] = useState<any>(null);

  useEffect(() => { try { localStorage.setItem("apiverse-api-keys-v1",JSON.stringify(apiKeys)); } catch {} },[apiKeys]);
  useEffect(() => { try { localStorage.setItem("apiverse-favorites",JSON.stringify(favorites)); } catch {} },[favorites]);
  useEffect(() => { try { localStorage.setItem("apiverse-theme",dark?"dark":"light"); } catch {} },[dark]);
  useEffect(() => {
    const handler = (e:KeyboardEvent) => {
      if ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="k") { e.preventDefault(); document.getElementById("apiverse-search")?.focus(); }
      if (e.key==="Escape") { setActive(null); setMobile(false); }
    };
    window.addEventListener("keydown",handler); return () => window.removeEventListener("keydown",handler);
  },[]);

  const filtered = useMemo(() => apis.filter(api => {
    if (view==="favorites" && !favorites.includes(api.id)) return false;
    if (view==="playground" && !api.demo) return false;
    if (view==="discover" && category!=="Alle APIs" && api.category!==category) return false;
    if (subcategory && api.subcategory!==subcategory) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [api.name,api.description,api.category,api.subcategory,...api.tags].join(" ").toLowerCase().includes(q);
  }),[search,category,subcategory,view,favorites]);

  function chooseCategory(name:string) { setCategory(name); setSubcategory(""); setView("discover"); setMobile(false); }
  function chooseSub(name:string,sub:string) { setCategory(name); setSubcategory(sub); setView("discover"); setMobile(false); }
  function chooseView(next:"discover"|"favorites"|"playground"|"overlays") { setView(next); setCategory("Alle APIs"); setSubcategory(""); setMobile(false); }
  function startOverlay(apiId:string) { setOverlayApiId(apiId); setView("overlays"); setActive(null); setCategory("Alle APIs"); setSubcategory(""); setMobile(false); window.scrollTo({top:0,behavior:"smooth"}); }
  function toggleFavorite(id:string) { setFavorites(old => old.includes(id) ? old.filter(x=>x!==id) : [...old,id]); }
  function openApi(api:ApiItem) {
    setActive(api);
    setDemoInput(api.demo==="weather"?"Berlin":api.demo==="pokemon"?"pikachu":api.demo==="tvmaze"?"doctor":api.demo==="country"?"germany":api.demo==="jikan"?"one piece":api.demo==="github"?"octocat":api.demo==="dictionary"?"hello":api.demo==="recipe"?"chicken":api.demo==="itunes"?"daft punk":"");
    const defaults = getKeyDefaults(api.id);
    const saved = apiKeys[api.id];
    setKeyDraft(saved?.value || "");
    setKeyMode(saved?.mode || defaults.mode);
    setKeyField(saved?.field || defaults.field);
    setKeyPrefix(saved?.prefix ?? defaults.prefix);
    setKeyVisible(false);
    setKeyNotice("");
    setCustomEndpoint(api.endpoint);
    setCustomLoading(false);
    setCustomError("");
    setCustomResult(null);
    setDemoResult(null);
    setDemoError("");
    setDemoLoading(false);
  }
  function saveApiKey() {
    if (!active) return;
    const value = keyDraft.trim();
    if (!value) { setKeyNotice("Bitte einen Schlüssel eintragen oder auf „Entfernen“ klicken."); return; }
    const config: ApiKeyConfig = {
      value,
      mode: keyMode,
      field: keyField.trim() || (keyMode === "query" ? "api_key" : "Authorization"),
      prefix: keyMode === "header" ? keyPrefix : ""
    };
    setApiKeys(old => ({ ...old, [active.id]: config }));
    setKeyField(config.field);
    setKeyPrefix(config.prefix);
    setKeyNotice("Schlüssel nur auf diesem Gerät gespeichert.");
  }
  function removeApiKey() {
    if (!active) return;
    setApiKeys(old => { const next = { ...old }; delete next[active.id]; return next; });
    const defaults = getKeyDefaults(active.id);
    setKeyDraft("");
    setKeyMode(defaults.mode);
    setKeyField(defaults.field);
    setKeyPrefix(defaults.prefix);
    setKeyNotice("Gespeicherter Schlüssel entfernt.");
  }
  async function requestWithApiKey(url: string, init: RequestInit = {}) {
    let requestUrl = url;
    const headers = new Headers(init.headers);
    const config = active ? apiKeys[active.id] : undefined;
    if (config?.value?.trim()) {
      if (config.mode === "query") {
        const parsed = new URL(requestUrl);
        parsed.searchParams.set(config.field || "api_key", config.value);
        requestUrl = parsed.toString();
      } else {
        headers.set(config.field || "Authorization", (config.prefix || "") + config.value);
      }
    }
    return fetch(requestUrl, { ...init, headers });
  }
  async function runCustomRequest() {
    if (!active) return;
    setCustomLoading(true);
    setCustomError("");
    setCustomResult(null);
    try {
      const url = new URL(customEndpoint.trim());
      if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Nur HTTP- und HTTPS-URLs sind erlaubt.");
      const response = await requestWithApiKey(url.toString());
      const body = await response.text();
      let data: any = body;
      try { data = body ? JSON.parse(body) : null; } catch { /* Keep plain-text responses readable. */ }
      if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText + (body ? ": " + body.slice(0, 260) : ""));
      setCustomResult(data);
    } catch (error) {
      setCustomError(error instanceof Error ? error.message : "Anfrage fehlgeschlagen. Prüfe URL, API-Key und Browserzugriff (CORS).");
    } finally { setCustomLoading(false); }
  }
  async function runDemo() {
    if (!active?.demo) return;
    setDemoLoading(true); setDemoError(""); setDemoResult(null);
    const q = demoInput.trim();
    const enc = encodeURIComponent(q);
    try {
      let result:any;
      switch (active.demo) {
        case "brawl": {
          const r = await requestWithApiKey("https://api.brawlapi.com/v1/brawlers"); if(!r.ok) throw new Error("BrawlAPI antwortet gerade nicht ("+r.status+").");
          const d=await r.json(); const rows=Array.isArray(d)?d:(d.list||d.items||[]);
          result={kind:"cards",title:"Brawler im Verzeichnis",items:rows.slice(0,18).map((b:any)=>({title:b.name||"Brawler",subtitle:[b.rarity?.name,b.class?.name].filter(Boolean).join(" · ")||"Brawl Stars",image:b.imageUrl||b.image||b.icon,name:b.name}))};
          if(!rows.length) throw new Error("Die API hat keine Brawler-Liste geliefert.");
          break;
        }
        case "weather": {
          if(!q) throw new Error("Gib zuerst einen Ort ein.");
          const g=await requestWithApiKey("https://geocoding-api.open-meteo.com/v1/search?name="+enc+"&count=1&language=de&format=json");
          if(!g.ok) throw new Error("Ortssuche fehlgeschlagen.");
          const gd=await g.json(); const place=gd.results?.[0]; if(!place) throw new Error("Ort nicht gefunden. Prüfe die Schreibweise.");
          const r=await requestWithApiKey("https://api.open-meteo.com/v1/forecast?latitude="+place.latitude+"&longitude="+place.longitude+"&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=3");
          if(!r.ok) throw new Error("Wetterdaten nicht erreichbar.");
          result={kind:"weather",place:place.name+(place.admin1?", "+place.admin1:"")+", "+place.country,data:await r.json()};
          break;
        }
        case "pokemon": {
          const r=await requestWithApiKey("https://pokeapi.co/api/v2/pokemon/"+(q||"pikachu").toLowerCase().replace(/\s+/g,"-"));
          if(!r.ok) throw new Error("Pokémon nicht gefunden. Probiere z. B. pikachu oder 25.");
          const d=await r.json(); result={kind:"pokemon",data:d}; break;
        }
        case "tvmaze": {
          if(!q) throw new Error("Gib einen Seriennamen ein.");
          const r=await requestWithApiKey("https://api.tvmaze.com/search/shows?q="+enc); if(!r.ok) throw new Error("TVmaze ist gerade nicht erreichbar.");
          const d=await r.json(); result={kind:"cards",title:"Serien-Treffer",items:d.slice(0,8).map((x:any)=>({title:x.show.name,subtitle:[x.show.premiered?.slice(0,4),x.show.status,x.show.genres?.slice(0,2).join(", ")].filter(Boolean).join(" · "),image:x.show.image?.medium,description:x.show.summary?.replace(/<[^>]*>/g,"").slice(0,180)}))}; break;
        }
        case "country": {
          if(!q) throw new Error("Gib ein Land ein.");
          const r=await requestWithApiKey("https://restcountries.com/v3.1/name/"+enc+"?fields=name,capital,region,population,flags,currencies,languages");
          if(!r.ok) throw new Error("Land nicht gefunden.");
          const d=await r.json(); result={kind:"cards",title:"Länder-Treffer",items:d.slice(0,5).map((c:any)=>({title:c.name?.common,subtitle:[c.region,c.capital?.[0]].filter(Boolean).join(" · "),image:c.flags?.png,description:"Einwohner: "+prettyNum(c.population||0)+" · Sprachen: "+Object.values(c.languages||{}).slice(0,3).join(", "),name:c.name?.common}))}; break;
        }
        case "dog": { const r=await requestWithApiKey("https://dog.ceo/api/breeds/image/random"); if(!r.ok) throw new Error("Dog API nicht erreichbar."); result={kind:"image",url:(await r.json()).message,title:"Zufälliger Hund"}; break; }
        case "catfact": { const r=await requestWithApiKey("https://catfact.ninja/fact"); if(!r.ok) throw new Error("Cat Fact API nicht erreichbar."); const d=await r.json(); result={kind:"fact",title:"Katzen-Fakt",text:d.fact,meta:(d.length||"")+" Zeichen"}; break; }
        case "jikan": {
          if(!q) throw new Error("Gib einen Anime-Titel ein.");
          const r=await requestWithApiKey("https://api.jikan.moe/v4/anime?q="+enc+"&limit=8"); if(!r.ok) throw new Error("Jikan hat das Limit erreicht oder ist nicht erreichbar.");
          const d=await r.json(); result={kind:"cards",title:"Anime-Treffer",items:d.data.map((x:any)=>({title:x.title,subtitle:[x.year,x.type,x.episodes?x.episodes+" Folgen":""].filter(Boolean).join(" · "),image:x.images?.jpg?.image_url,description:x.synopsis?.slice(0,180)}))}; break;
        }
        case "github": {
          const name=q||"octocat"; const r=await requestWithApiKey("https://api.github.com/users/"+encodeURIComponent(name)); if(!r.ok) throw new Error("GitHub-Nutzer nicht gefunden oder API-Limit erreicht.");
          const d=await r.json(); result={kind:"profile",title:d.login,subtitle:d.name||"GitHub-Profil",image:d.avatar_url,description:d.bio,stats:[["Repos",d.public_repos],["Follower",d.followers],["Folgt",d.following]],url:d.html_url,meta:d.location||d.company}; break;
        }
        case "dictionary": {
          if(!q) throw new Error("Gib ein englisches Wort ein.");
          const r=await requestWithApiKey("https://api.dictionaryapi.dev/api/v2/entries/en/"+enc); if(!r.ok) throw new Error("Wort nicht gefunden.");
          const d=await r.json(); result={kind:"dictionary",data:d[0]}; break;
        }
        case "recipe": {
          if(!q) throw new Error("Gib eine Zutat oder einen Rezeptnamen ein.");
          const r=await requestWithApiKey("https://www.themealdb.com/api/json/v1/1/search.php?s="+enc); if(!r.ok) throw new Error("Rezeptsuche nicht verfügbar.");
          const d=await r.json(); result={kind:"cards",title:"Rezept-Treffer",items:(d.meals||[]).slice(0,8).map((m:any)=>({title:m.strMeal,subtitle:m.strArea+" · "+m.strCategory,image:m.strMealThumb,description:m.strInstructions?.slice(0,180),url:m.strSource||m.strYoutube}))}; if(!result.items.length) throw new Error("Kein Rezept gefunden."); break;
        }
        case "joke": {
          const r=await requestWithApiKey("https://v2.jokeapi.dev/joke/Programming?safe-mode"); if(!r.ok) throw new Error("Joke API nicht erreichbar.");
          const d=await r.json(); result={kind:"fact",title:"Programmier-Witz",text:d.type==="twopart"?d.setup+"\n\n"+d.delivery:d.joke,meta:"Safe Mode aktiv"}; break;
        }
        case "currency": {
          const r=await requestWithApiKey("https://api.frankfurter.dev/v1/latest?base=EUR"); if(!r.ok) throw new Error("Wechselkurse momentan nicht erreichbar.");
          const d=await r.json(); result={kind:"currency",data:d}; break;
        }
        case "nasa": {
          const r=await requestWithApiKey("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"); if(!r.ok) throw new Error("NASA-Demo-Key ist limitiert. Später erneut versuchen.");
          const d=await r.json(); result={kind:"nasa",data:d}; break;
        }
        case "qr": {
          const value=q||"https://apivault.dev/";
          result={kind:"qr",value,url:"https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data="+encodeURIComponent(value)}; break;
        }
        case "swapi": {
          const r=await requestWithApiKey("https://www.swapi.tech/api/people/1"); if(!r.ok) throw new Error("Star Wars API gerade nicht erreichbar.");
          const d=await r.json(); result={kind:"json",data:d.result||d}; break;
        }
        case "randomuser": {
          const r=await requestWithApiKey("https://randomuser.me/api/"); if(!r.ok) throw new Error("Random User API nicht erreichbar.");
          const d=(await r.json()).results?.[0]; result={kind:"profile",title:d.name.first+" "+d.name.last,subtitle:d.email,image:d.picture.large,description:"Demo-Profil aus synthetischen Daten.",stats:[["Land",d.location.country],["Alter",d.dob.age],["Telefon",d.phone]],meta:d.location.city}; break;
        }
        case "httpcat": result={kind:"image",url:"https://http.cat/"+(q||"200").replace(/[^0-9]/g,"").slice(0,3),title:"HTTP Cats · Status "+(q||"200")}; break;
        case "itunes": {
          const r=await requestWithApiKey("https://itunes.apple.com/search?term="+encodeURIComponent(q||"daft punk")+"&entity=song&limit=8"); if(!r.ok) throw new Error("iTunes-Suche fehlgeschlagen.");
          const d=await r.json(); result={kind:"cards",title:"Musik-Treffer",items:d.results.map((m:any)=>({title:m.trackName||m.collectionName,subtitle:[m.artistName,m.collectionName].filter(Boolean).join(" · "),image:m.artworkUrl100,url:m.trackViewUrl,description:m.primaryGenreName}))}; break;
        }
      }
      setDemoResult(result);
    } catch(e) { setDemoError(e instanceof Error ? e.message : "Unbekannter Fehler. Die API könnte gerade nicht erreichbar sein."); }
    finally { setDemoLoading(false); }
  }

  async function copyEndpoint(api:ApiItem) {
    try { await navigator.clipboard.writeText(api.endpoint); setCopied(true); window.setTimeout(()=>setCopied(false),1400); }
    catch { window.prompt("Endpoint kopieren:",api.endpoint); }
  }
  const shownTitle = view==="favorites" ? "Deine Favoriten" : view==="playground" ? "Live Playground" : (subcategory || (category==="Alle APIs" ? "API entdecken" : category));
  const shownDescription = view==="favorites" ? "Deine gespeicherten APIs, direkt griffbereit." : view==="playground" ? "Wähle eine API mit Demo und teste echte Antworten direkt im Browser." : subcategory ? "APIs in der Unterkategorie "+subcategory+"." : "Durchsuche kuratierte APIs für Games, Daten, kreative Ideen und echte Projekte.";
  const featured = apis.filter(a=>a.featured).slice(0,4);
  
  return <div className={"av-root "+(dark?"av-dark":"av-light")}>
    <div className="av-orb av-orb-one"/><div className="av-orb av-orb-two"/>
    <aside className={"av-sidebar "+(mobile?"av-sidebar-open":"")}>
      <div className="av-brand" onClick={()=>chooseView("discover")} role="button" tabIndex={0}>
        <div className="av-brand-mark"><Layers3 size={23}/></div>
        <div><div className="av-brand-name">API<span>verse</span></div><div className="av-brand-sub">OPEN API UNIVERSE</div></div>
        <button className="av-mobile-close" onClick={(e)=>{e.stopPropagation();setMobile(false)}} aria-label="Menü schließen"><X size={18}/></button>
      </div>
      <div className="av-nav-label">WORKSPACE</div>
      <button className={"av-nav-item "+(view==="discover"?"active":"")} onClick={()=>chooseView("discover")}><Compass size={17}/> <span>Entdecken</span><small>{apis.length}</small></button>
      <button className={"av-nav-item "+(view==="playground"?"active":"")} onClick={()=>chooseView("playground")}><Zap size={17}/> <span>Live Playground</span><small className="av-live">LIVE</small></button>
      <button className={"av-nav-item "+(view==="overlays"?"active":"")} onClick={()=>chooseView("overlays")}><MonitorPlay size={17}/> <span>OBS Overlay Studio</span><small className="av-live">NEW</small></button>
      <button className={"av-nav-item "+(view==="favorites"?"active":"")} onClick={()=>chooseView("favorites")}><Bookmark size={17}/> <span>Favoriten</span><small>{favorites.length}</small></button>
      <div className="av-nav-label av-nav-label-row">KATEGORIEN <span>{groups.length}</span></div>
      <nav className="av-category-list">
        <button className={"av-category-all "+(category==="Alle APIs"&&!subcategory&&view==="discover"?"active":"")} onClick={()=>chooseCategory("Alle APIs")}><span className="av-category-icon">✳</span> Alle APIs <span className="av-count">{apis.length}</span></button>
        {groups.map(group=>{
          const Icon=group.icon; const items=apis.filter(a=>a.category===group.name);
          return <div className={"av-group "+(expanded.includes(group.name)?"expanded":"")} key={group.name}>
            <div className="av-group-row">
              <button className={"av-category-btn "+(category===group.name?"active":"")} onClick={()=>chooseCategory(group.name)}><span className="av-category-icon" style={{color:group.tint}}><Icon size={16}/></span><span>{group.name}</span><small>{items.length}</small></button>
              <button className="av-expand-btn" aria-label={group.name+" aufklappen"} onClick={()=>setExpanded(old=>old.includes(group.name)?old.filter(x=>x!==group.name):[...old,group.name])}>{expanded.includes(group.name)?<ChevronDown size={13}/>:<ChevronRight size={13}/>}</button>
            </div>
            {expanded.includes(group.name)&&<div className="av-subcats">{group.sub.map(sub=><button key={sub} className={"av-subcat "+(subcategory===sub?"active":"")} onClick={()=>chooseSub(group.name,sub)}>{sub}<span>{apis.filter(a=>a.subcategory===sub).length}</span></button>)}</div>}
          </div>
        })}
      </nav>
      <div className="av-sidebar-bottom"><div className="av-status"><span/> APIverse läuft lokal im Browser</div><div className="av-sidebar-note">Kuratiert mit Inspiration von <a href="https://apivault.dev/" target="_blank" rel="noreferrer">APIVault ↗</a></div><div className="av-sidebar-version">MADE FOR CURIOUS MINDS · v1.0</div></div>
    </aside>
    {mobile&&<button className="av-scrim" aria-label="Menü schließen" onClick={()=>setMobile(false)}/>}
    <main className={"av-main "+(view==="overlays"?"av-main-studio":"")}>
      <header className="av-topbar">
        <div className="av-top-left"><button className="av-icon-btn av-menu-btn" onClick={()=>setMobile(true)} aria-label="Menü öffnen"><Menu size={19}/></button><div className="av-breadcrumb">APIverse <ChevronRight size={13}/><strong>{view==="discover"?"Entdecken":view==="favorites"?"Favoriten":"Playground"}</strong></div></div>
        <div className="av-top-actions"><label className="av-search-wrap"><Search size={17}/><input id="apiverse-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="APIs, Kategorien suchen …"/><kbd>⌘ K</kbd></label><button className="av-icon-btn" title={dark?"Hellmodus":"Dunkelmodus"} aria-label="Farbschema wechseln" onClick={()=>setDark(!dark)}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button><a className="av-github-btn" href="https://github.com/Lennonbsiq999/craft-attack-app" target="_blank" rel="noreferrer"><Code2 size={15}/> <span>GitHub</span><ArrowUpRight size={13}/></a></div>
      </header>
      <div className="av-content">
        <section className="av-overlay-studio-page" hidden={view!=="overlays"}><OverlayStudio initialApiId={overlayApiId} apiKeys={apiKeys}/></section>
        {view==="discover"&&!search&&!subcategory&&category==="Alle APIs"&&<section className="av-hero">
          <div className="av-hero-copy"><div className="av-eyebrow"><span className="av-pulse"/> DEIN ZUGANG ZU DEN APIs</div><h1>Ideen rein.<br/><span>APIs entdecken.</span></h1><p>Die besten öffentlichen APIs für Games, KI, Wetter, Filme, Daten und verrückte Projekte. Finden, testen und direkt losbauen.</p><div className="av-hero-actions"><button className="av-primary-btn" onClick={()=>document.getElementById("av-catalog")?.scrollIntoView({behavior:"smooth"})}>APIs entdecken <ArrowRight size={16}/></button><button className="av-secondary-btn" onClick={()=>chooseView("playground")}><Play size={15}/> Live Playground</button></div><div className="av-hero-pills"><span><Check size={13}/> Kein Account nötig</span><span><Zap size={13}/> Live Demos</span><span><Bookmark size={13}/> Favoriten speichern</span></div></div>
          <div className="av-hero-art" aria-hidden="true"><div className="av-art-ring ring-one"/><div className="av-art-ring ring-two"/><div className="av-art-center"><Layers3 size={42}/></div><div className="av-float-chip chip-a"><Gamepad2 size={15}/> Games API</div><div className="av-float-chip chip-b"><CloudSun size={15}/> Wetter live</div><div className="av-float-chip chip-c"><Code2 size={15}/> REST / JSON</div><div className="av-art-dot dot-a"/><div className="av-art-dot dot-b"/></div>
          <div className="av-hero-grid"/>
        </section>}
        {view==="discover"&&!search&&!subcategory&&category==="Alle APIs"&&<section className="av-stats-row">
          <div className="av-stat"><div className="av-stat-icon purple"><Layers3 size={17}/></div><div><strong>{apis.length}</strong><span>Kuratierte APIs</span></div><small>DISCOVER</small></div>
          <div className="av-stat"><div className="av-stat-icon mint"><Zap size={17}/></div><div><strong>{apis.filter(a=>a.demo).length}</strong><span>Direkt testbar</span></div><small>LIVE DEMOS</small></div>
          <div className="av-stat"><div className="av-stat-icon orange"><Globe2 size={17}/></div><div><strong>{groups.length}</strong><span>Hauptkategorien</span></div><small>EXPLORE</small></div>
          <div className="av-stat"><div className="av-stat-icon pink"><Star size={17}/></div><div><strong>{favorites.length}</strong><span>Deine Favoriten</span></div><small>BOOKMARKS</small></div>
        </section>}
        {view==="discover"&&!search&&!subcategory&&category==="Alle APIs"&&<section className="av-section av-featured-section"><div className="av-section-head"><div><div className="av-kicker">HANDVERLESEN <span>✦</span></div><h2>Gute APIs. Direkt zum Start.</h2><p>Ein paar Favoriten für dein nächstes Projekt.</p></div><button className="av-text-btn" onClick={()=>document.getElementById("av-catalog")?.scrollIntoView({behavior:"smooth"})}>Alle APIs ansehen <ArrowRight size={15}/></button></div><div className="av-featured-grid">{featured.map((api,i)=><button key={api.id} className={"av-featured-card accent-"+i} onClick={()=>openApi(api)}><div className="av-featured-top"><span className="av-featured-icon">{api.icon}</span><span className="av-arrow"><ArrowUpRight size={16}/></span></div><strong>{api.name}</strong><p>{api.description}</p><div className="av-featured-meta"><span>{api.category}</span>{api.demo&&<em><Activity size={11}/> Live-Demo</em>}</div></button>)}</div></section>}
        <section className="av-section av-catalog-section" id="av-catalog">
          <div className="av-section-head"><div><div className="av-kicker">{view==="favorites"?"DEIN WORKSPACE":view==="playground"?"LIVE API LAB":"API DIRECTORY"} <span>✦</span></div><h2>{shownTitle}</h2><p>{shownDescription}</p></div><div className="av-count-badge"><span/>{filtered.length} Treffer</div></div>
          {view==="discover"&&!search&&!subcategory&&category==="Alle APIs"&&<div className="av-category-tiles">{groups.slice(0,6).map(g=>{const Icon=g.icon;return <button key={g.name} className="av-category-tile" onClick={()=>chooseCategory(g.name)}><span style={{color:g.tint}}><Icon size={19}/></span><strong>{g.name}</strong><small>{apis.filter(a=>a.category===g.name).length} APIs</small><ArrowUpRight size={14}/></button>})}</div>}
          <div className="av-toolbar"><div className="av-chips"><button className={!search&&!subcategory&&category==="Alle APIs"&&view==="discover"?"selected":""} onClick={()=>chooseCategory("Alle APIs")}>Alle APIs</button><button className={view==="playground"?"selected":""} onClick={()=>chooseView("playground")}><Zap size={12}/> Live testbar</button><button className={view==="favorites"?"selected":""} onClick={()=>chooseView("favorites")}><Star size={12}/> Favoriten</button><span className="av-toolbar-divider"/><span className="av-filter-caption">Filter nach Kategorie im Menü ↖</span></div><span className="av-sort-label">SORTIERT: <b>EMPFOHLEN</b></span></div>
          <div className="av-api-grid">{filtered.map((api,i)=><article className="av-api-card" key={api.id} style={{animationDelay:Math.min(i*25,250)+"ms"}}><div className="av-api-card-top"><div className="av-api-icon" style={{"--api-tint":api.color} as CSSProperties}>{api.icon}</div><button className={"av-fav-btn "+(favorites.includes(api.id)?"favorited":"")} onClick={()=>toggleFavorite(api.id)} title={favorites.includes(api.id)?"Favorit entfernen":"Zu Favoriten hinzufügen"} aria-label="Favorit umschalten"><Star size={16} fill={favorites.includes(api.id)?"currentColor":"none"}/></button></div><div className="av-api-name-row"><h3>{api.name}</h3>{api.featured&&<span className="av-hot"><Flame size={10}/> TOP</span>}</div><div className="av-api-sub">{api.subcategory}</div><p className="av-api-desc">{api.description}</p><div className="av-api-tags">{api.auth==="Keine"?<span className="av-tag green"><Check size={10}/> Kein Key</span>:<span className="av-tag amber">{api.auth==="OAuth"?"OAuth":"Key möglich"}</span>}<span className={"av-tag "+(api.demo?"cyan":"")}>{api.demo?<><Activity size={10}/> Live-Demo</>:"Dokumentation"}</span></div><div className="av-api-card-footer"><span className="av-api-category">{api.icon} {api.category}</span><div className="av-card-footer-actions"><button className="av-card-overlay-link" onClick={()=>startOverlay(api.id)} title="OBS-Overlay für diese API erstellen" aria-label={"OBS Overlay für "+api.name+" erstellen"}><MonitorPlay size={13}/></button><button onClick={()=>openApi(api)}>{api.demo?"API testen":"Details ansehen"} <ArrowRight size={13}/></button></div></div></article>)}
          {filtered.length===0&&<div className="av-empty"><div><Search size={25}/></div><h3>Nichts gefunden</h3><p>Keine API passt zu deinem Filter. Versuch einen anderen Suchbegriff oder setz die Filter zurück.</p><button className="av-primary-btn" onClick={()=>{setSearch("");chooseView("discover")}}>Filter zurücksetzen <ArrowRight size={14}/></button></div>}
          </div>
        </section>
        <section className="av-lab-banner"><div className="av-lab-icon"><Terminal size={25}/></div><div><div className="av-kicker">FÜR MAKER & NEUGIERIGE</div><h2>Eine Idee. Tausend Möglichkeiten.</h2><p>Starte eine Live-Demo, kopiere einen Endpoint oder öffne die Original-Dokumentation. Deine nächste App wartet nicht auf ein Abo.</p></div><button onClick={()=>chooseView("playground")}>Zum Playground <ArrowRight size={15}/></button><div className="av-lab-decor">{"{ }"}</div></section>
        <footer className="av-footer"><div className="av-footer-brand"><div className="av-brand-mark"><Layers3 size={19}/></div><div><strong>APIverse</strong><span>Das offene API-Universum.</span></div></div><div className="av-footer-links"><a href="https://apivault.dev/" target="_blank" rel="noreferrer">Inspiration: APIVault <ExternalLink size={12}/></a><a href="https://github.com/Lennonbsiq999/craft-attack-app" target="_blank" rel="noreferrer">Open Source <ExternalLink size={12}/></a></div><p>APIs werden von Drittanbietern betrieben. Verfügbarkeit, Kontingente und Nutzungsbedingungen können sich ändern.</p></footer>
      </div>
    </main>
    {active&&<div className="av-modal-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setActive(null)}}><section className="av-modal" role="dialog" aria-modal="true" aria-labelledby="av-modal-title"><header className="av-modal-header"><div className="av-modal-icon" style={{"--api-tint":active.color} as CSSProperties}>{active.icon}</div><div className="av-modal-title"><div className="av-modal-kicker">{active.category} / {active.subcategory}</div><h2 id="av-modal-title">{active.name}</h2><p>{active.description}</p></div><button className="av-icon-btn" onClick={()=>{setOverlayApiId(active.id);setActive(null);chooseView("overlays");}} title="OBS-Overlay erstellen" aria-label="OBS-Overlay erstellen"><MonitorPlay size={17}/></button><button className="av-icon-btn" onClick={()=>setActive(null)} aria-label="Schließen"><X size={19}/></button></header><div className="av-modal-body"><div className="av-modal-badges"><span className={active.auth==="Keine"?"green": "amber"}>{active.auth==="Keine"?"✓ Kein API-Key nötig":active.auth==="OAuth"?"OAuth erforderlich":active.auth==="Optional"?"Key je nach Endpunkt":"API-Key erforderlich"}</span><span>{active.cors==="Ja"?"✓ Browserzugriff laut Quelle":active.cors==="Nein"?"Browserzugriff eingeschränkt":"? CORS bitte prüfen"}</span>{active.demo&&<span className="cyan">⚡ Live-Demo verfügbar</span>}</div><div className="av-detail-grid"><div><label>ENDPOINT / BEISPIEL</label><code>{active.endpoint}</code><button className="av-copy-btn" onClick={()=>copyEndpoint(active)}>{copied?<Check size={13}/>:<Copy size={13}/>} {copied?"Kopiert":"Endpoint kopieren"}</button></div><div><label>ZUGANG & HINWEISE</label><p>{active.auth==="Keine"?"Laut Eintrag ohne API-Key nutzbar. Limits und Nutzungsbedingungen des Anbieters beachten.":active.auth==="API-Key"?"Dieser Dienst erwartet typischerweise einen eigenen Schlüssel. Niemals private Schlüssel in eine öffentliche Website oder ein GitHub-Repository committen.":active.auth==="OAuth"?"Authentifizierung über OAuth kann je nach Funktion nötig sein.": "Einige Funktionen sind offen, andere können einen Schlüssel oder ein Konto voraussetzen."}</p><a className="av-doc-link" href={active.docs} target="_blank" rel="noreferrer">Offizielle Dokumentation öffnen <ExternalLink size={13}/></a></div></div><div className="av-endpoint-code"><div><span/><span/><span/><label>REQUEST PREVIEW</label><button onClick={()=>copyEndpoint(active)}><Copy size={12}/> Kopieren</button></div><pre>GET {active.endpoint}</pre></div>
          <section className="av-key-panel" aria-label="API-Key verwalten">
            <div className="av-key-panel-heading"><div><span className="av-demo-live"><Terminal size={12}/> API-KEY MANAGER</span><h3>Dein Schlüssel. Deine Regeln.</h3><p>Für jede API getrennt konfigurierbar. Gespeichert wird nur in deinem Browser.</p></div><span className={"av-key-status "+(apiKeys[active.id]?.value?"saved":"")}>{apiKeys[active.id]?.value?"● Gespeichert":"○ Kein Key"}</span></div>
            <label className="av-key-label" htmlFor="av-api-key">API-Key / Token</label>
            <div className="av-key-secret-row"><input id="av-api-key" type={keyVisible?"text":"password"} autoComplete="new-password" spellCheck={false} value={keyDraft} onChange={e=>{setKeyDraft(e.target.value);setKeyNotice("");}} placeholder="API-Key hier einfügen …"/><button type="button" className="av-key-visibility" onClick={()=>setKeyVisible(v=>!v)}>{keyVisible?"Verbergen":"Anzeigen"}</button></div>
            <div className="av-key-config-grid">
              <label><span>ÜBERTRAGUNG</span><select value={keyMode} onChange={e=>{const next=e.target.value as KeyMode;const currentDefault=getKeyFieldForMode(active.id,keyMode);setKeyMode(next);if(!keyField||keyField===currentDefault)setKeyField(getKeyFieldForMode(active.id,next));setKeyPrefix(next==="header"?getKeyDefaults(active.id).prefix:"");}}><option value="header">HTTP-Header</option><option value="query">Query-Parameter</option></select></label>
              <label><span>{keyMode==="header"?"HEADER-NAME":"PARAMETER-NAME"}</span><input value={keyField} onChange={e=>setKeyField(e.target.value)} placeholder={keyMode==="header"?"Authorization":"api_key"}/></label>
              {keyMode==="header"&&<label><span>WERT-PRÄFIX (OPTIONAL)</span><input value={keyPrefix} onChange={e=>setKeyPrefix(e.target.value)} placeholder="z. B. Bearer "/></label>}
            </div>
            <div className="av-key-actions"><button type="button" className="av-primary-btn" onClick={saveApiKey}><Check size={14}/> Schlüssel lokal speichern</button><button type="button" className="av-key-remove" onClick={removeApiKey}><X size={13}/> Entfernen</button>{keyNotice&&<span role="status">{keyNotice}</span>}</div>
            <p className="av-key-warning"><CircleHelp size={13}/> Schlüssel werden nicht an APIverse-Server oder GitHub gesendet. Sie bleiben in localStorage dieses Browsers. Andere Skripte derselben Website könnten sie auslesen. Verwende daher keine Admin- oder Zahlungs-Schlüssel; achte auf Berechtigungen und API-Limits.</p>
          </section>
          <details className="av-custom-request"><summary><Terminal size={14}/> Eigenen Endpoint mit diesem Key testen <ChevronDown size={14}/></summary><div className="av-custom-request-body"><label htmlFor="av-custom-endpoint">HTTP- oder HTTPS-Endpoint</label><input id="av-custom-endpoint" value={customEndpoint} onChange={e=>setCustomEndpoint(e.target.value)} spellCheck={false} placeholder="https://api.example.com/v1/data"/><button type="button" className="av-primary-btn" onClick={()=>void runCustomRequest()} disabled={customLoading}>{customLoading?<span className="av-spinner"/>:<Play size={13}/>} {customLoading?"Anfrage läuft …":"GET-Anfrage senden"}</button>{customError&&<div className="av-custom-error" role="alert">{customError}</div>}{customResult!==null&&<><div className="av-custom-success"><Check size={12}/> Antwort empfangen</div><pre className="av-json-mini">{typeof customResult==="string"?customResult:JSON.stringify(customResult,null,2)}</pre></>}</div></details>
          {active.demo?<div className="av-demo-panel"><div className="av-demo-head"><div><span className="av-demo-live"><Activity size={12}/> INTERAKTIVE DEMO</span><h3>Probier es direkt aus.</h3></div><span className="av-browser-badge">Browser · Fetch API</span></div><div className="av-demo-form">{!["dog","catfact","nasa","swapi","randomuser"].includes(active.demo)&&<input value={demoInput} onChange={e=>setDemoInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")void runDemo()}} placeholder={active.demo==="weather"?"z. B. Berlin":active.demo==="brawl"?"Optional: wird ignoriert":active.demo==="pokemon"?"Pokémon-Name oder ID":active.demo==="tvmaze"?"Serienname":active.demo==="country"?"Land, z. B. Germany":active.demo==="jikan"?"Anime-Titel":active.demo==="github"?"GitHub Username":active.demo==="dictionary"?"Englisches Wort":active.demo==="recipe"?"Rezept oder Zutat":active.demo==="currency"?"Basis EUR (optional)":active.demo==="qr"?"Text oder URL":active.demo==="httpcat"?"HTTP-Status, z. B. 404":active.demo==="itunes"?"Artist oder Song":"Suche…"} /> }<button className="av-primary-btn" onClick={()=>void runDemo()} disabled={demoLoading}>{demoLoading?<span className="av-spinner"/>:<Play size={14}/>} {demoLoading?"Lädt …":"API ausführen"}</button></div>{demoError&&<div className="av-demo-error"><CircleHelp size={16}/><div><strong>Anfrage hat nicht geklappt</strong><span>{demoError}</span><small>Der Dienst kann vorübergehend down sein, Limits haben oder Browserzugriff blockieren.</small></div></div>}{demoResult&&<div className="av-demo-results">{demoResult.kind==="weather"&&<><div className="av-result-title"><CloudSun size={17}/><strong>{demoResult.place}</strong></div><div className="av-weather-metrics"><div><small>JETZT</small><strong>{Math.round(demoResult.data.current.temperature_2m)}°C</strong><span>Temperatur</span></div><div><small>GEFÜHLT</small><strong>{Math.round(demoResult.data.current.apparent_temperature)}°C</strong><span>Gefühlte Temp.</span></div><div><small>WIND</small><strong>{Math.round(demoResult.data.current.wind_speed_10m)} km/h</strong><span>Luftbewegung</span></div></div><div className="av-json-mini">{JSON.stringify(demoResult.data.daily,null,2)}</div></>}
              {demoResult.kind==="cards"&&<><div className="av-result-title"><Check size={15}/><strong>{demoResult.title}</strong><span>{demoResult.items.length} Treffer</span></div><div className="av-result-cards">{demoResult.items.map((it:any,i:number)=><div className="av-result-card" key={i}>{it.image&&<img src={it.image} alt="" loading="lazy"/>}<strong>{it.title}</strong>{it.subtitle&&<small>{it.subtitle}</small>}{it.description&&<p>{it.description}</p>}{it.url&&<a href={it.url} target="_blank" rel="noreferrer">Mehr ansehen <ArrowUpRight size={11}/></a>}</div>)}</div></>}
              {demoResult.kind==="pokemon"&&<div className="av-pokemon-result"><img src={demoResult.data.sprites?.other?.["official-artwork"]?.front_default||demoResult.data.sprites?.front_default} alt={demoResult.data.name}/><div><div className="av-result-title"><strong>{demoResult.data.name.charAt(0).toUpperCase()+demoResult.data.name.slice(1)}</strong><span>#{String(demoResult.data.id).padStart(3,"0")}</span></div><div className="av-poke-tags">{demoResult.data.types.map((t:any)=><span key={t.type.name}>{t.type.name}</span>)}</div><p>Größe: {demoResult.data.height/10} m · Gewicht: {demoResult.data.weight/10} kg</p><small>Fähigkeiten: {demoResult.data.abilities.map((a:any)=>a.ability.name).join(", ")}</small></div></div>}
              {demoResult.kind==="fact"&&<div className="av-fact"><Sparkles size={20}/><h4>{demoResult.title}</h4><p>{demoResult.text}</p><small>{demoResult.meta}</small></div>}
              {demoResult.kind==="image"&&<div className="av-image-result"><img src={demoResult.url} alt={demoResult.title}/><strong>{demoResult.title}</strong><a href={demoResult.url} target="_blank" rel="noreferrer">Bild direkt öffnen <ExternalLink size={12}/></a></div>}
              {demoResult.kind==="qr"&&<div className="av-qr-result"><img src={demoResult.url} alt="Generierter QR-Code"/><div><strong>QR-Code erstellt</strong><p>{demoResult.value}</p><a className="av-doc-link" href={demoResult.url} target="_blank" rel="noreferrer">PNG öffnen <ExternalLink size={12}/></a></div></div>}
              {demoResult.kind==="profile"&&<div className="av-profile-result">{demoResult.image&&<img src={demoResult.image} alt=""/>}<div><h4>{demoResult.title}</h4><strong>{demoResult.subtitle}</strong><p>{demoResult.description||demoResult.meta||""}</p><div className="av-profile-stats">{demoResult.stats?.map((s:any)=><span key={s[0]}><b>{typeof s[1]==="number"?prettyNum(s[1]):s[1]}</b>{s[0]}</span>)}</div>{demoResult.url&&<a href={demoResult.url} target="_blank" rel="noreferrer">Profil öffnen <ArrowUpRight size={12}/></a>}</div></div>}
              {demoResult.kind==="dictionary"&&<div className="av-dictionary-result"><div className="av-result-title"><BookOpen size={15}/><strong>{demoResult.data.word}</strong><span>{demoResult.data.phonetic||""}</span></div>{demoResult.data.meanings?.slice(0,3).map((m:any,i:number)=><div className="av-meaning" key={i}><b>{m.partOfSpeech}</b><p>{m.definitions?.[0]?.definition}</p>{m.definitions?.[0]?.example&&<small>“{m.definitions[0].example}”</small>}</div>)}</div>}
              {demoResult.kind==="currency"&&<div className="av-currency-result"><div className="av-result-title"><Globe2 size={15}/><strong>Referenzkurse</strong><span>{demoResult.data.date}</span></div><p>1 {demoResult.data.base} entspricht ungefähr:</p><div className="av-currency-grid">{Object.entries(demoResult.data.rates||{}).filter(([key])=>["USD","GBP","JPY","CHF","CAD","AUD","PLN","SEK"].includes(key)).map(([key,value])=><div key={key}><small>{key}</small><strong>{Number(value).toFixed(3)}</strong></div>)}</div><small>Referenzdaten, keine Live-Handelskurse.</small></div>}
              {demoResult.kind==="nasa"&&<div className="av-nasa-result">{demoResult.data.url&&<img src={demoResult.data.url} alt={demoResult.data.title}/>}<h4>{demoResult.data.title}</h4><small>{demoResult.data.date}</small><p>{demoResult.data.explanation}</p></div>}
              {demoResult.kind==="json"&&<pre className="av-json-mini">{JSON.stringify(demoResult.data,null,2)}</pre>}
              <div className="av-response-footer"><span><span className="av-status-dot"/> API-Antwort empfangen</span><button onClick={()=>{try{void navigator.clipboard.writeText(JSON.stringify(demoResult,null,2));setCopied(true);window.setTimeout(()=>setCopied(false),1200)}catch{}}}><Copy size={12}/> JSON kopieren</button></div>
            </div>}</div>:<div className="av-no-demo"><Terminal size={18}/><div><strong>Keine integrierte Demo</strong><p>Diese API ist katalogisiert. Öffne die Dokumentation für Endpunkte, Zugang und Beispielanfragen.</p><a href={active.docs} target="_blank" rel="noreferrer">Dokumentation ansehen <ArrowUpRight size={13}/></a></div></div>}<p className="av-modal-footnote">Sende keine privaten Tokens oder Passwörter in öffentliche Demo-Felder. Deine Abfrage geht direkt an den jeweiligen Drittanbieter. APIverse speichert keine Anfrageinhalte auf einem eigenen Server.</p></div></section></div>}
  </div>;
}

export default ApiVerse;

type OverlayMode = "cards" | "ticker" | "banner" | "stats" | "minimal" | "terminal";
type OverlayConfig = {
  title: string; endpoint: string; mode: OverlayMode; width: number; height: number;
  accent: string; textColor: string; background: string; transparent: boolean; opacity: number;
  fontSize: number; fontFamily: string; padding: number; radius: number; gap: number;
  columns: number; refresh: number; maxItems: number; align: "left" | "center" | "right";
  showTitle: boolean; showIcon: boolean; showTimestamp: boolean; showDetails: boolean;
  showBorder: boolean; glow: boolean; animation: boolean; jsonPath: string; includeKeyInUrl: boolean;
  apiKey?: string; keyMode?: KeyMode; keyField?: string; keyPrefix?: string;
};
type OverlayRow = { title: string; value?: string; detail?: string; image?: string };
const overlayFonts = [
  {label:"Manrope",value:"Manrope, sans-serif"},
  {label:"Space Grotesk",value:"'Space Grotesk', sans-serif"},
  {label:"Inter",value:"Inter, Arial, sans-serif"},
  {label:"Monospace",value:"'DM Mono', monospace"},
  {label:"Arial",value:"Arial, sans-serif"}
];
function defaultOverlayConfig(api:ApiItem):OverlayConfig {
  const endpoints:Record<string,string> = {
    weather:"https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.405&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe%2FBerlin",
    brawl:"https://api.brawlapi.com/v1/brawlers",
    pokeapi:"https://pokeapi.co/api/v2/pokemon/pikachu",
    countries:"https://restcountries.com/v3.1/name/germany?fields=name,capital,region,population,flags,currencies,languages",
    tvmaze:"https://api.tvmaze.com/search/shows?q=doctor",
    jikan:"https://api.jikan.moe/v4/anime?q=one%20piece&limit=8",
    nasa:"https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",
    github:"https://api.github.com/users/octocat",
    recipe:"https://www.themealdb.com/api/json/v1/1/search.php?s=chicken",
    itunes:"https://itunes.apple.com/search?term=daft%20punk&entity=song&limit=8",
    dog:"https://dog.ceo/api/breeds/image/random",
    catfact:"https://catfact.ninja/fact",
    jokes:"https://v2.jokeapi.dev/joke/Programming?safe-mode",
    randomfacts:"https://uselessfacts.jsph.pl/api/v2/facts/random?language=en",
    currency:"https://api.frankfurter.dev/v1/latest?base=EUR",
    randomuser:"https://randomuser.me/api/"
  };
  return {
    title:api.name, endpoint:endpoints[api.id]||api.endpoint, mode:"cards",
    width:800,height:450,accent:"#8f7cff",textColor:"#f3f5ff",background:"#101522",
    transparent:true,opacity:92,fontSize:18,fontFamily:"Manrope, sans-serif",
    padding:18,radius:16,gap:10,columns:2,refresh:30,maxItems:6,align:"left",
    showTitle:true,showIcon:true,showTimestamp:true,showDetails:true,showBorder:true,
    glow:true,animation:true,jsonPath:"",includeKeyInUrl:false
  };
}
function readOverlayConfigs():Record<string,OverlayConfig> {
  try { const v=localStorage.getItem("apiverse-overlay-configs-v1"); return v?JSON.parse(v) as Record<string,OverlayConfig>:{}; }
  catch { return {}; }
}
function encodeOverlayConfig(value:unknown):string {
  const bytes=new TextEncoder().encode(JSON.stringify(value));
  let binary="";
  for(let i=0;i<bytes.length;i++) binary+=String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
}
function decodeOverlayConfig(value:string):any {
  const safe=value.replace(/-/g,"+").replace(/_/g,"/");
  const padded=safe+"=".repeat((4-safe.length%4)%4);
  const binary=atob(padded);
  const bytes=Uint8Array.from(binary,ch=>ch.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
function createOverlayUrl(api:ApiItem,config:OverlayConfig,key?:ApiKeyConfig):string {
  const payload:any={...config,apiId:api.id,apiKey:"",keyMode:"header",keyField:"Authorization",keyPrefix:""};
  if(config.includeKeyInUrl && key?.value) {
    payload.apiKey=key.value;
    payload.keyMode=key.mode;
    payload.keyField=key.field;
    payload.keyPrefix=key.prefix;
  }
  const base=window.location.origin+window.location.pathname;
  return base+"#overlay="+encodeURIComponent(api.id)+"&cfg="+encodeURIComponent(encodeOverlayConfig(payload));
}
function overlayReadPath(data:any,path:string):any {
  if(!path.trim()) return data;
  return path.trim().split(".").filter(Boolean).reduce((v,key)=>{
    if(v===undefined||v===null) return undefined;
    if(Array.isArray(v)&&/^\d+$/.test(key)) return v[Number(key)];
    return v[key];
  },data);
}
function overlayString(value:any):string {
  if(value===undefined||value===null) return "";
  if(typeof value==="string"||typeof value==="number"||typeof value==="boolean") return String(value);
  if(Array.isArray(value)) return value.map(overlayString).filter(Boolean).slice(0,4).join(", ");
  return "";
}
function overlayImage(value:any):string|undefined {
  const candidate=value?.imageUrl||value?.image||value?.icon||value?.picture?.large||value?.picture?.medium||value?.avatar_url||value?.strMealThumb||value?.artworkUrl100||value?.images?.jpg?.image_url||value?.sprites?.other?.["official-artwork"]?.front_default||value?.sprites?.front_default||value?.flags?.png||value?.image?.medium||value?.show?.image?.medium||value?.item?.image;
  return typeof candidate==="string"&&/^https?:\/\//i.test(candidate)?candidate:undefined;
}
function overlayToRows(raw:any,config:OverlayConfig):OverlayRow[] {
  let data=overlayReadPath(raw,config.jsonPath);
  if(data===undefined||data===null) return [];
  if(data&&typeof data==="object"&&!Array.isArray(data)) {
    const arrayKeys=["list","items","results","brawlers","meals","drinks","tracks","records","data","pokemon"];
    for(const key of arrayKeys) {
      if(Array.isArray(data[key])) { data=data[key]; break; }
    }
  }
  if(Array.isArray(data)) {
    return data.slice(0,Math.max(1,config.maxItems)).map((v:any,index:number)=>{
      const name=overlayString(v?.name?.common)||overlayString(v?.name)||overlayString(v?.title)||overlayString(v?.strMeal)||overlayString(v?.trackName)||overlayString(v?.show?.name)||overlayString(v?.login)||overlayString(v?.word)||overlayString(v?.species)||overlayString(v?.id)||("Element "+(index+1));
      const value=overlayString(v?.value)||overlayString(v?.score)||overlayString(v?.rank)||overlayString(v?.population)||overlayString(v?.current_price)||overlayString(v?.rarity?.name)||overlayString(v?.class?.name);
      const detail=overlayString(v?.subtitle)||overlayString(v?.status)||overlayString(v?.release_date)||overlayString(v?.description)||overlayString(v?.synopsis)||overlayString(v?.strCategory)||overlayString(v?.region)||overlayString(v?.genres)||overlayString(v?.types?.map?.((t:any)=>t.type?.name||t.name))||overlayString(v?.rarity?.name);
      return {title:name,value,detail,image:overlayImage(v)};
    });
  }
  if(typeof data==="string"||typeof data==="number"||typeof data==="boolean") return [{title:"Antwort",value:overlayString(data)}];
  if(typeof data!=="object") return [];
  if(data.current&&typeof data.current==="object") data=data.current;
  if(data.rates&&typeof data.rates==="object") {
    return Object.entries(data.rates).slice(0,Math.max(1,config.maxItems)).map(([k,v])=>({title:k,value:overlayString(v),detail:"Referenzkurs"}));
  }
  const title=overlayString(data.name?.common)||overlayString(data.name)||overlayString(data.title)||overlayString(data.strMeal)||overlayString(data.trackName)||overlayString(data.login)||overlayString(data.word)||overlayString(data.english_name)||overlayString(data.id);
  const values:Array<{title:string;value?:string;detail?:string;image?:string}>=[];
  const preferred=["temperature_2m","apparent_temperature","wind_speed_10m","relative_humidity_2m","capital","population","region","status","score","rank","price","value","count","followers","public_repos","date","base","fact","joke","explanation","description"];
  for(const key of preferred) {
    const v=data[key];
    const textValue=overlayString(v);
    if(textValue) values.push({title:key.replace(/_/g," ").replace(/\b\w/g,ch=>ch.toUpperCase()),value:textValue});
  }
  if(title) values.unshift({title,value:overlayString(data.value)||overlayString(data.id),detail:overlayString(data.subtitle)||overlayString(data.status)||overlayString(data.description)||overlayString(data.synopsis)||overlayString(data.fact)||overlayString(data.joke),image:overlayImage(data)});
  if(!values.length) {
    Object.entries(data).filter(([,v])=>typeof v==="string"||typeof v==="number"||typeof v==="boolean").slice(0,Math.max(1,config.maxItems)).forEach(([key,value])=>values.push({title:key.replace(/_/g," ").replace(/\b\w/g,ch=>ch.toUpperCase()),value:overlayString(value)}));
  }
  return values.slice(0,Math.max(1,config.maxItems));
}
function overlayPreviewRows(api:ApiItem):OverlayRow[] {
  const samples:Record<string,OverlayRow[]> = {
    brawl:[{title:"Spike",value:"Legendär",detail:"Schaden · Kontrolle"},{title:"Shelly",value:"Start-Brawler",detail:"Schrotflinte"},{title:"Leon",value:"Legendär",detail:"Assassine"}],
    weather:[{title:"Temperatur",value:"18 °C",detail:"Berlin · aktuell"},{title:"Wind",value:"11 km/h",detail:"Nordwest"},{title:"Luftfeuchte",value:"64 %",detail:"Wetterdaten"}],
    pokeapi:[{title:"Pikachu",value:"#025",detail:"Elektro",image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"}],
    tvmaze:[{title:"The Mandalorian",value:"Serie",detail:"Sci-Fi · Abenteuer"},{title:"Doctor Who",value:"Seit 1963",detail:"Science-Fiction"},{title:"Arcane",value:"Drama",detail:"Animation"}],
    github:[{title:"octocat",value:"8 Repos",detail:"GitHub-Profil"}],
    countries:[{title:"Deutschland",value:"Berlin",detail:"83 Mio. Einwohner · Europa",image:"https://flagcdn.com/w320/de.png"}],
    nasa:[{title:"Bild des Tages",value:"NASA · APOD",detail:"Entdecke das Universum"}],
    catfact:[{title:"Katzen-Fakt",value:"Katzen schlafen einen großen Teil des Tages.",detail:"Zufälliger Fakt"}],
    dog:[{title:"Zufälliger Hund",value:"Foto",detail:"Dog CEO API",image:"https://images.dog.ceo/breeds/shiba/shiba-12.jpg"}],
    currency:[{title:"USD",value:"1.08",detail:"pro EUR"},{title:"JPY",value:"162.4",detail:"pro EUR"}],
    jokes:[{title:"Programmier-Humor",value:"Warum mögen Entwickler die Natur?",detail:"Da sind weniger Bugs als im Code."}],
    recipe:[{title:"Chicken Bowl",value:"Rezept",detail:"Zutaten · Anleitung"}],
    itunes:[{title:"Musik entdecken",value:"Daft Punk",detail:"Track · Artist"}]
  };
  return samples[api.id]||[{title:api.name,value:"Live-Daten folgen",detail:"Verbinde den Endpoint, um echte API-Daten anzuzeigen."},{title:"Konfigurierbar",value:"100 %",detail:"Layout, Farben und Felder frei anpassen."}];
}
function overlayHexRgba(hex:string,opacity:number):string {
  const safe=/^#[0-9a-f]{6}$/i.test(hex)?hex:"#101522";
  const n=parseInt(safe.slice(1),16);
  return "rgba("+((n>>16)&255)+","+((n>>8)&255)+","+(n&255)+","+Math.max(0,Math.min(100,opacity))/100+")";
}
function OverlayWidget({api,config,rows,error,updated,preview=false}:{api:ApiItem;config:OverlayConfig;rows:OverlayRow[];error?:string;updated?:string;preview?:boolean}) {
  const stageStyle:CSSProperties={width:config.width,height:config.height,maxWidth:"100%",fontFamily:config.fontFamily,fontSize:config.fontSize,color:config.textColor};
  const panelStyle:CSSProperties={
    padding:config.padding,borderRadius:config.radius,background:config.transparent?"transparent":overlayHexRgba(config.background,config.opacity),
    border:config.showBorder?"1px solid "+overlayHexRgba(config.accent,54):"1px solid transparent",
    boxShadow:config.glow?"0 0 35px "+overlayHexRgba(config.accent,24):"none",textAlign:config.align,gap:config.gap
  };
  return <div className="av-stream-stage" style={stageStyle}>
    <div className={"av-stream-widget av-stream-"+config.mode+(config.animation?" av-stream-animated":"")} style={panelStyle}>
      {config.showTitle&&<div className="av-stream-heading">
        <div className="av-stream-heading-main">{config.showIcon&&<span className="av-stream-api-icon">{api.icon}</span>}<span className="av-stream-title">{config.title||api.name}</span></div>
        {config.showTimestamp&&<span className="av-stream-time">{updated?new Date(updated).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"}):preview?"LIVE":"VERBINDE…"}</span>}
      </div>}
      {error&&<div className="av-stream-error">API-Verbindung fehlgeschlagen · {error}</div>}
      <div className="av-stream-rows" style={{gridTemplateColumns:config.mode==="ticker"?"repeat("+Math.max(2,rows.length)+", minmax(160px, 1fr))":"repeat("+config.columns+", minmax(0, 1fr))",gap:config.gap}}>
        {rows.slice(0,config.maxItems).map((row,i)=><article className="av-stream-row" key={i} style={{borderRadius:Math.max(5,config.radius-5),border:config.mode==="minimal"||!config.showBorder?"1px solid transparent":"1px solid "+overlayHexRgba(config.accent,25),background:config.mode==="minimal"?"transparent":overlayHexRgba(config.background,config.transparent?30:Math.min(100,config.opacity+3))}}>
          {row.image&&config.mode!=="terminal"&&<img className="av-stream-image" src={row.image} alt="" />}
          <div className="av-stream-row-copy">
            <div className="av-stream-row-title">{row.title}</div>
            {config.showDetails&&row.detail&&<div className="av-stream-row-detail">{row.detail}</div>}
            {config.showDetails&&row.value&&<div className="av-stream-row-value" style={{color:config.accent}}>{row.value}</div>}
          </div>
        </article>)}
        {!rows.length&&!error&&<div className="av-stream-empty">{preview?"Live-Daten werden hier angezeigt":"Warte auf API-Daten…"}</div>}
      </div>
      {config.mode==="terminal"&&<div className="av-stream-terminal-line"><span>●</span> {preview?"PREVIEW READY":"ENDPOINT CONNECTED"}</div>}
      {config.mode==="banner"&&<div className="av-stream-banner-caption">{preview?"STREAM WIDGET · "+api.category.toUpperCase():"LIVE API DATA · "+api.category.toUpperCase()}</div>}
    </div>
  </div>;
}
function OverlayStudio({initialApiId,apiKeys}:{initialApiId:string;apiKeys:Record<string,ApiKeyConfig>}) {
  const [selectedId,setSelectedId]=useState(initialApiId);
  const [configs,setConfigs]=useState<Record<string,OverlayConfig>>(()=>readOverlayConfigs());
  const [copied,setCopied]=useState(false);
  const [preset,setPreset]=useState("custom");
  const api=apis.find(a=>a.id===selectedId)||apis[0];
  const config=configs[selectedId]||defaultOverlayConfig(api);
  useEffect(()=>{setSelectedId(initialApiId);},[initialApiId]);
  useEffect(()=>{try{localStorage.setItem("apiverse-overlay-configs-v1",JSON.stringify(configs));}catch{}},[configs]);
  const update = <K extends keyof OverlayConfig,>(field:K,value:OverlayConfig[K])=>setConfigs(old=>({...old,[selectedId]:{...(old[selectedId]||defaultOverlayConfig(api)),[field]:value}}));
  const sourceUrl=createOverlayUrl(api,config,apiKeys[selectedId]);
  const savedKey=apiKeys[selectedId];
  async function copySource(){
    try{await navigator.clipboard.writeText(sourceUrl);setCopied(true);window.setTimeout(()=>setCopied(false),1300);}
    catch{window.prompt("OBS Browser Source URL kopieren:",sourceUrl);}
  }
  function applyPreset(name:string) {
    setPreset(name);
    const base=configs[selectedId]||defaultOverlayConfig(api);
    const presets:Record<string,Partial<OverlayConfig>>={
      neon:{mode:"cards",accent:"#8f7cff",textColor:"#f3f5ff",background:"#101522",transparent:true,opacity:95,glow:true,showBorder:true,animation:true,radius:16,padding:18,fontSize:18,columns:2},
      minimal:{mode:"minimal",accent:"#ffffff",textColor:"#ffffff",background:"#080b12",transparent:true,opacity:0,glow:false,showBorder:false,animation:false,radius:4,padding:8,fontSize:16,columns:1},
      broadcast:{mode:"banner",accent:"#53e5d5",textColor:"#ffffff",background:"#0b101a",transparent:false,opacity:94,glow:true,showBorder:true,animation:true,radius:12,padding:20,fontSize:24,columns:2},
      ticker:{mode:"ticker",accent:"#a88bff",textColor:"#f4f6ff",background:"#0b101a",transparent:false,opacity:93,glow:false,showBorder:true,animation:true,radius:9,padding:10,fontSize:15,columns:3},
      terminal:{mode:"terminal",accent:"#80ffb0",textColor:"#c8ffdf",background:"#050b08",transparent:false,opacity:95,glow:true,showBorder:true,animation:false,radius:8,padding:16,fontSize:15,columns:2}
    };
    setConfigs(old=>({...old,[selectedId]:{...base,...(presets[name]||{}),title:base.title}}));
  }
  function check(label:string,field:keyof OverlayConfig){
    return <label className="av-studio-check" key={String(field)}><input type="checkbox" checked={Boolean(config[field])} onChange={e=>update(field,e.target.checked as any)}/><span>{label}</span></label>;
  }
  const previewRows=overlayPreviewRows(api);
  return <div className="av-studio-shell">
    <div className="av-studio-heading">
      <div><div className="av-studio-kicker"><span/> STREAM TOOLKIT / 01</div><h1>OBS Overlay <em>Studio</em></h1><p>Mach aus jeder API eine eigene Browser-Source. Pixelgenau anpassen, live ansehen, URL kopieren und in OBS oder Streamlabs einfügen.</p></div>
      <div className="av-studio-heading-badge"><MonitorPlay size={21}/><span>OBS READY</span><small>Browser Source</small></div>
    </div>
    <div className="av-studio-steps"><div><b>01</b><span>API auswählen</span></div><ArrowRight size={14}/><div><b>02</b><span>Overlay designen</span></div><ArrowRight size={14}/><div><b>03</b><span>URL in OBS einfügen</span></div></div>
    <div className="av-studio-api-select">
      <div><span className="av-studio-label">WIDGET QUELLE</span><h2>Welches Overlay baust du?</h2><p>Jede API kann ein separates Overlay bekommen. Einstellungen bleiben pro API gespeichert.</p></div>
      <div className="av-studio-api-select-control"><span className="av-studio-selected-icon">{api.icon}</span><select value={selectedId} onChange={e=>{setSelectedId(e.target.value);setPreset("custom");}}>{groups.map(g=><optgroup key={g.name} label={g.name}>{apis.filter(a=>a.category===g.name).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</optgroup>)}</select><span className="av-studio-api-count">{apis.length} APIs</span></div>
    </div>
    <div className="av-studio-workspace">
      <div className="av-studio-controls">
        <div className="av-studio-card">
          <div className="av-studio-card-head"><div><span className="av-studio-label">DESIGN SYSTEM</span><h3>Start mit einem Preset</h3></div><SlidersHorizontal size={18}/></div>
          <div className="av-studio-presets">{[{id:"neon",title:"Neon Glass",sub:"Glow + Glas"},{id:"minimal",title:"Clean Minimal",sub:"Dezent"},{id:"broadcast",title:"Broadcast",sub:"Fette Grafik"},{id:"ticker",title:"Live Ticker",sub:"Laufband"},{id:"terminal",title:"Terminal",sub:"Tech Style"}].map(p=><button key={p.id} className={preset===p.id?"selected":""} onClick={()=>applyPreset(p.id)}><span className={"av-preset-swatch av-preset-"+p.id}></span><span><strong>{p.title}</strong><small>{p.sub}</small></span></button>)}</div>
        </div>
        <div className="av-studio-card">
          <div className="av-studio-card-head"><div><span className="av-studio-label">CONTENT</span><h3>API & Datenquelle</h3></div><Database size={18}/></div>
          <label className="av-studio-field"><span>Overlay-Titel</span><input value={config.title} onChange={e=>update("title",e.target.value)} maxLength={70} placeholder={api.name}/></label>
          <label className="av-studio-field"><span>API-Endpoint (GET)</span><input value={config.endpoint} onChange={e=>update("endpoint",e.target.value)} spellCheck={false} placeholder="https://api.example.com/data"/></label>
          <label className="av-studio-field"><span>JSON-Pfad (optional)</span><input value={config.jsonPath} onChange={e=>update("jsonPath",e.target.value)} placeholder="z. B. data.results oder current"/></label>
          <p className="av-studio-help">JSON-Pfade zeigen nur den gewünschten Teil der Antwort. Wenn die API nicht direkt im Browser erreichbar ist (CORS) oder einen Key benötigt, kann die Live-Anzeige scheitern.</p>
        </div>
        <div className="av-studio-card">
          <div className="av-studio-card-head"><div><span className="av-studio-label">LAYOUT</span><h3>Form & Aufbau</h3></div><Layers3 size={18}/></div>
          <label className="av-studio-field"><span>Darstellung</span><select value={config.mode} onChange={e=>update("mode",e.target.value as OverlayMode)}><option value="cards">Cards · Karten</option><option value="ticker">Ticker · Laufband</option><option value="banner">Broadcast · Banner</option><option value="stats">Stats · Metriken</option><option value="minimal">Minimal · nur Text</option><option value="terminal">Terminal · Tech</option></select></label>
          <div className="av-studio-two-fields"><label className="av-studio-field"><span>Spalten</span><select value={config.columns} onChange={e=>update("columns",Number(e.target.value))}><option value={1}>1 Spalte</option><option value={2}>2 Spalten</option><option value={3}>3 Spalten</option><option value={4}>4 Spalten</option></select></label><label className="av-studio-field"><span>Max. Items</span><select value={config.maxItems} onChange={e=>update("maxItems",Number(e.target.value))}>{[1,2,3,4,5,6,8,10,12,16].map(n=><option value={n} key={n}>{n} Items</option>)}</select></label></div>
          <label className="av-studio-field"><span>Ausrichtung</span><select value={config.align} onChange={e=>update("align",e.target.value as OverlayConfig["align"])}><option value="left">Links</option><option value="center">Zentriert</option><option value="right">Rechts</option></select></label>
        </div>
        <div className="av-studio-card">
          <div className="av-studio-card-head"><div><span className="av-studio-label">VISUAL TUNING</span><h3>Farben & Typografie</h3></div><Palette size={18}/></div>
          <div className="av-studio-color-grid"><label><span>Akzentfarbe</span><input type="color" value={config.accent} onChange={e=>update("accent",e.target.value)}/></label><label><span>Textfarbe</span><input type="color" value={config.textColor} onChange={e=>update("textColor",e.target.value)}/></label><label><span>Panel-Farbe</span><input type="color" value={config.background} onChange={e=>update("background",e.target.value)}/></label></div>
          <label className="av-studio-field"><span>Schrift</span><select value={config.fontFamily} onChange={e=>update("fontFamily",e.target.value)}>{overlayFonts.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select></label>
          <div className="av-studio-range"><label><span>Schriftgröße</span><b>{config.fontSize}px</b></label><input type="range" min="10" max="42" step="1" value={config.fontSize} onChange={e=>update("fontSize",Number(e.target.value))}/></div>
          <div className="av-studio-range"><label><span>Panel-Deckkraft</span><b>{config.opacity}%</b></label><input type="range" min="0" max="100" step="1" value={config.opacity} onChange={e=>update("opacity",Number(e.target.value))}/></div>
          <label className="av-studio-field"><span>Transparenz</span><select value={config.transparent?"on":"off"} onChange={e=>update("transparent",e.target.value==="on")}><option value="on">Transparenter Stream-Hintergrund</option><option value="off">Panel-Hintergrund anzeigen</option></select></label>
        </div>
        <div className="av-studio-card">
          <div className="av-studio-card-head"><div><span className="av-studio-label">PIXEL CONTROL</span><h3>Spacing & Größe</h3></div><SlidersHorizontal size={18}/></div>
          <div className="av-studio-two-fields"><label className="av-studio-field"><span>Breite (px)</span><input type="number" min="240" max="1920" value={config.width} onChange={e=>update("width",Math.min(1920,Math.max(240,Number(e.target.value)||240)))}/></label><label className="av-studio-field"><span>Höhe (px)</span><input type="number" min="120" max="1080" value={config.height} onChange={e=>update("height",Math.min(1080,Math.max(120,Number(e.target.value)||120)))}/></label></div>
          <div className="av-studio-range"><label><span>Innenabstand</span><b>{config.padding}px</b></label><input type="range" min="0" max="48" value={config.padding} onChange={e=>update("padding",Number(e.target.value))}/></div>
          <div className="av-studio-range"><label><span>Eckenrundung</span><b>{config.radius}px</b></label><input type="range" min="0" max="36" value={config.radius} onChange={e=>update("radius",Number(e.target.value))}/></div>
          <div className="av-studio-range"><label><span>Abstände</span><b>{config.gap}px</b></label><input type="range" min="0" max="28" value={config.gap} onChange={e=>update("gap",Number(e.target.value))}/></div>
        </div>
        <div className="av-studio-card">
          <div className="av-studio-card-head"><div><span className="av-studio-label">STREAM BEHAVIOR</span><h3>Update & Effekte</h3></div><RefreshCcw size={18}/></div>
          <label className="av-studio-field"><span>Aktualisieren alle</span><select value={config.refresh} onChange={e=>update("refresh",Number(e.target.value))}>{[5,10,15,30,60,120,300].map(n=><option value={n} key={n}>{n<60?n+" Sekunden":n/60+" Minute"+(n===60?"":"n")}</option>)}</select></label>
          <div className="av-studio-check-grid">{check("Overlay-Titel","showTitle")}{check("API-Icon","showIcon")}{check("Zeitstempel","showTimestamp")}{check("Details / Werte","showDetails")}{check("Border","showBorder")}{check("Glow / Neon","glow")}{check("Animation","animation")}</div>
        </div>
        <div className="av-studio-card av-studio-security">
          <div className="av-studio-card-head"><div><span className="av-studio-label">AUTH & SECURITY</span><h3>API-Key für OBS</h3></div><CircleHelp size={18}/></div>
          <p>Gespeicherte Schlüssel sind normalerweise nur in deinem Dashboard-Browser vorhanden. OBS hat eventuell einen getrennten Browser-Speicher.</p>
          <label className="av-studio-embed-key"><input type="checkbox" checked={config.includeKeyInUrl} onChange={e=>update("includeKeyInUrl",e.target.checked)}/><span><strong>Gespeicherten Key in die Overlay-URL einbetten</strong><small>Nur aktivieren, wenn diese API ohne Key nicht funktioniert.</small></span></label>
          {config.includeKeyInUrl&&<div className="av-key-url-warning"><CircleHelp size={14}/><span>{savedKey?.value?"Der Key wird in der URL mitgeführt. Base64 ist keine Verschlüsselung. Jeder, der die OBS-URL sieht, könnte den Key auslesen.":"Für diese API ist im Dashboard noch kein Key gespeichert. Speichere zuerst den Key in den API-Details."}</span></div>}
        </div>
      </div>
      <div className="av-studio-preview-column">
        <div className="av-studio-preview-card">
          <div className="av-studio-preview-head"><div><span className="av-studio-label">CANVAS PREVIEW</span><h3>So sieht's im Stream aus</h3></div><span className="av-studio-live"><i/> LIVE PREVIEW</span></div>
          <div className="av-studio-canvas" style={{backgroundImage:config.transparent?"linear-gradient(45deg,#161c29 25%,transparent 25%),linear-gradient(-45deg,#161c29 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#161c29 75%),linear-gradient(-45deg,transparent 75%,#161c29 75%)":"none",backgroundSize:config.transparent?"20px 20px":"auto",backgroundPosition:config.transparent?"0 0,0 10px,10px -10px,-10px 0":"0 0",backgroundColor:config.transparent?"#0b101a":config.background}}>
            <div className="av-studio-canvas-scale"><OverlayWidget api={api} config={config} rows={previewRows} preview/></div>
          </div>
          <div className="av-studio-preview-meta"><span><MonitorPlay size={13}/> {config.width} × {config.height}px</span><span><RefreshCcw size={12}/> Update: {config.refresh}s</span><span><Activity size={12}/> {config.mode.toUpperCase()}</span></div>
        </div>
        <div className="av-studio-url-card">
          <div className="av-studio-url-heading"><div><span className="av-studio-label">BROWSER SOURCE</span><h3>Deine persönliche Overlay-URL</h3><p>Die URL enthält Layout, Farben, Refresh-Rate und gewählte Felder. Für jede API wird eine eigene URL generiert.</p></div><span className="av-studio-url-icon"><Link2 size={20}/></span></div>
          <div className="av-studio-url-code"><code>{sourceUrl}</code><button onClick={()=>void copySource()}>{copied?<Check size={14}/>:<Copy size={14}/>} {copied?"Kopiert":"URL kopieren"}</button></div>
          <div className="av-studio-url-actions"><button className="av-primary-btn" onClick={()=>window.open(sourceUrl,"_blank","noopener,noreferrer")}><Eye size={14}/> Overlay separat öffnen</button><button className="av-secondary-btn" onClick={()=>{const next=defaultOverlayConfig(api);setConfigs(old=>({...old,[selectedId]:next}));setPreset("custom");}}><RefreshCcw size={13}/> API-Design zurücksetzen</button></div>
          <div className="av-studio-checklist"><div><Check size={13}/><span>Einzelne Browser-Source pro API</span></div><div><Check size={13}/><span>Hintergrund transparent möglich</span></div><div><Check size={13}/><span>Design-Einstellungen lokal gespeichert</span></div></div>
        </div>
        <div className="av-studio-howto"><div className="av-studio-howto-icon"><MonitorPlay size={21}/></div><div><span className="av-studio-label">IN OBS / STREAMLABS</span><h3>So kommt das Overlay in deinen Stream</h3><ol><li>Klicke auf <b>URL kopieren</b>.</li><li>Füge in OBS eine <b>Browser-Quelle</b> hinzu und kopiere die URL hinein.</li><li>Setze Breite und Höhe auf <b>{config.width} × {config.height}</b>.</li><li>Bei Problemen: Browser-Quelle aktualisieren und prüfen, ob die API CORS sowie öffentliche Browser-Abfragen erlaubt.</li></ol></div></div>
      </div>
    </div>
    <div className="av-studio-footer-note"><CircleHelp size={14}/><span><b>Wichtig:</b> Die Vorschau nutzt Beispieldaten und zeigt das aktuelle Design. Im echten OBS-Overlay werden Daten vom eingetragenen Endpoint geladen. Manche APIs verlangen Authentifizierung, blockieren Browserzugriff oder begrenzen Abfragen; der Overlay-Link kann keine Anbieter-Limits umgehen.</span></div>
  </div>;
}
function StandaloneOverlay() {
  const params=new URLSearchParams(window.location.hash.replace(/^#/,""));
  const apiId=params.get("overlay")||new URLSearchParams(window.location.search).get("overlay")||"";
  const api=apis.find(a=>a.id===apiId)||apis[0];
  const [config] = useState<OverlayConfig>(()=> {
    try {
      const encoded=params.get("cfg")||new URLSearchParams(window.location.search).get("cfg");
      const decoded=encoded?decodeOverlayConfig(encoded):{};
      return {...defaultOverlayConfig(api),...decoded,endpoint:typeof decoded.endpoint==="string"?decoded.endpoint:defaultOverlayConfig(api).endpoint};
    } catch { return defaultOverlayConfig(api); }
  });
  const [data,setData]=useState<any>(null);
  const [error,setError]=useState("");
  const [updated,setUpdated]=useState("");
  const [loading,setLoading]=useState(false);
  useEffect(()=>{
    let alive=true;
    let busy=false;
    let controller:AbortController|null=null;
    async function load(){
      if(busy||!alive) return;
      busy=true;setLoading(true);
      if(controller) controller.abort();
      controller=new AbortController();
      try{
        const endpoint=config.endpoint.trim();
        const url=new URL(endpoint);
        if(url.protocol!=="https:"&&url.protocol!=="http:") throw new Error("Endpoint muss HTTP oder HTTPS verwenden.");
        let requestUrl=url.toString();
        const headers=new Headers();
        let key:ApiKeyConfig|undefined;
        if(typeof config.apiKey==="string"&&config.apiKey) key={value:config.apiKey,mode:config.keyMode||"header",field:config.keyField||"Authorization",prefix:config.keyPrefix||""};
        if(!key){
          try{const saved=JSON.parse(localStorage.getItem("apiverse-api-keys-v1")||"{}");key=saved[apiId];}catch{}
        }
        if(key?.value){
          if(key.mode==="query"){const parsed=new URL(requestUrl);parsed.searchParams.set(key.field||"api_key",key.value);requestUrl=parsed.toString();}
          else headers.set(key.field||"Authorization",(key.prefix||"")+key.value);
        }
        const response=await fetch(requestUrl,{headers,signal:controller.signal,cache:"no-store",referrerPolicy:"no-referrer"});
        const text=await response.text();
        if(!response.ok) throw new Error("HTTP "+response.status+" "+response.statusText);
        let parsed:any=text;
        try{parsed=text?JSON.parse(text):null;}catch{}
        if(alive){setData(parsed);setError("");setUpdated(new Date().toISOString());}
      }catch(err){
        if(alive&&!(err instanceof DOMException&&err.name==="AbortError")){
          setError(err instanceof Error?err.message:"API nicht erreichbar. Prüfe CORS, Endpoint und Key.");
        }
      }finally{busy=false;if(alive)setLoading(false);}
    }
    void load();
    const interval=window.setInterval(()=>void load(),Math.max(5,Number(config.refresh)||30)*1000);
    return ()=>{alive=false;window.clearInterval(interval);controller?.abort();};
  },[apiId,config.endpoint,config.refresh,config.apiKey,config.keyMode,config.keyField,config.keyPrefix]);
  const rows=overlayToRows(data,config);
  return <div className="av-stream-page" style={{background:"transparent"}}><OverlayWidget api={api} config={config} rows={rows} error={error} updated={updated}/><div className="av-stream-debug" aria-live="polite">{error?"API ERROR":loading&&!data?"CONNECTING":updated?"LIVE · "+new Date(updated).toLocaleTimeString("de-DE"):"WAITING"}</div></div>;
}

function Index() {
  const hashParams=new URLSearchParams(window.location.hash.replace(/^#/,""));
  const queryParams=new URLSearchParams(window.location.search);
  if(hashParams.has("overlay")||queryParams.has("overlay")) return <StandaloneOverlay/>;
  return <ApiVerse/>;
}
export default Index;
