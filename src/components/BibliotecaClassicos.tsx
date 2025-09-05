
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

export const BibliotecaClassicos = () => {
  const { setCurrentFunction } = useNavigation();

  const handleBack = () => {
    setCurrentFunction(null);
  };

  return (
    <div className="fixed inset-0 bg-background">
      {/* Header Consistente */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/30 h-14">
        <div className="flex items-center h-full px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 hover:bg-accent/80"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={3} />
            Voltar
          </Button>
          <h1 className="ml-4 text-lg font-semibold">Biblioteca de Estudos</h1>
        </div>
      </div>
      
      {/* Iframe ocupando o resto da tela */}
      <div className="pt-14 h-full">
        <iframe 
          src="https://biblioteca-classicos-direito.vercel.app/" 
          className="w-full h-full border-0" 
          title="Biblioteca de Estudos"
          loading="lazy"
        />
      </div>
    </div>
  );
};
