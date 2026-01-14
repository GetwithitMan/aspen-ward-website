import { initErrorHandler } from './utils/error-handler.js';
import { showInlineError } from './utils/error-handler.js';
import { SELECTORS } from './config.js';
import { loadWardInfo, loadProgram, loadEvents } from './services/data-service.js';
import { initTheme } from './components/theme-toggle.js';
import { initNavigation } from './components/navigation.js';
import { initModal } from './components/modal.js';
import { showLoading, hideLoading } from './components/loading.js';
import { renderWardInfo } from './renderers/ward-info-renderer.js';
import { renderProgram } from './renderers/program-renderer.js';
import { renderEvents } from './renderers/events-renderer.js';

/**
 * Main application initialization
 */
async function init() {
  // Initialize error handling
  initErrorHandler();

  // Initialize UI components
  initTheme();
  initNavigation();
  initModal();

  // Show loading screen
  showLoading();

  try {
    // Load ward information
    const wardDetails = await loadWardInfo();
    renderWardInfo(wardDetails);

    // Load program and events in parallel
    const results = await Promise.allSettled([
      loadProgram().then(rows => renderProgram(rows, wardDetails)),
      loadEvents().then(rows => renderEvents(rows, wardDetails))
    ]);

    // Handle any errors from individual loads
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Data load ${index} failed:`, result.reason);

        // Show inline error for program
        if (index === 0) {
          showInlineError(
            SELECTORS.programGrid(),
            'We couldn\'t load today\'s program. Please refresh or try again soon.'
          );
        }

        // Show inline error for events
        if (index === 1) {
          showInlineError(
            SELECTORS.eventsTimeline(),
            'Upcoming events are unavailable right now.'
          );
        }
      }
    });
  } catch (error) {
    console.error('Fatal initialization error:', error);
  } finally {
    // Hide loading screen
    hideLoading();
  }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
