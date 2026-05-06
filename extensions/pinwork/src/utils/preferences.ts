/**
 * Preferences utilities for Pinwork Raycast extension.
 */

import { getPreferenceValues } from "@raycast/api";

/**
 * Gets the user's extension preferences.
 */
export function getPreferences(): Preferences {
  return getPreferenceValues<Preferences>();
}

/**
 * Checks if completed tasks should be shown.
 */
export function shouldShowCompletedTasks(): boolean {
  return getPreferences().showCompletedTasks;
}

/**
 * Gets the default list to display.
 */
export function getDefaultList(): "today" | "inbox" | "next" {
  return getPreferences().defaultList;
}
