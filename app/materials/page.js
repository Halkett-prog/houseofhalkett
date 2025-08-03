// src/app/materials/page.js
export default function MaterialsPage() {
  const materials = [
    {
      id: 1,
      name: "Custom Kitchen Cabinets",
      category: "Cabinetry",
      price: "From $8,500",
      description: "Handcrafted kitchen cabinets in any style",
      image: "🗄️"
    },
    {
      id: 2,
      name: "Built-in Bookshelf",
      category: "Storage",
      price: "From $3,200",
      description: "Floor-to-ceiling custom bookshelves",
      image: "📚"
    },
    {
      id: 3,
      name: "Bathroom Vanity",
      category: "Cabinetry",
      price: "From $2,800",
      description: "Custom vanities with integrated storage",
      image: "🚿"
    },
    {
      id: 4,
      name: "Home Office Desk",
      category: "Furniture",
      price: "From $1,800",
      description: "Ergonomic desks tailored to your space",
      image: "🖥️"
    },
    {
      id: 5,
      name: "Entertainment Center",
      category: "Storage",
      price: "From $4,500",
      description: "Media consoles and TV units",
      image: "📺"
    },
    {
      id: 6,
      name: "Closet System",
      category: "Storage",
      price: "From $2,200",
      description: "Walk-in closet organization systems",
      image: "👔"
    },
    {
      id: 7,
      name: "Mudroom Bench",
      category: "Furniture",
      price: "From $1,500",
      description: "Entry storage with seating",
      image: "🪑"
    },
    {
      id: 8,
      name: "Floating Shelves",
      category: "Storage",
      price: "From $350/set",
      description: "Minimalist wall-mounted shelving",
      image: "📐"
    },
    {
      id: 9,
      name: "Wine Rack",
      category: "Storage",
      price: "From $1,200",
      description: "Custom wine storage solutions",
      image: "🍷"
    }
  ];

  return (
    <main className="min-h-screen bg-[#EFEEE1]">
      {/* Header */}
      <header className="bg-[#232320] text-[#EFEEE1] py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold tracking-[8px] mb-2">HOUSE OF HALKETT</h1>
            <p className="text-sm tracking-[3px] opacity-80">MATERIALS & SYSTEMS</p>
          </div>
          <nav className="flex justify-center gap-8 mt-6">
            <a href="/" className="text-sm tracking-wider hover:text-[#B19359] transition">HOME</a>
            <a href="/calculator" className="text-sm tracking-wider hover:text-[#B19359] transition">CALCULATOR</a>
            <a href="/materials" className="text-sm tracking-wider text-[#B19359]">MATERIALS</a>
            <a href="/cart" className="text-sm tracking-wider hover:text-[#B19359] transition">CART</a>
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-4 text-[#232320]">Custom Woodworking</h2>
          <p className="text-lg text-gray-600">
            Handcrafted furniture and cabinetry for every room
          </p>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white p-6 text-center">
          <p className="text-gray-700">
            Looking for our modular wall systems? 
            <a href="/calculator" className="text-[#B19359] hover:underline ml-2">
              Use our Wall System Calculator →
            </a>
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <div key={material.id} className="bg-white p-6 hover:shadow-lg transition">
                <div className="text-6xl mb-4 text-center">{material.image}</div>
                <h3 className="text-xl font-semibold mb-2">{material.name}</h3>
                <p className="text-sm text-[#B19359] mb-2">{material.category}</p>
                <p className="text-gray-600 mb-4">{material.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{material.price}</span>
                  <button className="bg-[#232320] text-[#EFEEE1] px-4 py-2 text-sm hover:bg-[#B19359] transition">
                    INQUIRE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-2xl mb-4">Need Something Custom?</h3>
          <p className="text-gray-600 mb-6">
            All our pieces are made to order. Contact us to discuss your project.
          </p>
          <button className="bg-[#B19359] text-white px-8 py-4 text-sm tracking-wider hover:bg-[#232320] transition">
            GET A QUOTE
          </button>
        </div>
      </section>
    </main>
  );
}