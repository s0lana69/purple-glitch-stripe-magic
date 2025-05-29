'use client';

import * as React from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>[0];

interface CarouselProps {
  opts?: UseCarouselParameters;
  plugins?: Parameters<typeof useEmblaCarousel>[1];
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ orientation = 'horizontal', opts, setApi, plugins, className, children, ...props }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins,
    );

    const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);

    React.useEffect(() => {
      if (emblaApi) {
        setApi?.(emblaApi);
      }
    }, [emblaApi, setApi]);

    const scrollPrev = React.useCallback(() => {
      emblaApi?.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
      emblaApi?.scrollNext();
    }, [emblaApi]);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;

      setPrevBtnDisabled(!api.canScrollPrev());
      setNextBtnDisabled(!api.canScrollNext());
    }, []);

    React.useEffect(() => {
      if (!emblaApi) return;

      onSelect(emblaApi);
      emblaApi.on('select', () => onSelect(emblaApi));
      emblaApi.on('reInit', () => onSelect(emblaApi));
    }, [emblaApi, onSelect]);

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <div ref={emblaRef} className="overflow-hidden">
          <div className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)}>
            {React.Children.map(children, (child) => (
              <div className={cn('min-w-0 flex-[0_0_100%]', orientation === 'horizontal' ? 'pl-4' : 'pt-4')}>
                {child}
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'absolute h-8 w-8 rounded-full',
            orientation === 'horizontal' ? 'top-1/2 -translate-y-1/2' : 'left-1/2 -translate-x-1/2',
            'left-4',
          )}
          disabled={prevBtnDisabled}
          onClick={scrollPrev}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'absolute h-8 w-8 rounded-full',
            orientation === 'horizontal' ? 'top-1/2 -translate-y-1/2' : 'left-1/2 -translate-x-1/2',
            'right-4',
          )}
          disabled={nextBtnDisabled}
          onClick={scrollNext}
        >
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
    );
  },
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('', className)} {...props} />,
);
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('', className)} {...props} />,
);
CarouselItem.displayName = 'CarouselItem';

export { type CarouselApi, Carousel, CarouselContent, CarouselItem };
