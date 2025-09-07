import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, PenTool, BookOpen, Target, Lightbulb, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { useRedacao } from '@/hooks/useRedacao';
import { useToast } from '@/hooks/use-toast';

export const Redacao = () => {
  const { setCurrentFunction } = useNavigation();
  const { toast } = useToast();
  const { 
    loading, 
    analiseRedacao, 
    dicasRedacao, 
    analisarRedacao, 
    buscarDicas, 
    resetAnalise 
  } = useRedacao();
  
  const [textoRedacao, setTextoRedacao] = useState('');
  const [tipoRedacao, setTipoRedacao] = useState<'dissertativa' | 'parecer' | 'peca'>('dissertativa');
  const [activeTab, setActiveTab] = useState('escrever');

  const handleBack = () => {
    setCurrentFunction(null);
  };

  const handleAnalise = async () => {
    if (!textoRedacao.trim()) {
      toast({
        title: "Texto necessário",
        description: "Por favor, escreva sua redação antes de solicitar análise.",
        variant: "destructive"
      });
      return;
    }

    await analisarRedacao(textoRedacao, tipoRedacao);
    setActiveTab('analise');
  };

  const handleBuscarDicas = async () => {
    await buscarDicas(tipoRedacao);
    setActiveTab('dicas');
  };

  const getNota = () => {
    if (!analiseRedacao?.nota) return null;
    const nota = parseFloat(analiseRedacao.nota);
    
    if (nota >= 9) return { cor: 'bg-green-500', texto: 'Excelente' };
    if (nota >= 7) return { cor: 'bg-blue-500', texto: 'Bom' };
    if (nota >= 5) return { cor: 'bg-yellow-500', texto: 'Regular' };
    return { cor: 'bg-red-500', texto: 'Precisa melhorar' };
  };

  const tiposRedacao = [
    { id: 'dissertativa', label: 'Dissertativa', desc: 'Texto argumentativo sobre tema jurídico' },
    { id: 'parecer', label: 'Parecer Jurídico', desc: 'Análise técnica de caso' },
    { id: 'peca', label: 'Peça Processual', desc: 'Petição, contestação, etc.' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 hover:bg-accent/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="ml-4 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
              <PenTool className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Análise de Redação</h1>
              <p className="text-sm text-muted-foreground">Assistente IA para redação jurídica</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="escrever" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Escrever
            </TabsTrigger>
            <TabsTrigger value="dicas" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Dicas
            </TabsTrigger>
            <TabsTrigger value="analise" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Análise
            </TabsTrigger>
          </TabsList>

          <TabsContent value="escrever" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Tipo de Redação
                </CardTitle>
                <CardDescription>
                  Selecione o tipo de texto que você está escrevendo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {tiposRedacao.map((tipo) => (
                    <div
                      key={tipo.id}
                      onClick={() => setTipoRedacao(tipo.id as any)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        tipoRedacao === tipo.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <h3 className="font-medium">{tipo.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{tipo.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Sua Redação</label>
                  <Textarea
                    value={textoRedacao}
                    onChange={(e) => setTextoRedacao(e.target.value)}
                    placeholder="Cole ou digite sua redação aqui..."
                    className="min-h-[400px] resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {textoRedacao.length} caracteres • {textoRedacao.split(/\s+/).filter(word => word.length > 0).length} palavras
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleBuscarDicas}
                        disabled={loading}
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Ver Dicas
                      </Button>
                      <Button 
                        onClick={handleAnalise} 
                        disabled={loading || !textoRedacao.trim()}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        {loading ? 'Analisando...' : 'Analisar Redação'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dicas" className="space-y-6">
            {dicasRedacao ? (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Dicas para {tiposRedacao.find(t => t.id === tipoRedacao)?.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dicasRedacao.estrutura && (
                      <div>
                        <h4 className="font-medium mb-2">Estrutura</h4>
                        <p className="text-muted-foreground">{dicasRedacao.estrutura}</p>
                      </div>
                    )}
                    
                    {dicasRedacao.dicas && dicasRedacao.dicas.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Dicas Importantes</h4>
                        <ul className="space-y-2">
                          {dicasRedacao.dicas.map((dica, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{dica}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {dicasRedacao.criterios && dicasRedacao.criterios.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Critérios de Avaliação</h4>
                        <div className="grid gap-2">
                          {dicasRedacao.criterios.map((criterio, index) => (
                            <Badge key={index} variant="outline" className="justify-start">
                              {criterio}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Clique em "Ver Dicas" para obter orientações específicas sobre redação jurídica
                  </p>
                  <Button 
                    onClick={handleBuscarDicas} 
                    className="mt-4"
                    disabled={loading}
                  >
                    Buscar Dicas
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analise" className="space-y-6">
            {analiseRedacao ? (
              <div className="grid gap-6">
                {/* Nota e resumo */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Resultado da Análise
                      </CardTitle>
                      {analiseRedacao.nota && (
                        <div className="flex items-center gap-2">
                          <Badge className={`${getNota()?.cor} text-white`}>
                            Nota: {analiseRedacao.nota}
                          </Badge>
                          <span className="text-sm font-medium">{getNota()?.texto}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{analiseRedacao.resumo}</p>
                  </CardContent>
                </Card>

                {/* Pontos fortes */}
                {analiseRedacao.pontos_fortes && analiseRedacao.pontos_fortes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        Pontos Fortes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analiseRedacao.pontos_fortes.map((ponto, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{ponto}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Pontos de melhoria */}
                {analiseRedacao.melhorias && analiseRedacao.melhorias.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-600">
                        <AlertCircle className="h-5 w-5" />
                        Sugestões de Melhoria
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analiseRedacao.melhorias.map((melhoria, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{melhoria}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-center">
                  <Button 
                    onClick={() => {
                      resetAnalise();
                      setActiveTab('escrever');
                    }}
                    variant="outline"
                  >
                    Nova Análise
                  </Button>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Nenhuma análise disponível. Escreva sua redação e clique em "Analisar Redação"
                  </p>
                  <Button 
                    onClick={() => setActiveTab('escrever')} 
                    className="mt-4"
                  >
                    Voltar para Escrita
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};