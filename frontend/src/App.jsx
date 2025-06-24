import FraudCheckForm from './components/FraudCheckForm';
export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Hello from FraudGuard!</h1>
      {/* Fraud Detection Section */}
  <section className="py-16 bg-gray-100">
    <div className="container mx-auto px-6">
      <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">Fraud Detection Check</h3>
      <FraudCheckForm />
    </div>
  </section>
    </div>
  );
}