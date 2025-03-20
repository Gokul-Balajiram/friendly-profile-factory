
import React from 'react';
import { X } from 'lucide-react';

type SkillTagProps = {
  skill: string;
  color?: 'blue' | 'green' | 'purple' | 'pink' | 'yellow' | 'teal' | 'orange';
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
};

const SkillTag: React.FC<SkillTagProps> = ({ 
  skill,
  color = 'blue',
  onRemove,
  onClick,
  className = '',
}) => {
  // Color mappings
  const colorClasses = {
    blue: 'bg-soft-blue text-edu-blue border-edu-blue/20',
    green: 'bg-soft-green text-edu-green border-edu-green/20',
    purple: 'bg-soft-purple text-edu-purple border-edu-purple/20',
    pink: 'bg-soft-pink text-edu-pink border-edu-pink/20',
    yellow: 'bg-soft-yellow text-edu-yellow border-edu-yellow/20',
    teal: 'bg-soft-teal text-edu-teal border-edu-teal/20',
    orange: 'bg-soft-orange text-edu-orange border-edu-orange/20',
  };
  
  // Randomly select a color if not specified
  const getRandomColor = () => {
    const colors = Object.keys(colorClasses) as Array<keyof typeof colorClasses>;
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const tagColor = color || getRandomColor();

  return (
    <div 
      className={`skill-tag border ${colorClasses[tagColor]} ${className} ${onClick ? 'cursor-pointer hover:shadow-sm' : ''}`}
      onClick={onClick}
    >
      <span>{skill}</span>
      
      {onRemove && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 p-0.5 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Remove skill"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SkillTag;
