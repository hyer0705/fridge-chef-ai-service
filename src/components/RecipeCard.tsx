import React from 'react';
import { ChefHat, Clock, Star, Users, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Recipe {
  name: string;
  time: string;
  difficulty: string;
  ingredientsUsed: string[];
  steps: string[];
  nutrition: string;
  servings: string;
}

interface RecipeCardProps {
  recipe: Recipe;
}

const difficultyConfig = {
  '초급': { color: 'bg-herb-green/20 text-herb-green', icon: '⭐' },
  '중급': { color: 'bg-chef-orange/20 text-chef-orange', icon: '⭐⭐' },
  '고급': { color: 'bg-spice-red/20 text-spice-red', icon: '⭐⭐⭐' },
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const difficultyStyle = difficultyConfig[recipe.difficulty as keyof typeof difficultyConfig] || 
    { color: 'bg-muted text-muted-foreground', icon: '⭐' };

  return (
    <div className="bg-card rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 ease-in-out border border-border hover:shadow-xl">
      <div className="p-6">
        {/* Header */}
        <h3 className="text-2xl font-bold text-card-foreground mb-3 flex items-start">
          <ChefHat className="mr-3 text-primary flex-shrink-0 mt-1" size={28} />
          <span className="leading-tight">{recipe.name}</span>
        </h3>
        
        {/* Meta Information */}
        <div className="flex items-center flex-wrap gap-4 text-muted-foreground mb-4">
          <span className="flex items-center">
            <Clock size={16} className="mr-1.5" /> 
            {recipe.time}
          </span>
          <span className={`flex items-center px-3 py-1 text-sm rounded-full font-medium ${difficultyStyle.color}`}>
            <span className="mr-1.5">{difficultyStyle.icon}</span> 
            {recipe.difficulty}
          </span>
          {recipe.servings && (
            <span className="flex items-center">
              <Users size={16} className="mr-1.5" /> 
              {recipe.servings}
            </span>
          )}
        </div>
        
        {/* Ingredients Used */}
        <div className="mb-5">
          <h4 className="font-semibold text-card-foreground mb-2">활용된 재료</h4>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredientsUsed?.map((ingredient, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>

        {/* Cooking Steps */}
        <div className="mb-5">
          <h4 className="font-semibold text-card-foreground mb-3">만드는 법</h4>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
            {recipe.steps?.map((step, i) => (
              <li key={i} className="leading-relaxed text-sm">{step}</li>
            ))}
          </ol>
        </div>
        
        {/* Nutrition Info */}
        <div className="bg-primary/5 p-4 rounded-lg mb-5 border border-primary/10">
          <h4 className="font-semibold text-primary mb-2 flex items-center">
            <Star className="mr-2" size={16} />
            영양 정보 (추정)
          </h4>
          <p className="text-card-foreground text-sm">{recipe.nutrition}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" className="flex items-center">
            <Share2 size={16} className="mr-2" /> 
            공유하기
          </Button>
        </div>
      </div>
    </div>
  );
}