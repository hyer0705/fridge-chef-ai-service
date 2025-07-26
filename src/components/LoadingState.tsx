import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-card rounded-2xl shadow-lg border border-border">
      <div className="relative">
        <Loader2 className="animate-spin text-primary" size={48} />
        <Sparkles className="absolute -top-2 -right-2 text-chef-orange animate-pulse" size={20} />
      </div>
      <h3 className="mt-6 text-xl font-bold text-card-foreground">AI가 최고의 레시피를 찾고 있어요!</h3>
      <p className="mt-2 text-muted-foreground max-w-md">
        냉장고 속 재료들의 환상적인 변신을 기대해주세요. 
        <br />
        곧 맛있는 요리가 탄생할 거예요 ✨
      </p>
      <div className="mt-4 flex space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
}