'use client';

// Generate by V0

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeItem {
  id: string;
  label: string;
  children?: TreeItem[];
  type?: 'endpoint' | 'argument';
}

const useHeight = ({ isExpanded = false }: { isExpanded: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(
    isExpanded ? undefined : 0,
  );

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((el) => {
      setHeight(el[0]?.contentRect.height);
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { ref, height };
};

const TreeItemComponent: React.FC<{ item: TreeItem; level: number }> = ({
  item,
  level,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const { ref, height } = useHeight({ isExpanded });

  const toggleExpand = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="font-mono">
      <div
        className={`flex items-center py-1 cursor-pointer ${level > 0 ? 'ml-4' : ''}`}
        onClick={toggleExpand}
        role="button"
        tabIndex={0}
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        {hasChildren && (
          <ChevronRight
            className={`h-4 w-4 text-gray-400 mr-1 transition-transform duration-300 ${isExpanded ? 'transform rotate-90' : ''}`}
          />
        )}
        {item.type === 'argument' && (
          <Circle className="h-2 w-2 fill-blue-400 text-blue-400 mr-2" />
        )}
        <span
          className={item.type === 'endpoint' ? 'text-white' : 'text-gray-300'}
        >
          {item.label}
        </span>
      </div>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: isExpanded ? height : 0 }}
      >
        <div ref={ref}>
          {item.children &&
            item.children.map((child) => (
              <TreeItemComponent
                key={child.id}
                item={child}
                level={level + 1}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default function AnimatedTreeView({
  item,
  className,
}: {
  item: TreeItem;
  className?: string;
}) {
  return (
    <div className={cn('p-4 bg-gray-900 rounded-lg shadow-lg ', className)}>
      <TreeItemComponent item={item} level={0} />
    </div>
  );
}
