-- Seed inicial de produtos para a loja Miniaturas 3D
-- Este script adiciona produtos de exemplo em diferentes categorias

INSERT INTO products (name, description, price, image_url, category, stock, featured, discount_percentage) VALUES
-- Miniaturas de Fantasia
(
  'Dragão Vermelho',
  'Miniatura detalhada de dragão vermelho em resina de alta qualidade. Perfeito para RPG e colecionadores. Altura: 8cm.',
  89.90,
  '/placeholder.svg?height=400&width=400',
  'Fantasia',
  15,
  true,
  10
),
(
  'Elfo Arqueiro',
  'Elfo arqueiro em pose de combate. Pintado à mão com detalhes realistas. Escala 32mm.',
  45.00,
  '/placeholder.svg?height=400&width=400',
  'Fantasia',
  25,
  true,
  0
),
(
  'Mago Ancião',
  'Mago com cajado místico e túnica detalhada. Ideal para mestres de RPG. Escala 28mm.',
  52.00,
  '/placeholder.svg?height=400&width=400',
  'Fantasia',
  20,
  false,
  0
),
(
  'Guerreiro Anão',
  'Anão guerreiro com machado de batalha e armadura completa. Resina premium.',
  48.00,
  '/placeholder.svg?height=400&width=400',
  'Fantasia',
  18,
  false,
  15
),
(
  'Necromante',
  'Necromante invocando mortos-vivos. Base decorada incluída. Escala 32mm.',
  65.00,
  '/placeholder.svg?height=400&width=400',
  'Fantasia',
  12,
  true,
  0
),

-- Miniaturas Sci-Fi
(
  'Soldado Espacial',
  'Soldado do futuro com armadura power e rifle de plasma. Escala 28mm.',
  55.00,
  '/placeholder.svg?height=400&width=400',
  'Sci-Fi',
  30,
  true,
  0
),
(
  'Robô de Combate',
  'Mecha de combate articulado com armas intercambiáveis. Altura: 10cm.',
  95.00,
  '/placeholder.svg?height=400&width=400',
  'Sci-Fi',
  10,
  false,
  20
),
(
  'Alien Guerreiro',
  'Criatura alienígena com armas biológicas. Design original e detalhado.',
  58.00,
  '/placeholder.svg?height=400&width=400',
  'Sci-Fi',
  22,
  false,
  0
),
(
  'Ciborgue Hacker',
  'Hacker cibernético com implantes tecnológicos visíveis. Escala 32mm.',
  62.00,
  '/placeholder.svg?height=400&width=400',
  'Sci-Fi',
  15,
  false,
  0
),

-- Miniaturas Históricas
(
  'Cavaleiro Medieval',
  'Cavaleiro com armadura completa e espada longa. Período século XIV. Escala 54mm.',
  72.00,
  '/placeholder.svg?height=400&width=400',
  'Histórico',
  14,
  false,
  0
),
(
  'Legionário Romano',
  'Soldado romano com gladius e scutum. Período imperial. Escala 28mm.',
  42.00,
  '/placeholder.svg?height=400&width=400',
  'Histórico',
  20,
  false,
  0
),
(
  'Viking Berserker',
  'Guerreiro viking em fúria de batalha com machado duplo. Escala 32mm.',
  50.00,
  '/placeholder.svg?height=400&width=400',
  'Histórico',
  16,
  false,
  10
),
(
  'Samurai',
  'Samurai em armadura tradicional com katana. Período Edo. Escala 54mm.',
  78.00,
  '/placeholder.svg?height=400&width=400',
  'Histórico',
  11,
  true,
  0
),

-- Miniaturas de Terror
(
  'Vampiro Conde',
  'Vampiro aristocrata com capa e presas expostas. Base gótica incluída.',
  68.00,
  '/placeholder.svg?height=400&width=400',
  'Terror',
  13,
  false,
  0
),
(
  'Lobisomem',
  'Criatura licantropa em transformação. Detalhes de pelos e garras. Escala 32mm.',
  59.00,
  '/placeholder.svg?height=400&width=400',
  'Terror',
  17,
  false,
  15
),
(
  'Zumbi Horda',
  'Set com 5 zumbis em poses variadas. Perfeito para jogos de sobrevivência.',
  85.00,
  '/placeholder.svg?height=400&width=400',
  'Terror',
  8,
  false,
  0
),
(
  'Cultista Lovecraftiano',
  'Cultista com túnica e tomo proibido. Temática de horror cósmico.',
  46.00,
  '/placeholder.svg?height=400&width=400',
  'Terror',
  19,
  false,
  0
),

-- Miniaturas de Animais e Criaturas
(
  'Lobo Gigante',
  'Lobo de tamanho aumentado para RPG. Pelagem detalhada. Escala 28mm.',
  38.00,
  '/placeholder.svg?height=400&width=400',
  'Criaturas',
  24,
  false,
  0
),
(
  'Grifo Majestoso',
  'Criatura mítica metade águia, metade leão. Asas abertas. Altura: 7cm.',
  82.00,
  '/placeholder.svg?height=400&width=400',
  'Criaturas',
  9,
  true,
  0
),
(
  'Aranha Gigante',
  'Aranha monstruosa com pernas articuladas. Ideal para dungeons. Escala 32mm.',
  44.00,
  '/placeholder.svg?height=400&width=400',
  'Criaturas',
  21,
  false,
  0
),

-- Miniaturas Modernas
(
  'Policial SWAT',
  'Oficial de forças especiais com equipamento tático completo. Escala 28mm.',
  49.00,
  '/placeholder.svg?height=400&width=400',
  'Moderno',
  26,
  false,
  0
),
(
  'Sobrevivente Apocalipse',
  'Sobrevivente pós-apocalíptico com armas improvisadas. Escala 32mm.',
  47.00,
  '/placeholder.svg?height=400&width=400',
  'Moderno',
  18,
  false,
  0
),
(
  'Agente Secreto',
  'Espião em traje formal com pistola silenciada. Escala 28mm.',
  51.00,
  '/placeholder.svg?height=400&width=400',
  'Moderno',
  15,
  false,
  0
);

-- Verificar inserção
SELECT COUNT(*) as total_produtos FROM products;
