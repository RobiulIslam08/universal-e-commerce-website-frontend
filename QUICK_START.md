# 🚀 Quick Start Guide - Category System

## 🎯 For Developers

### 1. Add Category Navigation to Header

```tsx
// In your src/components/layout/Header.tsx or NavigationMenu.tsx

import CategoryNavigation from "@/components/category/CategoryNavigation";

export default function Header() {
  return (
    <header>
      <div className="container">
        {/* Your logo, search bar, etc. */}

        {/* Add this for category navigation */}
        <CategoryNavigation />
      </div>
    </header>
  );
}
```

### 2. Environment Setup

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Install Required Packages

```bash
npm install @radix-ui/react-slider lucide-react
```

### 4. Category Page Routes

The system automatically works for any category slug:

```
/category/electronics
/category/men
/category/women
/category/fashion
/category/[any-category-slug]
```

## 🎨 For Designers

### Category Page Layout

```
┌─────────────────────────────────────────────────────┐
│                    Header                           │
├───────────────┬─────────────────────────────────────┤
│               │                                     │
│  FilterSidebar│         Product Grid                │
│               │                                     │
│  - Search     │  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  - Categories │  │Prod│ │Prod│ │Prod│ │Prod│      │
│  - Price      │  └────┘ └────┘ └────┘ └────┘      │
│  - Sort       │                                     │
│               │  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  BestSellers  │  │Prod│ │Prod│ │Prod│ │Prod│      │
│  - Product 1  │  └────┘ └────┘ └────┘ └────┘      │
│  - Product 2  │                                     │
│  - Product 3  │         Pagination                  │
│               │      1  2  3  4  5                  │
└───────────────┴─────────────────────────────────────┘
```

## 📊 For Product Managers

### How to Create Categories

**Option 1: Via API (Recommended)**

```bash
curl -X POST http://localhost:5000/api/v1/categories/create-category \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "slug": "electronics",
    "description": "All electronic items",
    "parentCategory": null,
    "level": 0,
    "order": 1
  }'
```

**Option 2: Via Admin Panel**

1. Go to Admin → Categories
2. Click "Create Category"
3. Fill in details
4. Save

### Category Hierarchy Example

```
Fashion (Level 0)
├── Men (Level 1)
│   ├── Shirts (Level 2)
│   ├── Pants (Level 2)
│   └── Shoes (Level 2)
├── Women (Level 1)
│   ├── Dresses (Level 2)
│   └── Accessories (Level 2)
└── Kids (Level 1)
```

## 🔍 For QA/Testers

### Test Cases

#### 1. Basic Category Page

- [ ] Visit `/category/men`
- [ ] Page loads without errors
- [ ] Products are displayed
- [ ] Sidebar shows filters

#### 2. Subcategory Filtering

- [ ] Click "Shirts" in sidebar
- [ ] URL updates to `?subCategory=shirt`
- [ ] Only shirts are displayed
- [ ] Product count updates

#### 3. Search within Category

- [ ] Type "casual" in search box
- [ ] Press Enter or click search button
- [ ] URL updates with `?searchTerm=casual`
- [ ] Relevant products shown

#### 4. Price Filter

- [ ] Move price slider
- [ ] Click "Apply Price Filter"
- [ ] URL updates with `?minPrice=500&maxPrice=2000`
- [ ] Products within range shown

#### 5. Sorting

- [ ] Select "Price: Low to High"
- [ ] Products re-order by price ascending
- [ ] URL updates with `?sortBy=price-asc`

#### 6. Pagination

- [ ] Click page 2
- [ ] URL updates with `?page=2`
- [ ] Different products load
- [ ] Page 2 button is highlighted

#### 7. Best Sellers Sidebar

- [ ] 5 products shown in sidebar
- [ ] Click a product
- [ ] Navigates to product detail page

#### 8. Empty States

- [ ] Visit category with no products
- [ ] See "No products found" message
- [ ] Search for non-existent term
- [ ] See "No results found" message

#### 9. Mobile Responsive

- [ ] Open on mobile device
- [ ] Sidebar is collapsible
- [ ] 2 column grid on mobile
- [ ] Filters work correctly

#### 10. Performance

- [ ] Page loads under 2 seconds
- [ ] Smooth scrolling
- [ ] No console errors
- [ ] Images lazy load

## 🛠️ For Backend Developers

### Required API Endpoints

Make sure these endpoints are working:

```typescript
// Categories
GET    /api/v1/categories              // All categories
GET    /api/v1/categories/root         // Root categories only
GET    /api/v1/categories/tree         // Hierarchical tree
GET    /api/v1/categories/:slug        // Single category
GET    /api/v1/categories/:slug/subcategories
POST   /api/v1/categories/create-category
PATCH  /api/v1/categories/:slug
DELETE /api/v1/categories/:slug

// Products
GET    /api/v1/products                // All products with filters
GET    /api/v1/products/best-sellers   // Best selling products
GET    /api/v1/products/featured       // Featured products
GET    /api/v1/products/search?q=term  // Search products
```

### Query Parameters for Products

```
category      - Filter by category slug
subCategory   - Filter by subcategory slug
minPrice      - Minimum price
maxPrice      - Maximum price
sortBy        - Sort field (price, rating, createdAt)
sortOrder     - asc or desc
page          - Page number
limit         - Items per page
searchTerm    - Search query
```

### Expected Response Format

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [...products],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 75,
    "totalPage": 7
  }
}
```

## 📱 User Flow Examples

### Example 1: Browse Men's Clothing

1. User clicks "Fashion" in navigation
2. Dropdown shows: Men, Women, Kids
3. User clicks "Men"
4. Lands on `/category/men`
5. Sees all men's products
6. Sidebar shows: Shirts (25), Pants (30), Shoes (20)
7. User clicks "Shirts"
8. URL: `/category/men?subCategory=shirt`
9. Only shirts displayed
10. User can further filter by price

### Example 2: Find Affordable Laptops

1. User visits `/category/electronics`
2. Clicks "Laptop" in sidebar
3. Moves price slider to $500-$1500
4. Clicks "Apply Price Filter"
5. Sees only laptops in budget
6. Sorts by "Price: Low to High"
7. Finds perfect laptop
8. Clicks to view details

### Example 3: Search for Casual Wear

1. User visits `/category/men`
2. Types "casual" in search box
3. Presses Enter
4. Sees casual shirts, pants, shoes
5. Can still filter by subcategory
6. Can still adjust price range
7. Results update in real-time

## 🎓 Common Issues & Solutions

### Issue 1: Categories Not Loading

**Solution:** Check if backend API is running and NEXT_PUBLIC_API_URL is set

### Issue 2: Products Not Filtering

**Solution:** Verify backend is handling query parameters correctly

### Issue 3: Pagination Not Working

**Solution:** Ensure meta object is returned from API with correct structure

### Issue 4: Images Not Showing

**Solution:** Check if image URLs are valid and accessible

### Issue 5: Subcategories Not Appearing

**Solution:** Verify subcategories have correct parentCategory slug

## 🚀 Deployment Checklist

- [ ] Backend API is deployed and accessible
- [ ] Environment variable NEXT_PUBLIC_API_URL is set
- [ ] Categories are created in database
- [ ] Products are linked to categories
- [ ] Test all category pages
- [ ] Test filters and search
- [ ] Test on mobile devices
- [ ] Check SEO metadata
- [ ] Enable caching/CDN
- [ ] Monitor performance

## 📞 Need Help?

- Check [CATEGORY_IMPLEMENTATION.md](./CATEGORY_IMPLEMENTATION.md) for detailed docs
- Review backend code provided
- Test API endpoints in Postman
- Check browser console for errors
- Review network tab for API calls

---

**Happy Coding! 🎉**
