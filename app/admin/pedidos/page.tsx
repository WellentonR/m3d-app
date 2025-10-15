import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OrdersTable } from "@/components/orders-table"

export default async function AdminPedidosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      profile:profiles(full_name, email),
      order_items(*, product:products(*))
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Gerenciar Pedidos</h1>
        <p className="text-muted-foreground">Visualize e atualize o status dos pedidos</p>
      </div>

      <OrdersTable orders={orders || []} />
    </div>
  )
}
