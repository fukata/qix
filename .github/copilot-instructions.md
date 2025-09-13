# Qix - Territory Control Game
Qix is an HTML5/CSS3/JavaScript browser-based territory control game inspired by the classic arcade game. Players move around the border and draw lines to claim territory while avoiding enemies.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively
- **NO BUILD SYSTEM**: This is a pure frontend web application with no build process, dependencies, or compilation required.
- **RUN IMMEDIATELY**: The game runs directly in any modern web browser via a local HTTP server.
- Start a local HTTP server using one of these validated methods:
  - **Python 3**: `python3 -m http.server 8000` (recommended - always available)
  - **Node.js**: `npx http-server -p 8001` (requires network access for initial download)
  - **PHP**: `php -S localhost:8002` (if PHP is available)
- **NEVER CANCEL**: Server commands run indefinitely. Use timeout of 300+ seconds and run with `async=true` when starting servers.
- Open browser to `http://localhost:[PORT]` where PORT is 8000, 8001, or 8002 depending on server used.

## Validation
- **MANUAL TESTING REQUIRED**: After making any changes, always manually test the complete user scenario:
  1. Start local HTTP server
  2. Open game in browser (`http://localhost:8000`)
  3. Click "ゲーム開始" (Start Game) button - verify button becomes disabled
  4. Verify game elements are visible: player (cyan dot), Qix enemy (red circle with trail), sparks (yellow dots on borders)
  5. Test controls: Arrow keys move player, Space key starts/stops line drawing
  6. Verify collision detection works (touching enemies causes game over)
  7. Test game reset functionality with "リセット" button - verify start button re-enables
  8. Test pause/resume with "一時停止" button
- **NEVER SKIP MANUAL VALIDATION**: Simply starting the server is not sufficient - you must test actual gameplay.
- **UI TESTING**: Take screenshots to verify visual elements render correctly.
- **COLLISION TESTING**: Expect immediate game over when testing - this is normal behavior due to sensitive collision detection.
- **CONTROL VALIDATION**: Game must be started first before controls work - clicking start button is mandatory.

## Repository Structure
- **Root files only**: No subdirectories, build scripts, or configuration files
- **index.html**: Main game page with UI elements and canvas
- **script.js**: Complete game logic (16KB) - all gameplay, physics, rendering, and AI
- **style.css**: Responsive CSS styling with gradients and animations
- **README.md**: Documentation in Japanese with game rules and setup instructions

## Key Game Components (script.js)
- **QixGame class**: Main game controller with complete state management
- **Player system**: Movement, line drawing, territory claiming logic
- **Enemy AI**: Qix (red enemy) with trail and Sparks (border enemies)
- **Collision detection**: Real-time collision between player, enemies, and drawn lines
- **Territory calculation**: Area claiming and percentage scoring system
- **UI integration**: Score display, lives counter, game state management

## Development Workflow
- **Direct editing**: Modify HTML/CSS/JS files directly - no build step required
- **Instant testing**: Refresh browser after file changes to see updates
- **No dependencies**: Zero external libraries or frameworks - pure vanilla JavaScript
- **Cross-browser compatible**: Runs in all modern browsers with HTML5 Canvas support

## Common Tasks
- **Start development server**: `python3 -m http.server 8000` (NEVER CANCEL - runs indefinitely)
- **View game**: Open `http://localhost:8000` in browser
- **Test gameplay**: Click start, use arrow keys + spacebar, verify collision detection
- **Debug**: Use browser developer tools console for JavaScript errors
- **Deploy**: Files can be deployed to any static web hosting (currently on GitHub Pages)

## File Locations
- **Game logic**: `/script.js` 501 lines (complete game implementation)
- **UI styling**: `/style.css` 161 lines (responsive design with animations)
- **Game interface**: `/index.html` 44 lines (canvas and control buttons)
- **Documentation**: `/README.md` 62 lines (Japanese language instructions and features)

## Important Notes
- **Language**: UI and documentation are in Japanese (゛ixクズ陣取りゲーム)
- **No server-side code**: Everything runs in browser - no backend required
- **Canvas-based**: Game renders using HTML5 Canvas API for smooth graphics
- **Real-time gameplay**: Uses requestAnimationFrame for smooth 60fps animation
- **Mobile responsive**: CSS includes mobile viewport and responsive design

## Troubleshooting
- **Game won't load**: Ensure HTTP server is running and browser shows correct URL
- **Controls not working**: Game must be started first with "ゲーム開始" button
- **Immediate game over**: This is normal - collision detection is very sensitive
- **File:// URLs don't work**: Must use HTTP server due to browser security restrictions
- **Port conflicts**: Try different ports (8000, 8001, 8002) if one is in use
- **Empty black canvas**: Check browser console for JavaScript errors
- **Buttons not responding**: Verify page fully loaded and click start button first
- **Server won't start**: Check if port is already in use with `lsof -i :8000`

## Expected Behavior
- **Game starts immediately** when "ゲーム開始" clicked
- **Quick game over is normal** due to sensitive collision detection with enemies
- **Server startup takes 1-2 seconds** - not a long-running process to wait for
- **Browser refresh shows changes instantly** - no compilation delay
- **All three server methods work identically** - choose based on available tools