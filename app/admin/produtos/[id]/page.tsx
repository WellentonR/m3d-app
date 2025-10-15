import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"
import { ProductForm } from "@/components/product-form"

interface EditProdutoPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProdutoPage({ params }: EditProdutoPageProps) {
  const { id } = await params
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

  const { data: product } = await supabase.from("products").select("*").eq("id", id).single<Product>()

  if (!product) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Editar Produto</h1>
        <p className="text-muted-foreground">Atualize as informações do produto</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <ProductForm product={product} />
      </div>
    </div>
  )
}
