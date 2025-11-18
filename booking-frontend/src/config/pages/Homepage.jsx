 export default function HomePage() { const token = localStorage.getItem("token");

return ( <div className="min-h-screen flex items-center justify-center bg-green-100"> <div className="p-8 bg-white rounded-xl shadow-lg text-center"> <h1 className="text-2xl font-bold mb-3">Welcome to Home Page</h1> {token ? ( <p className="text-green-700">You are logged in!</p> ) : ( <p className="text-red-700">No token found</p> )}

<button
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}
      className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg"
    >
      Logout
    </button>
  </div>
</div>

);
}