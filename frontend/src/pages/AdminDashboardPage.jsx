import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import canflareLogo from '../assets/canflare-logo.jpg';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Flame,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  Settings,
  DollarSign,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  X,
  Tag,
  Check,
  FolderPlus,
  Image as ImageIcon,
  Sparkles,
  Menu,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { showToast } from '../redux/slices/uiSlice';
import apiClient from '../services/apiClient';

export default function AdminDashboardPage() {
  const dispatch = useDispatch();

  // Navigation tab state: 'overview' | 'products' | 'categories' | 'orders'
  const [activeTab, setActiveTab] = useState('overview');

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters for products list
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Product Modal State (Create or Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: 499,
    originalPrice: 699,
    category: 'Scented Candles',
    fragranceFamily: 'Woody & Resinous',
    olfactoryIntensity: 'Balanced',
    burnTime: '50-55 Hours',
    vesselType: '220g Amber Glass Jar',
    waxType: '100% Pure Botanical Soy Wax',
    wickType: 'Braided Organic Cotton',
    countInStock: 25,
    inStock: true,
    badge: 'New Pour',
    image: '',
    topNotes: 'Bergamot, Cassis',
    heartNotes: 'Damask Rose, Wild Violet',
    baseNotes: 'Mysore Sandalwood, Warm Amber',
  });

  // Category Modal State (Create or Edit)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    tag: 'Aromatics',
    description: '',
    image: '',
  });

  // Fetch all dashboard data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, prodRes, catRes] = await Promise.all([
        apiClient.get('/orders'),
        apiClient.get('/products'),
        apiClient.get('/products/categories/all').catch(() => ({ data: [] })),
      ]);

      setOrders(ordRes.orders || ordRes.data || []);
      setProducts(prodRes.data || prodRes.products || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- PRODUCT HANDLERS ---

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      subtitle: '',
      description: '',
      price: 499,
      originalPrice: 699,
      category: categories[0]?.name || 'Scented Candles',
      fragranceFamily: 'Woody & Resinous',
      olfactoryIntensity: 'Balanced',
      burnTime: '50-55 Hours',
      vesselType: '220g Amber Glass Jar',
      waxType: '100% Pure Botanical Soy Wax',
      wickType: 'Braided Organic Cotton',
      countInStock: 30,
      inStock: true,
      badge: 'New Pour',
      image:
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      topNotes: 'Bergamot, Cassis',
      heartNotes: 'Damask Rose, Jasmine',
      baseNotes: 'Mysore Sandalwood, Warm Amber',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title || '',
      subtitle: prod.subtitle || '',
      description: prod.description || '',
      price: prod.price || 499,
      originalPrice: prod.originalPrice || prod.price || 699,
      category: prod.category || 'Scented Candles',
      fragranceFamily: prod.fragranceFamily || 'Woody & Resinous',
      olfactoryIntensity: prod.olfactoryIntensity || 'Balanced',
      burnTime: prod.burnTime || '50-55 Hours',
      vesselType: prod.vesselType || '220g Amber Glass Jar',
      waxType: prod.waxType || '100% Pure Botanical Soy Wax',
      wickType: prod.wickType || 'Braided Organic Cotton',
      countInStock: prod.countInStock ?? 20,
      inStock: prod.inStock ?? true,
      badge: prod.badge || 'None',
      image: prod.images?.[0]?.url || prod.image || '',
      topNotes: Array.isArray(prod.scentPyramid?.top)
        ? prod.scentPyramid.top.join(', ')
        : 'Bergamot, Cassis',
      heartNotes: Array.isArray(prod.scentPyramid?.heart)
        ? prod.scentPyramid.heart.join(', ')
        : 'Damask Rose, Jasmine',
      baseNotes: Array.isArray(prod.scentPyramid?.base)
        ? prod.scentPyramid.base.join(', ')
        : 'Mysore Sandalwood, Warm Amber',
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        countInStock: Number(productForm.countInStock),
        inStock: Boolean(productForm.inStock),
        topNotes: productForm.topNotes.split(',').map((s) => s.trim()),
        heartNotes: productForm.heartNotes.split(',').map((s) => s.trim()),
        baseNotes: productForm.baseNotes.split(',').map((s) => s.trim()),
      };

      if (editingProduct) {
        // Edit existing product
        const id = editingProduct.id || editingProduct._id;
        const res = await apiClient.put(`/products/${id}`, payload);
        const updated = res.data || { ...editingProduct, ...payload };
        setProducts(
          products.map((p) => (p.id === id || p._id === id ? updated : p))
        );
        dispatch(
          showToast({
            message: `"${updated.title}" successfully updated!`,
            type: 'success',
          })
        );
      } else {
        // Create new product
        const res = await apiClient.post('/products', payload);
        const created = res.data || {
          id: `prod-${Date.now()}`,
          ...payload,
        };
        setProducts([created, ...products]);
        dispatch(
          showToast({
            message: `New formulation "${created.title}" added to catalog!`,
            type: 'success',
          })
        );
      }

      setIsProductModalOpen(false);
      fetchData();
    } catch (err) {
      dispatch(
        showToast({
          message: err.message || 'Failed to save candle formulation',
          type: 'error',
        })
      );
    }
  };

  const handleDeleteProduct = async (prod) => {
    const id = prod.id || prod._id;
    if (
      !window.confirm(
        `Are you sure you want to decommission "${prod.title}" from the catalog?`
      )
    ) {
      return;
    }

    try {
      await apiClient.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id && p._id !== id));
      dispatch(
        showToast({
          message: `"${prod.title}" removed from catalog.`,
          type: 'info',
        })
      );
      fetchData();
    } catch (err) {
      dispatch(
        showToast({
          message: err.message || 'Failed to delete formulation',
          type: 'error',
        })
      );
    }
  };

  const handleToggleStock = async (prod) => {
    const id = prod.id || prod._id;
    const newStockStatus = !prod.inStock;
    try {
      await apiClient.put(`/products/${id}`, { inStock: newStockStatus });
      setProducts(
        products.map((p) =>
          p.id === id || p._id === id ? { ...p, inStock: newStockStatus } : p
        )
      );
      dispatch(
        showToast({
          message: `${prod.title} is now ${
            newStockStatus ? 'IN STOCK' : 'MARKED OUT OF STOCK'
          }`,
          type: 'info',
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  // --- CATEGORY HANDLERS ---

  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      tag: 'Aromatics',
      description: '',
      image:
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name || '',
      tag: cat.tag || 'Aromatics',
      description: cat.description || '',
      image: cat.image || '',
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const id = editingCategory.id || editingCategory.name;
        const res = await apiClient.put(
          `/products/categories/${encodeURIComponent(id)}`,
          categoryForm
        );
        const updated = res.data || { ...editingCategory, ...categoryForm };
        setCategories(
          categories.map((c) =>
            c.id === id || c.name === editingCategory.name ? updated : c
          )
        );
        dispatch(
          showToast({
            message: `Category "${updated.name}" updated!`,
            type: 'success',
          })
        );
      } else {
        const res = await apiClient.post(
          '/products/categories',
          categoryForm
        );
        const created = res.data || {
          id: `cat-${Date.now()}`,
          ...categoryForm,
          productCount: 0,
        };
        setCategories([...categories, created]);
        dispatch(
          showToast({
            message: `Category "${created.name}" created!`,
            type: 'success',
          })
        );
      }
      setIsCategoryModalOpen(false);
      fetchData();
    } catch (err) {
      dispatch(
        showToast({
          message: err.message || 'Failed to save category',
          type: 'error',
        })
      );
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (
      !window.confirm(
        `Are you sure you want to decommission category "${cat.name}"?`
      )
    ) {
      return;
    }

    try {
      const id = cat.id || cat.name;
      await apiClient.delete(`/products/categories/${encodeURIComponent(id)}`);
      setCategories(categories.filter((c) => c.id !== id && c.name !== cat.name));
      dispatch(
        showToast({
          message: `Category "${cat.name}" removed.`,
          type: 'info',
        })
      );
    } catch (err) {
      dispatch(
        showToast({
          message: err.message || 'Failed to delete category',
          type: 'error',
        })
      );
    }
  };

  // --- ORDER HANDLER ---

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(
        orders.map((o) =>
          o.id === orderId || o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
      dispatch(
        showToast({
          message: `Order consignment status updated to "${newStatus}"`,
          type: 'success',
        })
      );
    } catch (err) {
      setOrders(
        orders.map((o) =>
          o.id === orderId || o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    }
  };

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      productSearch === '' ||
      p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.subtitle?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase());

    const matchCat =
      categoryFilter === 'all' ||
      p.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchSearch && matchCat;
  });

  const totalRevenue = orders.reduce((acc, o) => acc + (o.pricing?.total || 0), 0);

  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    {
      id: 'products',
      label: 'Products',
      icon: <Layers className="w-3.5 h-3.5" />,
      count: products.length,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <Tag className="w-3.5 h-3.5" />,
      count: categories.length,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <Truck className="w-3.5 h-3.5" />,
      count: orders.length,
    },
  ];

  return (
    <div className="w-full bg-[#FBF9F5] text-[#1B1C1A] min-h-screen flex flex-col md:flex-row">
      {/* 1. Mobile Top Bar (Visible only on < md screens) */}
      <header className="md:hidden sticky top-0 z-40 bg-[#1B1C1A] text-white px-4 py-3 flex items-center justify-between border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <img
            src={canflareLogo}
            alt="Canflare"
            className="h-6 w-auto object-contain"
          />
          <span className="text-xs font-semibold text-[#FFDEA4]">Atelier Operations</span>
        </div>
        <Link
          to="/"
          className="text-xs font-semibold text-[#FFDEA4] hover:underline flex items-center gap-1"
        >
          <span>Store</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </header>

      {/* 2. Mobile Horizontal Tab Navigation (Sticky below mobile top bar) */}
      <nav className="md:hidden sticky top-[49px] z-30 flex items-center gap-2 overflow-x-auto px-3 py-2 bg-[#F5F3EF] border-b border-[#EAE5DE] scrollbar-none shadow-xs">
        {tabsConfig.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#FAB507] text-[#1B1C1A] shadow-xs'
                : 'bg-white text-[#4A4731] border border-[#EAE5DE]'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span className="text-[10px] font-bold px-1 rounded bg-black/10">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* 3. Desktop Sidebar Nav (Visible on md+ screens) */}
      <aside className="w-64 bg-[#F5F3EF] border-r border-[#EAE5DE] p-6 flex-col justify-between shrink-0 hidden md:flex min-h-screen sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="bg-[#1B1C1A] rounded px-3 py-2 inline-flex items-center">
              <img
                src={canflareLogo}
                alt="Canflare — Let there be Light"
                className="h-7 w-auto object-contain"
              />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#7B785F] block font-semibold mt-1">
              Atelier Operations
            </span>
          </div>

          <div className="px-3 py-2 rounded-lg bg-white border border-[#EAE5DE] flex items-center justify-between text-xs">
            <span className="text-[#7B785F]">Chennai Curing Room</span>
            <span className="font-semibold text-emerald-800">21.4°C • 48% RH</span>
          </div>

          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#FAB507] text-[#1B1C1A] font-bold shadow-xs'
                  : 'text-[#4A4731] hover:bg-[#EAE8E4]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#FAB507] text-[#1B1C1A] font-bold shadow-xs'
                  : 'text-[#4A4731] hover:bg-[#EAE8E4]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Products &amp; Formulations</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/10">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#FAB507] text-[#1B1C1A] font-bold shadow-xs'
                  : 'text-[#4A4731] hover:bg-[#EAE8E4]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4" />
                <span>Categories Manager</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/10">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#FAB507] text-[#1B1C1A] font-bold shadow-xs'
                  : 'text-[#4A4731] hover:bg-[#EAE8E4]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4" />
                <span>Live Consignments</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/10">
                {orders.length}
              </span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-[#EAE5DE] flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-[#1B1C1A]">Canflare Admin</p>
            <p className="text-[10px] text-[#7B785F]">Master Chandleur</p>
          </div>
          <Link
            to="/"
            className="text-[11px] text-[#7B5800] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Storefront</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </aside>

      {/* 4. Main Panel Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 overflow-y-auto">
        {/* Top Header Banner */}
        <section className="bg-white border border-[#EAE5DE] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FFDEA4] text-[#7B5800] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FAB507] animate-pulse" />
              Canflare Atelier Node • Chennai Kolathur Studio
            </div>
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#1B1C1A]">
              Atelier Command &amp; Product Intelligence
            </h1>
            <p className="text-xs text-[#7B785F]">
              Create, edit, and orchestrate handcrafted candle formulations and olfactory categories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={handleOpenCreateProduct}
              className="flex-1 sm:flex-initial bg-[#FAB507] hover:bg-[#E5A506] text-[#1B1C1A] px-3.5 sm:px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>+ New Candle</span>
            </button>
            <button
              onClick={handleOpenCreateCategory}
              className="flex-1 sm:flex-initial bg-[#1B1C1A] hover:bg-[#30312E] text-white px-3.5 sm:px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-[#FAB507] shrink-0" />
              <span>+ Add Category</span>
            </button>
          </div>
        </section>

        {/* Tab 1: DASHBOARD OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Metrics (2 cols on mobile, 4 cols on desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div
                onClick={() => setActiveTab('products')}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE5DE] shadow-xs cursor-pointer hover:border-[#FAB507] transition-colors"
              >
                <div className="flex justify-between items-center text-[#7B785F]">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
                    Formulations
                  </span>
                  <Layers className="w-4 h-4 text-[#FAB507]" />
                </div>
                <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#1B1C1A]">
                    {products.length}
                  </span>
                  <span className="text-[11px] text-[#7B5800] font-medium hidden sm:inline">
                    Manage &rarr;
                  </span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('categories')}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE5DE] shadow-xs cursor-pointer hover:border-[#FAB507] transition-colors"
              >
                <div className="flex justify-between items-center text-[#7B785F]">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
                    Categories
                  </span>
                  <Tag className="w-4 h-4 text-[#FAB507]" />
                </div>
                <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#1B1C1A]">
                    {categories.length}
                  </span>
                  <span className="text-[11px] text-[#7B5800] font-medium hidden sm:inline">
                    Configure &rarr;
                  </span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('orders')}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE5DE] shadow-xs cursor-pointer hover:border-[#FAB507] transition-colors"
              >
                <div className="flex justify-between items-center text-[#7B785F]">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
                    Orders
                  </span>
                  <Truck className="w-4 h-4 text-[#FAB507]" />
                </div>
                <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#1B1C1A]">
                    {orders.length}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium hidden sm:inline">
                    Live
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE5DE] shadow-xs">
                <div className="flex justify-between items-center text-[#7B785F]">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
                    Gross Volume
                  </span>
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#1B1C1A]">
                    {formatCurrency(totalRevenue || 4590)}
                  </span>
                  <span className="text-[10px] text-[#7B5800]">INR</span>
                </div>
              </div>
            </div>

            {/* Quick Catalog Preview */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#EAE5DE] shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#EAE5DE]">
                <div>
                  <h3 className="font-serif text-base sm:text-lg text-[#1B1C1A]">
                    Recent Formulations in Atelier
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#7B785F]">
                    Click any candle to edit its price, description, images, or notes.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-semibold text-[#7B5800] hover:underline cursor-pointer"
                >
                  View All ({products.length}) &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.slice(0, 4).map((prod) => (
                  <div
                    key={prod.id || prod._id}
                    className="group bg-[#FBF9F5] p-3 sm:p-3.5 rounded-xl border border-[#EAE5DE] hover:border-[#FAB507] transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="aspect-square rounded-lg overflow-hidden bg-white border border-[#EAE5DE]">
                        <img
                          src={
                            prod.images?.[0]?.url ||
                            prod.image ||
                            'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-[#1B1C1A] truncate">
                        {prod.title}
                      </h4>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold">{formatCurrency(prod.price)}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#EAE5DE] text-[#7B5800] truncate max-w-[110px]">
                          {prod.category}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 mt-2 border-t border-[#EAE5DE] flex justify-between gap-2">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="flex-1 py-1.5 px-2 text-[11px] font-semibold bg-white hover:bg-[#FAB507] hover:text-[#1B1C1A] text-[#4A4731] rounded-lg border border-[#EAE5DE] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete formulation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PRODUCTS & FORMULATIONS MANAGER */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-[#EAE5DE] p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 border-b border-[#EAE5DE]">
              <div>
                <h2 className="font-serif text-lg sm:text-2xl text-[#1B1C1A]">
                  Candle Formulations &amp; Inventory ({filteredProducts.length})
                </h2>
                <p className="text-xs text-[#7B785F]">
                  Create new candles, adjust retail pricing, manage stock status, and refine olfactory notes.
                </p>
              </div>

              <button
                onClick={handleOpenCreateProduct}
                className="w-full sm:w-auto bg-[#FAB507] hover:bg-[#E5A506] text-[#1B1C1A] px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add Candle</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7B785F]" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search formulations by name, category, notes..."
                  className="w-full bg-[#FBF9F5] border border-[#EAE5DE] rounded-lg pl-9 pr-4 py-2 text-xs text-[#1B1C1A] focus:outline-none focus:ring-1 focus:ring-[#FAB507]"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#FBF9F5] border border-[#EAE5DE] rounded-lg px-3 py-2 text-xs text-[#1B1C1A] focus:outline-none focus:ring-1 focus:ring-[#FAB507] cursor-pointer"
              >
                <option value="all">All Categories ({products.length})</option>
                {categories.map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Card View (< md) */}
            <div className="md:hidden space-y-3">
              {filteredProducts.map((prod) => {
                const id = prod.id || prod._id;
                const imgUrl =
                  prod.images?.[0]?.url ||
                  prod.image ||
                  'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=150&q=80';

                return (
                  <div
                    key={id}
                    className="p-3.5 bg-[#FBF9F5] rounded-xl border border-[#EAE5DE] space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={imgUrl}
                        alt={prod.title}
                        className="w-14 h-14 rounded-lg object-cover border border-[#EAE5DE] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-sm text-[#1B1C1A] truncate">
                          {prod.title}
                        </h4>
                        <p className="text-[11px] text-[#7B785F] truncate">
                          {prod.subtitle || prod.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-xs">
                            {formatCurrency(prod.price)}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#EAE5DE] text-[#7B5800]">
                            {prod.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#EAE5DE]">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(prod)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          prod.inStock
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                      <span className="text-[11px] text-[#7B785F]">
                        Qty: <strong>{prod.countInStock ?? 20}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(prod)}
                        className="flex-1 py-1.5 px-3 bg-white border border-[#EAE5DE] hover:bg-[#FAB507] hover:text-[#1B1C1A] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Formulation</span>
                      </button>
                      <Link
                        to={`/product/${prod.slug || id}`}
                        target="_blank"
                        className="p-1.5 bg-white border border-[#EAE5DE] rounded-lg text-[#7B785F] hover:text-[#1B1C1A]"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod)}
                        className="p-1.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAE5DE] text-[#7B785F] uppercase text-[10px] tracking-wider bg-[#FBF9F5]">
                    <th className="py-3 px-4">Candle Formulation</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Fragrance Family</th>
                    <th className="py-3 px-3">Price (INR)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3">Stock Count</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DE]">
                  {filteredProducts.map((prod) => {
                    const id = prod.id || prod._id;
                    const imgUrl =
                      prod.images?.[0]?.url ||
                      prod.image ||
                      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=150&q=80';

                    return (
                      <tr key={id} className="hover:bg-[#FBF9F5] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={imgUrl}
                              alt={prod.title}
                              className="w-12 h-12 rounded-lg object-cover border border-[#EAE5DE] shrink-0"
                            />
                            <div>
                              <p className="font-serif font-bold text-[#1B1C1A] text-sm">
                                {prod.title}
                              </p>
                              <p className="text-[11px] text-[#7B785F] truncate max-w-xs">
                                {prod.subtitle || prod.burnTime || 'Handcrafted botanical candle'}
                              </p>
                              {prod.badge && prod.badge !== 'None' && (
                                <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#FFDEA4] text-[#7B5800] px-1.5 py-0.2 rounded">
                                  {prod.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-[#F5F0E8] text-[#1B1C1A] text-[11px] font-medium border border-[#EAE5DE]">
                            {prod.category}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-[#4A4731]">
                          {prod.fragranceFamily}
                        </td>

                        <td className="py-3 px-3 font-semibold text-[#1B1C1A]">
                          <div>{formatCurrency(prod.price)}</div>
                          {prod.originalPrice > prod.price && (
                            <span className="text-[10px] text-[#7B785F] line-through">
                              {formatCurrency(prod.originalPrice)}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStock(prod)}
                            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                              prod.inStock
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                            title="Click to toggle stock status"
                          >
                            {prod.inStock ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>

                        <td className="py-3 px-3 font-mono text-[#4A4731]">
                          {prod.countInStock ?? 25} flacons
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/product/${prod.slug || id}`}
                              target="_blank"
                              className="p-1.5 text-[#7B785F] hover:text-[#1B1C1A] hover:bg-[#F5F0E8] rounded transition-colors"
                              title="View in Storefront"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 text-[#7B5800] hover:text-[#1B1C1A] hover:bg-[#FFDEA4] rounded transition-colors cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Delete from Catalog"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-[#7B785F] space-y-2">
                <Package className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-sm">No candle formulations match your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: CATEGORIES MANAGER */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl border border-[#EAE5DE] p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 border-b border-[#EAE5DE]">
              <div>
                <h2 className="font-serif text-lg sm:text-2xl text-[#1B1C1A]">
                  Atelier Olfactory Categories ({categories.length})
                </h2>
                <p className="text-xs text-[#7B785F]">
                  Organize candle collections, assign tags, curate descriptions, and update category imagery.
                </p>
              </div>

              <button
                onClick={handleOpenCreateCategory}
                className="w-full sm:w-auto bg-[#1B1C1A] hover:bg-[#30312E] text-white px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <FolderPlus className="w-4 h-4 text-[#FAB507]" />
                <span>+ Create Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id || cat.name}
                  className="bg-[#FBF9F5] rounded-xl border border-[#EAE5DE] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#EFEEEA] relative overflow-hidden">
                      <img
                        src={
                          cat.image ||
                          'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'
                        }
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-black/75 text-[#FAB507]">
                        {cat.tag || 'Aromatics'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-serif text-base font-bold text-[#1B1C1A]">
                          {cat.name}
                        </h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-[#EAE5DE] text-[#7B5800]">
                          {cat.productCount ?? 0} Candles
                        </span>
                      </div>
                      <p className="text-xs text-[#4A4731] line-clamp-2">
                        {cat.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-end gap-2 border-t border-[#EAE5DE]/60 mt-2">
                    <button
                      onClick={() => handleOpenEditCategory(cat)}
                      className="flex-1 py-1.5 px-3 text-xs font-semibold bg-white hover:bg-[#FAB507] hover:text-[#1B1C1A] text-[#1B1C1A] rounded-lg border border-[#EAE5DE] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Decommission Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: LIVE CONSIGNMENTS & ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-[#EAE5DE] p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#EAE5DE]">
              <div>
                <h2 className="font-serif text-lg sm:text-2xl text-[#1B1C1A]">
                  Active Customer Consignments ({orders.length})
                </h2>
                <p className="text-xs text-[#7B785F]">
                  Manage dispatch, courier updates, and final doorstep delivery statuses.
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {orders.map((ord) => {
                const id = ord.id || ord._id;
                return (
                  <div
                    key={id}
                    className="p-4 sm:p-5 rounded-xl border border-[#EAE5DE] bg-[#FBF9F5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif font-bold text-base text-[#1B1C1A]">
                          {ord.orderNumber || id}
                        </span>
                        <span className="text-xs text-[#7B785F]">
                          • {ord.customer?.name}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A4731]">
                        {ord.items?.length || 1} candle(s) • Total:{' '}
                        <strong>{formatCurrency(ord.pricing?.total || 0)}</strong>
                      </p>
                      <p className="text-[11px] text-[#7B785F]">
                        Destination: {ord.shippingAddress?.city}, {ord.shippingAddress?.state || 'India'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAE5DE]">
                      <select
                        value={ord.status || 'Pending'}
                        onChange={(e) => handleUpdateOrderStatus(id, e.target.value)}
                        className="bg-white border border-[#EAE5DE] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#1B1C1A] focus:outline-none focus:ring-1 focus:ring-[#FAB507] cursor-pointer"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress (Pouring)</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>

                      <Link
                        to={`/track/${ord.orderNumber || id}`}
                        target="_blank"
                        className="text-xs font-semibold text-[#7B5800] hover:underline"
                      >
                        Live Tracking &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 5. MODAL: CREATE / EDIT PRODUCT (Mobile & Desktop Responsive) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-8 space-y-4 sm:space-y-6 border border-[#EAE5DE] shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DE]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#7B5800] font-semibold">
                  Atelier Formulation Studio
                </span>
                <h3 className="font-serif text-lg sm:text-2xl text-[#1B1C1A]">
                  {editingProduct ? 'Edit Candle Formulation' : 'Create New Formulation'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5F0E8] hover:bg-[#EAE5DE] flex items-center justify-center text-[#4A4731] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Candle Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) =>
                      setProductForm({ ...productForm, title: e.target.value })
                    }
                    placeholder="e.g. Mysore Amber & Sandalwood"
                    className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE] focus:outline-none focus:ring-1 focus:ring-[#FAB507]"
                  />
                </div>

                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Subtitle / Notes Summary
                  </label>
                  <input
                    type="text"
                    value={productForm.subtitle}
                    onChange={(e) =>
                      setProductForm({ ...productForm, subtitle: e.target.value })
                    }
                    placeholder="e.g. Royal Sandalwood & Amber Resin"
                    className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE] focus:outline-none focus:ring-1 focus:ring-[#FAB507]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value })
                    }
                    className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE] focus:outline-none focus:ring-1 focus:ring-[#FAB507] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Fragrance Family
                  </label>
                  <select
                    value={productForm.fragranceFamily}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        fragranceFamily: e.target.value,
                      })
                    }
                    className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE] focus:outline-none focus:ring-1 focus:ring-[#FAB507] cursor-pointer"
                  >
                    <option value="Woody & Resinous">Woody &amp; Resinous</option>
                    <option value="Floral & Botanical">Floral &amp; Botanical</option>
                    <option value="Fresh & Herbaceous">Fresh &amp; Herbaceous</option>
                    <option value="Gourmand & Sweet">Gourmand &amp; Sweet</option>
                    <option value="Warm Amber">Warm Amber</option>
                    <option value="Oriental & Spiced">Oriental &amp; Spiced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Hallmark Badge
                  </label>
                  <select
                    value={productForm.badge}
                    onChange={(e) =>
                      setProductForm({ ...productForm, badge: e.target.value })
                    }
                    className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE] focus:outline-none focus:ring-1 focus:ring-[#FAB507] cursor-pointer"
                  >
                    <option value="None">None</option>
                    <option value="New Pour">New Pour</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Master Reserve">Master Reserve</option>
                    <option value="Limited Batch">Limited Batch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="w-full bg-[#FBF9F5] px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg border border-[#EAE5DE]"
                  />
                </div>

                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Original Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.originalPrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        originalPrice: e.target.value,
                      })
                    }
                    className="w-full bg-[#FBF9F5] px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg border border-[#EAE5DE]"
                  />
                </div>

                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.countInStock}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        countInStock: e.target.value,
                      })
                    }
                    className="w-full bg-[#FBF9F5] px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg border border-[#EAE5DE]"
                  />
                </div>

                <div className="flex items-center pt-4 sm:pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1B1C1A]">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          inStock: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-[#FAB507]"
                    />
                    <span className="text-[11px] sm:text-xs">In Stock</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Burn Time
                  </label>
                  <input
                    type="text"
                    value={productForm.burnTime}
                    onChange={(e) =>
                      setProductForm({ ...productForm, burnTime: e.target.value })
                    }
                    placeholder="e.g. 55-60 Hours"
                    className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE]"
                  />
                </div>

                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Vessel Type
                  </label>
                  <input
                    type="text"
                    value={productForm.vesselType}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        vesselType: e.target.value,
                      })
                    }
                    placeholder="e.g. 250g Ceramic Flacon"
                    className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE]"
                  />
                </div>

                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Wick Type
                  </label>
                  <input
                    type="text"
                    value={productForm.wickType}
                    onChange={(e) =>
                      setProductForm({ ...productForm, wickType: e.target.value })
                    }
                    placeholder="e.g. Braided Organic Cotton"
                    className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) =>
                    setProductForm({ ...productForm, image: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE]"
                />
                {productForm.image && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="w-12 h-12 rounded object-cover border border-[#EAE5DE]"
                    />
                    <span className="text-[11px] text-[#7B785F]">Image Preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                  Sensory Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  placeholder="Describe the notes, ambiance, and small-batch craftsmanship..."
                  className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Top Notes
                  </label>
                  <input
                    type="text"
                    value={productForm.topNotes}
                    onChange={(e) =>
                      setProductForm({ ...productForm, topNotes: e.target.value })
                    }
                    placeholder="Bergamot, Cassis"
                    className="w-full bg-[#FBF9F5] px-3 py-2 rounded-lg border border-[#EAE5DE]"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Heart Notes
                  </label>
                  <input
                    type="text"
                    value={productForm.heartNotes}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        heartNotes: e.target.value,
                      })
                    }
                    placeholder="Damask Rose, Jasmine"
                    className="w-full bg-[#FBF9F5] px-3 py-2 rounded-lg border border-[#EAE5DE]"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                    Base Notes
                  </label>
                  <input
                    type="text"
                    value={productForm.baseNotes}
                    onChange={(e) =>
                      setProductForm({ ...productForm, baseNotes: e.target.value })
                    }
                    placeholder="Sandalwood, Amber"
                    className="w-full bg-[#FBF9F5] px-3 py-2 rounded-lg border border-[#EAE5DE]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE5DE]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-[#EAE5DE] text-[#4A4731] hover:bg-[#F5F0E8] font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1B1C1A] hover:bg-[#30312E] text-white font-semibold rounded-lg uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Formulation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: CREATE / EDIT CATEGORY (Mobile & Desktop Responsive) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-4 sm:space-y-5 border border-[#EAE5DE] shadow-2xl max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DE]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#7B5800] font-semibold">
                  Olfactory Classification
                </span>
                <h3 className="font-serif text-lg sm:text-xl text-[#1B1C1A]">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5F0E8] hover:bg-[#EAE5DE] flex items-center justify-center text-[#4A4731] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  placeholder="e.g. Aromatherapy Candles"
                  className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE]"
                />
              </div>

              <div>
                <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                  Sub-tag / Label
                </label>
                <input
                  type="text"
                  value={categoryForm.tag}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, tag: e.target.value })
                  }
                  placeholder="e.g. Botanicals, Master Reserve"
                  className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE]"
                />
              </div>

              <div>
                <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={categoryForm.image}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, image: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE]"
                />
                {categoryForm.image && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={categoryForm.image}
                      alt="Preview"
                      className="w-12 h-12 rounded object-cover border border-[#EAE5DE]"
                    />
                    <span className="text-[11px] text-[#7B785F]">Image Preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#4A4731] uppercase tracking-wider mb-1 font-semibold">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Short note about the olfactory profile and mood..."
                  className="w-full bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#EAE5DE]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE5DE]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#EAE5DE] text-[#4A4731] hover:bg-[#F5F0E8] font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1B1C1A] hover:bg-[#30312E] text-white font-semibold rounded-lg uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
