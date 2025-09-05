
import { Suspense, memo, useEffect, useState } from 'react';

import { MobileLayout } from '@/components/MobileLayout';
import { DesktopLayout } from '@/components/DesktopLayout';
import { TabletLayout } from '@/components/TabletLayout';
import { IntroOnboarding } from '@/components/IntroOnboarding';
import { useNavigation } from '@/context/NavigationContext';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { 
  LazyFeaturesGrid, 
  LazySocialMediaFooter, 
  LazySuporteTab, 
  LazyAppFunction,
  LazyProductCarousel,
  LazyCategoryAccessSection,
  preloadCriticalComponents
} from '@/components/lazy/LazyComponents';
import { optimizeAppLoading } from '@/utils/bundleOptimization';

// Loading fallback component
const LoadingComponent = memo(() => <div className="w-full h-32 flex items-center justify-center animate-pulse">
    <div className="text-muted-foreground">Carregando...</div>
  </div>);
LoadingComponent.displayName = 'LoadingComponent';

const Index = memo(() => {
  const {
    isInFunction
  } = useNavigation();
  const {
    isMobile,
    isTablet,
    isDesktop
  } = useDeviceDetection();

  const [showIntro, setShowIntro] = useState(false);

  // Check if intro should be shown
  useEffect(() => {
    const introSeen = localStorage.getItem('intro_seen_v1');
    if (!introSeen) {
      setShowIntro(true);
    }
  }, []);

  // Preload componentes críticos na inicialização
  useEffect(() => {
    preloadCriticalComponents();
    optimizeAppLoading();
  }, []);

  // Handle intro completion
  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  // If we're in a function, show the function component with lazy loading
  if (isInFunction) {
    return <Suspense fallback={<LoadingComponent />}>
        <LazyAppFunction />
      </Suspense>;
  }

  // Main content for both mobile and desktop  
  const mainContent = <>
      {/* Category Access Section */}
      <Suspense fallback={<LoadingComponent />}>
        <LazyCategoryAccessSection />
      </Suspense>


      {/* Social Media Footer - Lazy loaded */}
      <Suspense fallback={<LoadingComponent />}>
        <LazySocialMediaFooter />
      </Suspense>
    </>;

  // Show intro onboarding if first visit
  if (showIntro) {
    return <IntroOnboarding onComplete={handleIntroComplete} />;
  }

  // Return appropriate layout based on device
  if (isMobile) {
    return <MobileLayout>{mainContent}</MobileLayout>;
  }
  if (isTablet) {
    return <TabletLayout>{mainContent}</TabletLayout>;
  }
  return <DesktopLayout>{mainContent}</DesktopLayout>;
});
Index.displayName = 'Index';
export default Index;
