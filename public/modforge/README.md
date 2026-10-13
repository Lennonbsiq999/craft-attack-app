# ModForge AI

Creator for Minecraft Mods, server plugins and datapacks.

- Configure project type, Minecraft version, loader/platform, Java version and package.
- Generate a starter project and prompt without an API key.
- Optionally use an OpenRouter API key to generate editable source files with an AI model.
- Inspect generated files, download individual files or export a ZIP.

## Live URL
https://lennonbsiq999.github.io/craft-attack-app/modforge/

## Security and limitations
The API key is held in the current browser tab only and is sent directly to OpenRouter for generation. It is not written to GitHub or the ZIP. Do not use API keys you do not control.

Exports are source projects, not guaranteed compiled JARs. Check the selected Minecraft and loader/API versions, build locally, and test before using on a live server or world.

## Implementation
`index.html` is served from the existing site's `public/modforge/` directory and copied to `dist/modforge/` by Vite during the existing GitHub Pages build.
