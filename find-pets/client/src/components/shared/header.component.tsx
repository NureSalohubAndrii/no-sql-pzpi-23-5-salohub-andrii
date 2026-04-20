import { Link } from '@tanstack/react-router';
import { LogOut, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';

const Header = () => {
  const { accessToken, clearAuth } = useAuthStore();

  return (
    <header className='px-6 py-3 flex items-center justify-between'>
      <Link to='/' className='flex items-center gap-2 font-semibold text-lg'>
        <PawPrint size={22} />
        FindPets
      </Link>

      {accessToken ? (
        <nav className='flex items-center gap-2'>
          <Button variant='ghost' asChild size='sm'>
            <Link to='/my-pets'>My pets</Link>
          </Button>
          <Button variant='ghost' asChild size='sm'>
            <Link to='/my-posts'>My posts</Link>
          </Button>
          <Button variant='ghost' size='sm' onClick={clearAuth}>
            <LogOut size={16} className='mr-2' />
            Log out
          </Button>
        </nav>
      ) : (
        <nav className='flex items-center gap-2'>
          <Button variant='ghost' asChild size='sm'>
            <Link to='/login'>Log in</Link>
          </Button>
          <Button asChild size='sm'>
            <Link to='/register'>Sign up</Link>
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
