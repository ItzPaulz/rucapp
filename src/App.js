import React, { useState } from "react";

function App() {
  const [correo, setCorreo] = useState("");
  const [ruc, setRuc] = useState("");
  const [cedula, setCedula] = useState("");
  const [placa, setPlaca] = useState("");

  const [esContribuyente, setEsContribuyente] = useState(null);
  const [datosContribuyente, setDatosContribuyente] = useState(null);
  const [datosVehiculo, setDatosVehiculo] = useState(null);
  const [puntosLicencia, setPuntosLicencia] = useState("");

  const verificarRuc = async () => {
    if (!correo) {
      alert("Por favor, ingresa un correo válido.");
      return;
    }
    if (!ruc) {
      alert("Por favor, ingresa un número de RUC.");
      return;
    }

    try {
      const existeResp = await fetch(`http://localhost:8080/api/verificarRuc?ruc=${ruc}`);
      const existe = await existeResp.json();
      setEsContribuyente(existe);

      if (existe) {
        const datosResp = await fetch(`http://localhost:8080/api/datosContribuyente?ruc=${ruc}`);
        const datos = await datosResp.json();
        setDatosContribuyente(datos);
      } else {
        setDatosContribuyente(null);
      }
    } catch (error) {
      console.error("Error al verificar RUC:", error);
    }
  };

  const consultarVehiculo = async () => {
    if (!placa) {
      alert("Por favor, ingresa una placa.");
      return;
    }
    try {
      const resp = await fetch(`http://localhost:8080/api/vehiculo?placa=${placa}`);
      const datos = await resp.json();
      setDatosVehiculo(datos);
    } catch (error) {
      console.error("Error al consultar vehículo:", error);
    }
  };

  // Esta función ya no hace fetch para evitar error 401,
  // abre la URL oficial ANT en nueva pestaña con los datos de cedula/ruc y placa
  const consultarPuntos = () => {
    // Usa el ruc como cédula, o puedes adaptar para usar el estado cedula si lo usas
    if (!ruc || !placa) {
      alert("Por favor, ingresa cédula o RUC y placa para consultar.");
      return;
    }
    const url = `https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_grid_citaciones.jsp?ps_tipo_identificacion=CED&ps_identificacion=${ruc}&ps_placa=${placa}`;
    window.open(url, "_blank");
  };

  const limpiarTodo = () => {
    setCorreo("");
    setRuc("");
    setCedula("");
    setPlaca("");
    setEsContribuyente(null);
    setDatosContribuyente(null);
    setDatosVehiculo(null);
    setPuntosLicencia("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Verificación SRI y ANT</h2>

      <label>Correo:</label><br />
      <input value={correo} onChange={(e) => setCorreo(e.target.value)} /><br /><br />

      <label>Cédula o RUC:</label><br />
      <input value={ruc} onChange={(e) => setRuc(e.target.value)} /><br /><br />
      <button onClick={verificarRuc}>Verificar RUC</button><br /><br />

      {esContribuyente !== null && (
        <div>
          {esContribuyente ? (
            <div>
              <p>✅ Es contribuyente</p>
              <h4>🧍 Datos del Contribuyente:</h4>
              <pre>{JSON.stringify(datosContribuyente, null, 2)}</pre>
            </div>
          ) : (
            <p>❌ No es contribuyente del SRI</p>
          )}
        </div>
      )}

      <label>Placa del vehículo:</label><br />
      <input value={placa} onChange={(e) => setPlaca(e.target.value)} /><br />
      <button onClick={consultarVehiculo}>Consultar Vehículo</button><br /><br />

      {datosVehiculo && (
        <div>
          <h4>🚗 Datos del Vehículo:</h4>
          <pre>{JSON.stringify(datosVehiculo, null, 2)}</pre>
        </div>
      )}

      <br />
      <button onClick={consultarPuntos}>Consultar Puntos de Licencia</button><br /><br />
      {puntosLicencia && (
        <div>
          <h4>🎯 Puntos de Licencia:</h4>
          <pre>{puntosLicencia}</pre>
        </div>
      )}

      <br />
      <button onClick={limpiarTodo}>🔄 Limpiar Todo</button>
    </div>
  );
}

export default App;

