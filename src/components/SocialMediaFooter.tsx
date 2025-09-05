import { GraduationCap } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

export const SocialMediaFooter = () => {
  const { setCurrentFunction } = useNavigation();

  const handlePlanoEstudo = () => {
    setCurrentFunction('Plano de Estudo');
  };

  return (
    <div className="bg-card border-t border-border py-6 mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center items-center">
            <button 
              onClick={handlePlanoEstudo}
              className="flex items-center gap-3 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <GraduationCap className="w-6 h-6" />
              <span className="font-medium">Plano de Estudo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};