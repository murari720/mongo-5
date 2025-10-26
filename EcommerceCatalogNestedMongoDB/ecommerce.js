const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerceDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  stock: Number
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  variants: [variantSchema]
});

const Product = mongoose.model('Product', productSchema);

async function main() {
  await Product.deleteMany({});

  const sampleProducts = [
    {
      name: "T-Shirt",
      price: 499,
      category: "Clothing",
      variants: [
        { color: "Red", size: "M", stock: 20 },
        { color: "Blue", size: "L", stock: 15 }
      ]
    },
    {
      name: "Sneakers",
      price: 2999,
      category: "Footwear",
      variants: [
        { color: "White", size: "8", stock: 10 },
        { color: "Black", size: "9", stock: 5 }
      ]
    },
    {
      name: "Smartwatch",
      price: 5499,
      category: "Electronics",
      variants: [
        { color: "Black", size: "Standard", stock: 12 },
        { color: "Silver", size: "Standard", stock: 8 }
      ]
    }
  ];

  await Product.insertMany(sampleProducts);
  console.log("Sample products inserted.\n");

  console.log("All Products:");
  const allProducts = await Product.find();
  console.log(allProducts);

  console.log("\nProducts in 'Clothing' category:");
  const clothingProducts = await Product.find({ category: "Clothing" });
  console.log(clothingProducts);

  console.log("\nProjecting only product name and variant details:");
  const variantDetails = await Product.find({}, { name: 1, "variants.color": 1, "variants.size": 1, _id: 0 });
  console.log(variantDetails);

  mongoose.connection.close();
}

main();
