import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bot, ChefHat, Loader2 } from "lucide-react";

interface ProgressDisplayProps {
  progress: number;
  isStreaming: boolean;
}

const getProgressMessage = (progress: number): string => {
  if (progress < 20) return "AI가 재료를 분석하고 있어요...";
  if (progress < 40) return "맛있는 레시피를 구상 중이에요...";
  if (progress < 60) return "요리법을 정리하고 있어요...";
  if (progress < 80) return "영양 정보를 계산하고 있어요...";
  if (progress < 100) return "최종 검토 중이에요...";
  return "레시피 완성! 🎉";
};

const ProgressDisplay = ({ progress, isStreaming }: ProgressDisplayProps) => {
  if (!isStreaming && progress === 0) return null;

  return (
    <Card className="mb-8 border-2 border-chef-orange/30 bg-chef-orange/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-chef-orange">
          <Bot className="mr-2" size={20} />
          AI 셰프가 레시피를 만들고 있어요
          {isStreaming && <Loader2 className="ml-2 animate-spin" size={16} />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <ChefHat className="text-chef-orange" size={24} />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">{getProgressMessage(progress)}</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        {progress === 100 && !isStreaming && (
          <div className="text-center text-green-600 font-medium">✅ 레시피 생성 완료! 아래에서 확인해보세요.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressDisplay;
