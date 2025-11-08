import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { DollarSign, LogOut, Plus, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { CustomerModal } from './components/CustomerModal';
import { CustomerTable } from './components/CustomerTable';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StatsCard } from './components/StatsCard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { Customer } from './services/api';
import { customersApi, statsApi } from './services/api';

const queryClient = new QueryClient();

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const queryClientInstance = useQueryClient();
  const { user, signOut } = useAuth();

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await statsApi.get();
      return response.data;
    },
  });

  // Fetch customers
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await customersApi.getAll();
      return response.data;
    },
  });

  // Create customer mutation
  const createMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['customers'] });
      queryClientInstance.invalidateQueries({ queryKey: ['stats'] });
      setIsModalOpen(false);
    },
  });

  // Update customer mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Customer> }) =>
      customersApi.update(id, data),
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['customers'] });
      queryClientInstance.invalidateQueries({ queryKey: ['stats'] });
      setIsModalOpen(false);
      setEditingCustomer(undefined);
    },
  });

  // Delete customer mutation
  const deleteMutation = useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['customers'] });
      queryClientInstance.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const handleSubmit = (data: { name: string; email: string; phone: string }) => {
    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Furniture CRM</h1>
              <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                type="button"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Customer
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                type="button"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Customers" value={stats?.totalCustomers || 0} icon={Users} />
          <StatsCard title="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingCart} />
          <StatsCard
            title="Total Revenue"
            value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
            icon={DollarSign}
          />
          <StatsCard
            title="Avg Order Value"
            value={`$${(stats?.avgOrderValue || 0).toFixed(2)}`}
            icon={TrendingUp}
          />
        </div>

        {/* Customers Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Customers</h2>
          {isLoading ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500">Loading customers...</p>
            </div>
          ) : (
            <CustomerTable customers={customers} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </main>

      {/* Customer Modal */}
      {isModalOpen && (
        <CustomerModal
          customer={editingCustomer}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
