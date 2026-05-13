import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '@store';
import {hydrateStore} from '@store/reducers/rootSlice';

/**
 * Hook to handle initial app hydration from SQLite and background sync.
 */
export const useInitialHydration = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log('🚀 App Starting: Triggering SQLite hydration...');
    dispatch(hydrateStore());
  }, [dispatch]);
};
