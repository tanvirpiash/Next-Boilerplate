import Username from '@/components/Username';
import useProfile from '@/src/store/store';
import { signIn, signOut } from 'next-auth/react';

// const Username = dynamic(() => import('@/components/username'), { ssr: false });

export default function Home() {
   const name = useProfile((state) => state.name);
   const changeInfo = useProfile((state) => state.changeInfo);
   return (
      <div>
         <button onClick={() => signIn('credentials', { username: 'sanjib@gmail.com', password: 'Sanjib123$..' })}>
            Sign in
         </button>
         <br />
         <br />
         <input
            value={name}
            type='text'
            name=''
            id=''
            onChange={(e) => {
               changeInfo({
                  ...name,
                  name: e.target.value,
               });
            }}
         />
         name:
         <Username />
         <button onClick={() => signOut()}>Sign out</button>
      </div>
   );
}
