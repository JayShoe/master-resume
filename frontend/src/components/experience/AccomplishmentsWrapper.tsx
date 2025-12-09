'use client';

import AccomplishmentsList from './AccomplishmentsList';

interface AccomplishmentsWrapperProps {
  position: any;
}

export default function AccomplishmentsWrapper({ position }: AccomplishmentsWrapperProps) {
  return <AccomplishmentsList position={position} />;
}