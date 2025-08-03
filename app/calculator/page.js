// src/app/calculator/page.js
export default function CalculatorPage() {
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
            <a href="/calculator" className="text-sm tracking-wider text-[#B19359]">CALCULATOR</a>
            <a href="/materials" className="text-sm tracking-wider hover:text-[#B19359] transition">MATERIALS</a>
            <a href="/cart" className="text-sm tracking-wider hover:text-[#B19359] transition">CART</a>
          </nav>
        </div>
      </header>

      {/* Calculator Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light mb-4 text-[#232320]">Wall System Calculator</h2>
            <p className="text-gray-600">Configure your modular wall system and get instant pricing</p>
          </div>
          
          {/* Calculator iframe */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <iframe 
              src="https://halkett-calculator.vercel.app"
              className="w-full"
              style={{ height: '800px', minHeight: '600px' }}
              frameBorder="0"
              title="HALKETT Wall System Calculator"
            />
          </div>

          {/* Info section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Need help? Call us at (555) 123-4567 or email info@halkett.com
            </p>
            <a 
              href="/materials"
              className="text-[#B19359] hover:underline"
            >
              Looking for other custom woodworking? Browse our materials →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}