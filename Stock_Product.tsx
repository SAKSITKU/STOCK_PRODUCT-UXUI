import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Product {
  id: string;
  name: string;
  stock: number;
  category: string;
  location: string;
  status: 'Active' | 'Inactive';
  price?: number;
  description?: string;
  image?: string;
}

const ProductsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from JSON file
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Option 1: Local JSON file (put products.json in assets folder)
      // const productsData = require('../assets/data/products.json');
      // setProducts(productsData.products || productsData);
      
      //  Option 2: Load from remote API
      const response = await fetch('https://raw.githubusercontent.com/SAKSITKU/STOCK_PRODUCT-UXUI/refs/heads/main/product1.json');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products || data);
    
      
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
      
      // Fallback data if JSON loading fails
      setProducts([
        {
          id: '1',
          name: 'Unisex T-Shirt White',
          stock: 12,
          category: 'T-shirts',
          location: '3 stores',
          status: 'Active',
          price: 299,
        },
        {
          id: '2',
          name: 'Unisex T-Shirt Black',
          stock: 8,
          category: 'T-shirts',
          location: '2 stores',
          status: 'Active',
          price: 299,
        },
        {
          id: '3',
          name: 'Unisex T-Shirt Yellow',
          stock: 15,
          category: 'T-shirts',
          location: '4 stores',
          status: 'Active',
          price: 299,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = () => {
    loadProducts();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <TouchableOpacity 
      style={[styles.productCard, { marginBottom: 12 }]}
      onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
      activeOpacity={0.8}
    >
      <View style={styles.productImage}>
        {product.image ? (
          <Text style={styles.imageText}>IMG</Text>
        ) : (
          <Ionicons name="shirt-outline" size={32} color="#6b7280" />
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.stockText}>
          Stock: {product.stock} in stock
        </Text>
        <Text style={styles.categoryText}>
          Category: {product.category}
        </Text>
        <Text style={styles.locationText}>
          Location: {product.location}
        </Text>
        <Text style={styles.productName}>{product.name}</Text>
        {product.price && (
          <Text style={styles.priceText}>฿{product.price.toLocaleString()}</Text>
        )}
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={[
            styles.activeButton, 
            product.status === 'Inactive' && styles.inactiveButton
          ]}
        >
          <Text style={[
            styles.activeButtonText,
            product.status === 'Inactive' && styles.inactiveButtonText
          ]}>
            {product.status}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('home')}
        >
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Search and Actions */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6366f1" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refreshProducts}
        >
          <Ionicons name="refresh" size={16} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refreshProducts} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Products List */}
      <ScrollView 
        style={styles.productsList} 
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refreshProducts}
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>
              {searchText ? 'No products found' : 'No products available'}
            </Text>
            {searchText && (
              <Text style={styles.emptySubText}>
                Try searching with different keywords
              </Text>
            )}
          </View>
        ) : (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </Text>
            </View>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home-outline" size={24} color="#999" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#999" />
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="grid-outline" size={24} color="#6366f1" />
          <Text style={[styles.navText, styles.activeNavText]}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Categories')}
        >
          <Ionicons name="folder-outline" size={24} color="#999" />
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f8f9ff',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6366f1',
    letterSpacing: 0.5,
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#fff',
    gap: 12,
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    paddingHorizontal: 4,
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
    fontWeight: '200',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#dc2626',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: 4,
    paddingBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  productsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  productImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  imageText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  stockText: {
    fontSize: 12,
    color: '#10b981',
    marginBottom: 3,
    fontWeight: '500',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 3,
    fontWeight: '400',
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '400',
  },
  productName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: 22,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
    marginTop: 4,
  },
  productActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: 80,
  },
  activeButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  inactiveButton: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  activeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  inactiveButtonText: {
    color: '#fff',
  },
  moreButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingBottom: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeNavItem: {
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  navText: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 6,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#6366f1',
    fontWeight: '600',
  },
});

export default ProductsScreen;
