
import React from 'react';
import { cn } from '@/lib/utils';
import { ReportCategory } from '@/contexts/ReportContext';

interface CategoryFilterProps {
  selectedCategory: ReportCategory | 'all';
  onCategoryChange: (category: ReportCategory | 'all') => void;
}

const categories: { id: ReportCategory | 'all', label: string }[] = [
  { id: 'all', label: 'Todos os Relatórios' },
  { id: 'financial', label: 'Financeiro' },
  { id: 'sales', label: 'Vendas' },
  { id: 'operations', label: 'Operações' },
  { id: 'hr', label: 'RH' },
  { id: 'marketing', label: 'Marketing' }
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
            selectedCategory === category.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
