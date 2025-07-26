import React from 'react';
import { CloudSun, Smile, Users } from 'lucide-react';

interface PreferenceInputsProps {
  weather: string;
  mood: string;
  servings: string;
  onWeatherChange: (weather: string) => void;
  onMoodChange: (mood: string) => void;
  onServingsChange: (servings: string) => void;
}

const InputField = ({ 
  icon: Icon, 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = 'text' 
}: {
  icon: React.ElementType;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) => (
  <div>
    <label className="font-semibold text-foreground mb-2 block flex items-center">
      <Icon className="inline-block mr-2" size={18} />
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="text-muted-foreground" size={20} />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background text-foreground"
      />
    </div>
  </div>
);

export default function PreferenceInputs({ 
  weather, 
  mood, 
  servings, 
  onWeatherChange, 
  onMoodChange, 
  onServingsChange 
}: PreferenceInputsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <InputField
        icon={CloudSun}
        label="오늘의 날씨는?"
        placeholder="예: 맑은 날, 쌀쌀한 저녁"
        value={weather}
        onChange={onWeatherChange}
      />
      <InputField
        icon={Smile}
        label="어떤 음식이 당기나요?"
        placeholder="예: 매콤한, 간단한, 건강한"
        value={mood}
        onChange={onMoodChange}
      />
      <InputField
        icon={Users}
        label="몇 명이 먹을 건가요?"
        placeholder="예: 1, 2, 4"
        value={servings}
        onChange={onServingsChange}
        type="number"
      />
    </div>
  );
}