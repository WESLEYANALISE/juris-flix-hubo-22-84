import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, FileText, Image } from 'lucide-react';
import { AnaliseArquivo } from './types';

interface ConfirmacaoAnaliseProps {
  analise: AnaliseArquivo;
  arquivo: File;
  onConfirmar: () => void;
  onRecusar: () => void;
  loading?: boolean;
}

export const ConfirmacaoAnalise = ({ 
  analise, 
  arquivo, 
  onConfirmar, 
  onRecusar, 
  loading = false 
}: ConfirmacaoAnaliseProps) => {
  const getConfiancaColor = (confianca: number) => {
    if (confianca >= 80) return 'bg-green-500';
    if (confianca >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfiancaIcon = (confianca: number) => {
    if (confianca >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (confianca >= 60) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/60 backdrop-blur-sm border-border/50 shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-500/10 rounded-full">
            {arquivo.type === 'application/pdf' ? (
              <FileText className="h-8 w-8 text-blue-500" />
            ) : (
              <Image className="h-8 w-8 text-blue-500" />
            )}
          </div>
        </div>
        <CardTitle className="text-2xl bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
          Análise do Material
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Confirme se a interpretação está correta antes de gerar o plano
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/40">
          <div className="flex items-center gap-3">
            {arquivo.type === 'application/pdf' ? (
              <FileText className="h-5 w-5 text-blue-500" />
            ) : (
              <Image className="h-5 w-5 text-blue-500" />
            )}
            <span className="font-medium text-sm truncate max-w-[200px]">
              {arquivo.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getConfiancaIcon(analise.confianca)}
            <Badge variant="secondary" className="gap-1">
              <div 
                className={`w-2 h-2 rounded-full ${getConfiancaColor(analise.confianca)}`}
              />
              {analise.confianca}% confiança
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-2">
              Assunto Identificado:
            </h4>
            <p className="text-sm bg-primary/10 text-primary p-3 rounded-lg border border-primary/20">
              {analise.assunto}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-2">
              Resumo do Conteúdo:
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed p-3 bg-secondary/20 rounded-lg border border-border/30">
              {analise.resumo}
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-yellow-800 dark:text-yellow-200 text-sm mb-1">
                Confirme a Interpretação
              </h5>
              <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                O material analisado corresponde ao que você pretendia estudar? 
                Confirme para gerar um plano de estudos personalizado baseado neste conteúdo.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onRecusar}
            disabled={loading}
            className="flex-1"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Não, tentar novamente
          </Button>
          <Button
            onClick={onConfirmar}
            disabled={loading}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {loading ? 'Gerando plano...' : 'Sim, gerar plano'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};