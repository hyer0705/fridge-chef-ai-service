import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-destructive/5 text-destructive p-6 rounded-lg border border-destructive/20">
      <AlertCircle className="mb-4 text-destructive" size={48} />
      <div className="text-center">
        <h3 className="font-bold text-lg mb-2">앗, 문제가 발생했어요!</h3>
        <p className="text-sm mb-4 max-w-md">{message}</p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <RefreshCw size={16} className="mr-2" />
            다시 시도하기
          </Button>
        )}
      </div>
    </div>
  );
}