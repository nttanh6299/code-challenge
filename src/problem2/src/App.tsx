import { SwapForm } from "./components/SwapForm";

function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-5">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-500 mb-2">
            Fancy Swap
          </h1>
        </div>
        <SwapForm />
      </div>
    </div>
  );
}

export default App;
