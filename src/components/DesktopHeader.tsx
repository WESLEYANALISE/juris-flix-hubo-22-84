import { Search, Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShareButton } from '@/components/ShareButton';
import { useState } from 'react';
export const DesktopHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  return <header className="fixed top-0 right-0 left-72 z-30 bg-background/95 backdrop-blur-xl border-b border-border/20">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar na plataforma..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 w-80" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ShareButton variant="ghost" size="icon" />
          
          
          
        </div>
      </div>
    </header>;
};