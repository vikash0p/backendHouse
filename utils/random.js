const furnitureList = Array.from({ length: 1 }, (_, index) => {
    const originalPrice = (Math.random() * 1000 + 100).toFixed(0); // Random price between 100 and 1100
    const discount = Math.floor(Math.random() * 80); // Random discount between 0 and 80%
    const finalPrice = (originalPrice - (originalPrice * (discount / 100))).toFixed(0); // Final price after discount

    const reviews = Array.from({ length: 2 }, () => ({
        user: `User${Math.floor(Math.random() * 1000)}`,
        comment: `This is a great product. Highly recommended!`,
        rating: Math.floor(Math.random() * 5) + 1, // Random review rating between 1 and 5
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    }));

    // Define the category first
    const category = ["sofa", "recliner", "dining-table", "double-bed", "study", "mattress", "chair", "center-table", "wardrobe", "vase", "outdoor", "dressing-table", "shoe-rack", "bookshelf", "desk", "bed"][Math.floor(Math.random() * 16)];
    const colors = ["#808080", "#FFFFFF", "#000000", "#F5F5DC", "#DEB887", "#654321", "#000080", "#50C878"];
    const location = ["Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Chandigarh", "Surat", "Lucknow", "Kochi", "Indore", "Nagpur", "Patna", "Visakhapatnam", "Vadodara", "Bhopal", "Coimbatore"]

    return {
        id: new Date().getTime().toString() + index,
        title: " ",
        description: " ",
        about: " ",
        category: "sofa",
        image: `https://res.cloudinary.com/dhttnehwp/image/upload/v1731801894/${category}/sp3ego5rdz0m7tk9nfgf.png`,
        origin: ["Italy", "Denmark", "Sweden", "Germany", "France", "United States", "Norway", "Spain"][Math.floor(Math.random() * 8)],
        originalPrice,
        discount,
        finalPrice,
        quantity: Math.floor(Math.random() * 100),
        material: ["Wood", "Fabric", "Metal", "Plastic"][Math.floor(Math.random() * 4)],
        color: Array.from(new Set([...Array.from({ length: 3 }, () => colors[Math.floor(Math.random() * colors.length)]), ...colors]).values()).slice(0, 3),
        stock: Math.floor(Math.random() * 50) + 1,
        dimension: {
            length: `${Math.floor(Math.random() * 100 + 100)}cm`,
            width: `${Math.floor(Math.random() * 50 + 50)}cm`,
            height: `${Math.floor(Math.random() * 50 + 50)}cm`,
        },
        rating: (Math.random() * 5).toFixed(1),
        brand: ["IKEA", "Ashley Furniture Industries", "West Elm", "Restoration Hardware (RH)", "Crate & Barrel", "Herman Miller", "La-Z-Boy", "Ethan Allen", "Williams-Sonoma Home", "Pottery Barn"][Math.floor(Math.random() * 10)],
        weight: Math.floor(Math.random() * 100) + 10,
        review: reviews,
        location: Array.from(new Set([...Array.from({ length: 5 }, () => location[Math.floor(Math.random() * location.length)]), ...location]).values()).slice(0, 5),
    };
});

console.log(furnitureList)