import RefreshTokenHandler from '@/components/refreshTokenHandler';
import '@/styles/globals.scss';
import { Poppins } from '@next/font/google';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
const queryClient = new QueryClient();
const poppins = Poppins({
   weight: ['300', '400', '500', '600', '700'],
   subsets: ['latin'],
   variable: '--font-poppins',
});
export default function App({ Component, pageProps }) {
   const [interval, setInterval] = useState(0);
   return (
      <QueryClientProvider client={queryClient}>
         <SessionProvider session={pageProps.session} refetchInterval={interval}>
            <main className={`${poppins.variable} font-sans`}>
               <Component {...pageProps} />
               <RefreshTokenHandler setInterval={setInterval} />
               <ReactQueryDevtools initialIsOpen={false} />
            </main>
         </SessionProvider>
      </QueryClientProvider>
   );
}
