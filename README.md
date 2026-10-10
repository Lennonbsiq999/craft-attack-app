# APIverse

Eine interaktive API-Zentrale für öffentliche APIs. Entdecke Dienste, teste Live-Endpunkte und baue für jede API ein eigenes OBS-/Streamlabs-Browser-Overlay.

## Live

- **APIverse:** https://lennonbsiq999.github.io/craft-attack-app/
- **GitHub:** https://github.com/Lennonbsiq999/craft-attack-app

## Funktionen

- 35 kuratierte APIs in Kategorien und Unterkategorien, unter anderem Gaming, Wetter & Geografie, Entertainment, Tiere, Wissenschaft, Entwicklung, kreative Tools, Essen und Finanzdaten.
- Suche, Favoriten und Hell-/Dunkelmodus.
- Live-Demos für unterstützte APIs.
- API-Key-Manager mit separater Konfiguration pro API.
- **OBS Overlay Studio:** Für jede gelistete API ein eigener Browser-Source-Link.
- Anpassbare Overlays: Karten, Ticker, Broadcast-Banner, Stat-Karten, Minimal und Terminal.
- Design-Editor für Farben, Schriftarten, Transparenz, Deckkraft, Größe, Abstände, Rundungen, Spalten, Refresh-Rate, Animation, Glow und sichtbare Felder.
- JSON-Feld-Mapping für Titel, Wert, Beschreibung und Bild-URL.
- Konfigurationen bleiben lokal im Browser; OBS-URLs kodieren die Layout-Einstellungen im URL-Fragment.

## OBS / Streamlabs

1. APIverse öffnen und **OBS Overlay Studio** auswählen oder bei einer einzelnen API das Monitor-Symbol anklicken.
2. API auswählen, Layout und Felder einstellen und die Vorschau prüfen.
3. **URL kopieren** wählen.
4. In OBS oder Streamlabs eine Browser-Quelle hinzufügen, die URL einfügen und Breite/Höhe entsprechend der Studio-Einstellung setzen.

## API-Keys & Privatsphäre

- APIverse committet keine API-Schlüssel in dieses Repository.
- Gespeicherte Schlüssel verbleiben im lokalen Browserspeicher der jeweiligen Browser-Umgebung.
- OBS kann einen getrennten Browserspeicher verwenden. Falls nötig, kann ein gespeicherter Schlüssel optional in den codierten Overlay-Link eingebettet werden. Base64 ist **keine Verschlüsselung**; jede Person mit der URL kann den Schlüssel auslesen. Verwende hierfür nur Schlüssel mit minimal nötigen Berechtigungen und widerrufbaren Limits.
- Einige APIs benötigen einen Schlüssel, blockieren Browserzugriff (CORS) oder haben Kontingente. Ein Overlay-Link kann diese Anbieterbeschränkungen nicht umgehen.
- Öffentliche APIs und deren Nutzungsbedingungen können sich ändern.

## Entwicklung

Die Website nutzt React, TypeScript und Vite. GitHub Actions führt den TypeScript-Check und den Build aus und veröffentlicht den Ordner dist über GitHub Pages.
