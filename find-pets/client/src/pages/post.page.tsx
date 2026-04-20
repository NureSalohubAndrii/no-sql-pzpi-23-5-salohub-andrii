import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, MapPin, Calendar, User, Users, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PetSize, petSizeLabels, PetType, petTypeLabels } from '@/types/pet.types';
import { usePostQuery } from '@/queries/post.queries';
import { PostStatus } from '@/types/post.types';
import StaticMap from '@/components/post/static-map.component';

const PostPage = () => {
  const { id } = useParams({ from: '/posts/$id' });
  const { data: post, isLoading, isError } = usePostQuery(id);

  if (isLoading) {
    return (
      <div className='max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6'>
        <Skeleton className='h-8 w-32' />
        <Skeleton className='h-72 w-full rounded-xl' />
        <Skeleton className='h-6 w-48' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className='max-w-3xl mx-auto px-4 py-8 text-center flex flex-col items-center gap-4'>
        <p className='text-muted-foreground text-lg'>Post not found</p>
        <Button asChild variant='outline'>
          <Link to='/'>Back to feed</Link>
        </Button>
      </div>
    );
  }

  const pet = post.petId;
  const foundPet = post.foundPetInfo;
  const photos = pet?.photos ?? foundPet?.photos ?? [];
  const petType = pet?.type ?? foundPet?.type;
  const petBreed = pet?.breed ?? foundPet?.breed;
  const petSize = pet?.size ?? foundPet?.size;
  const petColors = pet?.colors ?? foundPet?.colors ?? [];

  return (
    <div className='max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6'>
      <Button asChild variant='ghost' size='sm' className='w-fit -ml-2'>
        <Link to='/'>
          <ArrowLeft size={16} className='mr-2' />
          Back to feed
        </Link>
      </Button>

      {photos.length > 0 ? (
        <div className='grid grid-cols-3 gap-2'>
          {photos.map((photo, i) => (
            <div
              key={i}
              className={`rounded-xl overflow-hidden ${i === 0 ? 'col-span-3 aspect-video' : 'aspect-square'}`}
            >
              <img src={photo} alt={post.title} className='w-full h-full object-cover' />
            </div>
          ))}
        </div>
      ) : (
        <div className='w-full aspect-video rounded-xl bg-muted flex items-center justify-center text-6xl'>
          🐾
        </div>
      )}

      <div className='flex items-start justify-between gap-4'>
        <h1 className='text-2xl font-semibold leading-snug'>{post.title}</h1>
        <div className='flex flex-col items-end gap-2 shrink-0'>
          <Badge variant={post.status === PostStatus.Lost ? 'destructive' : 'default'}>
            {post.status === PostStatus.Lost ? 'Lost' : 'Found'}
          </Badge>
          {post.isResolved && (
            <Badge variant='outline' className='text-green-600 border-green-600'>
              Resolved
            </Badge>
          )}
        </div>
      </div>

      <div className='flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground'>
        {post.address && (
          <span className='flex items-center gap-1.5'>
            <MapPin size={14} />
            {post.address}
          </span>
        )}
        <span className='flex items-center gap-1.5'>
          <Calendar size={14} />
          {new Date(post.createdAt).toLocaleDateString('en-US')}
        </span>
        {post.userIds && (
          <span className='flex items-center gap-1.5'>
            {post.userIds.length > 1 ? <Users size={14} /> : <User size={14} />}
            {post.userIds.map(user => user.fullName).join(', ')}
          </span>
        )}
      </div>

      <div className='p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-full bg-primary/10 text-primary'>
            <Phone size={18} />
          </div>
          <div>
            <p className='text-xs text-muted-foreground uppercase font-bold tracking-wider'>
              Contact
            </p>
            <p className='text-lg font-semibold'>{post.phone}</p>
          </div>
        </div>
        <Button asChild>
          <a href={`tel:${post.phone}`}>Call</a>
        </Button>
      </div>

      {post.description && (
        <p className='text-sm leading-relaxed text-foreground'>{post.description}</p>
      )}

      {(petType || petBreed || petSize || petColors.length > 0) && (
        <div className='rounded-xl border p-4 flex flex-col gap-3'>
          <h2 className='font-medium text-sm'>Pet details</h2>
          <div className='grid grid-cols-2 gap-y-2 gap-x-4 text-sm'>
            {petType && (
              <>
                <span className='text-muted-foreground'>Type</span>
                <span className='capitalize'>{petTypeLabels[petType as PetType] ?? petType}</span>
              </>
            )}
            {petBreed && (
              <>
                <span className='text-muted-foreground'>Breed</span>
                <span>{petBreed}</span>
              </>
            )}
            {petSize && (
              <>
                <span className='text-muted-foreground'>Size</span>
                <span>{petSizeLabels[petSize as PetSize] ?? petSize}</span>
              </>
            )}
            {petColors.length > 0 && (
              <>
                <span className='text-muted-foreground'>Colors</span>
                <div className='flex flex-wrap gap-1'>
                  {petColors.map(color => (
                    <Badge key={color} variant='secondary' className='text-xs'>
                      {color}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {post.locationId && typeof post.locationId === 'object' && (
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <h2 className='font-semibold text-lg'>Location</h2>
            <Badge variant='outline' className='font-mono font-normal text-[10px]'>
              {(post.locationId as any).coordinates?.join(', ')}
            </Badge>
          </div>

          <StaticMap coordinates={(post.locationId as any).coordinates} title={post.title} />

          {(post.locationId as any).description && (
            <div className='flex items-start gap-2 p-3 bg-muted/50 rounded-lg'>
              <MapPin size={16} className='mt-0.5 shrink-0 text-primary' />
              <p className='text-sm text-muted-foreground'>
                {(post.locationId as any).description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostPage;
