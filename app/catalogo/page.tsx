import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"
import { CatalogoFilters } from "@/components/catalogo-filters";

interface CatalogoPageProps {
  searchParams: Promise<{
    categoria?: string
    ordenar?: string
  }>
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from("products").select("*")

  if (params.categoria && params.categoria !== "todas") {
    query = query.eq("category", params.categoria)
  }

  if (params.ordenar === "preco-asc") {
    query = query.order("price", { ascending: true })
  } else if (params.ordenar === "preco-desc") {
    query = query.order("price", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data: products } = await query.returns<Product[]>()

  const { data: categories } = await supabase.from("products").select("category").not("category", "is", null)

  const uniqueCategories = categories ? Array.from(new Set(categories.map((c) => c.category))) : []

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Catálogo de Produtos</h1>
        <p className="text-muted-foreground">Explore nossa coleção completa de miniaturas 3D</p>
      </div>

      <div className="mb-8">
        <CatalogoFilters
          categorias={uniqueCategories}
        />
      </div>

      {products && products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  )
}
