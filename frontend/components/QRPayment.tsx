import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { getContractFunction, toOctas } from "@/utils/contract";
import { QrReader } from "react-qr-reader";

export const QRPayment = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handlePayment = async () => {
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet before sending a payment.",
        variant: "destructive",
      });
      return;
    }

    // Validate inputs
    if (!recipient || !recipient.startsWith("0x") || recipient.length !== 66) {
      toast({
        title: "Invalid recipient",
        description: "Please enter a valid Aptos address",
        variant: "destructive",
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const contractAddress = "0x9f5c1bc6345eeb5c7ee48e51c46143b82dbea8af58484a6d76da16164e7d7316";
      // Prepare transaction payload according to Aptos specification
      const transaction = {
        data: {
          function: getContractFunction("make_payment"),
          typeArguments: [],
          functionArguments: [
            contractAddress, // admin_addr parameter
            recipient,
            toOctas(amountValue), // Convert APT to Octas with proper precision
            "Payment via QR",
          ]
        }
      };

      console.log("Submitting transaction:", {
        function: transaction.data.function,
        admin: contractAddress,
        recipient,
        amount: amountValue,
        octas: toOctas(amountValue),
      });

      const response = await signAndSubmitTransaction(transaction);
      console.log("Transaction submitted:", response);

      if (response?.hash) {
        toast({
          title: "Transaction Submitted!",
          description: (
            <div className="mt-2">
              <p>Transaction has been submitted successfully.</p>
              <p className="mt-2 font-mono text-xs break-all">
                Hash: {response.hash}
              </p>
            </div>
          ),
        });

        setAmount("");
        setRecipient("");
        setShowQR(false);
      } else {
        throw new Error("No transaction hash received");
      }
    } catch (error: any) {
      console.error("Transaction error:", error);
      
      let errorMessage = "Transaction failed";
      
      if (error?.message?.includes("insufficient balance")) {
        errorMessage = "Insufficient balance to complete the transaction";
      } else if (error?.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection and try again";
      } else if (error?.message?.includes("rejected")) {
        errorMessage = "Transaction rejected by wallet";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const paymentData = {
    address: account?.address,
    amount: amount,
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Amount (APT)</Label>
        <Input
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Recipient Address</Label>
        <Input
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>

      <div className="flex space-x-4">
        <Button onClick={handlePayment}>Send Payment</Button>
        <Button variant="outline" onClick={() => setShowQR(!showQR)}>
          {showQR ? "Hide" : "Show"} QR Code
        </Button>
        <Button variant="outline" onClick={() => setShowScanner(!showScanner)}>
          {showScanner ? "Stop" : "Scan"} QR Code
        </Button>
      </div>

      {showQR && (
        <div className="flex justify-center p-4 bg-white rounded-lg">
          <QRCodeSVG value={JSON.stringify(paymentData)} />
        </div>
      )}

      {showScanner && (
        <div className="w-full max-w-sm mx-auto mt-4">
          <QrReader
            onResult={(result: any) => {
              if (result) {
                try {
                  const scannedData = JSON.parse(result.text);
                  if (scannedData.address) setRecipient(scannedData.address);
                  if (scannedData.amount) setAmount(scannedData.amount);
                  setShowScanner(false);
                } catch (error) {
                  toast({
                    title: "Invalid QR Code",
                    description: "The scanned QR code is not in the correct format",
                    variant: "destructive",
                  });
                }
              }
            }}
            constraints={{ facingMode: "environment" }}
            containerStyle={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
};
