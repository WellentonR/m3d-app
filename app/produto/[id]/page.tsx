import { notFound } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, Shield } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase.from("products").select("*").eq("id", id).single<Product>()

  if (!product) {
    notFound()
  }

  const finalPrice =
    product.discount_percentage > 0 ? product.price * (1 - product.discount_percentage / 100) : product.price

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.image_url || `/placeholder.svg?height=800&width=800&query=${encodeURIComponent(product.name)}`}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {product.discount_percentage > 0 && (
            <Badge className="absolute right-4 top-4 bg-destructive text-destructive-foreground">
              -{product.discount_percentage}%
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-balance md:text-4xl">{product.name}</h1>
            <div className="flex items-baseline gap-3">
              {product.discount_percentage > 0 ? (
                <>
                  <span className="text-3xl font-bold text-primary">R$ {finalPrice.toFixed(2)}</span>
                  <span className="text-xl text-muted-foreground line-through">R$ {product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary">R$ {product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">Descrição</h2>
            <p className="text-muted-foreground text-pretty leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {product.stock > 0 ? (
                <span className="text-green-600">{product.stock} unidades em estoque</span>
              ) : (
                <span className="text-destructive">Produto esgotado</span>
              )}
            </p>
          </div>

          <AddToCartButton product={product} />

          <div className="mt-8 grid gap-4 border-t pt-8">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Alta Qualidade</h3>
                <p className="text-sm text-muted-foreground">Impressão 3D com acabamento profissional</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Entrega Rápida</h3>
                <p className="text-sm text-muted-foreground">Enviamos para todo o Brasil</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Garantia Total</h3>
                <p className="text-sm text-muted-foreground">Satisfação garantida ou seu dinheiro de volta</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
