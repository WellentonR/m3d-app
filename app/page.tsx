import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"
import { ArrowRight, Package, Truck, Shield } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .limit(4)
    .returns<Product[]>()

  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-6xl">
              Miniaturas 3D Personalizadas
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-pretty md:text-xl">
              Transforme suas ideias em realidade com impressão 3D de alta qualidade. Personagens, cenários e muito
              mais.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/catalogo">
                  Ver Catálogo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Alta Qualidade</h3>
              <p className="text-sm text-muted-foreground">
                Impressão 3D com acabamento profissional e detalhes precisos
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Entrega Rápida</h3>
              <p className="text-sm text-muted-foreground">Enviamos para todo o Brasil com rastreamento completo</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Garantia Total</h3>
              <p className="text-sm text-muted-foreground">Satisfação garantida ou seu dinheiro de volta</p>
            </div>
          </div>
        </div>
      </section>

      {featuredProducts && featuredProducts.length > 0 && (
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Produtos em Destaque</h2>
              <p className="text-muted-foreground">Confira nossa seleção especial de miniaturas</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/catalogo">
                  Ver Todos os Produtos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
