export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  description: string
  category: string
  isNew?: boolean
  isOnSale?: boolean
  featured?: boolean
  stock: number
  sku: string
  tags?: string[]
  rating?: number
  reviewCount?: number
}

export interface Category {
  id: string
  name: string
  image: string
  productCount: number
}

// Update the categories array with more categories and real images
export const categories: Category[] = [
  {
    id: "clothing",
    name: "Clothing",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productCount: 42,
  },
  {
    id: "shoes",
    name: "Shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productCount: 24,
  },
  {
    id: "accessories",
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productCount: 18,
  },
  {
    id: "electronics",
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productCount: 36,
  },
  {
    id: "home-decor",
    name: "Home Decor",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productCount: 29,
  },
  {
    id: "beauty",
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productCount: 15,
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productCount: 22,
  },
  {
    id: "books",
    name: "Books & Stationery",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productCount: 17,
  },
  {
    id: "toys",
    name: "Toys & Games",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productCount: 14,
  },
  {
    id: "tech-gadgets",
    name: "Tech Gadgets",
    image:
      "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productCount: 31,
  },
]

// Add more products with real images and descriptions
export const products: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    price: 599,
    originalPrice: 799,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "100% organic cotton t-shirt with premium finish. Minimalist design and modern cut that adapts to any style.",
    category: "clothing",
    isOnSale: true,
    featured: true,
    stock: 12,
    sku: "TS-001-BLK",
    tags: ["cotton", "casual", "summer"],
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    name: "Urban Sports Shoes",
    price: 2499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Urban design shoes with advanced technology for maximum comfort. Ideal for daily use and light sports activities.",
    category: "shoes",
    isNew: true,
    featured: true,
    stock: 8,
    sku: "SH-002-RED",
    tags: ["sports", "urban", "comfort"],
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "Premium Wireless Headphones",
    price: 4999,
    originalPrice: 5999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606400082777-ef05f3c5e815?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Headphones with noise cancellation, high definition sound and long battery life. Ergonomic design for maximum comfort.",
    category: "electronics",
    isOnSale: true,
    featured: true,
    stock: 15,
    sku: "EL-003-BLK",
    tags: ["audio", "wireless", "technology"],
    rating: 4.9,
    reviewCount: 203,
  },
  {
    id: "4",
    name: "Leather Crossbody Bag",
    price: 1899,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1559563458-527698bf5295?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Genuine leather crossbody bag with premium finish. Spacious and functional with multiple compartments and adjustable strap.",
    category: "accessories",
    featured: true,
    stock: 5,
    sku: "AC-004-BRN",
    tags: ["leather", "bag", "fashion"],
    rating: 4.7,
    reviewCount: 62,
  },
  {
    id: "5",
    name: "Polarized Sunglasses",
    price: 1299,
    originalPrice: 1799,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Sunglasses with UV400 protection and polarized lenses. Lightweight and durable frame with timeless design.",
    category: "accessories",
    isOnSale: true,
    stock: 3,
    sku: "AC-005-BLK",
    tags: ["glasses", "summer", "protection"],
    rating: 4.5,
    reviewCount: 48,
  },
  {
    id: "6",
    name: "Slim Fit Chinos",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Chino pants with slim fit cut and stretch fabric for greater comfort. Versatile for formal or casual occasions.",
    category: "clothing",
    stock: 7,
    sku: "BT-006-KHK",
    tags: ["pants", "formal", "casual"],
    rating: 4.6,
    reviewCount: 57,
  },
  {
    id: "7",
    name: "Sports Smartwatch",
    price: 3899,
    originalPrice: 4599,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Smartwatch with heart rate monitor, built-in GPS and long battery life. Water resistant and compatible with iOS and Android.",
    category: "electronics",
    isOnSale: true,
    isNew: true,
    stock: 10,
    sku: "EL-007-BLK",
    tags: ["smartwatch", "sports", "technology"],
    rating: 4.8,
    reviewCount: 114,
  },
  {
    id: "8",
    name: "Large Scented Candle",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1602519392653-ece5b0979338?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1602519392653-ece5b0979338?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596507457972-0c67d830be89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Handcrafted scented candle with soy wax and essential oils. Long-lasting fragrance and reusable container.",
    category: "home-decor",
    stock: 20,
    sku: "HD-008-VAN",
    tags: ["home", "scents", "decoration"],
    rating: 4.7,
    reviewCount: 39,
  },
  {
    id: "9",
    name: "Natural Skincare Set",
    price: 1999,
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca80f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca80f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570194065650-d99fb4cb6888?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Complete skincare set with natural and organic ingredients. Includes cleanser, toner, serum and moisturizer.",
    category: "beauty",
    isNew: true,
    stock: 9,
    sku: "BE-009-NAT",
    tags: ["beauty", "skincare", "natural"],
    rating: 4.9,
    reviewCount: 76,
  },
  {
    id: "10",
    name: "Vintage Denim Jacket",
    price: 2499,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588099768523-f4e6a5300d6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description: "Denim jacket with vintage finish and distressed details. Oversized cut and functional pockets.",
    category: "clothing",
    stock: 6,
    sku: "JK-010-DEN",
    tags: ["denim", "vintage", "outerwear"],
    rating: 4.7,
    reviewCount: 91,
  },
  {
    id: "11",
    name: "Eco-Friendly Water Bottle",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526434426615-1abe81efcb0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description: "Stainless steel thermal bottle with double wall to keep drinks cold or hot for hours. BPA free.",
    category: "accessories",
    isNew: true,
    stock: 4,
    sku: "AC-011-SIL",
    tags: ["eco-friendly", "bottle", "travel"],
    rating: 4.8,
    reviewCount: 53,
  },
  {
    id: "12",
    name: "Formal Leather Shoes",
    price: 3299,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Genuine leather formal shoes with non-slip rubber sole. Elegant and comfortable for daily use or special events.",
    category: "shoes",
    isOnSale: true,
    stock: 17,
    sku: "SH-012-BRN",
    tags: ["formal", "leather", "footwear"],
    rating: 4.6,
    reviewCount: 45,
  },
  {
    id: "13",
    name: "Premium Yoga Mat",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516526995003-435ccce2be97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Professional non-slip yoga mat made from eco-friendly materials. Extra thick for optimal comfort and joint protection.",
    category: "sports",
    isNew: true,
    stock: 14,
    sku: "SP-013-YOG",
    tags: ["yoga", "fitness", "exercise"],
    rating: 4.7,
    reviewCount: 68,
  },
  {
    id: "14",
    name: "Bluetooth Portable Speaker",
    price: 2499,
    originalPrice: 2999,
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558537348-c0f8e733989d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Portable Bluetooth speaker with deep bass, 20-hour battery life, and waterproof design. Perfect for outdoor adventures.",
    category: "electronics",
    isOnSale: true,
    stock: 8,
    sku: "EL-014-SPK",
    tags: ["speaker", "bluetooth", "portable"],
    rating: 4.5,
    reviewCount: 93,
  },
  {
    id: "15",
    name: "Minimalist Desk Lamp",
    price: 1799,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534105615256-13940a56ff5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1532462048928-8ebe7b1c09f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Modern LED desk lamp with adjustable brightness levels, color temperatures, and flexible arm. Energy-efficient and stylish.",
    category: "home-decor",
    featured: true,
    stock: 15,
    sku: "HD-015-LMP",
    tags: ["lamp", "lighting", "modern"],
    rating: 4.8,
    reviewCount: 47,
  },
  {
    id: "16",
    name: "Classic Leather Wallet",
    price: 1499,
    image: "https://images.unsplash.com/photo-1556915457-5b02698c8a53?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556915457-5b02698c8a53?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589782182349-0ffda3d06d8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Handcrafted genuine leather wallet with multiple card slots, ID window, and full-length bill compartments. Slim profile design.",
    category: "accessories",
    stock: 9,
    sku: "AC-016-WAL",
    tags: ["wallet", "leather", "accessories"],
    rating: 4.6,
    reviewCount: 61,
  },
  {
    id: "17",
    name: "Professional Notebook Set",
    price: 899,
    originalPrice: 1299,
    image:
      "https://images.unsplash.com/photo-1527863280617-15596f92e5c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1527863280617-15596f92e5c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544113155-33d8fafbe683?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Premium notebook set with acid-free paper, durable hardcover, and elegant design. Includes ruled, dotted, and blank pages.",
    category: "books",
    isOnSale: true,
    stock: 7,
    sku: "BK-017-NTB",
    tags: ["notebook", "stationery", "office"],
    rating: 4.7,
    reviewCount: 33,
  },
  {
    id: "18",
    name: "Wireless Gaming Mouse",
    price: 2799,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1634497885778-152eb0a8f33c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Professional gaming mouse with 16,000 DPI optical sensor, programmable buttons, and customizable RGB lighting. Ultra-fast wireless connectivity.",
    category: "tech-gadgets",
    isNew: true,
    stock: 11,
    sku: "TG-018-MUS",
    tags: ["gaming", "mouse", "wireless"],
    rating: 4.9,
    reviewCount: 87,
  },
  {
    id: "19",
    name: "Board Game Collection",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606503153255-59d8b2e4fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1637077877390-615c2a9d4bdf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Collection of 3 premium strategy board games for family game nights. Includes classic and modern favorites for 2-6 players.",
    category: "toys",
    featured: true,
    stock: 5,
    sku: "TY-019-BRD",
    tags: ["board games", "family", "entertainment"],
    rating: 4.8,
    reviewCount: 52,
  },
  {
    id: "20",
    name: "Smart Home Hub",
    price: 4999,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1561471916-fb6a5100c708?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527359443443-84a48aec73d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Central smart home hub with voice control, automation capabilities, and compatibility with major smart home devices. Easy setup and powerful app.",
    category: "tech-gadgets",
    isOnSale: true,
    stock: 3,
    sku: "TG-020-HUB",
    tags: ["smart home", "technology", "automation"],
    rating: 4.7,
    reviewCount: 76,
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((product) => product.category === categoryId)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured)
}

export function getNewProducts(): Product[] {
  return products.filter((product) => product.isNew)
}

export function getSaleProducts(): Product[] {
  return products.filter((product) => product.isOnSale)
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((category) => category.id === id)
}

