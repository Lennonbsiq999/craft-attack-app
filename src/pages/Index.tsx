import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Blocks,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  ExternalLink,
  Globe2,
  Heart,
  MapPinned,
  Menu,
  Play,
  Search,
  Sparkles,
  Star,
  Users,
  Video,
  X,
} from "lucide-react";

type Creator = {
  name: string;
  channel: string;
  initials: string;
  seasons: string;
  tag: "longtime" | "new";
  tone: string;
  blurb: string;
};

const creators: Creator[] = [
  { name: "Paluten", channel: "paluten", initials: "PA", seasons: "Seit Staffel 8", tag: "longtime", tone: "#d39a48", blurb: "Abenteuer, Projekte und jede Menge Chaos auf einer gemeinsamen Minecraft-Welt." },
  { name: "BastiGHG", channel: "bastighg", initials: "BG", seasons: "Seit Staffel 7", tag: "longtime", tone: "#4b92a8", blurb: "Technische Builds, verrückte Ideen und große Projekte." },
  { name: "Papaplatte", channel: "papaplatte", initials: "PP", seasons: "Seit Staffel 10", tag: "longtime", tone: "#a26ac9", blurb: "Streams und Highlights aus der CraftAttack-Welt." },
  { name: "Trymacs", channel: "trymacs", initials: "TR", seasons: "Seit Staffel 8", tag: "longtime", tone: "#4b9c76", blurb: "Community-Momente und Projekte in einer großen Creator-Runde." },
  { name: "rewinside", channel: "rewinside", initials: "RE", seasons: "Seit Staffel 1", tag: "longtime", tone: "#c56f5e", blurb: "Seit den frühen Staffeln Teil der CraftAttack-Geschichte." },
  { name: "CastCrafter", channel: "castcrafter", initials: "CC", seasons: "Seit Staffel 1", tag: "longtime", tone: "#6480cf", blurb: "Minecraft-Builds und kreative Ideen seit den ersten Staffeln." },
  { name: "MontanaBlack", channel: "montanablack88", initials: "MB", seasons: "Neu in Staffel 13", tag: "new", tone: "#b45555", blurb: "Ein neues Gesicht in der bisher besonders großen dreizehnten Staffel." },
  { name: "PietSmiet", channel: "pietsmiet", initials: "PS", seasons: "Neu in Staffel 13", tag: "new", tone: "#d0a247", blurb: "Die Gaming-Gruppe ist in Staffel 13 neu zum Projekt gestoßen." },
  { name: "EliasN97", channel: "eliasn97", initials: "E97", seasons: "Neu in Staffel 13", tag: "new", tone: "#4f8dc9", blurb: "Neue Perspektive und neue Projekte seit Staffel 13." },
  { name: "Maudado", channel: "maudado", initials: "MA", seasons: "Neu in Staffel 13", tag: "new", tone: "#c26e9c", blurb: "Seit Staffel 13 Teil des Creator-Projekts." },
  { name: "HandOfBlood", channel: "handofblood", initials: "HB", seasons: "Seit Staffel 12", tag: "longtime", tone: "#b86645", blurb: "Gaming, Events und besondere Momente aus dem SMP." },
  { name: "Zombey", channel: "zombey", initials: "ZO", seasons: "Seit Staffel 8", tag: "longtime", tone: "#6d8c55", blurb: "Ein vertrauter Name aus den späteren CraftAttack-Staffeln." },
];

const videos = [
  { title: "CraftAttack – die besten Momente", subtitle: "Highlights & Community-Momente", query: "CraftAttack 13 Highlights", style: "thumb-green", icon: "✦" },
  { title: "Neue Builds, neue Ideen", subtitle: "Bauprojekte entdecken", query: "CraftAttack 13 Base Tour", style: "thumb-blue", icon: "▦" },
  { title: "Was geht auf dem Server?", subtitle: "Streams und aktuelle Videos", query: "CraftAttack 13 aktuell", style: "thumb-orange", icon: "▶" },
];

const youtubeSearch = (query: string) =>
  "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);

function CreatorAvatar({ creator, large = false }: { creator: Creator; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={"creator-avatar" + (large ? " creator-avatar-large" : "")} style={{ background: creator.tone }}>
      {!failed ? (
        <img
          src={"https://unavatar.io/twitch/" + creator.channel}
          alt={creator.name + " Profilbild"}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{creator.initials}</span>
      )}
      <span className="avatar-glint" aria-hidden="true" />
    </div>
  );
}

const Index = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("craftattack-hub-favorites");
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState<"all" | "longtime" | "new">("all");
  const [creatorSearch, setCreatorSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("craftattack-hub-favorites", JSON.stringify(favorites));
    } catch {
      // The site still works if browser storage is disabled.
    }
  }, [favorites]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSelectedCreator(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredCreators = useMemo(() => {
    const query = creatorSearch.trim().toLowerCase();
    return creators.filter((creator) => {
      const matchesFilter = filter === "all" || creator.tag === filter;
      const matchesQuery =
        !query ||
        creator.name.toLowerCase().includes(query) ||
        creator.seasons.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [filter, creatorSearch]);

  const searchResults = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return creators.slice(0, 5);
    return creators.filter((creator) =>
      (creator.name + " " + creator.seasons + " " + creator.blurb).toLowerCase().includes(query),
    ).slice(0, 8);
  }, [searchValue]);

  const toggleFavorite = (creator: Creator) => {
    const alreadySaved = favorites.includes(creator.channel);
    setFavorites((current) =>
      alreadySaved ? current.filter((item) => item !== creator.channel) : [...current, creator.channel],
    );
    setToast(alreadySaved ? creator.name + " aus Favoriten entfernt" : creator.name + " gespeichert");
    window.setTimeout(() => setToast(""), 2400);
  };

  const jumpTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="ca-site">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="ca-header">
        <a className="brand" href="#start" onClick={() => jumpTo("start")} aria-label="CraftAttack Hub Startseite">
          <span className="brand-mark"><Blocks size={24} strokeWidth={2.4} /></span>
          <span className="brand-copy"><strong>CRAFT<span>ATTACK</span></strong><small>COMMUNITY HUB</small></span>
        </a>

        <nav className={"main-nav" + (mobileOpen ? " nav-open" : "")} aria-label="Hauptnavigation">
          <a href="#start" onClick={() => setMobileOpen(false)} className="nav-active">Start</a>
          <a href="#creator" onClick={() => setMobileOpen(false)}>Creator</a>
          <a href="#videos" onClick={() => setMobileOpen(false)}>Videos</a>
          <a href="#welt" onClick={() => setMobileOpen(false)}>Welt & Projekte</a>
          <a href="#infos" onClick={() => setMobileOpen(false)}>Infos</a>
        </nav>

        <div className="header-actions">
          <button className="icon-button search-trigger" onClick={() => setSearchOpen(true)} aria-label="Website durchsuchen" title="Suche (Strg+K)">
            <Search size={18} />
            <span className="search-shortcut">⌘ K</span>
          </button>
          <a className="header-cta" href="https://craftattack.me/staffeln" target="_blank" rel="noreferrer">
            Staffel entdecken <ArrowUpRight size={16} />
          </a>
          <button className="icon-button mobile-trigger" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}>
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero section-wrap" id="start">
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-dot" /> INOFFIZIELLER FAN-HUB <span className="eyebrow-line" /></div>
            <h1>Eine Welt.<br /><span>Unendlich</span> viele<br className="mobile-break" /> Geschichten.</h1>
            <p className="hero-lead">
              Entdecke die Creator, verfolge die Highlights und tauche tiefer in die Welt von CraftAttack ein.
              Alles an einem Ort.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => jumpTo("creator")}>Creator entdecken <ArrowRight size={18} /></button>
              <button className="button button-secondary" onClick={() => jumpTo("videos")}><Play size={17} fill="currentColor" /> Highlights ansehen</button>
            </div>
            <div className="hero-proof">
              <div className="proof-avatars" aria-hidden="true">
                {creators.slice(0, 4).map((creator) => <span key={creator.channel} style={{ background: creator.tone }}>{creator.initials.slice(0, 1)}</span>)}
              </div>
              <div><strong>Ein Hub für die Community</strong><small>Creator · Videos · Welt · Infos</small></div>
              <span className="proof-star"><Sparkles size={17} /></span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Illustration einer Minecraft-inspirierten Blockwelt">
            <div className="visual-topline"><span><span className="status-dot" /> WORLD OVERVIEW</span><span>CRAFTATTACK / HUB_01</span></div>
            <div className="voxel-scene">
              <div className="scene-sun" />
              <div className="scene-cloud cloud-one" />
              <div className="scene-cloud cloud-two" />
              <div className="mountain mountain-back" />
              <div className="mountain mountain-front" />
              <div className="scene-water" />
              <div className="scene-land land-back" />
              <div className="scene-land land-front" />
              <div className="pixel-tree tree-one"><i /><b /></div>
              <div className="pixel-tree tree-two"><i /><b /></div>
              <div className="pixel-house"><span /><i /><b /></div>
              <div className="scene-cube cube-one" />
              <div className="scene-cube cube-two" />
              <div className="scene-cube cube-three" />
              <div className="scene-vignette" />
              <div className="scene-caption"><span className="tiny-label">YOUR NEXT ADVENTURE</span><strong>Deine Welt wartet.</strong><span>Entdecken. Bauen. Erleben.</span></div>
            </div>
            <div className="visual-footer">
              <div className="visual-stat"><span className="stat-icon"><Users size={16} /></span><span><small>CREATOR</small><strong>Eine Community</strong></span></div>
              <div className="visual-stat"><span className="stat-icon purple"><Compass size={16} /></span><span><small>PROJEKT</small><strong>Seit 2014</strong></span></div>
              <a href="https://craftattack.me/" target="_blank" rel="noreferrer" className="round-link" aria-label="Mehr über CraftAttack"><ArrowUpRight size={19} /></a>
            </div>
            <div className="floating-chip chip-top"><span className="chip-pulse" /> COMMUNITY FIRST</div>
            <div className="floating-chip chip-bottom"><Sparkles size={14} /> BLOCK FÜR BLOCK</div>
          </div>
          <div className="hero-scroll" aria-hidden="true"><span /> SCROLL TO EXPLORE</div>
        </section>

        <section className="quick-stats section-wrap" aria-label="CraftAttack auf einen Blick">
          <div className="quick-stat"><span className="quick-icon"><CalendarDays size={19} /></span><span><strong>Seit 2014</strong><small>Eine lange Minecraft-Geschichte</small></span></div>
          <div className="quick-stat"><span className="quick-icon"><Users size={19} /></span><span><strong>100+ Creator</strong><small>Große Runden, viele Perspektiven</small></span></div>
          <div className="quick-stat"><span className="quick-icon"><Video size={19} /></span><span><strong>Unzählige Videos</strong><small>Highlights und Projekte entdecken</small></span></div>
          <a className="stats-link" href="https://craftattack.me/about" target="_blank" rel="noreferrer">Projekt kennenlernen <ArrowUpRight size={15} /></a>
        </section>

        <section className="section-wrap creator-section section-block" id="creator">
          <div className="section-heading">
            <div>
              <div className="eyebrow section-eyebrow">DIE MENSCHEN HINTER DEN BUILDS</div>
              <h2>Creator <span>entdecken.</span></h2>
              <p>Bekannte Gesichter aus Staffel 13 und ihre Kanäle auf einen Blick.</p>
            </div>
            <div className="section-heading-side">
              <div className="saved-count"><Heart size={15} fill={favorites.length ? "currentColor" : "none"} /> {favorites.length} gespeichert</div>
              <span className="section-index">01 / CREATOR</span>
            </div>
          </div>

          <div className="creator-tools">
            <label className="creator-search"><Search size={18} /><input value={creatorSearch} onChange={(event) => setCreatorSearch(event.target.value)} placeholder="Creator suchen..." aria-label="Creator suchen" />{creatorSearch && <button onClick={() => setCreatorSearch("")} aria-label="Suche leeren"><X size={15} /></button>}</label>
            <div className="filter-pills" role="group" aria-label="Creator filtern">
              <button className={filter === "all" ? "filter-active" : ""} onClick={() => setFilter("all")}>Alle <span>{creators.length}</span></button>
              <button className={filter === "longtime" ? "filter-active" : ""} onClick={() => setFilter("longtime")}>Schon länger dabei</button>
              <button className={filter === "new" ? "filter-active" : ""} onClick={() => setFilter("new")}>Neu in Staffel 13</button>
            </div>
          </div>

          {filteredCreators.length ? (
            <div className="creator-grid">
              {filteredCreators.map((creator, index) => {
                const saved = favorites.includes(creator.channel);
                return (
                  <article className="creator-card" key={creator.channel} style={{ animationDelay: (index * 35) + "ms" }}>
                    <button className="creator-card-main" onClick={() => setSelectedCreator(creator)} aria-label={creator.name + " Profil ansehen"}>
                      <div className="creator-card-top">
                        <CreatorAvatar creator={creator} />
                        <span className="creator-arrow"><ArrowUpRight size={16} /></span>
                      </div>
                      <div className="creator-card-info"><h3>{creator.name}</h3><span>{creator.seasons}</span></div>
                      <div className="creator-card-bottom"><span className={creator.tag === "new" ? "season-badge badge-new" : "season-badge"}>{creator.tag === "new" ? "NEU DABEI" : "CRAFTATTACK"}</span><span className="card-open">Profil <ChevronRight size={14} /></span></div>
                    </button>
                    <button className={"favorite-button" + (saved ? " is-favorite" : "")} onClick={() => toggleFavorite(creator)} aria-label={saved ? creator.name + " aus Favoriten entfernen" : creator.name + " speichern"} title={saved ? "Aus Favoriten entfernen" : "Als Favorit speichern"}>
                      <Heart size={16} fill={saved ? "currentColor" : "none"} />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state"><Search size={22} /><strong>Kein Creator gefunden</strong><span>Ändere den Suchbegriff oder setze die Filter zurück.</span><button className="text-button" onClick={() => { setCreatorSearch(""); setFilter("all"); }}>Filter zurücksetzen <ArrowRight size={15} /></button></div>
          )}
          <div className="section-footnote"><span><span className="info-dot">i</span> Die Übersicht bezieht sich auf Staffel 13. Die Teilnehmerliste für neue Staffeln kann abweichen.</span><a href="https://craftattack.me/staffeln/13" target="_blank" rel="noreferrer">Quelle & Staffelinfos <ExternalLink size={13} /></a></div>
        </section>

        <section className="video-section section-block" id="videos">
          <div className="section-wrap">
            <div className="section-heading">
              <div>
                <div className="eyebrow section-eyebrow">DEIN NÄCHSTER RABBIT HOLE</div>
                <h2>Nur noch <span>ein Video.</span></h2>
                <p>Spring direkt zu Highlights, Bauprojekten und aktuellen Videos auf YouTube.</p>
              </div>
              <span className="section-index">02 / WATCH</span>
            </div>
            <div className="video-grid">
              {videos.map((video, index) => (
                <a className="video-card" href={youtubeSearch(video.query)} target="_blank" rel="noreferrer" key={video.title}>
                  <div className={"video-art " + video.style}>
                    <div className="video-art-top"><span>CRAFTATTACK HUB</span><span>0{index + 1} / 03</span></div>
                    <div className="video-art-glyph">{video.icon}</div>
                    <div className="video-art-title">{index === 0 ? "BEST OF" : index === 1 ? "BIG BUILDS" : "SERVER LIFE"}<span>CRAFTATTACK</span></div>
                    <span className="video-play"><Play size={17} fill="currentColor" /></span>
                    <div className="video-art-grid" />
                  </div>
                  <div className="video-card-info"><div><h3>{video.title}</h3><p>{video.subtitle}</p></div><span className="video-external"><ArrowUpRight size={17} /></span></div>
                </a>
              ))}
            </div>
            <div className="video-bottom">
              <div><span className="video-bottom-icon"><Bookmark size={18} /></span><span><strong>Dein nächster Watch-Loop</strong><small>Die Karten öffnen passende YouTube-Suchen. Es werden keine Videos erfunden.</small></span></div>
              <a className="button button-secondary button-small" href={youtubeSearch("CraftAttack")} target="_blank" rel="noreferrer">Alle Videos suchen <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className="section-wrap world-section section-block" id="welt">
          <div className="world-copy">
            <div className="eyebrow section-eyebrow">MEHR ALS NUR EIN SERVER</div>
            <h2>Eine Welt voller<br /><span>Ideen & Projekte.</span></h2>
            <p>Von gigantischen Basen bis zu kleinen Community-Momenten: Entdecke CraftAttack über die Videos und die verfügbaren Projektinfos.</p>
            <a className="button button-primary" href="https://craftattack.me/staffeln/13" target="_blank" rel="noreferrer">Welt & Staffelinfos <ArrowUpRight size={17} /></a>
            <div className="world-note"><Globe2 size={17} /><span><strong>Keine Fake-Livekarte</strong><small>Hier verlinken wir nur Quellen, die tatsächlich verfügbar sind.</small></span></div>
          </div>
          <div className="world-panel">
            <div className="world-panel-header"><span><MapPinned size={16} /> WORLD DIRECTORY</span><span className="world-panel-status">FAN GUIDE</span></div>
            <div className="world-minimap">
              <div className="map-grid" />
              <div className="map-river" />
              <div className="map-island island-one" /><div className="map-island island-two" /><div className="map-island island-three" />
              <span className="map-pin pin-one"><span /><b>BUILD ZONE</b></span>
              <span className="map-pin pin-two"><span /><b>COMMUNITY</b></span>
              <span className="map-pin pin-three"><span /><b>PROJECTS</b></span>
              <span className="map-coordinates">X: — / Z: —</span>
            </div>
            <div className="world-panel-bottom"><div><small>DISCOVER MORE</small><strong>Projektarchiv & Staffelübersicht</strong></div><a href="https://craftattack.me/staffeln" target="_blank" rel="noreferrer" aria-label="Staffelübersicht öffnen"><ArrowUpRight size={19} /></a></div>
          </div>
        </section>

        <section className="info-section section-block" id="infos">
          <div className="section-wrap">
            <div className="section-heading">
              <div><div className="eyebrow section-eyebrow">GOOD TO KNOW</div><h2>Der Überblick <span>bleibt hier.</span></h2><p>Nützliche Einstiege, ohne dir falsche Live-Daten vorzugaukeln.</p></div>
              <span className="section-index">03 / INFO</span>
            </div>
            <div className="info-grid">
              <a className="info-card" href="https://craftattack.me/staffeln" target="_blank" rel="noreferrer"><span className="info-card-icon"><CalendarDays size={20} /></span><span className="info-card-number">01</span><h3>Staffeln & Chronik</h3><p>Von den ersten Welten bis zu den neuesten Projektinfos.</p><span className="info-card-link">Staffeln ansehen <ArrowUpRight size={15} /></span></a>
              <a className="info-card" href="https://craftattack.me/about" target="_blank" rel="noreferrer"><span className="info-card-icon"><Sparkles size={20} /></span><span className="info-card-number">02</span><h3>Das Projekt</h3><p>Hintergründe, Geschichte und die Menschen, die organisieren.</p><span className="info-card-link">Mehr erfahren <ArrowUpRight size={15} /></span></a>
              <a className="info-card" href="https://www.youtube.com/results?search_query=CraftAttack+13" target="_blank" rel="noreferrer"><span className="info-card-icon"><Play size={20} /></span><span className="info-card-number">03</span><h3>Community-Momente</h3><p>Finde Streams, Highlights und neue Perspektiven auf YouTube.</p><span className="info-card-link">Highlights finden <ArrowUpRight size={15} /></span></a>
            </div>
          </div>
        </section>

        <section className="closing-cta section-wrap">
          <div className="closing-emblem"><Blocks size={30} /></div>
          <div><div className="eyebrow section-eyebrow">DEIN HUB. DEINE ENTDECKUNG.</div><h2>Was baust du als Nächstes?</h2><p>Finde neue Creator, entdecke Projekte und tauche in die CraftAttack-Welt ein.</p></div>
          <button className="button button-primary" onClick={() => jumpTo("creator")}>Los geht's <ArrowRight size={17} /></button>
          <div className="closing-decoration" aria-hidden="true"><span /><span /><span /></div>
        </section>
      </main>

      <footer className="ca-footer section-wrap">
        <a className="brand footer-brand" href="#start" onClick={() => jumpTo("start")}><span className="brand-mark"><Blocks size={21} /></span><span className="brand-copy"><strong>CRAFT<span>ATTACK</span></strong><small>COMMUNITY HUB</small></span></a>
        <p>Ein inoffizielles Fan-Projekt. Nicht mit CraftAttack oder dessen Organisation verbunden.</p>
        <div className="footer-links"><a href="https://craftattack.me/" target="_blank" rel="noreferrer">Projektinfos <ExternalLink size={13} /></a><button onClick={() => setSearchOpen(true)}>Suche <Search size={13} /></button><a href="#start" onClick={() => jumpTo("start")}>Nach oben ↑</a></div>
        <span className="footer-copy">© {new Date().getFullYear()} CRAFTATTACK HUB</span>
      </footer>

      {searchOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}>
          <div className="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title">
            <div className="search-modal-head"><span className="modal-search-icon"><Search size={19} /></span><input autoFocus value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Creator und mehr suchen..." aria-label="Globale Suche" /><button className="icon-button modal-close" onClick={() => setSearchOpen(false)} aria-label="Suche schließen"><X size={19} /></button></div>
            <div className="search-modal-body">
              <div className="search-modal-title"><span id="search-title">{searchValue ? "Suchergebnisse" : "Schnellzugriff"}</span><kbd>ESC</kbd></div>
              {searchResults.length ? searchResults.map((creator) => (
                <button className="search-result" key={creator.channel} onClick={() => { setSearchOpen(false); setSearchValue(""); setSelectedCreator(creator); }}>
                  <CreatorAvatar creator={creator} /><span><strong>{creator.name}</strong><small>{creator.seasons}</small></span><ChevronRight size={17} />
                </button>
              )) : <div className="search-no-results">Kein Creator gefunden. Probiere einen anderen Suchbegriff.</div>}
              <div className="search-modal-footer"><span><Search size={13} /> Durchsucht Creator-Profile</span><span>CRAFTATTACK HUB</span></div>
            </div>
          </div>
        </div>
      )}

      {selectedCreator && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedCreator(null); }}>
          <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-name">
            <button className="icon-button profile-close" onClick={() => setSelectedCreator(null)} aria-label="Profil schließen"><X size={19} /></button>
            <div className="profile-cover" style={{ background: "linear-gradient(135deg, " + selectedCreator.tone + "66, #111a19 72%)" }}><span className="eyebrow">CREATOR PROFILE / STAFFEL 13</span><div className="profile-orbit" /></div>
            <div className="profile-body"><CreatorAvatar creator={selectedCreator} large /><span className="profile-season">{selectedCreator.seasons}</span><h2 id="profile-name">{selectedCreator.name}</h2><p>{selectedCreator.blurb}</p>
              <div className="profile-actions"><a className="button button-primary" href={youtubeSearch("CraftAttack 13 " + selectedCreator.name)} target="_blank" rel="noreferrer" onClick={() => setSelectedCreator(null)}><Play size={16} fill="currentColor" /> Videos finden <ArrowUpRight size={15} /></a><a className="button button-secondary" href={"https://www.twitch.tv/" + selectedCreator.channel} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Twitch-Profil</a><button className={"button button-secondary profile-fav" + (favorites.includes(selectedCreator.channel) ? " is-favorite" : "")} onClick={() => toggleFavorite(selectedCreator)}><Heart size={16} fill={favorites.includes(selectedCreator.channel) ? "currentColor" : "none"} /> {favorites.includes(selectedCreator.channel) ? "Gespeichert" : "Merken"}</button></div>
              <span className="profile-disclaimer">Links führen zu externen Plattformen. Creator-Daten beziehen sich auf Staffel 13.</span>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="ca-toast" role="status"><span><Check size={16} /></span>{toast}</div>}
      <button className="back-to-top" onClick={() => jumpTo("start")} aria-label="Zurück nach oben"><ChevronDown size={18} /></button>
    </div>
  );
};

export default Index;
