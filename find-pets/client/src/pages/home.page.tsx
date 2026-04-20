import { useMemo, useEffect } from 'react';
import { PostSortBy, type GetPostsParams } from '@/types/post.types';
import { usePostsQuery } from '@/queries/post.queries';
import { useLocationStore } from '@/store/location.store';
import PostFiltersBar from '@/components/post/post-filters-bar.component';
import { usePostFiltersStore } from '@/store/post-filters.store';
import PostsLists from '@/components/post/posts-list.component';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { PlusCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const LIMIT = 8;

const HomePage = () => {
  const { accessToken } = useAuthStore();
  const { lon, lat, setLocation } = useLocationStore();

  const { status, petType, petSize, sortOrder, appliedSearch, radius, page } =
    usePostFiltersStore();

  const queryParams = useMemo<GetPostsParams>(
    () => ({
      page,
      limit: LIMIT,
      sortBy: PostSortBy.CreatedAt,
      sortOrder,
      status: status || undefined,
      petType: petType === 'all' ? undefined : petType,
      search: appliedSearch.trim() || undefined,
      radius: radius && radius > 0 ? radius : undefined,
      lon,
      lat,
      petSize: petSize === 'all' ? undefined : petSize,
    }),
    [page, sortOrder, status, petType, appliedSearch, lon, lat, radius, petSize]
  );

  const { data, isLoading } = usePostsQuery(queryParams);

  useEffect(() => {
    getVisitorIp();
  }, []);

  const getVisitorIp = async () => {
    try {
      if (!navigator.geolocation) {
        return;
      }
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setLocation(coords.longitude, coords.latitude);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Find pets</h1>
          <p className='text-muted-foreground'>Help animals find their way home</p>
        </div>

        {accessToken && (
          <Button asChild className='rounded-full px-6 shadow-sm'>
            <Link to='/posts/create'>
              <PlusCircle size={18} className='mr-2' />
              Create post
            </Link>
          </Button>
        )}
      </div>

      <PostFiltersBar />

      <PostsLists data={data} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;
