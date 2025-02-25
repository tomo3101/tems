import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export const useCurrentSession = () => {
  const [session, setSession] = useState<Session | null>(null);

  const [status, setStatus] = useState<string>('loading');
  const pathName = usePathname();

  const retrieveSession = useCallback(async () => {
    try {
      const sessionData = await getSession();
      if (sessionData) {
        setSession(sessionData);
        setStatus('authenticated');
        return;
      }

      setStatus('unauthenticated');
    } catch (error) {
      console.log('Error retrieving session', error);
      setStatus('unauthenticated');
      setSession(null);
    }
  }, [setSession]);

  useEffect(() => {
    if (!session) {
      retrieveSession();
    }
  }, [retrieveSession, session, pathName]);

  return { session, status };
};
