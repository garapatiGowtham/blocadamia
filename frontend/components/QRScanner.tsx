import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface QRScannerProps {
  onScan: (data: { address?: string; amount?: string }) => void;
}

export const QRScanner = ({ onScan }: QRScannerProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (result: any) => {
    if (result) {
      try {
        const data = JSON.parse(result?.text);
        if (data.address || data.amount) {
          onScan(data);
          setOpen(false);
        }
      } catch (e) {
        setError("Invalid QR code format");
      }
    }
  };

  const handleError = (err: any) => {
    setError(err?.message || "Failed to access camera");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Scan QR Code</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Payment QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          <div className="w-full max-w-sm">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={handleScan}
              containerStyle={{ width: "100%" }}
              videoStyle={{ width: "100%" }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
