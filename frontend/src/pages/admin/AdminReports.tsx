import { useState, useEffect } from 'react';
import axios from '../../api/axios';

interface Reporte {
  resumen: {
    ventasTotales: number;
    numeroVentas: number;
    ordenesPendientes: number;
    ordenesEnviadas: number;
    totalProductos: number;
    valorInventario: number;
    costoEnvioTotal: number;
  };
  productosMasVendidos: Array<{
    id: string;
    nombre: string;
    cantidad: number;
    ingresos: number;
  }>;
  productosBajoStock: Array<{
    id: string;
    nombre: string;
    stock: number;
    precio: number;
  }>;
  ventasPorDia: { [key: string]: number };
  tipoClientes: {
    invitados: number;
    registrados: number;
  };
}

const AdminReports = () => {
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReporte();
  }, []);

  const fetchReporte = async () => {
    try {
      const { data } = await axios.get('/reports');
      setReporte(data);
    } catch (error) {
      console.error('Error al cargar reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando reportes...</div>
      </div>
    );
  }

  if (!reporte) {
    return <div className="text-center p-8">Error al cargar reportes</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        📊 Reportes y Estadísticas
      </h1>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-primary to-pink-400 text-white">
          <h3 className="text-sm font-semibold mb-2">Ventas Totales</h3>
          <p className="text-3xl font-bold">
            ${reporte.resumen.ventasTotales.toLocaleString('es-CL')}
          </p>
          <p className="text-sm opacity-90 mt-1">
            {reporte.resumen.numeroVentas} órdenes
          </p>
        </div>

        <div className="card bg-gradient-to-br from-accent to-purple-600 text-white">
          <h3 className="text-sm font-semibold mb-2">Inventario</h3>
          <p className="text-3xl font-bold">
            ${reporte.resumen.valorInventario.toLocaleString('es-CL')}
          </p>
          <p className="text-sm opacity-90 mt-1">
            {reporte.resumen.totalProductos} productos
          </p>
        </div>

        <div className="card bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
          <h3 className="text-sm font-semibold mb-2">Pendientes</h3>
          <p className="text-3xl font-bold">{reporte.resumen.ordenesPendientes}</p>
          <p className="text-sm opacity-90 mt-1">órdenes por procesar</p>
        </div>

        <div className="card bg-gradient-to-br from-green-400 to-green-600 text-white">
          <h3 className="text-sm font-semibold mb-2">Envíos</h3>
          <p className="text-3xl font-bold">${reporte.resumen.costoEnvioTotal.toLocaleString('es-CL')}</p>
          <p className="text-sm opacity-90 mt-1">generado en envíos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Productos más vendidos */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-accent">
            🏆 Productos Más Vendidos
          </h2>
          {reporte.productosMasVendidos.length > 0 ? (
            <div className="space-y-3">
              {reporte.productosMasVendidos.map((prod, index) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{prod.nombre}</p>
                      <p className="text-sm text-gray-600">
                        {prod.cantidad} unidades vendidas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ${prod.ingresos.toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay ventas aún
            </p>
          )}
        </div>

        {/* Productos con stock bajo */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            ⚠️ Stock Bajo (menos de 5)
          </h2>
          {reporte.productosBajoStock.length > 0 ? (
            <div className="space-y-3">
              {reporte.productosBajoStock.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{prod.nombre}</p>
                    <p className="text-sm text-gray-600">
                      Precio: ${prod.precio.toLocaleString('es-CL')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
                      {prod.stock} unidades
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              ✅ Todos los productos tienen stock suficiente
            </p>
          )}
        </div>
      </div>

      {/* Tipo de Clientes */}
      <div className="card mt-8">
        <h2 className="text-2xl font-bold mb-4 text-accent">
          👥 Tipo de Clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-4xl font-bold text-blue-600">
              {reporte.tipoClientes.registrados}
            </p>
            <p className="text-gray-700 mt-2">Usuarios Registrados</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <p className="text-4xl font-bold text-purple-600">
              {reporte.tipoClientes.invitados}
            </p>
            <p className="text-gray-700 mt-2">Compras como Invitado</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
