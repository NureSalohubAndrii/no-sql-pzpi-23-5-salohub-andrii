import { Link } from '@tanstack/react-router';
import { useMyPostsQuery, useResolvePostMutation } from '@/queries/post.queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PostStatus } from '@/types/post.types';
import { CheckCircle, PlusCircle } from 'lucide-react';
import EditPostDialog from '@/components/my-posts/edit-post-dialog.component';
import DeletePostDialog from '@/components/my-posts/delete-post-dialog.component';

const MyPostsPage = () => {
  const { data: posts, isLoading } = useMyPostsQuery();
  const { mutate: resolvePost } = useResolvePostMutation();

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8 flex flex-col gap-3'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='h-24 rounded-2xl border bg-muted animate-pulse' />
        ))}
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>My Posts</h1>
          <p className='text-muted-foreground'>{posts?.length ?? 0} posts total</p>
        </div>
        <Button asChild className='rounded-full px-6 shadow-sm'>
          <Link to='/posts/create'>
            <PlusCircle size={18} className='mr-2' />
            Create post
          </Link>
        </Button>
      </div>

      {!posts?.length ? (
        <div className='text-center py-32 border-2 border-dashed rounded-3xl bg-muted/10'>
          <p className='text-muted-foreground text-lg'>You have no posts yet</p>
          <Button asChild variant='link'>
            <Link to='/posts/create'>Create your first post</Link>
          </Button>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {posts.map(post => {
            const photo = post.petId?.photos?.[0] ?? post.foundPetInfo?.photos?.[0];

            return (
              <div
                key={post._id}
                className='flex gap-4 p-4 rounded-2xl border bg-card items-center hover:shadow-md transition-shadow'
              >
                <Link to='/posts/$id' params={{ id: post._id }} className='shrink-0'>
                  <div className='w-16 h-16 rounded-xl overflow-hidden bg-muted'>
                    {photo ? (
                      <img src={photo} alt={post.title} className='w-full h-full object-cover' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-2xl opacity-30'>
                        🐾
                      </div>
                    )}
                  </div>
                </Link>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <Link to='/posts/$id' params={{ id: post._id }}>
                      <p className='font-semibold text-sm hover:text-primary transition-colors'>
                        {post.title}
                      </p>
                    </Link>
                    <Badge variant={post.status === PostStatus.Lost ? 'destructive' : 'default'}>
                      {post.status === PostStatus.Lost ? 'Lost' : 'Found'}
                    </Badge>
                    {post.isResolved && (
                      <Badge className='bg-green-500 text-white hover:bg-green-500'>Resolved</Badge>
                    )}
                  </div>
                  {post.resolvedAt && (
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Resolved:{' '}
                      {new Date(post.resolvedAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                <div className='flex items-center gap-1 shrink-0'>
                  {!post.isResolved && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-green-600 hover:text-green-700 hover:bg-green-50'
                      onClick={() => resolvePost(post._id)}
                    >
                      <CheckCircle size={16} className='mr-1' />
                      Resolve
                    </Button>
                  )}
                  <EditPostDialog isResolved={post.isResolved} post={post} />
                  <DeletePostDialog post={post} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;
