import { useState, type FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import type { Post } from '@/types/post.types';
import { useDeletePostMutation } from '@/queries/post.queries';

interface DeletePostDialogProps {
  post: Post;
}

const DeletePostDialog: FC<DeletePostDialogProps> = ({ post }) => {
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const { mutate: deletePost, isPending } = useDeletePostMutation();

  return (
    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='text-destructive hover:text-destructive hover:bg-destructive/10'
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post</DialogTitle>
        </DialogHeader>

        <p className='text-sm text-muted-foreground leading-relaxed'>
          Are you sure you want to delete this post?
          <span className='block mt-2 p-2 rounded-md bg-muted text-foreground font-medium italic'>
            {post.title}
          </span>
        </p>

        <DialogFooter className='flex gap-2'>
          <Button variant='outline' onClick={() => setDeleteOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              deletePost(post._id);
            }}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostDialog;
