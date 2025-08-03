export default function Home() {
  return (
    <main className="min-h-screen bg-[#EFEEE1]">
      {/* Header */}
      <header className="bg-[#232320] text-[#EFEEE1] py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-[8px] mb-2">HOUSE OF HALKETT</h1>
          <p className="text-sm tracking-[3px] opacity-80">MATERIALS & SYSTEMS</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-6 text-[#232320]">
            Architectural Wall Systems
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Transform your space with our signature modular wall systems. 
            From calculation to installation, we make luxury accessible.
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/calculator"
              className="bg-[#B19359] text-white px-8 py-4 text-sm tracking-wider hover:bg-[#232320] transition"
            >
              WALL CALCULATOR
            </a>
            <a 
              href="/materials"
              className="border-2 border-[#232320] text-[#232320] px-8 py-4 text-sm tracking-wider hover:bg-[#232320] hover:text-[#EFEEE1] transition"
            >
              BROWSE MATERIALS
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📐</div>
            <h3 className="text-xl font-semibold mb-2">Calculate</h3>
            <p className="text-gray-600">
              Use our precision calculator to spec your wall system perfectly
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Customize</h3>
            <p className="text-gray-600">
              Choose from wood, leather, metal, and painted finishes
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Order</h3>
            <p className="text-gray-600">
              Complete system delivered with everything you need
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#232320] text-[#EFEEE1]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl mb-4">Ready to Transform Your Space?</h2>
          <p className="text-lg mb-8 opacity-80">
            Start with our calculator or explore our material gallery
          </p>
          <a 
            href="/calculator"
            className="bg-[#B19359] text-white px-8 py-4 inline-block text-sm tracking-wider hover:bg-[#EFEEE1] hover:text-[#232320] transition"
          >
            GET STARTED
          </a>
        </div>
      </section>
    </main>
  );
}