import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const finalPrice =
    product.discount_percentage > 0 ? product.price * (1 - product.discount_percentage / 100) : product.price

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/produto/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image_url || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(product.name)}`}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.discount_percentage > 0 && (
            <Badge className="absolute right-2 top-2 bg-destructive text-destructive-foreground">
              -{product.discount_percentage}%
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge className="absolute left-2 top-2 bg-muted text-muted-foreground">Esgotado</Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/produto/${product.id}`}>
          <h3 className="mb-2 font-semibold text-balance line-clamp-2 hover:text-primary">{product.name}</h3>
        </Link>
        <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex items-baseline gap-2">
          {product.discount_percentage > 0 ? (
            <>
              <span className="text-lg font-bold text-primary">R$ {finalPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">R$ {product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-primary">R$ {product.price.toFixed(2)}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={product.stock === 0} asChild={product.stock > 0}>
          {product.stock > 0 ? (
            <Link href={`/produto/${product.id}`}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Adicionar ao Carrinho
            </Link>
          ) : (
            <>Esgotado</>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
