import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Bookmark,
  Check, ChevronDown, ChevronRight, CircleHelp, CloudSun, Code2, Compass,
  Copy, Database, ExternalLink, Film, Flame, Gamepad2, Globe2, Heart,
  Image, Layers3, Menu, Moon, Music2, Palette, Play, Search, Sparkles,
  Star, Sun, Telescope, Terminal, Utensils, X, Zap, type LucideIcon
} from "lucide-react";
import "./ApiVerse.css";

type DemoId = "brawl" | "weather" | "pokemon" | "tvmaze" | "country" | "dog" | "catfact" | "jikan" | "github" | "dictionary" | "recipe" | "joke" | "currency" | "nasa" | "qr" | "swapi" | "cocktail" | "randomuser" | "httpcat" | "itunes";
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
  {id:"cocktail",name:"TheCocktailDB",category:"Essen & Alltag",subcategory:"Rezepte",description:"Cocktail-Datenbank mit Zutaten und Zubereitung. Demo ausschließlich für alkoholfreie Suchbegriffe oder allgemeine Rezeptinfos verwenden.",endpoint:"https://www.thecocktaildb.com/api/json/v1/1/search.php?s=mojito",docs:"https://www.thecocktaildb.com/api.php",auth:"Optional",cors:"Ja",tags:["Getränke","Rezepte","Zutaten"],icon:"🥤",color:"#f3b86d",demo:"cocktail"},
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
  const [view,setView] = useState<"discover"|"favorites"|"playground">("discover");
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
  function chooseView(next:"discover"|"favorites"|"playground") { setView(next); setCategory("Alle APIs"); setSubcategory(""); setMobile(false); }
  function toggleFavorite(id:string) { setFavorites(old => old.includes(id) ? old.filter(x=>x!==id) : [...old,id]); }
  function openApi(api:ApiItem) { setActive(api); setDemoInput(api.demo==="weather"?"Berlin":api.demo==="pokemon"?"pikachu":api.demo==="tvmaze"?"doctor":api.demo==="country"?"germany":api.demo==="jikan"?"one piece":api.demo==="github"?"octocat":api.demo==="dictionary"?"hello":api.demo==="recipe"?"chicken":api.demo==="itunes"?"daft punk":""); setDemoResult(null); setDemoError(""); setDemoLoading(false); }
  async function runDemo() {
    if (!active?.demo) return;
    setDemoLoading(true); setDemoError(""); setDemoResult(null);
    const q = demoInput.trim();
    const enc = encodeURIComponent(q);
    try {
      let result:any;
      switch (active.demo) {
        case "brawl": {
          const r = await fetch("https://api.brawlapi.com/v1/brawlers"); if(!r.ok) throw new Error("BrawlAPI antwortet gerade nicht ("+r.status+").");
          const d=await r.json(); const rows=Array.isArray(d)?d:(d.list||d.items||[]);
          result={kind:"cards",title:"Brawler im Verzeichnis",items:rows.slice(0,18).map((b:any)=>({title:b.name||"Brawler",subtitle:[b.rarity?.name,b.class?.name].filter(Boolean).join(" · ")||"Brawl Stars",image:b.imageUrl||b.image||b.icon,name:b.name}))};
          if(!rows.length) throw new Error("Die API hat keine Brawler-Liste geliefert.");
          break;
        }
        case "weather": {
          if(!q) throw new Error("Gib zuerst einen Ort ein.");
          const g=await fetch("https://geocoding-api.open-meteo.com/v1/search?name="+enc+"&count=1&language=de&format=json");
          if(!g.ok) throw new Error("Ortssuche fehlgeschlagen.");
          const gd=await g.json(); const place=gd.results?.[0]; if(!place) throw new Error("Ort nicht gefunden. Prüfe die Schreibweise.");
          const r=await fetch("https://api.open-meteo.com/v1/forecast?latitude="+place.latitude+"&longitude="+place.longitude+"&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=3");
          if(!r.ok) throw new Error("Wetterdaten nicht erreichbar.");
          result={kind:"weather",place:place.name+(place.admin1?", "+place.admin1:"")+", "+place.country,data:await r.json()};
          break;
        }
        case "pokemon": {
          const r=await fetch("https://pokeapi.co/api/v2/pokemon/"+(q||"pikachu").toLowerCase().replace(/\s+/g,"-"));
          if(!r.ok) throw new Error("Pokémon nicht gefunden. Probiere z. B. pikachu oder 25.");
          const d=await r.json(); result={kind:"pokemon",data:d}; break;
        }
        case "tvmaze": {
          if(!q) throw new Error("Gib einen Seriennamen ein.");
          const r=await fetch("https://api.tvmaze.com/search/shows?q="+enc); if(!r.ok) throw new Error("TVmaze ist gerade nicht erreichbar.");
          const d=await r.json(); result={kind:"cards",title:"Serien-Treffer",items:d.slice(0,8).map((x:any)=>({title:x.show.name,subtitle:[x.show.premiered?.slice(0,4),x.show.status,x.show.genres?.slice(0,2).join(", ")].filter(Boolean).join(" · "),image:x.show.image?.medium,description:x.show.summary?.replace(/<[^>]*>/g,"").slice(0,180)}))}; break;
        }
        case "country": {
          if(!q) throw new Error("Gib ein Land ein.");
          const r=await fetch("https://restcountries.com/v3.1/name/"+enc+"?fields=name,capital,region,population,flags,currencies,languages");
          if(!r.ok) throw new Error("Land nicht gefunden.");
          const d=await r.json(); result={kind:"cards",title:"Länder-Treffer",items:d.slice(0,5).map((c:any)=>({title:c.name?.common,subtitle:[c.region,c.capital?.[0]].filter(Boolean).join(" · "),image:c.flags?.png,description:"Einwohner: "+prettyNum(c.population||0)+" · Sprachen: "+Object.values(c.languages||{}).slice(0,3).join(", "),name:c.name?.common}))}; break;
        }
        case "dog": { const r=await fetch("https://dog.ceo/api/breeds/image/random"); if(!r.ok) throw new Error("Dog API nicht erreichbar."); result={kind:"image",url:(await r.json()).message,title:"Zufälliger Hund"}; break; }
        case "catfact": { const r=await fetch("https://catfact.ninja/fact"); if(!r.ok) throw new Error("Cat Fact API nicht erreichbar."); const d=await r.json(); result={kind:"fact",title:"Katzen-Fakt",text:d.fact,meta:(d.length||"")+" Zeichen"}; break; }
        case "jikan": {
          if(!q) throw new Error("Gib einen Anime-Titel ein.");
          const r=await fetch("https://api.jikan.moe/v4/anime?q="+enc+"&limit=8"); if(!r.ok) throw new Error("Jikan hat das Limit erreicht oder ist nicht erreichbar.");
          const d=await r.json(); result={kind:"cards",title:"Anime-Treffer",items:d.data.map((x:any)=>({title:x.title,subtitle:[x.year,x.type,x.episodes?x.episodes+" Folgen":""].filter(Boolean).join(" · "),image:x.images?.jpg?.image_url,description:x.synopsis?.slice(0,180)}))}; break;
        }
        case "github": {
          const name=q||"octocat"; const r=await fetch("https://api.github.com/users/"+encodeURIComponent(name)); if(!r.ok) throw new Error("GitHub-Nutzer nicht gefunden oder API-Limit erreicht.");
          const d=await r.json(); result={kind:"profile",title:d.login,subtitle:d.name||"GitHub-Profil",image:d.avatar_url,description:d.bio,stats:[["Repos",d.public_repos],["Follower",d.followers],["Folgt",d.following]],url:d.html_url,meta:d.location||d.company}; break;
        }
        case "dictionary": {
          if(!q) throw new Error("Gib ein englisches Wort ein.");
          const r=await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+enc); if(!r.ok) throw new Error("Wort nicht gefunden.");
          const d=await r.json(); result={kind:"dictionary",data:d[0]}; break;
        }
        case "recipe": {
          if(!q) throw new Error("Gib eine Zutat oder einen Rezeptnamen ein.");
          const r=await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+enc); if(!r.ok) throw new Error("Rezeptsuche nicht verfügbar.");
          const d=await r.json(); result={kind:"cards",title:"Rezept-Treffer",items:(d.meals||[]).slice(0,8).map((m:any)=>({title:m.strMeal,subtitle:m.strArea+" · "+m.strCategory,image:m.strMealThumb,description:m.strInstructions?.slice(0,180),url:m.strSource||m.strYoutube}))}; if(!result.items.length) throw new Error("Kein Rezept gefunden."); break;
        }
        case "joke": {
          const r=await fetch("https://v2.jokeapi.dev/joke=Programming?safe-mode"); if(!r.ok) throw new Error("Joke API nicht erreichbar.");
          const d=await r.json(); result={kind:"fact",title:"Programmier-Witz",text:d.type==="twopart"?d.setup+"\n\n"+d.delivery:d.joke,meta:"Safe Mode aktiv"}; break;
        }
        case "currency": {
          const r=await fetch("https://api.frankfurter.dev/v1/latest?base=EUR"); if(!r.ok) throw new Error("Wechselkurse momentan nicht erreichbar.");
          const d=await r.json(); result={kind:"currency",data:d}; break;
        }
        case "nasa": {
          const r=await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"); if(!r.ok) throw new Error("NASA-Demo-Key ist limitiert. Später erneut versuchen.");
          const d=await r.json(); result={kind:"nasa",data:d}; break;
        }
        case "qr": {
          const value=q||"https://apivault.dev/";
          result={kind:"qr",value,url:"https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data="+encodeURIComponent(value)}; break;
        }
        case "swapi": {
          const r=await fetch("https://www.swapi.tech/api/people/1"); if(!r.ok) throw new Error("Star Wars API gerade nicht erreichbar.");
          const d=await r.json(); result={kind:"json",data:d.result||d}; break;
        }
        case "cocktail": {
          const r=await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s="+encodeURIComponent(q||"mojito")); if(!r.ok) throw new Error("CocktailDB nicht erreichbar.");
          const d=await r.json(); result={kind:"cards",title:"Getränke-Treffer",items:(d.drinks||[]).slice(0,6).map((m:any)=>({title:m.strDrink,subtitle:m.strCategory,image:m.strDrinkThumb,description:m.strInstructions?.slice(0,180)}))}; if(!result.items.length) throw new Error("Nichts gefunden."); break;
        }
        case "randomuser": {
          const r=await fetch("https://randomuser.me/api/"); if(!r.ok) throw new Error("Random User API nicht erreichbar.");
          const d=(await r.json()).results?.[0]; result={kind:"profile",title:d.name.first+" "+d.name.last,subtitle:d.email,image:d.picture.large,description:"Demo-Profil aus synthetischen Daten.",stats:[["Land",d.location.country],["Alter",d.dob.age],["Telefon",d.phone]],meta:d.location.city}; break;
        }
        case "httpcat": result={kind:"image",url:"https://http.cat/"+(q||"200").replace(/[^0-9]/g,"").slice(0,3),title:"HTTP Cats · Status "+(q||"200")}; break;
        case "itunes": {
          const r=await fetch("https://itunes.apple.com/search?term="+encodeURIComponent(q||"daft punk")+"&entity=song&limit=8"); if(!r.ok) throw new Error("iTunes-Suche fehlgeschlagen.");
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
  const shownTitle = view==="favorites" ? "Deine Favoriten" : view==="playground" ? "Live Playground" : subcategory || category==="Alle APIs" ? "API entdecken" : category;
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
    <main className="av-main">
      <header className="av-topbar">
        <div className="av-top-left"><button className="av-icon-btn av-menu-btn" onClick={()=>setMobile(true)} aria-label="Menü öffnen"><Menu size={19}/></button><div className="av-breadcrumb">APIverse <ChevronRight size={13}/><strong>{view==="discover"?"Entdecken":view==="favorites"?"Favoriten":"Playground"}</strong></div></div>
        <div className="av-top-actions"><label className="av-search-wrap"><Search size={17}/><input id="apiverse-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="APIs, Kategorien suchen …"/><kbd>⌘ K</kbd></label><button className="av-icon-btn" title={dark?"Hellmodus":"Dunkelmodus"} aria-label="Farbschema wechseln" onClick={()=>setDark(!dark)}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button><a className="av-github-btn" href="https://github.com/Lennonbsiq999/craft-attack-app" target="_blank" rel="noreferrer"><Code2 size={15}/> <span>GitHub</span><ArrowUpRight size={13}/></a></div>
      </header>
      <div className="av-content">
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
          <div className="av-api-grid">{filtered.map((api,i)=><article className="av-api-card" key={api.id} style={{animationDelay:Math.min(i*25,250)+"ms"}}><div className="av-api-card-top"><div className="av-api-icon" style={{"--api-tint":api.color} as React.CSSProperties}>{api.icon}</div><button className={"av-fav-btn "+(favorites.includes(api.id)?"favorited":"")} onClick={()=>toggleFavorite(api.id)} title={favorites.includes(api.id)?"Favorit entfernen":"Zu Favoriten hinzufügen"} aria-label="Favorit umschalten"><Star size={16} fill={favorites.includes(api.id)?"currentColor":"none"}/></button></div><div className="av-api-name-row"><h3>{api.name}</h3>{api.featured&&<span className="av-hot"><Flame size={10}/> TOP</span>}</div><div className="av-api-sub">{api.subcategory}</div><p className="av-api-desc">{api.description}</p><div className="av-api-tags">{api.auth==="Keine"?<span className="av-tag green"><Check size={10}/> Kein Key</span>:<span className="av-tag amber">{api.auth==="OAuth"?"OAuth":"Key möglich"}</span>}<span className={"av-tag "+(api.demo?"cyan":"")}>{api.demo?<><Activity size={10}/> Live-Demo</>:"Dokumentation"}</span></div><div className="av-api-card-footer"><span className="av-api-category">{api.icon} {api.category}</span><button onClick={()=>openApi(api)}>{api.demo?"API testen":"Details ansehen"} <ArrowRight size={13}/></button></div></article>)}
          {filtered.length===0&&<div className="av-empty"><div><Search size={25}/></div><h3>Nichts gefunden</h3><p>Keine API passt zu deinem Filter. Versuch einen anderen Suchbegriff oder setz die Filter zurück.</p><button className="av-primary-btn" onClick={()=>{setSearch("");chooseView("discover")}}>Filter zurücksetzen <ArrowRight size={14}/></button></div>}
          </div>
        </section>
        <section className="av-lab-banner"><div className="av-lab-icon"><Terminal size={25}/></div><div><div className="av-kicker">FÜR MAKER & NEUGIERIGE</div><h2>Eine Idee. Tausend Möglichkeiten.</h2><p>Starte eine Live-Demo, kopiere einen Endpoint oder öffne die Original-Dokumentation. Deine nächste App wartet nicht auf ein Abo.</p></div><button onClick={()=>chooseView("playground")}>Zum Playground <ArrowRight size={15}/></button><div className="av-lab-decor">{"{ }"}</div></section>
        <footer className="av-footer"><div className="av-footer-brand"><div className="av-brand-mark"><Layers3 size={19}/></div><div><strong>APIverse</strong><span>Das offene API-Universum.</span></div></div><div className="av-footer-links"><a href="https://apivault.dev/" target="_blank" rel="noreferrer">Inspiration: APIVault <ExternalLink size={12}/></a><a href="https://github.com/Lennonbsiq999/craft-attack-app" target="_blank" rel="noreferrer">Open Source <ExternalLink size={12}/></a></div><p>APIs werden von Drittanbietern betrieben. Verfügbarkeit, Kontingente und Nutzungsbedingungen können sich ändern.</p></footer>
      </div>
    </main>
    {active&&<div className="av-modal-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setActive(null)}}><section className="av-modal" role="dialog" aria-modal="true" aria-labelledby="av-modal-title"><header className="av-modal-header"><div className="av-modal-icon" style={{"--api-tint":active.color} as React.CSSProperties}>{active.icon}</div><div className="av-modal-title"><div className="av-modal-kicker">{active.category} / {active.subcategory}</div><h2 id="av-modal-title">{active.name}</h2><p>{active.description}</p></div><button className="av-icon-btn" onClick={()=>setActive(null)} aria-label="Schließen"><X size={19}/></button></header><div className="av-modal-body"><div className="av-modal-badges"><span className={active.auth==="Keine"?"green": "amber"}>{active.auth==="Keine"?"✓ Kein API-Key nötig":active.auth==="OAuth"?"OAuth erforderlich":active.auth==="Optional"?"Key je nach Endpunkt":"API-Key erforderlich"}</span><span>{active.cors==="Ja"?"✓ Browserzugriff laut Quelle":active.cors==="Nein"?"Browserzugriff eingeschränkt":"? CORS bitte prüfen"}</span>{active.demo&&<span className="cyan">⚡ Live-Demo verfügbar</span>}</div><div className="av-detail-grid"><div><label>ENDPOINT / BEISPIEL</label><code>{active.endpoint}</code><button className="av-copy-btn" onClick={()=>copyEndpoint(active)}>{copied?<Check size={13}/>:<Copy size={13}/>} {copied?"Kopiert":"Endpoint kopieren"}</button></div><div><label>ZUGANG & HINWEISE</label><p>{active.auth==="Keine"?"Laut Eintrag ohne API-Key nutzbar. Limits und Nutzungsbedingungen des Anbieters beachten.":active.auth==="API-Key"?"Dieser Dienst erwartet typischerweise einen eigenen Schlüssel. Niemals private Schlüssel in eine öffentliche Website oder ein GitHub-Repository committen.":active.auth==="OAuth"?"Authentifizierung über OAuth kann je nach Funktion nötig sein.": "Einige Funktionen sind offen, andere können einen Schlüssel oder ein Konto voraussetzen."}</p><a className="av-doc-link" href={active.docs} target="_blank" rel="noreferrer">Offizielle Dokumentation öffnen <ExternalLink size={13}/></a></div></div><div className="av-endpoint-code"><div><span/><span/><span/><label>REQUEST PREVIEW</label><button onClick={()=>copyEndpoint(active)}><Copy size={12}/> Kopieren</button></div><pre>GET {active.endpoint}</pre></div>{active.demo?<div className="av-demo-panel"><div className="av-demo-head"><div><span className="av-demo-live"><Activity size={12}/> INTERAKTIVE DEMO</span><h3>Probier es direkt aus.</h3></div><span className="av-browser-badge">Browser · Fetch API</span></div><div className="av-demo-form">{!["dog","catfact","nasa","swapi","randomuser"].includes(active.demo)&&<input value={demoInput} onChange={e=>setDemoInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")void runDemo()}} placeholder={active.demo==="weather"?"z. B. Berlin":active.demo==="brawl"?"Optional: wird ignoriert":active.demo==="pokemon"?"Pokémon-Name oder ID":active.demo==="tvmaze"?"Serienname":active.demo==="country"?"Land, z. B. Germany":active.demo==="jikan"?"Anime-Titel":active.demo==="github"?"GitHub Username":active.demo==="dictionary"?"Englisches Wort":active.demo==="recipe"?"Rezept oder Zutat":active.demo==="currency"?"Basis EUR (optional)":active.demo==="qr"?"Text oder URL":active.demo==="httpcat"?"HTTP-Status, z. B. 404":active.demo==="itunes"?"Artist oder Song":"Suche…"} /> }<button className="av-primary-btn" onClick={()=>void runDemo()} disabled={demoLoading}>{demoLoading?<span className="av-spinner"/>:<Play size={14}/>} {demoLoading?"Lädt …":"API ausführen"}</button></div>{demoError&&<div className="av-demo-error"><CircleHelp size={16}/><div><strong>Anfrage hat nicht geklappt</strong><span>{demoError}</span><small>Der Dienst kann vorübergehend down sein, Limits haben oder Browserzugriff blockieren.</small></div></div>}{demoResult&&<div className="av-demo-results">{demoResult.kind==="weather"&&<><div className="av-result-title"><CloudSun size={17}/><strong>{demoResult.place}</strong></div><div className="av-weather-metrics"><div><small>JETZT</small><strong>{Math.round(demoResult.data.current.temperature_2m)}°C</strong><span>Temperatur</span></div><div><small>GEFÜHLT</small><strong>{Math.round(demoResult.data.current.apparent_temperature)}°C</strong><span>Gefühlte Temp.</span></div><div><small>WIND</small><strong>{Math.round(demoResult.data.current.wind_speed_10m)} km/h</strong><span>Luftbewegung</span></div></div><div className="av-json-mini">{JSON.stringify(demoResult.data.daily,null,2)}</div></>}
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
