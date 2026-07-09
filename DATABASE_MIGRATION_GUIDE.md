# Database Migration Guide

## Overview
This guide helps you migrate existing data to work with the new review system and food rating features.

## Important Notes
- ⚠️ **Backup your database before running any migration scripts**
- These migrations are **one-time operations**
- Run these only if you have existing data that needs updating

---

## Migration 1: Add Rating Fields to Existing Foods

If you have existing food items in your database, they won't have the new rating fields. This script adds them.

### Using MongoDB Shell (mongosh)

```javascript
// Connect to your database
use restaurant_db

// Add averageRating and totalReviews to all existing foods
db.foods.updateMany(
  {
    $or: [
      { averageRating: { $exists: false } },
      { totalReviews: { $exists: false } }
    ]
  },
  {
    $set: {
      averageRating: 0,
      totalReviews: 0
    }
  }
)

// Verify the update
db.foods.find({}, { name: 1, averageRating: 1, totalReviews: 1 })
```

### Using Node.js Script

Create a file `migrations/add-food-ratings.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const Food = require('../models/Food');
    
    // Update all foods
    const result = await Food.updateMany(
      {
        $or: [
          { averageRating: { $exists: false } },
          { totalReviews: { $exists: false } }
        ]
      },
      {
        $set: {
          averageRating: 0,
          totalReviews: 0
        }
      }
    );
    
    console.log(`Updated ${result.modifiedCount} food items`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
```

Run it:
```bash
cd backend
node migrations/add-food-ratings.js
```

---

## Migration 2: Recalculate Food Ratings from Existing Reviews

If you already have reviews in your database, recalculate the food ratings.

### Using MongoDB Aggregation

```javascript
// Connect to database
use restaurant_db

// For each food with reviews, calculate average
db.reviews.aggregate([
  {
    $group: {
      _id: "$food",
      averageRating: { $avg: "$rating" },
      totalReviews: { $sum: 1 }
    }
  }
]).forEach(function(doc) {
  db.foods.updateOne(
    { _id: doc._id },
    {
      $set: {
        averageRating: parseFloat(doc.averageRating.toFixed(1)),
        totalReviews: doc.totalReviews
      }
    }
  );
  print(`Updated food ${doc._id}: ${doc.averageRating.toFixed(1)} stars (${doc.totalReviews} reviews)`);
});
```

### Using Node.js Script

Create `migrations/recalculate-ratings.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const Review = require('../models/Review');
    const Food = require('../models/Food');
    
    // Get all unique food IDs from reviews
    const foodIds = await Review.distinct('food');
    
    console.log(`Found ${foodIds.length} foods with reviews`);
    
    for (const foodId of foodIds) {
      // Get all reviews for this food
      const reviews = await Review.find({ food: foodId });
      
      if (reviews.length > 0) {
        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
        
        await Food.findByIdAndUpdate(foodId, {
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews
        });
        
        console.log(`Updated food ${foodId}: ${averageRating.toFixed(1)} stars (${totalReviews} reviews)`);
      }
    }
    
    console.log('Migration complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
```

Run it:
```bash
cd backend
node migrations/recalculate-ratings.js
```

---

## Migration 3: Mark Reviewed Orders

If you have existing reviews, mark the corresponding orders as reviewed.

### Using MongoDB Shell

```javascript
use restaurant_db

// Get all reviewed order IDs
const reviewedOrderIds = db.reviews.distinct('order');

// Update orders
db.orders.updateMany(
  { _id: { $in: reviewedOrderIds } },
  { $set: { reviewed: true } }
);

// Verify
db.orders.find({ reviewed: true }).count();
```

### Using Node.js Script

Create `migrations/mark-reviewed-orders.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const Review = require('../models/Review');
    const Order = require('../models/Order');
    
    // Get all order IDs that have reviews
    const reviewedOrderIds = await Review.distinct('order');
    
    console.log(`Found ${reviewedOrderIds.length} orders with reviews`);
    
    // Update all these orders
    const result = await Order.updateMany(
      { _id: { $in: reviewedOrderIds } },
      { $set: { reviewed: true } }
    );
    
    console.log(`Updated ${result.modifiedCount} orders`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
```

Run it:
```bash
cd backend
node migrations/mark-reviewed-orders.js
```

---

## Migration 4: Fix Orders with Empty Items Array

If you have orders with empty items arrays from before the fix, you cannot recover the original items. You have two options:

### Option A: Delete Orders with Empty Items (Recommended)

```javascript
use restaurant_db

// Find orders with empty items
const emptyOrders = db.orders.find({ 
  items: { $size: 0 } 
}).toArray();

console.log(`Found ${emptyOrders.length} orders with empty items`);

// Optional: Export these orders for reference
// db.orders.find({ items: { $size: 0 } }).forEach(printjson);

// Delete them
db.orders.deleteMany({ items: { $size: 0 } });
```

### Option B: Mark Orders as Invalid (Keep for Records)

```javascript
use restaurant_db

// Add a flag to orders with empty items
db.orders.updateMany(
  { items: { $size: 0 } },
  { 
    $set: { 
      invalid: true,
      invalidReason: "Empty items array - placed before system update"
    } 
  }
);
```

---

## Complete Migration Script

Create `migrations/complete-migration.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...\n');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const Food = require('../models/Food');
    const Order = require('../models/Order');
    const Review = require('../models/Review');
    
    // Migration 1: Add rating fields to foods
    console.log('📝 Migration 1: Adding rating fields to foods...');
    const foodsResult = await Food.updateMany(
      {
        $or: [
          { averageRating: { $exists: false } },
          { totalReviews: { $exists: false } }
        ]
      },
      {
        $set: {
          averageRating: 0,
          totalReviews: 0
        }
      }
    );
    console.log(`✅ Updated ${foodsResult.modifiedCount} food items\n`);
    
    // Migration 2: Recalculate ratings
    console.log('📝 Migration 2: Recalculating food ratings...');
    const foodIds = await Review.distinct('food');
    let updatedFoods = 0;
    
    for (const foodId of foodIds) {
      const reviews = await Review.find({ food: foodId });
      
      if (reviews.length > 0) {
        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
        
        await Food.findByIdAndUpdate(foodId, {
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews
        });
        
        updatedFoods++;
      }
    }
    console.log(`✅ Updated ratings for ${updatedFoods} foods\n`);
    
    // Migration 3: Mark reviewed orders
    console.log('📝 Migration 3: Marking reviewed orders...');
    const reviewedOrderIds = await Review.distinct('order');
    const ordersResult = await Order.updateMany(
      { _id: { $in: reviewedOrderIds } },
      { $set: { reviewed: true } }
    );
    console.log(`✅ Marked ${ordersResult.modifiedCount} orders as reviewed\n`);
    
    // Migration 4: Handle empty items arrays
    console.log('📝 Migration 4: Checking for orders with empty items...');
    const emptyItemsCount = await Order.countDocuments({ 
      items: { $size: 0 } 
    });
    
    if (emptyItemsCount > 0) {
      console.log(`⚠️  Found ${emptyItemsCount} orders with empty items array`);
      console.log('⚠️  These orders were placed before the system update');
      console.log('⚠️  Consider deleting them or marking as invalid\n');
    } else {
      console.log('✅ No orders with empty items found\n');
    }
    
    // Summary
    console.log('🎉 Migration completed successfully!');
    console.log('\nSummary:');
    console.log(`- Foods updated: ${foodsResult.modifiedCount}`);
    console.log(`- Foods with ratings: ${updatedFoods}`);
    console.log(`- Orders marked as reviewed: ${ordersResult.modifiedCount}`);
    console.log(`- Orders with empty items: ${emptyItemsCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
```

Run all migrations at once:
```bash
cd backend
node migrations/complete-migration.js
```

---

## Verification Queries

After running migrations, verify the results:

### Check Food Ratings
```javascript
use restaurant_db

// All foods should have rating fields
db.foods.find(
  { 
    averageRating: { $exists: true },
    totalReviews: { $exists: true }
  }
).count()

// Should equal total foods
db.foods.count()

// View foods with reviews
db.foods.find(
  { totalReviews: { $gt: 0 } },
  { name: 1, averageRating: 1, totalReviews: 1 }
).pretty()
```

### Check Reviewed Orders
```javascript
// Count reviewed orders
db.orders.find({ reviewed: true }).count()

// Should match number of distinct orders in reviews
db.reviews.distinct('order').length

// View reviewed orders
db.orders.find(
  { reviewed: true },
  { _id: 1, customerName: 1, reviewed: 1 }
).limit(5).pretty()
```

### Check Order Items
```javascript
// Orders with items
db.orders.find({ 
  items: { $exists: true, $ne: [], $size: { $gt: 0 } } 
}).count()

// Orders with empty items (should be 0 after cleanup)
db.orders.find({ items: { $size: 0 } }).count()
```

---

## Rollback (If Needed)

If something goes wrong, you can rollback:

```javascript
use restaurant_db

// Rollback food rating fields
db.foods.updateMany(
  {},
  { 
    $unset: { 
      averageRating: "",
      totalReviews: "" 
    } 
  }
)

// Rollback reviewed flags
db.orders.updateMany(
  { reviewed: true },
  { $set: { reviewed: false } }
)
```

---

## Best Practices

1. **Always backup before migration**
   ```bash
   # Using mongodump
   mongodump --db restaurant_db --out ./backup_$(date +%Y%m%d)
   ```

2. **Test on development/staging first**
   - Never run migrations directly on production
   - Test with a copy of production data

3. **Verify results**
   - Run verification queries
   - Check a few records manually
   - Test the application after migration

4. **Keep migration scripts**
   - Save all migration scripts for reference
   - Document what each migration does
   - Version control your migrations

5. **Monitor after deployment**
   - Watch error logs
   - Check for any issues
   - Be ready to rollback if needed

---

## Troubleshooting

### Error: "Cannot connect to MongoDB"
- Check if MongoDB is running
- Verify MONGO_URI in .env
- Check network connectivity

### Error: "Model not found"
- Make sure you're in the backend directory
- Check that models are properly exported
- Verify file paths are correct

### Migration takes too long
- Run during low-traffic periods
- Consider batching updates
- Add progress logging

### Ratings don't match
- Rerun recalculate-ratings script
- Check if all reviews are valid
- Verify food IDs in reviews match existing foods

---

## Post-Migration Steps

1. ✅ Test the application thoroughly
2. ✅ Verify all features work
3. ✅ Check admin dashboard statistics
4. ✅ Test review submission
5. ✅ Verify ratings display correctly
6. ✅ Test review management page
7. ✅ Monitor error logs
8. ✅ Get user feedback

---

## Need Help?

If you encounter issues:
1. Check the error logs
2. Review the verification queries
3. Check the FIXES_SUMMARY.md
4. Restore from backup if needed

---

**Remember**: Always backup before migration! 🔒
