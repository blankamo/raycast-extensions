/**
 * Hook to check Pinwork installation and running status.
 */

import { useCachedPromise, showFailureToast } from "@raycast/utils";
import { getPinworkAvailability } from "../api/pinwork";

const initialAvailability = { installed: true, running: true };

export function usePinworkAvailability() {
  const { data, isLoading, error, revalidate } = useCachedPromise(
    getPinworkAvailability,
    [],
    {
      initialData: initialAvailability,
      onError: (err) =>
        showFailureToast(err, { title: "Unable to check Pinwork status" }),
    },
  );

  return {
    installed: data?.installed ?? false,
    running: data?.running ?? false,
    isReady: Boolean(data?.installed && data?.running),
    isLoading,
    error,
    revalidate,
  };
}
