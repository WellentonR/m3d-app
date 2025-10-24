"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <Button className="text-red-600 hover:text-red-700" variant="outline" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4 stroke-red-600" />
      Sair
    </Button>
  )
}
