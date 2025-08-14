import { useState, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

export const StudentLoans = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("5");
  const [duration, setDuration] = useState("30");
  const [activeLoans, setActiveLoans] = useState<any[]>([]);

  const fetchLoans = async () => {
    if (!account?.address) return;
    
    try {
      const response = await fetch(
        `https://fullnode.testnet.aptoslabs.com/v1/accounts/${process.env.REACT_APP_CONTRACT_ADDRESS}/resource/0x1::blocadamia::get_user_loans_as_borrower`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            function: `${process.env.REACT_APP_CONTRACT_ADDRESS}::blocadamia::get_user_loans_as_borrower`,
            type_arguments: [],
            arguments: [account.address]
          }),
        }
      );
      const loans = await response.json();
      setActiveLoans(loans);
    } catch (error: any) {
      console.error("Error fetching loans:", error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [account?.address]);

  const requestLoan = async () => {
    if (!account) return;
    
    try {
      const transaction = {
        data: {
          function: `${process.env.REACT_APP_CONTRACT_ADDRESS}::blocadamia::request_loan`,
          functionArguments: [
            account.address.toString(),
            parseInt(loanAmount).toString(),
            (parseInt(interestRate) * 100).toString(), // Convert to basis points
            parseInt(duration).toString(),
            "Student loan request"
          ],
          typeArguments: []
        }
      } as any; // Type assertion to bypass type checking temporarily

      await signAndSubmitTransaction(transaction);
      
      toast({
        title: "Success!",
        description: "Loan request submitted successfully",
      });
      
      setLoanAmount("");
      fetchLoans();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Loan Amount (APT)</Label>
          <Input
            type="number"
            placeholder="0.0"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Interest Rate (%)</Label>
          <Input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Duration (Days)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <Button onClick={requestLoan} className="w-full">
          Request Loan
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Loans</h3>
        {activeLoans.map((loan: any) => (
          <Card key={loan.id} className="p-4">
            <div className="space-y-2">
              <p>Amount: {loan.amount} APT</p>
              <p>Interest: {loan.interest_rate / 100}%</p>
              <p>Duration: {loan.duration_days} days</p>
              <p>Status: {loan.status}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
