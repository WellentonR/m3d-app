import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/product-form"

export default async function NovoProdutoPage() {
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

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Novo Produto</h1>
        <p className="text-muted-foreground">Adicione um novo produto ao catálogo</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <ProductForm />
      </div>
    </div>
  )
}
