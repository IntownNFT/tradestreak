import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ChevronRight, Plus } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { AddAccountDialog } from "@/components/add-account-dialog"

const accounts = [
  { id: 1, name: "Coinbase Pro", balance: "$12,345.67" },
  { id: 2, name: "Binance", balance: "$8,901.23" },
  { id: 3, name: "Kraken", balance: "$4,567.89" },
  { id: 4, name: "Gemini", balance: "$3,210.45" },
  { id: 5, name: "Bitfinex", balance: "$7,890.12" },
]

export default function TradingAccountSetup() {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)

  const handleAddAccount = (login: string, password: string, server: string) => {
    // Here you would typically send this data to your backend
    console.log('Adding account:', { login, password, server })
    // After successfully adding the account, you might want to refresh the list of accounts
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <CardTitle className="text-[rgba(191,219,254,1)] text-2xl font-bold">Connected Trading Accounts</CardTitle>
          <CardDescription className="text-[rgba(191,219,254,0.9)]">Manage your linked cryptocurrency exchanges</CardDescription>
        </div>
        <Button 
          className="bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)]"
          onClick={() => setIsAddAccountOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Account
        </Button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {accounts.map((account) => (
            <Card key={account.id} className="w-[280px] flex-shrink-0 bg-[#141414] border-none">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="text-[rgba(191,219,254,0.9)] font-semibold text-lg">{account.name}</h3>
                    <p className="text-[rgba(229,231,235,1)] text-2xl font-bold mt-1">{account.balance}</p>
                  </div>
                  <a 
                    href="#" 
                    className="text-[rgba(191,219,254,1)] hover:text-[rgba(191,219,254,0.8)] transition-colors duration-200 flex items-center text-sm font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add your click handler here
                      console.log(`View details clicked for ${account.name}`);
                    }}
                  >
                    View details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <AddAccountDialog 
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onAddAccount={handleAddAccount}
      />
    </div>
  )
}