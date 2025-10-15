"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CatalogoFiltersProps {
  categorias: string[]
  categoriaAtual?: string
  ordenarAtual?: string
}

export function CatalogoFilters({ categorias, categoriaAtual, ordenarAtual }: CatalogoFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoriaChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "todas") {
      params.delete("categoria")
    } else {
      params.set("categoria", value)
    }
    router.push(`/catalogo?${params.toString()}`)
  }

  const handleOrdenarChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "recentes") {
      params.delete("ordenar")
    } else {
      params.set("ordenar", value)
    }
    router.push(`/catalogo?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Categoria:</span>
        <Select defaultValue={categoriaAtual || "todas"} onValueChange={handleCategoriaChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {categorias.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Ordenar por:</span>
        <Select defaultValue={ordenarAtual || "recentes"} onValueChange={handleOrdenarChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mais recentes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recentes">Mais recentes</SelectItem>
            <SelectItem value="preco-asc">Menor preço</SelectItem>
            <SelectItem value="preco-desc">Maior preço</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
