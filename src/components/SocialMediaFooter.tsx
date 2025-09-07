import { GraduationCap, PenTool } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

export const SocialMediaFooter = () => {
  const { setCurrentFunction } = useNavigation();

  const handlePlanoEstudo = () => {
    setCurrentFunction('Plano de Estudo');
  };

  const handleRedacao = () => {
    setCurrentFunction('Redação');
  };

  return (
    <div className="bg-card border-t border-border py-6 mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={handlePlanoEstudo}
              className="flex items-center gap-3 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <GraduationCap className="w-6 h-6" />
              <span className="font-medium">Plano de Estudo</span>
            </button>
            <button 
              onClick={handleRedacao}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <PenTool className="w-6 h-6" />
              <span className="font-medium">Redação</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};