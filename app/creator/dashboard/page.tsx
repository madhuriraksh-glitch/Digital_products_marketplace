"use client";

import { useEffect, useState, FormEvent } from "react";

type Product = {
  product_id: number;
  product_name: string;
  description: string;
  price: number;
  image: string | null;
  category_id: number;
};

type Category = {
  category_id: number;
  category_name: string;
};

export default function CreatorDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    product_name: "",
    description: "",
    price: "",
    image: "",
    category_id: "",
  });

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [productResponse, categoryResponse] = await Promise.all([
        fetch("/api/creator/products", { credentials: "include" }),
        fetch("/api/categories"),
      ]);

      const productData = await productResponse.json();
      const categoryData = await categoryResponse.json();

      if (!productResponse.ok) {
        throw new Error(productData.message || "Unable to load products.");
      }

      setProducts(productData.products || []);

      if (categoryResponse.ok) {
        setCategories(categoryData.categories || []);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({
      product_name: "",
      description: "",
      price: "",
      image: "",
      category_id: "",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const body = {
      product_id: editingId,
      product_name: form.product_name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      image: form.image.trim(),
      category_id: Number(form.category_id),
    };

    try {
      const response = await fetch("/api/creator/products", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Product operation failed.");
      }

      setMessage(data.message || "Product saved successfully.");
      resetForm();
      await loadDashboard();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.product_id);
    setForm({
      product_name: product.product_name,
      description: product.description,
      price: String(product.price),
      image: product.image || "",
      category_id: String(product.category_id),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(productId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/creator/products?product_id=${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete product.");
      }

      setMessage(data.message || "Product deleted successfully.");
      await loadDashboard();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen bg-[#faf6ef] text-[#38201f]">
      <header className="bg-[#4b171d] px-6 py-5 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Master Market</h1>
            <p className="text-sm text-[#e8d4bd]">Creator Dashboard</p>
          </div>

          <a
            href="/"
            className="rounded-lg border border-[#d8b66b] px-4 py-2 text-sm hover:bg-[#6a292e]"
          >
            Back to Home
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <h2 className="text-3xl font-bold">Manage Your Products</h2>
        <p className="mt-2 text-[#806b62]">
          Add, update and manage your digital products.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#eadcc9] bg-white p-5">
            <p className="text-sm text-[#806b62]">Total Products</p>
            <p className="mt-2 text-3xl font-bold">{products.length}</p>
          </div>

          <div className="rounded-xl border border-[#eadcc9] bg-white p-5">
            <p className="text-sm text-[#806b62]">Creator Account</p>
            <p className="mt-2 text-lg font-semibold">Active</p>
          </div>

          <div className="rounded-xl border border-[#eadcc9] bg-white p-5">
            <p className="text-sm text-[#806b62]">Product Management</p>
            <p className="mt-2 text-lg font-semibold">Enabled</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[#eadcc9] bg-white p-6">
          <h3 className="mb-5 text-xl font-bold">
            {editingId ? "Edit Product" : "Add New Product"}
          </h3>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Product Name
              </label>
              <input
                required
                value={form.product_name}
                onChange={(e) =>
                  setForm({ ...form, product_name: e.target.value })
                }
                className="w-full rounded-lg border border-[#ddcdb9] p-3 outline-none focus:border-[#8c4245]"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Price
              </label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="w-full rounded-lg border border-[#ddcdb9] p-3 outline-none focus:border-[#8c4245]"
                placeholder="Enter price"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full rounded-lg border border-[#ddcdb9] p-3 outline-none focus:border-[#8c4245]"
                placeholder="Describe your product"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Category
              </label>
              <select
                required
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
                className="w-full rounded-lg border border-[#ddcdb9] bg-white p-3"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Product Image URL
              </label>
              <input
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
                className="w-full rounded-lg border border-[#ddcdb9] p-3 outline-none focus:border-[#8c4245]"
                placeholder="Enter image URL"
              />
            </div>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-[#681f27] px-6 py-3 font-semibold text-white hover:bg-[#842f38]"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-[#ddcdb9] px-6 py-3"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {message && (
          <p className="mt-5 rounded-lg bg-green-100 p-3 text-green-800">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-5 rounded-lg bg-red-100 p-3 text-red-800">
            {error}
          </p>
        )}

        <div className="mt-9">
          <h3 className="mb-5 text-2xl font-bold">My Products</h3>

          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#cdbba5] bg-white p-10 text-center">
              <p className="text-lg font-semibold">No products yet</p>
              <p className="mt-2 text-sm text-[#806b62]">
                Add your first digital product using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.product_id}
                  className="overflow-hidden rounded-xl border border-[#eadcc9] bg-white"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.product_name}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-[#f1e7d9] text-4xl">
                      📦
                    </div>
                  )}

                  <div className="p-5">
                    <h4 className="text-lg font-bold">
                      {product.product_name}
                    </h4>

                    <p className="mt-2 line-clamp-3 text-sm text-[#806b62]">
                      {product.description}
                    </p>

                    <p className="mt-3 font-bold text-[#762b32]">
                      LKR {Number(product.price).toFixed(2)}
                    </p>

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="flex-1 rounded-lg bg-[#eee2d1] px-3 py-2 text-sm font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteProduct(product.product_id)}
                        className="flex-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}