import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Users,
  LogOut,
  Plus,
  X,
  Star,
} from 'lucide-react';

interface AdminDashboardPageProps {
  token: string;
  user: any;
  onLogout: () => void;
  onReturnToStore: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  token,
  user,
  onLogout,
  onReturnToStore,
}) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'inventory' | 'orders' | 'customers'>('overview');

  const [createProductOpen, setSetCreateProductOpen] = useState(false);
  const [adjustInventoryProduct, setAdjustInventoryProduct] = useState<any | null>(null);
  const [inventoryDelta, setInventoryDelta] = useState(1);
  const [inventoryReason, setInventoryReason] = useState('Restock shipment');

  const [pName, setPName] = useState('');
  const [pSlug, setPSlug] = useState('');
  const [pCategory, setPCategory] = useState('JEWELRY_ACCESSORIES');
  const [pPrice, setPPrice] = useState(50000);
  const [pStock, setPStock] = useState(10);
  const [pDesc, setPDesc] = useState('');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const { data: stats } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/dashboard', { headers: authHeaders });
      const data = await res.json();
      return data.data;
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=100', { headers: authHeaders });
      const data = await res.json();
      return data.data || [];
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const res = await fetch('/api/orders?limit=100', { headers: authHeaders });
      const data = await res.json();
      return data.data || [];
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      const res = await fetch('/api/customers', { headers: authHeaders });
      const data = await res.json();
      return data.data || [];
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to update order status');
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    },
  });

  const publishProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/products/${productId}/publish`, {
        method: 'POST',
        headers: authHeaders,
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminProducts'] }),
  });

  const featureProductMutation = useMutation({
    mutationFn: async ({ productId, isFeatured }: { productId: string; isFeatured: boolean }) => {
      const res = await fetch(`/api/products/${productId}/featured`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ isFeatured }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to update featured status');
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminProducts'] }),
    onError: (error: Error) => alert(error.message),
  });

  const archiveProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/products/${productId}/archive`, {
        method: 'POST',
        headers: authHeaders,
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminProducts'] }),
  });

  const adjustInventoryMutation = useMutation({
    mutationFn: async () => {
      if (!adjustInventoryProduct) return;
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          productId: adjustInventoryProduct.id,
          quantityDelta: Number(inventoryDelta),
          reason: inventoryReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to adjust inventory');
      return data.data;
    },
    onSuccess: () => {
      setAdjustInventoryProduct(null);
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    },
  });

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          name: pName,
          slug: pSlug || pName.toLowerCase().replace(/\s+/g, '-'),
          categoryCode: pCategory,
          basePrice: Number(pPrice),
          stock: Number(pStock),
          description: pDesc,
          status: 'PUBLISHED',
          currency: 'NGN',
          images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'],
          variants: [],
          customizationFields: [
            {
              key: 'custom_text',
              label: 'Personalized Text / Engraving',
              type: 'TEXT',
              required: false,
              maxLength: 30,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to create product');

      setSetCreateProductOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0eded] text-[#1b1c1c] flex flex-col font-sans">
      <header className="bg-[#1b1c1c] text-white px-6 py-4 flex items-center justify-between border-b border-[#303030]">
        <div className="flex items-center gap-3">
          <span className="font-serif text-2xl font-bold text-[#c9a96e]">CUSTOMRY ADMIN</span>
          <span className="bg-[#745a27] text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
            {user.role}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onReturnToStore}
            className="text-xs text-[#c9a96e] hover:text-white transition"
          >
            ← View Storefront
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition border border-red-900/50 px-3 py-1.5 rounded-full"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-container mx-auto w-full px-6 py-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        <aside className="md:col-span-1 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'inventory', label: 'Inventory', icon: Boxes },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'customers', label: 'Customers', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wider uppercase transition ${
                  activeTab === tab.id
                    ? 'bg-[#745a27] text-white shadow-md'
                    : 'bg-white text-[#4d463a] hover:bg-[#f6f3f2]'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        <main className="md:col-span-4 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#1b1c1c]">Atelier Performance Overview</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-outline-variant/40 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7f7668]">Total Revenue</span>
                  <p className="font-serif text-2xl font-bold text-[#745a27] mt-1">
                    ₦{(stats?.totalRevenue || 0).toLocaleString()}
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-outline-variant/40 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7f7668]">Total Orders</span>
                  <p className="font-serif text-2xl font-bold text-[#1b1c1c] mt-1">
                    {stats?.totalOrders || 0}
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-outline-variant/40 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7f7668]">Pending Payments</span>
                  <p className="font-serif text-2xl font-bold text-amber-600 mt-1">
                    {stats?.pendingOrders || 0}
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-outline-variant/40 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7f7668]">Low Stock Alert</span>
                  <p className="font-serif text-2xl font-bold text-red-600 mt-1">
                    {stats?.lowStockProducts || 0} Items
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-outline-variant/40 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1b1c1c]">Recent Client Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-outline-variant/30 text-[#7f7668] uppercase font-bold text-[10px]">
                        <th className="pb-3">Order Number</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {stats?.recentOrders?.map((o: any) => (
                        <tr key={o._id}>
                          <td className="py-3 font-mono font-bold text-[#745a27]">{o.orderNumber}</td>
                          <td className="py-3 font-medium">{o.customer?.fullName}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f6f3f2] text-[#745a27]">
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 font-serif font-bold">₦{o.total?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-2xl font-bold text-[#1b1c1c]">Catalogue Products</h2>
                <button
                  onClick={() => setSetCreateProductOpen(true)}
                  className="bg-[#745a27] hover:bg-[#c9a96e] text-white hover:text-[#1b1c1c] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full flex items-center gap-1.5 transition shadow"
                >
                  <Plus size={16} /> New Product
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f6f3f2] text-[#7f7668] uppercase font-bold text-[10px] border-b border-outline-variant/40">
                    <tr>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Base Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {products.map((p: any) => (
                      <tr key={p.id}>
                        <td className="p-4 font-serif font-semibold text-[#1b1c1c]">{p.name}</td>
                        <td className="p-4 text-[10px] uppercase tracking-wider text-[#7f7668]">{p.categoryCode}</td>
                        <td className="p-4 font-serif font-bold text-[#745a27]">₦{p.basePrice.toLocaleString()}</td>
                        <td className="p-4 font-semibold">{p.stock}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            disabled={featureProductMutation.isPending}
                            onClick={() =>
                              featureProductMutation.mutate({
                                productId: p._id || p.id,
                                isFeatured: !p.isFeatured,
                              })
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition ${
                              p.isFeatured
                                ? 'bg-[#745a27] text-white'
                                : 'bg-[#f6f3f2] text-[#7f7668] hover:text-[#745a27]'
                            }`}
                            title={p.isFeatured ? 'Remove from featured' : 'Feature product'}
                          >
                            <Star size={12} fill={p.isFeatured ? 'currentColor' : 'none'} />
                            {p.isFeatured ? 'Featured' : 'Feature'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {p.status !== 'PUBLISHED' && (
                            <button
                              onClick={() => publishProductMutation.mutate(p.id)}
                              className="text-[10px] font-bold text-green-700 hover:underline uppercase"
                            >
                              Publish
                            </button>
                          )}
                          {p.status !== 'ARCHIVED' && (
                            <button
                              onClick={() => archiveProductMutation.mutate(p.id)}
                              className="text-[10px] font-bold text-red-600 hover:underline uppercase"
                            >
                              Archive
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#1b1c1c]">Stock & Inventory Management</h2>
              <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden p-6 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-outline-variant/30 text-[#7f7668] uppercase font-bold text-[10px]">
                        <th className="pb-3">Product Name</th>
                        <th className="pb-3">Current Stock</th>
                        <th className="pb-3">Stock State</th>
                        <th className="pb-3 text-right">Adjust Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {products.map((p: any) => (
                        <tr key={p.id}>
                          <td className="py-3 font-serif font-semibold">{p.name}</td>
                          <td className="py-3 font-bold">{p.stock}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.stock > 5
                                  ? 'bg-green-100 text-green-800'
                                  : p.stock > 0
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {p.stock > 5 ? 'IN STOCK' : p.stock > 0 ? 'LOW STOCK' : 'OUT OF STOCK'}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setAdjustInventoryProduct(p)}
                              className="bg-[#745a27] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full hover:bg-[#c9a96e]"
                            >
                              Adjust Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#1b1c1c]">All Orders & Fulfillment</h2>
              <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f6f3f2] text-[#7f7668] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-4">Order Ref</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Total</th>
                      <th className="p-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {orders.map((o: any) => (
                      <tr key={o.id}>
                        <td className="p-4 font-mono font-bold text-[#745a27]">{o.orderNumber}</td>
                        <td className="p-4">
                          <div className="font-bold">{o.customer?.fullName}</div>
                          <div className="text-[10px] text-[#7f7668]">{o.customer?.phone}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#f6f3f2] text-[#745a27]">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 font-semibold">{o.paymentStatus}</td>
                        <td className="p-4 font-serif font-bold">₦{o.total?.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              updateOrderStatusMutation.mutate({
                                orderId: o.id,
                                status: e.target.value,
                              })
                            }
                            className="p-1.5 bg-[#f6f3f2] border border-outline-variant rounded-lg text-[10px] font-bold"
                          >
                            <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                            <option value="PAID">PAID</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="READY_FOR_DELIVERY">READY_FOR_DELIVERY</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#1b1c1c]">Customer Profiles</h2>
              <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden p-6">
                <table className="w-full text-left text-xs">
                  <thead className="text-[#7f7668] uppercase font-bold text-[10px] border-b border-outline-variant/30">
                    <tr>
                      <th className="pb-3">Client Name</th>
                      <th className="pb-3">WhatsApp / Phone</th>
                      <th className="pb-3">Total Orders</th>
                      <th className="pb-3">Lifetime Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {customers.map((c: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-3 font-serif font-semibold">{c.fullName}</td>
                        <td className="py-3 font-mono">{c.phone}</td>
                        <td className="py-3 font-bold">{c.totalOrders}</td>
                        <td className="py-3 font-serif font-bold text-[#745a27]">₦{c.totalSpent?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {adjustInventoryProduct && (
        <div className="fixed inset-0 z-50 bg-[#1b1c1c]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1b1c1c]">
              Adjust Stock: {adjustInventoryProduct.name}
            </h3>
            <p className="text-xs text-[#7f7668]">Current Stock: {adjustInventoryProduct.stock}</p>

            <div>
              <label className="block text-xs font-bold text-[#1b1c1c] mb-1">
                Quantity Delta (e.g. +5 for addition, -2 for reduction)
              </label>
              <input
                type="number"
                value={inventoryDelta}
                onChange={(e) => setInventoryDelta(Number(e.target.value))}
                className="w-full p-2.5 border border-outline-variant rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1b1c1c] mb-1">Reason</label>
              <input
                type="text"
                value={inventoryReason}
                onChange={(e) => setInventoryReason(e.target.value)}
                className="w-full p-2.5 border border-outline-variant rounded-xl text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setAdjustInventoryProduct(null)}
                className="flex-1 py-3 text-xs uppercase font-bold border border-outline-variant rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={() => adjustInventoryMutation.mutate()}
                className="flex-1 py-3 text-xs uppercase font-bold bg-[#745a27] text-white rounded-full hover:bg-[#c9a96e]"
              >
                Save Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {createProductOpen && (
        <div className="fixed inset-0 z-50 bg-[#1b1c1c]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif text-xl font-bold text-[#1b1c1c]">Create New Product</h3>
              <button onClick={() => setSetCreateProductOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full p-2.5 border border-outline-variant rounded-xl"
                  placeholder="e.g. Solid Gold Pendant"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Category *</label>
                <select
                  value={pCategory}
                  onChange={(e) => setPCategory(e.target.value)}
                  className="w-full p-2.5 border border-outline-variant rounded-xl"
                >
                  <option value="JEWELRY_ACCESSORIES">JEWELRY_ACCESSORIES</option>
                  <option value="JOURNALS_BOOKS">JOURNALS_BOOKS</option>
                  <option value="WATER_BOTTLES">WATER_BOTTLES</option>
                  <option value="GIFT_BOXES">GIFT_BOXES</option>
                  <option value="WRISTWATCHES">WRISTWATCHES</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Base Price (NGN) *</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-outline-variant rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full p-2.5 border border-outline-variant rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full p-2.5 border border-outline-variant rounded-xl"
                  placeholder="Detailed product story..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#745a27] text-white py-3 rounded-full font-bold uppercase text-xs hover:bg-[#c9a96e] transition shadow mt-2"
              >
                Create & Publish Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
