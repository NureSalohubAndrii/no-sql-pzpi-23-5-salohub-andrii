import { Hash } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useAddPetByCodeMutation } from '@/queries/pets.queries';
import { useState } from 'react';
import { toast } from 'sonner';

const AddPetByCode = () => {
  const [addByCodeOpen, setAddByCodeOpen] = useState<boolean>(false);
  const [codeInput, setCodeInput] = useState<string>('');

  const { mutate: addByCode, isPending: isAddingByCode } = useAddPetByCodeMutation();

  const handleAddByCode = () => {
    if (!codeInput.trim()) return;
    addByCode(codeInput.trim().toUpperCase(), {
      onSuccess: () => {
        toast.success('Pet added successfully!');
        setCodeInput('');
        setAddByCodeOpen(false);
      },
      onError: error => toast.error(error?.message || 'Pet not found'),
    });
  };

  return (
    <Dialog open={addByCodeOpen} onOpenChange={setAddByCodeOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Hash size={16} className='mr-2' />
          Add by code
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add pet by code</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4 pt-2'>
          <div className='flex flex-col gap-1.5'>
            <Label>Pet code</Label>
            <Input
              placeholder='e.g. A3F7K2'
              value={codeInput}
              onChange={e => setCodeInput(e.target.value.toUpperCase())}
              maxLength={6}
              className='font-mono tracking-widest'
            />
          </div>
          <Button onClick={handleAddByCode} disabled={isAddingByCode}>
            {isAddingByCode ? 'Adding...' : 'Add pet'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPetByCode;
