'use client';

import Image from 'next/image';
import { Splide, SplideSlide } from 'react-splide-ts';
import 'react-splide-ts/css';

export const SplideTop = () => {
  return (
    <Splide
      aria-label="Splide top"
      options={{
        type: 'loop',
        focus: 'center',
        fixedWidth: '250px',
        gap: '2rem',
        autoplay: true,
        interval: 30000,
      }}
    >
      <SplideSlide>
        <Image
          src="/thumbnailTop.jpg"
          alt="サムネイル1"
          width={300}
          height={200}
        />
      </SplideSlide>
      <SplideSlide>
        <Image
          src="/thumbnailRight.jpg"
          alt="サムネイル2"
          width={300}
          height={200}
        />
      </SplideSlide>
      <SplideSlide>
        <Image
          src="/thumbnailLeft.jpg"
          alt="サムネイル3"
          width={300}
          height={200}
        />
      </SplideSlide>
    </Splide>
  );
};
