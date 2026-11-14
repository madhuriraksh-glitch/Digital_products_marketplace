"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Daily Digital Planner",
    category: "Planners",
    price: 1200,
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800",
    description: "Organise your daily tasks, goals and schedule.",
  },
  {
    id: 2,
    name: "Creative Social Media Kit",
    category: "Templates",
    price: 1800,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    description: "Beautiful templates for your social media content.",
  },
  {
    id: 3,
    name: "Digital E-book Collection",
    category: "E-books",
    price: 1500,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    description: "Discover useful digital books and learning resources.",
  },
  {
    id: 4,
    name: "Business Planning Kit",
    category: "Business Tools",
    price: 2200,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
    description: "Tools to organise and grow your business.",
  },
  {
    id: 5,
    name: "Professional Resume Template",
    category: "Resume Templates",
    price: 1000,
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800",
    description: "Create a professional resume with ease.",
  },
  {
    id: 6,
    name: "Modern Digital Artwork",
    category: "Digital Art",
    price: 1600,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
    description: "Creative digital artwork for your projects.",
  },
];

const categories = [
  {
    name: "Planners",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=700",
    count: "Organise your life",
  },
  {
    name: "Templates",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700",
    count: "Design creatively",
  },
  {
    name: "E-books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=700",
    count: "Learn something new",
  },
  {
    name: "Business Tools",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=700",
    count: "Grow your business",
  },
  {
    name: "Resume Templates",
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=700",
    count: "Build your career",
  },
  {
    name: "Digital Art",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=700",
    count: "Explore creativity",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customText, setCustomText] = useState("My Creative Design");
  const [customColor, setCustomColor] = useState("#7b263c");
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [showFinder, setShowFinder] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [finderChoice, setFinderChoice] = useState("Planners");
  const [message, setMessage] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const addToCart = (product: Product) => {
    setCart((previous) => [...previous, product]);
    setMessage(`${product.name} added to your cart!`);
    setTimeout(() => setMessage(""), 2500);
  };

  const removeFromCart = (index: number) => {
    setCart((previous) => previous.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, product) => sum + product.price, 0);

  const closeModals = () => {
    setShowCart(false);
    setShowLogin(false);
    setShowRegister(false);
    setShowCreator(false);
    setShowFinder(false);
    setSelectedProduct(null);
  };

  const handleDemoLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("Demo login submitted successfully!");
    setShowLogin(false);
    setTimeout(() => setMessage(""), 2500);
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("Demo registration completed!");
    setShowRegister(false);
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <main className="min-h-screen bg-[#fffaf5] text-[#35232a]">
      {/* GOOGLE FONTS */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        body {
          font-family: "Poppins", sans-serif;
        }
        .brand-font {
          font-family: "Cinzel", serif;
        }
        .nav-font {
          font-family: "Poppins", sans-serif;
          letter-spacing: 1.2px;
          font-weight: 600;
        }
      `}</style>

      {/* NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-[#80505c] bg-[#4a1728] shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <img
              src="/master-market-logo.png"
              alt="Master Market"
              className="h-12 w-auto object-contain brightness-110 contain-object"
            />
          <a
            href="#"
            className="brand-font text-xl font-black tracking-wider text-[#f5e6cc] md:text-2xl"
          >
            MASTER <span className="text-[#d9b77e]">MARKET.</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#" className="nav-font text-xs uppercase text-[#fff5e6] transition hover:text-[#d9b77e]">
              Home
            </a>
            <a href="#categories" className="nav-font text-xs uppercase text-[#fff5e6] transition hover:text-[#d9b77e]">
              Categories
            </a>
            <a href="#products" className="nav-font text-xs uppercase text-[#fff5e6] transition hover:text-[#d9b77e]">
              Products
            </a>
            <a href="#about" className="nav-font text-xs uppercase text-[#fff5e6] transition hover:text-[#d9b77e]">
              About
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setShowLogin(true)}
              className="nav-font rounded-full border border-[#e5c99e] px-4 py-2 text-xs text-[#fff5e6] transition hover:bg-[#fff5e6] hover:text-[#4a1728]"
            >
              LOGIN
            </button>

            <button
              onClick={() => setShowRegister(true)}
              className="nav-font rounded-full bg-[#d9b77e] px-5 py-2.5 text-xs text-[#4a1728] transition hover:bg-[#f1dfbd]"
            >
              SIGN UP
            </button>

            <button
              onClick={() => setShowCart(true)}
              className="nav-font rounded-full border border-[#e5c99e] px-4 py-2.5 text-xs text-[#fff5e6] transition hover:bg-[#fff5e6] hover:text-[#4a1728]"
            >
              CART ({cart.length})
            </button>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="text-2xl text-[#f5e6cc] md:hidden"
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-[#80505c] bg-[#4a1728] p-5 md:hidden">
            <div className="flex flex-col gap-5">
              <a href="#" onClick={() => setMobileMenu(false)} className="nav-font text-sm text-[#fff5e6]">HOME</a>
              <a href="#categories" onClick={() => setMobileMenu(false)} className="nav-font text-sm text-[#fff5e6]">CATEGORIES</a>
              <a href="#products" onClick={() => setMobileMenu(false)} className="nav-font text-sm text-[#fff5e6]">PRODUCTS</a>
              <a href="#about" onClick={() => setMobileMenu(false)} className="nav-font text-sm text-[#fff5e6]">ABOUT</a>
              <button onClick={() => { setShowLogin(true); setMobileMenu(false); }} className="text-left text-sm text-[#fff5e6]">LOGIN</button>
              <button onClick={() => { setShowRegister(true); setMobileMenu(false); }} className="text-left text-sm text-[#d9b77e]">SIGN UP</button>
              <button onClick={() => { setShowCart(true); setMobileMenu(false); }} className="text-left text-sm text-[#fff5e6]">CART ({cart.length})</button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="mb-5 inline-block rounded-full bg-[#f1e2dc] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#76263d]">
            Your Creative Digital Marketplace
          </span>

          <h1 className="max-w-xl text-4xl font-black leading-tight md:text-6xl">
            Discover Digital Products.
            <span className="text-[#9c5261]"> Create More.</span>
          </h1>

          <p className="mt-6 max-w-lg leading-8 text-[#76646a]">
            Explore beautiful planners, creative templates, e-books and
            digital resources. Everything you need to bring your ideas to life.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#products" className="rounded-full bg-[#76263d] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#5e1c30]">
              Explore Products →
            </a>

            <button onClick={() => setShowFinder(true)} className="rounded-full border border-[#b98d91] px-7 py-4 text-sm font-bold text-[#76263d] hover:bg-[#f5e9e5]">
              Find My Product
            </button>
          </div>

          <div className="mt-10 flex gap-8">
            <div><p className="text-2xl font-black text-[#76263d]">500+</p><p className="text-xs text-[#8b777b]">Digital Products</p></div>
            <div><p className="text-2xl font-black text-[#76263d]">100+</p><p className="text-xs text-[#8b777b]">Creative Creators</p></div>
            <div><p className="text-2xl font-black text-[#76263d]">24/7</p><p className="text-xs text-[#8b777b]">Online Access</p></div>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200"
            alt="Creative workspace with notebooks"
            className="h-[350px] w-full rounded-[30px] object-cover shadow-xl md:h-[480px]"
          />
          <div className="absolute -bottom-5 left-4 rounded-2xl bg-white p-5 shadow-lg md:-left-8">
            <p className="text-xs text-[#8b777b]">Make your ideas happen</p>
            <p className="mt-1 font-bold text-[#76263d]">Creativity starts here ✨</p>
          </div>
        </div>
      </section>

      {/* EXPLORE CATEGORIES */}
      <section id="categories" className="bg-[#f5ece7] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#9c5261]">Explore our collection</p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">Explore Categories</h2>
              <p className="mt-3 text-sm text-[#88777a]">Find the perfect digital products for your needs.</p>
            </div>

            <button
              onClick={() => {
                setCategory("All");
                document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm font-bold text-[#76263d] hover:underline"
            >
              View all products →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {categories.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setCategory(item.name);
                  document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative h-52 overflow-hidden rounded-2xl text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:h-64"
              >
                <img src={item.image} alt={item.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#28151d]/90 via-[#28151d]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 text-white">
                  <p className="text-lg font-bold md:text-xl">{item.name}</p>
                  <p className="mt-1 text-xs text-white/80">{item.count}</p>
                  <p className="mt-3 text-xs font-bold">Explore →</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9c5261]">Carefully selected for you</p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">Featured Products</h2>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <input
            type="search"
            placeholder="Search digital products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-[#e6d4ce] bg-white px-6 py-4 text-sm outline-none focus:border-[#76263d] md:max-w-md"
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full border border-[#e6d4ce] bg-white px-5 py-4 text-sm outline-none focus:border-[#76263d]">
            <option value="All">All Categories</option>
            {categories.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
          </select>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-2xl border border-[#eee0db] bg-white transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-60 overflow-hidden">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#76263d]">{product.category}</span>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#8b777b]">{product.description}</p>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-lg font-black text-[#76263d]">LKR {product.price.toLocaleString()}</p>
                  <button onClick={() => setSelectedProduct(product)} className="rounded-full border border-[#d9b9b7] px-4 py-2 text-xs font-bold text-[#76263d] hover:bg-[#f8efeb]">Quick View</button>
                </div>

                <button onClick={() => addToCart(product)} className="mt-5 w-full rounded-full bg-[#76263d] py-3.5 text-sm font-bold text-white hover:bg-[#5e1c30]">
                  Add to Cart +
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg font-bold">No products found.</p>
            <p className="mt-2 text-sm text-[#8b777b]">Try another search or category.</p>
            <button onClick={() => { setSearch(""); setCategory("All"); }} className="mt-4 rounded-full bg-[#76263d] px-6 py-3 text-sm font-bold text-white">Clear Filters</button>
          </div>
        )}
      </section>

      {/* SMART PRODUCT FINDER */}
      <section className="bg-[#f5ece7] px-5 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#9c5261]">Smart Product Finder</p>
              <h2 className="mt-3 text-3xl font-black">Not sure what you need?</h2>
              <p className="mt-4 text-sm leading-7 text-[#88777a]">Select your interest and discover digital products that match your needs.</p>
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold">Choose your interest</label>
              <select value={finderChoice} onChange={(e) => setFinderChoice(e.target.value)} className="w-full rounded-xl border border-[#e6d4ce] p-4 text-sm outline-none focus:border-[#76263d]">
                {categories.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
              </select>
              <button onClick={() => { setCategory(finderChoice); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-4 w-full rounded-full bg-[#76263d] py-4 text-sm font-bold text-white hover:bg-[#5e1c30]">
                Find Products →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CREATOR SECTION */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2">
        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000" alt="Creator working on a laptop" className="h-72 w-full rounded-3xl object-cover md:h-96" />

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#9c5261]">For digital creators</p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">Turn Your Creativity Into Opportunity.</h2>
          <p className="mt-5 leading-8 text-[#88777a]">Share your creativity with the world. Master Market provides a platform where creators can showcase their digital products and reach customers.</p>
          <button onClick={() => setShowCreator(true)} className="mt-7 rounded-full bg-[#76263d] px-7 py-4 text-sm font-bold text-white hover:bg-[#5e1c30]">
            Become a Creator →
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-[#f5ece7] px-5 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9c5261]">About Master Market</p>
          <h2 className="mt-3 text-3xl font-black">A Marketplace Made for Creativity</h2>
          <p className="mt-5 text-sm leading-8 text-[#88777a]">
            Master Market is a digital products marketplace designed to connect creators with customers. Discover useful digital resources, explore creative collections and find products that inspire you.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#381c27] px-5 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <h2 className="brand-font text-2xl font-black">MASTER <span className="text-[#d5a4a2]">MARKET.</span></h2>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">Discover, create and share amazing digital products.</p>
          </div>

          <div>
            <h3 className="font-bold">Quick Links</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/65">
              <a href="#" className="hover:text-white">Home</a>
              <a href="#categories" className="hover:text-white">Categories</a>
              <a href="#products" className="hover:text-white">Products</a>
              <a href="#about" className="hover:text-white">About Us</a>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Stay Connected</h3>
            <p className="mt-4 text-sm leading-7 text-white/65">Explore our digital collection and discover something creative.</p>
            <button onClick={() => setShowRegister(true)} className="mt-4 rounded-full bg-[#d9b77e] px-5 py-3 text-sm font-bold text-[#4a1728]">
              Join Our Community
            </button>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 pt-6 text-center text-xs text-white/50">
          © 2026 Master Market. All rights reserved.
        </div>
      </footer>

      {/* NOTIFICATION */}
      {message && (
        <div role="status" className="fixed bottom-6 right-5 z-[80] max-w-xs rounded-xl bg-[#381c27] px-6 py-4 text-sm font-semibold text-white shadow-xl">
          {message}
        </div>
      )}

      {/* PRODUCT PREVIEW MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-[#fffaf5] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black">Product Preview</h2>
              <button onClick={() => setSelectedProduct(null)} className="text-2xl" aria-label="Close preview">×</button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="h-64 w-full rounded-2xl object-cover" />

              <div>
                <span className="text-xs font-bold text-[#9c5261]">{selectedProduct.category}</span>
                <h3 className="mt-2 text-2xl font-black">{selectedProduct.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[#88777a]">{selectedProduct.description}</p>
                <p className="mt-4 text-xl font-black text-[#76263d]">LKR {selectedProduct.price.toLocaleString()}</p>

                <div className="mt-6 border-t border-[#eadbd5] pt-5">
                  <h4 className="font-bold">Live Customization Preview</h4>
                  <input value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder="Enter your text" className="mt-3 w-full rounded-xl border border-[#e6d4ce] p-3 text-sm outline-none focus:border-[#76263d]" />
                  <label className="mt-4 block text-sm font-semibold">Choose preview colour</label>
                  <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="mt-2 h-10 w-16 cursor-pointer" />
                  <div className="mt-4 rounded-xl p-6 text-center text-lg font-bold text-white" style={{ backgroundColor: customColor }}>
                    {customText || "Your Design Preview"}
                  </div>
                </div>

                <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="mt-6 w-full rounded-full bg-[#76263d] py-4 text-sm font-bold text-white hover:bg-[#5e1c30]">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#fffaf5] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="text-2xl" aria-label="Close cart">×</button>
            </div>

            {cart.length === 0 ? (
              <p className="py-12 text-center text-[#88777a]">Your cart is empty. Start exploring products!</p>
            ) : (
              <>
                <div className="mt-6 max-h-72 space-y-4 overflow-y-auto">
                  {cart.map((product, index) => (
                    <div key={`${product.id}-${index}`} className="flex items-center gap-4 border-b border-[#eadbd5] pb-4">
                      <img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-bold">{product.name}</p>
                        <p className="mt-1 text-sm text-[#76263d]">LKR {product.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="text-xs font-bold text-red-600">Remove</button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between text-lg font-black">
                  <span>Total</span>
                  <span className="text-[#76263d]">LKR {total.toLocaleString()}</span>
                </div>

                <button onClick={() => { setMessage("Checkout feature will be connected in the backend stage."); setShowCart(false); setTimeout(() => setMessage(""), 3000); }} className="mt-6 w-full rounded-full bg-[#76263d] py-4 text-sm font-bold text-white">
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleDemoLogin} className="w-full max-w-md rounded-3xl bg-[#fffaf5] p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Welcome Back</h2>
              <button type="button" onClick={closeModals} className="text-2xl">×</button>
            </div>

            <p className="mt-2 text-sm text-[#88777a]">Login to your Master Market account.</p>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="mt-6 w-full rounded-xl border border-[#e6d4ce] p-4 text-sm outline-none focus:border-[#76263d]" />
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mt-4 w-full rounded-xl border border-[#e6d4ce] p-4 text-sm outline-none focus:border-[#76263d]" />

            <button type="submit" className="mt-6 w-full rounded-full bg-[#76263d] py-4 font-bold text-white">Login</button>

            <button type="button" onClick={() => { setShowLogin(false); setShowRegister(true); }} className="mt-4 w-full text-sm font-semibold text-[#76263d]">
              Create a new account
            </button>
          </form>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleRegister} className="w-full max-w-md rounded-3xl bg-[#fffaf5] p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Create Account</h2>
              <button type="button" onClick={closeModals} className="text-2xl">×</button>
            </div>

            <p className="mt-2 text-sm text-[#88777a]">Join the Master Market community.</p>
            <input type="text" required placeholder="Full name" className="mt-6 w-full rounded-xl border border-[#e6d4ce] p-4 text-sm outline-none focus:border-[#76263d]" />
            <input type="email" required placeholder="Email address" className="mt-4 w-full rounded-xl border border-[#e6d4ce] p-4 text-sm outline-none focus:border-[#76263d]" />
            <input type="password" required minLength={6} placeholder="Create password (minimum 6 characters)" className="mt-4 w-full rounded-xl border border-[#e6d4ce] p-4 text-sm outline-none focus:border-[#76263d]" />

            <button type="submit" className="mt-6 w-full rounded-full bg-[#76263d] py-4 font-bold text-white">Register</button>
          </form>
        </div>
      )}

      {/* CREATOR DASHBOARD */}
      {showCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#fffaf5] p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Creator Dashboard</h2>
              <button onClick={closeModals} className="text-2xl">×</button>
            </div>

            <p className="mt-3 text-sm leading-7 text-[#88777a]">
              Welcome to the creator area. This demo dashboard introduces the tools creators can use to manage their digital products.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#f2e5df] p-5">
                <p className="text-sm text-[#88777a]">My Products</p>
                <p className="mt-2 text-2xl font-black text-[#76263d]">0</p>
              </div>
              <div className="rounded-2xl bg-[#f2e5df] p-5">
                <p className="text-sm text-[#88777a]">Total Sales</p>
                <p className="mt-2 text-2xl font-black text-[#76263d]">0</p>
              </div>
            </div>

            <button onClick={() => { setShowCreator(false); setMessage("Creator product management will be connected in the backend stage."); setTimeout(() => setMessage(""), 3000); }} className="mt-6 w-full rounded-full bg-[#76263d] py-4 text-sm font-bold text-white">
              Continue to Creator Area
            </button>
          </div>
        </div>
      )}

      {/* SMART FINDER MODAL */}
      {showFinder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#fffaf5] p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Smart Product Finder</h2>
              <button onClick={closeModals} className="text-2xl">×</button>
            </div>

            <p className="mt-3 text-sm text-[#88777a]">What type of digital product are you looking for?</p>

            <select value={finderChoice} onChange={(e) => setFinderChoice(e.target.value)} className="mt-6 w-full rounded-xl border border-[#e6d4ce] bg-white p-4 text-sm outline-none">
              {categories.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
            </select>

            <button onClick={() => { setCategory(finderChoice); setShowFinder(false); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-6 w-full rounded-full bg-[#76263d] py-4 text-sm font-bold text-white">
              Show Matching Products →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}