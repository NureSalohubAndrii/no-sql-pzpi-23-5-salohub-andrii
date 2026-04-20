import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PlusCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostStatus, type CreatePostData } from '@/types/post.types';
import { PetMode } from '@/types/pet.types';
import { useCreatePostMutation } from '@/queries/post.queries';
import { useMyPetsQuery } from '@/queries/pets.queries';
import PhotoUploader from '@/components/create-post/photos-uploader.component';
import PostGeneralInfo from '@/components/post/post-general-info.component';
import PetDetails from '@/components/post/pet-details.component';
import PetLocation from '@/components/post/pet-location.component';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);
  const { mutate: createPost, isPending } = useCreatePostMutation();
  const { data: myPets } = useMyPetsQuery({ limit: 100 });

  const [petMode, setPetMode] = useState<PetMode>(PetMode.NEW);
  const [colorInput, setColorInput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePostData>({
    defaultValues: {
      status: PostStatus.Lost,
      location: { locationType: 'Point', coordinates: [0, 0] },
      phone: '',
    },
  });

  const status = watch('status');
  const isLost = status === PostStatus.Lost;

  const handleStatusChange = (newStatus: PostStatus) => {
    setValue('status', newStatus);
    setColors([]);
    setPhotos([]);
  };

  const addColor = () => {
    const trimmed = colorInput.trim();

    if (trimmed && !colors.includes(trimmed)) {
      setColors(prev => [...prev, trimmed]);
    }

    setColorInput('');
  };

  const removeColor = (colorToRemove: string) => {
    setColors(prev => prev.filter(color => color !== colorToRemove));
  };

  const onSubmit = (data: CreatePostData) => {
    let payload: CreatePostData = {
      title: data.title,
      description: data.description,
      status: data.status,
      address: data.address,
      location: data.location,
      phone: data.phone,
    };

    if (isLost) {
      if (petMode === PetMode.EXISTING && data.petId) {
        payload.petId = data.petId;
      } else {
        payload.newPet = { ...data.newPet!, colors, photos };
      }
    } else {
      payload.foundPetInfo = { ...data.foundPetInfo, colors, photos };
    }

    createPost(payload, {
      onSuccess: post => {
        toast.success('Post created successfully!');
        navigate({ to: '/posts/$id', params: { id: post._id } });
      },

      onError: error => {
        console.log(error);
        toast.error(error?.message || 'Failed to create post');
      },
    });
  };

  return (
    <div className='max-w-3xl mx-auto px-4 py-10'>
      <div className='flex flex-col gap-2 mb-8 text-center'>
        <h1 className='text-3xl font-bold tracking-tight'>Create a Post</h1>
        <p className='text-muted-foreground'>Fill in the details to help find or return a pet.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <Tabs
          value={status}
          onValueChange={value => handleStatusChange(value as PostStatus)}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-2 h-12'>
            <TabsTrigger value={PostStatus.Lost} className='text-base cursor-pointer'>
              I Lost a Pet
            </TabsTrigger>
            <TabsTrigger value={PostStatus.Found} className='text-base cursor-pointer'>
              I Found a Pet
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <PostGeneralInfo register={register} errors={errors} status={status} />

        <PetDetails
          control={control}
          register={register}
          errors={errors}
          petMode={petMode}
          setPetMode={setPetMode}
          status={status}
          myPets={myPets}
          colors={colors}
          colorInput={colorInput}
          setColorInput={setColorInput}
          addColor={addColor}
          removeColor={removeColor}
        />

        <Card className='shadow-sm'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <div className='p-2 bg-primary/10 rounded-lg text-primary'>
                <Camera size={20} />
              </div>
              <div>
                <CardTitle className='text-lg'>Photos</CardTitle>
                <CardDescription>Upload photos to help identify the pet</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PhotoUploader photos={photos} onChange={setPhotos} />
          </CardContent>
        </Card>

        <PetLocation
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          watch={watch}
        />

        <Button
          type='submit'
          disabled={isPending}
          className='w-full h-14 text-lg shadow-lg shadow-primary/20 mb-10 cursor-pointer'
        >
          {isPending ? (
            'Publishing...'
          ) : (
            <>
              <PlusCircle size={20} className='mr-2' /> Publish Post
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreatePostPage;
