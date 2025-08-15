import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function Usuarios() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Usuarios" />
      <div className=" rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        
        {/* Barra de herramientas superior */}
        <div className="flex flex-col justify-between gap-4 mb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            {/* Botón Crear Usuario */}
            <button className="btn bg-green-500 text-white hover:bg-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Crear Usuario
            </button>
            
            {/* Opciones de Exportación */}
            <div className="dropdown dropdown-bottom">
              <div tabIndex={0} role="button" className="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Exportar
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>Exportar a Excel</a></li>
                <li><a>Exportar a CSV</a></li>
              </ul>
            </div>
          </div>
          
          {/* Buscador */}
          <div className="form-control">
            <div className="input-group">
              <input type="text" placeholder="Buscar usuarios..." className="input input-bordered w-full sm:w-auto" />
              <button className="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select className="select select-bordered w-full sm:w-auto">
            <option disabled selected>Filtrar por rol</option>
            <option>Administrador</option>
            <option>Usuario</option>
            <option>Editor</option>
          </select>
          
          <select className="select select-bordered w-full sm:w-auto">
            <option disabled selected>Ordenar por</option>
            <option>Nombre (A-Z)</option>
            <option>Nombre (Z-A)</option>
            <option>Fecha más reciente</option>
            <option>Fecha más antigua</option>
          </select>
          
{/*           <div className="join">
            <input className="input input-bordered join-item" placeholder="Fecha inicio" type="date" />
            <span className="join-item flex items-center px-4">a</span>
            <input className="input input-bordered join-item" placeholder="Fecha fin" type="date" />
          </div> */}
        </div>
        
        {/* Tabla */}
        <div className="overflow-x-auto mb-6">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                          alt="Avatar Tailwind CSS Component" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Hart Hagerty</div>
                      <div className="text-sm opacity-50">hart@example.com</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-primary">Administrador</span>
                </td>
                <td>
                  <span className="badge badge-success">Activo</span>
                </td>
                <th>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-xs">Editar</button>
                    <button className="btn btn-ghost btn-xs text-error">Eliminar</button>
                  </div>
                </th>
              </tr>
              {/* row 2 */}
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src="https://img.daisyui.com/images/profile/demo/3@94.webp"
                          alt="Avatar Tailwind CSS Component" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Brice Swyre</div>
                      <div className="text-sm opacity-50">brice@example.com</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-secondary">Usuario</span>
                </td>
                <td>
                  <span className="badge badge-success">Activo</span>
                </td>
                <th>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-xs">Editar</button>
                    <button className="btn btn-ghost btn-xs text-error">Eliminar</button>
                  </div>
                </th>
              </tr>
              {/* row 3 */}
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src="https://img.daisyui.com/images/profile/demo/4@94.webp"
                          alt="Avatar Tailwind CSS Component" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Marjy Ferencz</div>
                      <div className="text-sm opacity-50">marjy@example.com</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-accent">Editor</span>
                </td>
                <td>
                  <span className="badge badge-warning">Inactivo</span>
                </td>
                <th>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-xs">Editar</button>
                    <button className="btn btn-ghost btn-xs text-error">Eliminar</button>
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-sm opacity-70">
            Mostrando 1 al 3 de 3 registros
          </div>
          <div className="join">
            <button className="join-item btn">«</button>
            <button className="join-item btn btn-active">1</button>
            <button className="join-item btn">2</button>
            <button className="join-item btn">3</button>
            <button className="join-item btn">»</button>
          </div>
        </div>
      </div>
    </div>
  );
}