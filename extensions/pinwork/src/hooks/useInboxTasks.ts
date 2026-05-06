/**
 * Hook to fetch inbox tasks with caching.
 */

import { useCachedPromise } from "@raycast/utils";
import { getInboxTasks } from "../api/pinwork";

export function useInboxTasks(options?: { execute?: boolean }) {
  const { data, isLoading, error, revalidate, mutate } = useCachedPromise(
    getInboxTasks,
    [],
    {
      initialData: [],
      keepPreviousData: true,
      execute: options?.execute ?? true,
    },
  );

  return { tasks: data, isLoading, error, revalidate, mutate };
}
