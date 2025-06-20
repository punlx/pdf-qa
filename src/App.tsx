import { useCounterStore } from '@/store/counterStore';

function App() {
  const { count, increment, decrement } = useCounterStore();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Count: {count}</h1>
      <div className="flex gap-4">
        <button onClick={decrement} className="px-4 py-2 bg-red-500 text-white rounded">
          -
        </button>
        <button onClick={increment} className="px-4 py-2 bg-green-500 text-white rounded">
          +
        </button>
      </div>
    </div>
  );
}

export default App;
