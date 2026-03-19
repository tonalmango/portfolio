/**
 * main.js
 * Entry point — imports and initialises all modules.
 * Load order matters: loader first, then everything else.
 *
 * Note: Three.js is loaded as a global via CDN <script> tag
 * in index.html, so it doesn't need to be imported here.
 */

import { initLoader }          from './loader.js';
import { initCursor }          from './cursor.js';
import { initNavbar }          from './navbar.js';
import { initScrollReveal,
         initScrollExtras }    from './scrollReveal.js';
import { initTiltCards }       from './tilt.js';
import { initBackgroundScene } from './sceneBackground.js';
import { initHeroScene }       from './sceneHero.js';
import { initPong }            from './pong.js';
import { initContactForm }     from './contactForm.js';

/* ── Boot ── */
initLoader();
initCursor();
initNavbar();
initScrollReveal();
initScrollExtras();
initTiltCards();
initBackgroundScene();
initHeroScene();
initPong();
initContactForm();
