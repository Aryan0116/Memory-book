
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Download, MessageCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  slamBook: {
    title: string;
    description?: string;
    theme: string;
    slug: string;
  };
}

const SharePopup: React.FC<SharePopupProps> = ({ isOpen, onClose, slamBook }) => {
  const { toast } = useToast();
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string>('');

  const shareUrl = `${window.location.origin}/s/${slamBook.slug}`;

  React.useEffect(() => {
    if (isOpen && slamBook.slug) {
      generateQRCode();
    }
  }, [isOpen, slamBook.slug]);

  const generateQRCode = async () => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      setQrCodeDataUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied! 📋",
        description: "Share link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareToWhatsApp = () => {
    const message = `Hey! 👋 I've created a special farewell slam book "${slamBook.title}" and would love for you to fill it out! 🌟\n\nIt's a fun way to collect memories and messages. Please take a moment to share your thoughts:\n\n${shareUrl}\n\nThanks for being amazing! 💫`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = `${slamBook.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-qr-code.png`;
      link.href = qrCodeDataUrl;
      link.click();
    }
  };

  const themeClasses = {
    'gradient-sunset': 'from-orange-400 to-pink-600',
    'gradient-ocean': 'from-blue-400 to-teal-600',
    'gradient-forest': 'from-green-400 to-blue-600',
    'gradient-purple': 'from-purple-400 to-pink-600',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="relative flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute -top-2 -right-2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-center text-lg sm:text-xl font-bold text-gray-800 mb-4 pr-8">
            Share Your Slam Book 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 px-1">
          {/* Slam Book Preview */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <div className={`p-3 sm:p-4 rounded-lg bg-gradient-to-r ${themeClasses[slamBook.theme as keyof typeof themeClasses] || themeClasses['gradient-sunset']} text-white`}>
                <h3 className="font-bold text-base sm:text-lg mb-1 line-clamp-2">{slamBook.title}</h3>
                {slamBook.description && (
                  <p className="text-xs sm:text-sm opacity-90 line-clamp-2">{slamBook.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          {qrCodeDataUrl && (
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-3">Scan to access slam book</p>
              <div className="inline-block p-3 sm:p-4 bg-white rounded-xl shadow-md border">
                <img src={qrCodeDataUrl} alt="QR Code" className="mx-auto w-32 h-32 sm:w-auto sm:h-auto" />
              </div>
            </div>
          )}

          {/* Share URL Display */}
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent className="p-3">
              <p className="text-xs text-gray-600 mb-1">Share URL:</p>
              <p className="text-xs sm:text-sm font-mono break-all text-gray-800 bg-white p-2 rounded border leading-relaxed">
                {shareUrl}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={shareToWhatsApp} 
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-2 sm:py-3"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Share on WhatsApp
            </Button>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button onClick={copyShareLink} variant="outline" className="flex-1 py-2 sm:py-3 text-xs sm:text-sm">
                <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Copy Link
              </Button>

              <Button onClick={downloadQRCode} variant="outline" className="flex-1 py-2 sm:py-3 text-xs sm:text-sm">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Download QR
              </Button>
            </div>
          </div>

          {/* WhatsApp Message Preview */}
          <Card className="bg-green-50 border border-green-200">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-green-800 mb-1">WhatsApp message preview:</p>
                  <p className="text-xs text-green-700 leading-relaxed break-words">
                    "Hey! 👋 I've created a special farewell slam book '{slamBook.title}' and would love for you to fill it out! 🌟"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePopup;
