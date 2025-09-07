import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, LogOut, Loader2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserSettingsProps {
  onBack: () => void;
}

export const UserSettings = ({ onBack }: UserSettingsProps) => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState(profile?.nome_completo || '');

  const handleUpdateProfile = async () => {
    if (!user || !newName.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('perfis')
        .update({ nome_completo: newName.trim() })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Erro ao atualizar",
          description: "Não foi possível atualizar seu nome.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Nome atualizado!",
          description: "Seu nome foi atualizado com sucesso."
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      onBack();
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-1 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Configurações
              </CardTitle>
              <CardDescription>
                Gerencie sua conta e preferências
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informações do usuário */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <Button
              onClick={handleUpdateProfile}
              disabled={isLoading || !newName.trim() || newName === profile?.nome_completo}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t pt-4">
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair da Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};