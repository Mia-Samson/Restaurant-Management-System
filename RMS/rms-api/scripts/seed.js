require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});

const connectDB = require("../config/database");
const FoodMenu = require("../models/FoodMenu");

const sampleFoods = [
  {
    food_name: "Margherita Pizza",
    category: "Main Course",
    price: 299,
    description: "Classic tomato and mozzarella pizza",
    image:
      "https://th.bing.com/th/id/OIP.CjTBesiPk4eLDTJT_9OeHwHaJQ?w=186&h=233&c=7&r=0&o=7&pid=1.7&rm=3",

    food_name: "Chicken Biryani",
    category: "Main Course",
    price: 349,
    description: "Aromatic basmati rice with spiced chicken",
    image: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg",
  },
  {
    food_name: "Caesar Salad",
    category: "Starters",
    price: 199,
    description: "Crisp romaine with parmesan and croutons",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
  },
  {
    food_name: "Chocolate Brownie",
    category: "Desserts",
    price: 149,
    description: "Warm brownie with chocolate sauce",
    image:
      "https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg",
  },
  {
    food_name: "Grilled Salmon",
    category: "Main Course",
    price: 499,
    description: "Perfectly grilled salmon with lemon butter sauce",
    image:
      "https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg",
  },
  {
    food_name: "Veggie Buddha Bowl",
    category: "Healthy",
    price: 279,
    description: "Colorful bowl of quinoa, roasted veggies, and herbs",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
  },
  {
    food_name: "Penne Alfredo",
    category: "Main Course",
    price: 329,
    description: "Creamy Alfredo pasta with parmesan and herbs",
    image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
  },
  {
    food_name: "Tiramisu",
    category: "Desserts",
    price: 199,
    description: "Italian coffee-flavored dessert with mascarpone cream",
    image:
      "https://th.bing.com/th/id/OIP.Pwzcb84ruL5wLwcnu-j9dQHaLH?w=186&h=279&c=7&r=0&o=7&pid=1.7&rm=3",
  },
  {
    food_name: "Garlic Bread",
    category: "Starters",
    price: 99,
    description: "Toasted bread with garlic butter and herbs",
    image:
      "https://th.bing.com/th/id/OIP.hvQpFwbd1cU-CmLuws4gCAHaLH?w=186&h=279&c=7&r=0&o=7&pid=1.7&rm=3",
  },
  {
    food_name: "Mango Smoothie",
    category: "Beverages",
    price: 129,
    description: "Refreshing mango smoothie with yogurt and honey",
    image:
      "https://th.bing.com/th/id/OIP.4Wtfae7_SkGfHeBOXOoKpwHaLH?w=186&h=279&c=7&r=0&o=7&pid=1.7&rm=3",
  },
];

{
  /*const sampleFoods = [
  {
    food_name: "Margherita Pizza",
    category: "Main Course",
    price: 299,
    description: "Classic tomato and mozzarella pizza",
  },
  {
    food_name: "Chicken Biryani",
    category: "Main Course",
    price: 349,
    description: "Aromatic basmati rice with spiced chicken",
  },
  {
    food_name: "Caesar Salad",
    category: "Starters",
    price: 199,
    description: "Crisp romaine with parmesan and croutons",
  },
  {
    food_name: "Chocolate Brownie",
    category: "Desserts",
    price: 149,
    description: "Warm brownie with chocolate sauce",
  },
];*/
}

async function seed() {
  await connectDB();
  const count = await FoodMenu.countDocuments();
  if (count > 0) {
    console.log("Food menu already has data. Skipping seed.");
    process.exit(0);
  }
  await FoodMenu.insertMany(sampleFoods);
  console.log("Sample food menu items added.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
