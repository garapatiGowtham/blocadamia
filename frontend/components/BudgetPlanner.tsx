import { useState, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export const BudgetPlanner = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [budget, setBudget] = useState({
    food: 30,
    rent: 40,
    travel: 10,
    entertainment: 10,
    education: 5,
    other: 5,
    total: 1000
  });

  const fetchBudget = async () => {
    if (!account?.address) return;
    
    try {
      const response = await fetch(
        `https://fullnode.testnet.aptoslabs.com/v1/accounts/${process.env.REACT_APP_CONTRACT_ADDRESS}/resource/0x1::blocadamia::get_user_profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            function: `${process.env.REACT_APP_CONTRACT_ADDRESS}::blocadamia::get_user_profile`,
            type_arguments: [],
            arguments: [account.address]
          }),
        }
      );
      const profile = await response.json();
      if (profile.budget) {
        setBudget({
          food: profile.budget.food_percent,
          rent: profile.budget.rent_percent,
          travel: profile.budget.travel_percent,
          entertainment: profile.budget.entertainment_percent,
          education: profile.budget.education_percent,
          other: profile.budget.other_percent,
          total: profile.budget.total_budget
        });
      }
    } catch (error: any) {
      console.error("Error fetching budget:", error);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [account?.address]);

  const updateBudget = async () => {
    if (!account) return;
    
    try {
      const transaction = {
        data: {
          function: `${process.env.REACT_APP_CONTRACT_ADDRESS}::blocadamia::update_budget`,
          functionArguments: [
            account.address.toString(),
            budget.food.toString(),
            budget.rent.toString(),
            budget.travel.toString(),
            budget.entertainment.toString(),
            budget.education.toString(),
            budget.other.toString(),
            budget.total.toString()
          ],
          typeArguments: []
        }
      } as any; // Type assertion to bypass type checking temporarily

      await signAndSubmitTransaction(transaction);
      
      toast({
        title: "Success!",
        description: "Budget updated successfully",
      });
      
      fetchBudget();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBudget(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Food (%)</Label>
            <Input
              type="number"
              value={budget.food}
              onChange={(e) => handleInputChange('food', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Rent (%)</Label>
            <Input
              type="number"
              value={budget.rent}
              onChange={(e) => handleInputChange('rent', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Travel (%)</Label>
            <Input
              type="number"
              value={budget.travel}
              onChange={(e) => handleInputChange('travel', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Entertainment (%)</Label>
            <Input
              type="number"
              value={budget.entertainment}
              onChange={(e) => handleInputChange('entertainment', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Education (%)</Label>
            <Input
              type="number"
              value={budget.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Other (%)</Label>
            <Input
              type="number"
              value={budget.other}
              onChange={(e) => handleInputChange('other', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Total Budget (APT)</Label>
          <Input
            type="number"
            value={budget.total}
            onChange={(e) => handleInputChange('total', e.target.value)}
          />
        </div>

        <Button onClick={updateBudget} className="w-full">
          Update Budget
        </Button>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          Total allocation: {Object.values(budget).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0)}%
        </p>
      </div>
    </div>
  );
};
