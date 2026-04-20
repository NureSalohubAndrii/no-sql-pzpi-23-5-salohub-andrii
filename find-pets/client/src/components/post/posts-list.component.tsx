import { Link } from '@tanstack/react-router';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PostStatus, type PaginatedPosts } from '@/types/post.types';
import { type FC } from 'react';
import { usePostFiltersStore } from '@/store/post-filters.store';
import { MapPin, Calendar, User, Users } from 'lucide-react';
import { PetSize, petSizeLabels, PetType, petTypeLabels } from '@/types/pet.types';

interface PostsListsProps {
  isLoading: boolean;
  data?: PaginatedPosts;
}

const LIMIT = 8;

const PostsLists: FC<PostsListsProps> = ({ isLoading, data }) => {
  const { page, setPage, resetFilters } = usePostFiltersStore();

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
        {Array.from({ length: LIMIT }).map((_, i) => (
          <div key={i} className='rounded-2xl border bg-muted animate-pulse h-64' />
        ))}
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className='text-center py-32 border-2 border-dashed rounded-3xl bg-muted/10'>
        <p className='text-muted-foreground text-lg'>No matching posts found</p>
        <Button variant='link' onClick={() => resetFilters()}>
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
        {data?.data.map(post => {
          const photo = post.petId?.photos?.[0] ?? post.foundPetInfo?.photos?.[0];
          const petType = post.petId?.type ?? post.foundPetInfo?.type;
          const petBreed = post.petId?.breed ?? post.foundPetInfo?.breed;
          const petSize = post.petId?.size ?? post.foundPetInfo?.size;
          const petColors = post.petId?.colors ?? post.foundPetInfo?.colors ?? [];

          const authors = post.userIds || [];
          const firstAuthor = authors[0]?.fullName;
          const otherAuthorsCount = authors.length - 1;

          return (
            <Link key={post._id} to='/posts/$id' params={{ id: post._id }} className='group'>
              <div className='rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card flex flex-col h-full'>
                <div className='aspect-video bg-muted relative overflow-hidden'>
                  {photo ? (
                    <img
                      src={photo}
                      alt={post.title}
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-4xl grayscale opacity-30'>
                      🐾
                    </div>
                  )}
                  <div className='absolute top-3 left-3 flex gap-1.5'>
                    <Badge
                      className='shadow-lg'
                      variant={post.status === PostStatus.Lost ? 'destructive' : 'default'}
                    >
                      {post.status === PostStatus.Lost ? 'Lost' : 'Found'}
                    </Badge>
                    {post.isResolved && (
                      <Badge className='shadow-lg bg-green-500 text-white hover:bg-green-500'>
                        Resolved
                      </Badge>
                    )}
                  </div>
                </div>

                <div className='p-4 flex flex-col gap-2 flex-1'>
                  <p className='font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors'>
                    {post.title}
                  </p>

                  {post.description && (
                    <p className='text-xs text-muted-foreground line-clamp-2 leading-relaxed'>
                      {post.description}
                    </p>
                  )}

                  {(petType || petBreed || petSize || petColors.length > 0) && (
                    <div className='flex flex-wrap gap-1'>
                      {petType && (
                        <span className='text-[10px] bg-muted rounded-full px-2 py-0.5 text-muted-foreground'>
                          {petTypeLabels[petType as PetType] ?? petType}
                        </span>
                      )}
                      {petBreed && (
                        <span className='text-[10px] bg-muted rounded-full px-2 py-0.5 text-muted-foreground'>
                          {petBreed}
                        </span>
                      )}
                      {petSize && (
                        <span className='text-[10px] bg-muted rounded-full px-2 py-0.5 text-muted-foreground'>
                          {petSizeLabels[petSize as PetSize] ?? petSize}
                        </span>
                      )}
                    </div>
                  )}

                  <div className='mt-auto pt-2 border-t border-muted flex flex-col gap-1'>
                    {post.address && (
                      <span className='text-[11px] text-muted-foreground flex items-center gap-1 line-clamp-1'>
                        <MapPin size={10} className='shrink-0' />
                        {post.address}
                      </span>
                    )}
                    <div className='flex items-center justify-between gap-2'>
                      <span className='text-[11px] text-muted-foreground flex items-center gap-1 shrink-0'>
                        <Calendar size={10} className='shrink-0' />
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>

                      {firstAuthor && (
                        <span className='text-[11px] text-muted-foreground flex items-center gap-1 truncate'>
                          {otherAuthorsCount > 0 ? (
                            <Users size={10} className='shrink-0' />
                          ) : (
                            <User size={10} className='shrink-0' />
                          )}
                          <span className='truncate'>
                            {firstAuthor}
                            {otherAuthorsCount > 0 && ` +${otherAuthorsCount}`}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {data && data.totalPages > 1 && (
        <div className='flex justify-center items-center gap-1 py-4'>
          <Button variant='ghost' size='sm' disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <div className='flex gap-1'>
            {Array.from({ length: data.totalPages }).map((_, i) => (
              <Button
                key={i}
                size='sm'
                variant={page === i + 1 ? 'default' : 'ghost'}
                className='w-9 h-9 p-0 rounded-lg'
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant='ghost'
            size='sm'
            disabled={page === data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default PostsLists;
