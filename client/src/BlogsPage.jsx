import React, { useState } from "react";

const blogs = [
  {
    id: 1,
    title: "Kathmandu Valley - Cultural Heritage",
    description:
      "Explore UNESCO World Heritage Sites including Swayambhunath, Pashupatinath Temple, and Durbar Square.",
    content:
      "Kathmandu Valley is home to UNESCO World Heritage Sites like Swayambhunath (Monkey Temple), Pashupatinath Temple, and Kathmandu Durbar Square. The valley offers a perfect blend of ancient temples, vibrant markets, and rich history. It's ideal for history lovers, spiritual seekers, and culture enthusiasts who want to experience Nepal's heritage firsthand.",
    image:
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=800",
    date: "January 10, 2025",
    author: "Swarup",
    category: "Cultural Sites",
  },
  {
    id: 2,
    title: "Pokhara - Adventure Paradise",
    description:
      "Discover the city of lakes, adventure sports, and stunning mountain views.",
    content:
      "Pokhara, famous for Phewa Lake, Davis Falls, and Sarangkot sunrise viewpoint, is Nepal's adventure capital. The city offers world-class paragliding, boating, and serves as the gateway to the Annapurna trekking circuit. Perfect for both adventure enthusiasts and those seeking peaceful lakeside relaxation.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
    date: "January 5, 2025",
    author: "Swarup",
    category: "Adventure",
  },
  {
    id: 3,
    title: "Everest Base Camp Trek",
    description:
      "Experience the world's most famous trekking route with stunning views of Mt. Everest.",
    content:
      "The Everest Base Camp trek is one of the most iconic adventures in the world. This journey offers stunning views of Mt. Everest, Lhotse, and Ama Dablam. Trekkers experience unique Sherpa culture, dramatic landscapes, and the challenge of reaching the base of the world's highest peak.",
    image:
      "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&q=80&w=800",
    date: "December 30, 2024",
    author: "Swarup",
    category: "Trekking",
  },
  {
    id: 4,
    title: "Chitwan National Park Safari",
    description:
      "Encounter wildlife including Bengal tigers and one-horned rhinos in their natural habitat.",
    content:
      "Chitwan National Park offers exciting jungle safaris, elephant encounters, and chances to spot rare wildlife like the Bengal tiger and one-horned rhino. This UNESCO World Heritage site provides an excellent opportunity for nature lovers and wildlife photographers to experience Nepal's diverse ecosystem.",
    image:
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=800",
    date: "December 15, 2024",
    author: "Swarup",
    category: "Wildlife",
  },
  {
    id: 5,
    title: "Annapurna Base Camp Trek",
    description:
      "Experience one of Nepal’s most scenic treks with breathtaking views of the Annapurna range.",
    content:
      "The Annapurna Base Camp (ABC) Trek is one of Nepal's most iconic trekking routes. The trek takes you through diverse landscapes, from lush forests and cascading waterfalls to high-altitude glaciers and stunning panoramic views of the Annapurna mountain range. \n\n💡 Highlights:\n✅ Witness sunrise over Annapurna I (8,091m)\n✅ Pass through beautiful Gurung and Magar villages\n✅ Experience hot springs at Jhinu Danda\n✅ Moderate difficulty, ideal for both beginners & experienced trekkers.",
    image:
      "https://images.unsplash.com/photo-1590698933947-d2ec24dbb531?auto=format&fit=crop&q=80&w=800",
    date: "January 15, 2025",
    author: "Swarup",
    category: "Trekking",
  },
  {
    id: 6,
    title: "Best Hotels in Nepal",
    description:
      "Stay at Nepal’s top-rated hotels, from Kathmandu’s luxury to Pokhara’s lakeside retreats.",
    content:
      "Nepal offers some of the best hotels for all types of travelers, from luxury seekers to budget-conscious adventurers. Whether you want a heritage experience in Kathmandu or a lakeside retreat in Pokhara, Nepal has it all. \n\n🏨 Hotel Highlights:\n🌟 Solti Hotel (Kathmandu) – Luxury & Comfort in the heart of Kathmandu.\n🏔 Himalaya Hotel – Stunning mountain views and Nepalese hospitality.\n🌊 Bar Peepal Resort (Pokhara) – Lakeside luxury with infinity pool views.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    date: "February 1, 2025",
    author: "Swarup",
    category: "Luxury Hotels",
  },
  {
    id: 7,
    title: "Authentic Nepali Food You Must Try",
    description:
      "From Dal Bhat to Momos, taste the best Nepali cuisine for a flavorful experience.",
    content:
      "Nepali cuisine is a blend of flavors, spices, and traditions that showcase the country’s rich cultural heritage. From the famous Dal Bhat to flavorful momos, every dish has a unique story. \n\n🍛 Must-Try Nepali Dishes:\n🥘 Dal Bhat – A staple meal served twice a day in Nepalese homes.\n🥟 Momo – Delicious dumplings stuffed with vegetables or meat.\n🍜 Thukpa – A warm noodle soup, perfect for cold mountain regions.",
    image:
      "https://images.unsplash.com/photo-1592861956120-f8b8f5613f8f?auto=format&fit=crop&q=80&w=800",
    date: "February 10, 2025",
    author: "Swarup",
    category: "Food & Culture",
  },
  {
    id: 8,
    title: "Trekking in Nepal: A Beginner’s Guide",
    description:
      "Learn the essentials for trekking in Nepal, from choosing the right route to gear preparation.",
    content:
      "Trekking in Nepal is an unforgettable experience, but it’s important to be well-prepared. \n\n💡 Trekking Tips:\n✅ Choose the right trek based on difficulty (Everest, Annapurna, Langtang).\n✅ Pack light but carry essentials like a sleeping bag, trekking poles, and warm clothing.\n✅ Acclimatize properly to avoid altitude sickness.\n✅ Stay hydrated and maintain a slow pace to enjoy the journey.",
    image:
      "https://unsplash.com/photos/red-green-and-yellow-banner-cenlDgUeuW8",
    date: "February 20, 2025",
    author: "Swarup",
    category: "Travel Tips",
  },
];

const BlogsPage = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const openModal = (blog) => {
    setSelectedBlog(blog);
  };

  const closeModal = () => {
    setSelectedBlog(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-12 px-6 md:px-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="uppercase text-sm tracking-wide font-bold text-[#E3A726]">
            Our Blogs
          </h3>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 hover:text-[#E3A726] transition">
            Nepal Travel Guide
          </h1>
          <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
            Discover the magic of Nepal - From ancient temples to mighty
            Himalayas.
          </p>
        </div>

        {/* Blogs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-6">
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase rounded-full">
                  {blog.category}
                </span>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {blog.title}
                </h3>
                <p className="text-md text-gray-600 mt-3">{blog.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>{blog.date}</span>
                  <span>by {blog.author}</span>
                </div>
                <button
                  onClick={() => openModal(blog)}
                  className="mt-5 bg-[#E3A726] text-white px-6 py-3 rounded-lg hover:bg-[#D29C1F] transition-all duration-300"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
            >
              ✖
            </button>
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="w-full h-80 object-cover rounded-lg"
            />
            <span className="mt-3 px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase rounded-full">
              {selectedBlog.category}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-5">
              {selectedBlog.title}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {selectedBlog.date} • by {selectedBlog.author}
            </p>
            <p className="mt-4 text-gray-700">{selectedBlog.content}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogsPage;
