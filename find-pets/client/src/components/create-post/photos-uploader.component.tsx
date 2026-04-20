import { ImagePlus, X } from 'lucide-react';
import { Label } from '../ui/label';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

const PhotoUploader = ({ photos, onChange }: PhotoUploaderProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange([...photos, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className='flex flex-col gap-3'>
      <Label>Photos</Label>
      <div className='grid grid-cols-4 gap-2'>
        {photos.map((src, i) => (
          <div key={i} className='relative aspect-square rounded-md overflow-hidden border'>
            <img src={src} alt='Pet' className='w-full h-full object-cover' />
            <button
              type='button'
              onClick={() => removePhoto(i)}
              className='absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5'
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {photos.length < 5 && (
          <label className='flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed cursor-pointer hover:bg-accent transition-colors'>
            <ImagePlus className='text-muted-foreground' size={24} />
            <span className='text-[10px] mt-1 text-muted-foreground'>Add photo</span>
            <input
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default PhotoUploader;
