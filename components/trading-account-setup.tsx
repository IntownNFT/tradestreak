import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddAccountDialog } from "@/components/add-account-dialog"
import { AccountDetailsDialog } from "@/components/account-details-dialog"
import { toast } from 'sonner'
import { useSession } from "next-auth/react"
import { TradingAccount } from '@/types/trading'

interface TradingAccountSetupProps {
  projectId: string
}

export default function TradingAccountSetup({ projectId }: TradingAccountSetupProps) {
  const { data: session, status } = useSession()
  const [accounts, setAccounts] = useState<TradingAccount[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(null)
  const [suggestedServers, setSuggestedServers] = useState<Record<string, string[]>>({})

  const fetchAccounts = async () => {
    if (status === "loading") return;
    if (!session) {
      console.error("No session found");
      return;
    }
    try {
      const response = await fetch(`/api/projects/${projectId}/trading-accounts`)
      if (response.ok) {
        const data = await response.json()
        setAccounts(data)
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch accounts');
      }
    } catch (error) {
      console.error('Error fetching trading accounts:', error)
      toast.error('Failed to fetch trading accounts')
    }
  }

  useEffect(() => {
    if (session) {
      fetchAccounts()
    }
  }, [projectId, session])

  const handleAddAccount = async (name: string, login: string, password: string, server: string) => {
    try {
      const response = await fetch('/api/metaapi/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, login, password, server, projectId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Server error:', data);
        if (data.suggestedServers) {
          setSuggestedServers(data.suggestedServers);
          throw new Error('Invalid server name. Please choose from the suggested servers.');
        }
        throw new Error(data.error || `Failed to add account: ${response.status} ${response.statusText}`);
      }

      if (data.success) {
        fetchAccounts();
        toast.success('Trading account added successfully');
        setSuggestedServers({});
      } else {
        throw new Error(data.error || 'Failed to add account');
      }
    } catch (error) {
      console.error('Error adding trading account:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add trading account');
    }
  };

  const handleViewDetails = (account: TradingAccount) => {
    setSelectedAccount(account)
    setIsDetailsDialogOpen(true)
  }

  return (
    <Card className="w-full bg-[#141414] border-none shadow-xl flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-[rgba(191,219,254,1)] text-2xl font-bold">Connected Trading Accounts</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {accounts.map((account) => (
          <Card key={account.id} className="mb-4 bg-[#1c1c1c] border-none">
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <h3 className="font-semibold text-[rgba(191,219,254,0.9)]">{account.name}</h3>
                <p className="text-[rgba(229,231,235,1)]">Login: {account.login}</p>
                <p className="text-[rgba(229,231,235,1)]">Server: {account.server}</p>
                {account.balance && <p className="text-[rgba(229,231,235,1)]">Balance: {account.balance}</p>}
                {account.equity && <p className="text-[rgba(229,231,235,1)]">Equity: {account.equity}</p>}
              </div>
              <Button 
                onClick={() => handleViewDetails(account)} 
                className="bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)]"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
        <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4 bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)]">
          Add Trading Account
        </Button>
        <AddAccountDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAddAccount={handleAddAccount}
          suggestedServers={suggestedServers}
        />
        {selectedAccount && (
          <AccountDetailsDialog
            isOpen={isDetailsDialogOpen}
            onClose={() => setIsDetailsDialogOpen(false)}
            account={selectedAccount}
          />
        )}
      </CardContent>
    </Card>
  )
}