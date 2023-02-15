import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
const useProfile = create(
   persist(
      (set, get) => ({
         name: '',
         age: 0,
         changeInfo: (params) => {
            set(() => ({
               name: params.name,
               age: params.age,
            }));
         },
         resetInfo: () => set({ name: 0, age: 0 }),
      }),
      { name: 'profile', storage: createJSONStorage(() => sessionStorage) }
   )
);
export default useProfile;
