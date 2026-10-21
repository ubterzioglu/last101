'use client';

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { buildAdminListUrl, fetchAdminList, getErrorMessage, type AdminQuery } from '@/lib/admin/adminResource';

export interface UseAdminResourceOptions<T> {
  /** Admin list endpoint, e.g. `/api/broken-link-reports-admin-list`. */
  url: string;
  /** Filter values sent as query params (see `buildAdminListUrl`). Any change reloads the list. */
  query?: AdminQuery;
  /** Loads automatically while true, typically `useAdminGate() === 'authed'`. */
  enabled: boolean;
  initialData: T;
  /** Maps the JSON payload to `data`. May be an inline function. */
  select: (payload: unknown) => T;
  /** When set, load failures are logged as `console.error(errorLogLabel, error)`. */
  errorLogLabel?: string;
}

export interface AdminResource<T> {
  data: T;
  /** For local updates after an action, e.g. dropping a deleted row without a reload. */
  setData: Dispatch<SetStateAction<T>>;
  loading: boolean;
  /** Message of the last failed load; cleared when a load starts. */
  error: string;
  reload: () => Promise<void>;
}

/**
 * List state of an admin page: loads `url` + `query` with the admin headers, tracks loading and
 * error, and reloads when the query changes. Run actions with `postAdminAction` from
 * `@/lib/admin/adminResource`, then update `data` with `setData` or call `reload`.
 */
export function useAdminResource<T>({
  url,
  query,
  enabled,
  initialData,
  select,
  errorLogLabel,
}: UseAdminResourceOptions<T>): AdminResource<T> {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Read through a ref so an inline `select` does not re-create `reload` (and reload) every render.
  const selectRef = useRef(select);
  useEffect(() => {
    selectRef.current = select;
  });

  const requestUrl = buildAdminListUrl(url, query);

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await fetchAdminList(requestUrl);
      setData(selectRef.current(payload));
    } catch (loadError) {
      if (errorLogLabel) console.error(errorLogLabel, loadError);
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [requestUrl, errorLogLabel]);

  // Also keyed on the raw query: the hand-written clients reloaded on every filter edit, including
  // edits that trim to the same URL (e.g. typing a trailing space).
  const queryKey = JSON.stringify(query ?? {});

  useEffect(() => {
    if (enabled) void reload();
  }, [enabled, reload, queryKey]);

  return { data, setData, loading, error, reload };
}
