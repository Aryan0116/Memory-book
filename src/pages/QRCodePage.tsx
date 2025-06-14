
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Share, Copy, QrCode } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';
import SharePopup from '@/components/SharePopup';

const QRCodePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string>('');
  const [slamBook, setSlamBook] = React.useState<any>(null);
  const [showSharePopup, setShowSharePopup] = React.useState(false);

  React.useEffect(() => {
    if (slug) {
      loadSlamBook();
      generateQRCode();
    }
  }, [slug]);

  const loadSlamBook = () => {
    // Load from localStorage first, then try database
    const existingSlamBooks = JSON.parse(localStorage.getItem('globalSlamBooks') || '[]');
    const book = existingSlamBooks.find((book: any) => book.slug === slug);
    if (book) {
      setSlamBook(book);
    } else {
      // Fallback: try to get from database via API
      // For now, create a placeholder if not found in localStorage
      setSlamBook({
        title: 'Slam Book',
        description: 'Share your memories',
        theme: 'gradient-sunset',
        slug: slug
      });
    }
  };

  const generateQRCode = async () => {
    if (!slug) return;
    
    try {
      const shareUrl = `${window.location.origin}/s/${slug}`;
      console.log('Generating QR code for URL:', shareUrl);
      
      const qrCodeDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 400,
        margin: 3,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });
      
      setQrCodeDataUrl(qrCodeDataUrl);
      console.log('QR code generated successfully');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "QR Code Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = `${slamBook?.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'slam-book'}-qr-code.png`;
      link.href = qrCodeDataUrl;
      link.click();
      
      toast({
        title: "QR Code Downloaded! 📱",
        description: "Your QR code has been saved to downloads.",
      });
    }
  };

  const copyShareLink = async () => {
    const shareUrl = `${window.location.origin}/s/${slug}`;
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

  if (!slamBook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Slam Book Not Found</h2>
            <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-purple-600 to-pink-600">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const themeClasses = {
    'gradient-sunset': 'from-orange-400 to-pink-600',
    'gradient-ocean': 'from-blue-400 to-teal-600',
    'gradient-forest': 'from-green-400 to-blue-600',
    'gradient-purple': 'from-purple-400 to-pink-600',
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Header */}
        <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">QR Code & Share</h1>
            </div>
            <Button 
              onClick={() => setShowSharePopup(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Share className="h-4 w-4 mr-2" />
              Quick Share
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Enhanced QR Code Section */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <QrCode className="h-6 w-6 text-purple-600" />
                  Beautiful QR Code
                </CardTitle>
                <p className="text-sm text-gray-600">Scan to access your slam book instantly</p>
              </CardHeader>
              <CardContent className="text-center">
                {qrCodeDataUrl ? (
                  <div className="mb-6">
                    <div className="inline-block p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
                      <img 
                        src={qrCodeDataUrl} 
                        alt="QR Code for Slam Book" 
                        className="mx-auto rounded-lg"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      High-quality QR code with error correction
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="inline-block p-6 bg-gray-100 rounded-2xl shadow-lg border-2 border-gray-200">
                      <div className="w-80 h-80 flex items-center justify-center">
                        <p className="text-gray-500">Generating QR code...</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  <Button 
                    onClick={downloadQRCode} 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    disabled={!qrCodeDataUrl}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button onClick={copyShareLink} variant="outline" className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Share Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Slam Book Preview & Info */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Slam Book Preview</CardTitle>
                <p className="text-sm text-gray-600">How others will see your slam book</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Beautiful Slam Book Preview */}
                <div className={`p-6 rounded-xl bg-gradient-to-r ${themeClasses[slamBook.theme as keyof typeof themeClasses] || themeClasses['gradient-sunset']} text-white shadow-lg transform hover:scale-105 transition-transform duration-200`}>
                  <h3 className="font-bold text-xl mb-2">{slamBook.title}</h3>
                  {slamBook.description && (
                    <p className="text-sm opacity-90 leading-relaxed">{slamBook.description}</p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs opacity-75">
                    <QrCode className="h-3 w-3" />
                    <span>Scan QR code to access</span>
                  </div>
                </div>

                {/* Share URL Display */}
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-xs font-medium text-gray-600 mb-2">Share URL:</p>
                  <p className="text-sm font-mono break-all text-gray-800 bg-white p-3 rounded border">
                    {`${window.location.origin}/s/${slug}`}
                  </p>
                </div>

                {/* Share Button */}
                <Button 
                  onClick={() => setShowSharePopup(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Open Share Options
                </Button>

                {/* Tips */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Sharing Tips:</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Print the QR code for physical sharing</li>
                    <li>• Share via WhatsApp for instant access</li>
                    <li>• Perfect for farewell parties and events</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Popup */}
      {slamBook && (
        <SharePopup
          isOpen={showSharePopup}
          onClose={() => setShowSharePopup(false)}
          slamBook={slamBook}
        />
      )}
    </>
  );
};

export default QRCodePage;
