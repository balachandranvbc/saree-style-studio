import { useState, useCallback } from 'react';
import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Download, User, Sparkles, X, ExternalLink, Box } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarCreatorStepProps {
  onAvatarCreated: (avatarUrl: string, glbUrl: string) => void;
  onSkip?: () => void;
}

// Ready Player Me configuration
const avatarConfig: AvatarCreatorConfig = {
  clearCache: true,
  bodyType: 'fullbody',
  quickStart: false,
  language: 'en',
};

export function AvatarCreatorStep({ onAvatarCreated, onSkip }: AvatarCreatorStepProps) {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleAvatarExported = useCallback((event: AvatarExportedEvent) => {
    const url = event.data.url;
    console.log('Avatar exported:', url);
    
    // The URL from Ready Player Me is the GLB file
    // Format: https://models.readyplayer.me/{avatarId}.glb
    setAvatarUrl(url);
    setGlbUrl(url);
    setIsCreatorOpen(false);
    
    toast.success('3D Avatar created successfully!', {
      description: 'Your avatar is ready for saree try-on'
    });
  }, []);

  const handleContinue = () => {
    if (avatarUrl && glbUrl) {
      onAvatarCreated(avatarUrl, glbUrl);
    }
  };

  const handleDownloadGLB = async () => {
    if (!glbUrl) return;
    
    setIsExporting(true);
    try {
      const response = await fetch(glbUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-avatar.glb';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('GLB file downloaded!');
    } catch (error) {
      toast.error('Failed to download GLB file');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-medium mb-4">
              <Box className="w-4 h-4" />
              3D Avatar Creation
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Create Your 3D Avatar
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Build a personalized 3D avatar using Ready Player Me for realistic saree visualization
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Avatar Creator Card */}
            <Card variant="elevated" className="overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center space-y-6">
                  {!avatarUrl ? (
                    <>
                      <div className="w-32 h-32 mx-auto rounded-full bg-muted flex items-center justify-center">
                        <User className="w-16 h-16 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                          No Avatar Yet
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Create a 3D avatar that matches your look for accurate saree try-on
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-gold/20 border-2 border-primary/30">
                        {/* 3D Preview would go here - for now showing placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Box className="w-16 h-16 mx-auto text-primary mb-2" />
                            <span className="text-xs text-muted-foreground">3D Avatar Ready</span>
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          Created
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          Avatar Created!
                        </h3>
                        <p className="text-muted-foreground text-sm break-all">
                          {glbUrl?.split('/').pop()}
                        </p>
                      </div>
                    </>
                  )}

                  <Dialog open={isCreatorOpen} onOpenChange={setIsCreatorOpen}>
                    <DialogTrigger asChild>
                      <Button variant="gold" size="lg" className="w-full">
                        <Sparkles className="w-5 h-5" />
                        {avatarUrl ? 'Create New Avatar' : 'Create 3D Avatar'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[90vh] p-0">
                      <DialogHeader className="p-4 border-b">
                        <div className="flex items-center justify-between">
                          <DialogTitle className="flex items-center gap-2">
                            <Box className="w-5 h-5" />
                            Ready Player Me - Avatar Creator
                          </DialogTitle>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setIsCreatorOpen(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </DialogHeader>
                      <div className="flex-1 h-[calc(90vh-80px)]">
                        <AvatarCreator
                          subdomain="demo"
                          config={avatarConfig}
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          onAvatarExported={handleAvatarExported}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Info & Actions Card */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">
                    What You Get
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary text-xs font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Personalized 3D Avatar</p>
                        <p className="text-sm text-muted-foreground">Customizable face, body, and style</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary text-xs font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">GLB/GLTF Export</p>
                        <p className="text-sm text-muted-foreground">Download for use in any 3D software</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary text-xs font-bold">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">AR Ready</p>
                        <p className="text-sm text-muted-foreground">Compatible with AR/VR applications</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {avatarUrl && (
                <Card variant="gold">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-display font-semibold text-foreground">
                      Export Options
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={handleDownloadGLB}
                        disabled={isExporting}
                      >
                        <Download className="w-4 h-4" />
                        {isExporting ? 'Downloading...' : 'Download GLB'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(glbUrl || '', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View in Browser
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={!avatarUrl}
                  onClick={handleContinue}
                >
                  <Sparkles className="w-5 h-5" />
                  Continue with Avatar
                </Button>
                {onSkip && (
                  <Button
                    variant="outline"
                    onClick={onSkip}
                  >
                    Skip - Use Photo Instead
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
