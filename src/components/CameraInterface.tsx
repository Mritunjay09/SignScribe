
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { RefreshCw, ThumbsUp, Video, VideoOff } from "lucide-react";

export function CameraInterface() {
  const [cameraActive, setCameraActive] = useState(false);
  const [recognizedSign, setRecognizedSign] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);

  // This is a mock function that simulates sign recognition
  // In a real implementation, this would use a machine learning model
  const toggleCamera = () => {
    setCameraActive(!cameraActive);
    
    if (!cameraActive) {
      // Simulate sign recognition after camera is turned on
      const signs = ["Hello", "Thank you", "Please", "Yes", "No", "Help"];
      
      const recognitionInterval = setInterval(() => {
        const randomSign = signs[Math.floor(Math.random() * signs.length)];
        const randomConfidence = Math.floor(Math.random() * 30) + 70; // 70-99%
        
        setRecognizedSign(randomSign);
        setConfidence(randomConfidence);
      }, 3000);
      
      return () => clearInterval(recognitionInterval);
    } else {
      setRecognizedSign(null);
      setConfidence(0);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-video bg-slate-100 flex items-center justify-center">
              {cameraActive ? (
                <>
                  <div className="absolute inset-0 bg-slate-800 opacity-20"></div>
                  <video className="w-full h-full object-cover" autoPlay muted playsInline />
                </>
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <VideoOff size={48} />
                  <p className="mt-2">Camera is off</p>
                </div>
              )}
              
              {/* Overlay for recognized sign */}
              {cameraActive && recognizedSign && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 to-transparent p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white text-sm opacity-80">Recognized Sign</p>
                      <p className="text-white text-2xl font-bold">{recognizedSign}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-2 py-1">
                      <p className="text-white text-sm">
                        Confidence: <span className="font-medium">{confidence}%</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex gap-4">
        <Button 
          onClick={toggleCamera}
          className={cameraActive ? "bg-red-500 hover:bg-red-600" : "bg-purple hover:bg-purple-dark"}
        >
          {cameraActive ? (
            <>
              <VideoOff className="mr-2 h-4 w-4" />
              Stop Camera
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Start Camera
            </>
          )}
        </Button>
        
        <Button variant="outline" className="border-slate">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        
        {recognizedSign && (
          <Button variant="outline" className="border-teal text-teal">
            <ThumbsUp className="mr-2 h-4 w-4" />
            Correct!
          </Button>
        )}
      </div>
      
      <div className="mt-8 text-center max-w-md">
        <p className="text-slate text-sm">
          Position your hand in front of the camera and make a sign. 
          The system will analyze your gesture and provide real-time feedback.
        </p>
      </div>
    </div>
  );
}
