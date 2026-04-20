import { useState, type FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { AlertTriangle, Trash2, Info, UserMinus } from 'lucide-react';
import { useDeletePetMutation } from '@/queries/pets.queries';
import { toast } from 'sonner';
import type { Pet } from '@/types/pet.types';
import { Button } from '../ui/button';

interface PetDeleteDialogProps {
  pet: Pet;
}

const PetDeleteDialog: FC<PetDeleteDialogProps> = ({ pet }) => {
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const { mutate: deletePet } = useDeletePetMutation();

  const isOnlyOwner = !pet.ownersCount || pet.ownersCount <= 1;
  const hasActivePosts = (pet.activePostsCount ?? 0) > 0;

  const handleDelete = () => {
    deletePet(pet._id, {
      onSuccess: () => {
        toast.success(isOnlyOwner ? 'Pet deleted' : 'Removed from your list');
        setDeleteOpen(false);
      },
    });
  };

  return (
    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <DialogTrigger asChild>
        <button className='absolute top-2 right-2 p-1.5 rounded-lg bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground shadow-sm'>
          <Trash2 size={14} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isOnlyOwner ? 'Delete pet profile' : 'Unlink pet profile'}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-2'>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            {isOnlyOwner
              ? 'You are the sole owner of this pet. Deleting it will erase all data from the system.'
              : `This pet has ${pet.ownersCount} owners. Removing it will only delete it from your account.`}
          </p>

          {hasActivePosts && (
            <div
              className={`flex gap-3 p-3 rounded-xl border ${
                isOnlyOwner
                  ? 'bg-destructive/10 border-destructive/20'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <AlertTriangle
                className={isOnlyOwner ? 'text-destructive' : 'text-amber-600'}
                size={20}
              />
              <div className='text-sm'>
                <p className={`font-bold ${isOnlyOwner ? 'text-destructive' : 'text-amber-800'}`}>
                  {pet.activePostsCount} active posts affected
                </p>
                <p className={isOnlyOwner ? 'text-destructive/80' : 'text-amber-700'}>
                  {isOnlyOwner
                    ? 'All related posts will be permanently deleted.'
                    : "Posts will remain active, but you won't be listed as an owner anymore."}
                </p>
              </div>
            </div>
          )}

          {!isOnlyOwner && !hasActivePosts && (
            <div className='flex gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm'>
              <Info size={20} />
              <p>Other co-owners will still be able to manage this pet.</p>
            </div>
          )}
        </div>

        <DialogFooter className='flex gap-2'>
          <Button variant='outline' onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete} className='gap-2'>
            {isOnlyOwner ? <Trash2 size={16} /> : <UserMinus size={16} />}
            {isOnlyOwner ? 'Delete Everywhere' : 'Remove from My List'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PetDeleteDialog;
