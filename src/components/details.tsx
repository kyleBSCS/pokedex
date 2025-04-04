export default function Details() {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center w-full h-full backdrop-brightness-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-2 right-2 text-gray-600 hover:text-black">
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">Details Card</h2>
        <p className="text-gray-700">Hello</p>
      </div>
    </div>
  );
}
