import { Link } from "react-router";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Acceso Denegado</h1>
      <p className="text-lg mb-6">No tienes los permisos necesarios para acceder a esta página</p>
      <Link 
        to="/admin" 
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default Unauthorized;