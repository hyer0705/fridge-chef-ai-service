import React, { useState } from 'react';
import { Plus, X, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
}

const Tag = ({ text, onRemove }: { text: string; onRemove: () => void }) => (
  <div className="flex items-center bg-primary/10 text-primary text-sm font-medium mr-2 mb-2 px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/20 transition-colors">
    {text}
    <button 
      onClick={onRemove} 
      className="ml-2 text-primary hover:text-primary/80 transition-colors"
      aria-label={`${text} 제거`}
    >
      <X size={16} />
    </button>
  </div>
);

export default function IngredientInput({ ingredients, onAddIngredient, onRemoveIngredient }: IngredientInputProps) {
  const [currentIngredient, setCurrentIngredient] = useState('');

  const handleAdd = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      onAddIngredient(currentIngredient.trim());
      setCurrentIngredient('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <label className="font-semibold text-foreground mb-3 block flex items-center">
        <Utensils className="inline-block mr-2" size={18} />
        보유 재료
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Plus className="text-muted-foreground" size={20} />
          </div>
          <input
            type="text"
            placeholder="재료를 입력하고 Enter를 누르세요 (예: 계란, 양파)"
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background text-foreground"
          />
        </div>
        <Button 
          onClick={handleAdd}
          variant="cream"
          className="flex-shrink-0"
        >
          추가
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap">
        {ingredients.map((ingredient, i) => (
          <Tag 
            key={i} 
            text={ingredient} 
            onRemove={() => onRemoveIngredient(ingredient)} 
          />
        ))}
      </div>
    </div>
  );
}