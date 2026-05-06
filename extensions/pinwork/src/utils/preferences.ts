/**
 * Preferences utilities for Pinwork Raycast extension.
 */

import { getPreferenceValues } from "@raycast/api";

interface PinworkPreferences {
  /** Whether to show completed tasks in list views */
  showCompletedTasks: boolean;
  /** Default list to show when opening the extension */
  defaultList: "today" | "inbox" | "next";
}

/**
 * Gets the user's extension preferences.
 */
export function getPreferences(): PinworkPreferences {
  return getPreferenceValues<PinworkPreferences>();
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
