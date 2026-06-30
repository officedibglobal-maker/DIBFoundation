
'use client';

import { useRef, FC } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, MoreVertical, Trash2, Edit, Copy } from 'lucide-react';
import { HeroSlide } from '@/types/hero-slide';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ItemTypes = { CARD: 'card' };

interface HeroSlideCardProps {
  slide: HeroSlide;
  index: number;
  moveSlide: (dragIndex: number, hoverIndex: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const HeroSlideCard: FC<HeroSlideCardProps> = ({ slide, index, moveSlide, onEdit, onDelete, onDuplicate }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveSlide(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => ({ id: slide.id, index }),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} data-handler-id={handlerId}>
      <Card className="relative overflow-hidden">
        <CardHeader className="flex-row items-start justify-between">
          <div className="flex items-start gap-2">
            <div className="cursor-move p-2">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">{slide.title}</CardTitle>
              <Badge className={cn(
                  "mt-1",
                  slide.isActive ? 'bg-green-500' : 'bg-gray-500'
              )}>{slide.isActive ? 'Active' : 'Inactive'}</Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={onEdit}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate}><Copy className="mr-2 h-4 w-4"/>Duplicate</DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-500"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="relative h-40 w-full rounded-md overflow-hidden">
            <Image src={slide.imageUrl} alt={slide.imageAlt || slide.title} fill className="object-cover" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground truncate">{slide.subtitle}</p>
        </CardContent>
      </Card>
    </div>
  );
};
