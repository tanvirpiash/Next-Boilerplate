import useProfile from '@/src/store/store';
import React from 'react';

export default function Username() {
   const name = useProfile((state) => state.name);
   return <div>{name}</div>;
}
