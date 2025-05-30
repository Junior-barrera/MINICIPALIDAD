const WEB_ACTV_999 = "https://script.google.com/macros/s/AKfycbws3ckXIZJebtwEdAk0nmeE1uIEaEYN4ZanWWRfJcc0ulOcG29vdfW-R8_mFPzi5w01/exec";     // Implementacion

// Ejecutar cada 1 minuto
setInterval(activaciones, 5000);

function activaciones() {
  leer_usuario();
}

function leer_usuario() {
  if (localStorage.getItem('currentUser') === null) {
    no_hay_usuario();
  } else {
    // Si hay usuario actual, continuar con la lógica
    ultima_conexion()
  }
}


function no_hay_usuario() {
  // Si no hay usuario actual, redirigir a la página de iniciar sesión
  window.location.href = "login.html";
}


function ultima_conexion() {

  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  usuario = currentUser.username;

  var dato_ua = new Array();

  fetch(WEB_ACTV_999 + "?h=U")           // Lee la hoja Mensajes, UserActivity y Activity
    .then(response => response.json())
    .then(data => {
      // Asigna los datos recibidos a las variables bidimensionales
      dato_ua = data.dato_ua;    // Datos de la hoja "UserActivity"

      if (dato_ua.length > 0) {
        var fila = 0;
        for (tt = 0; tt < dato_ua.length; tt++) {
          if (dato_ua[tt][0] === usuario) {
            fila = tt + 1;      // +1 porque la fila 0 es el encabezado
            break;
          }
        }

        // Obtener la fecha y hora actual
        var fecha_actual = new Date();
        // var fecha_chile = fecha_actual.toLocaleString("es-CL");
        var data_userActivity = new Array();
        data_userActivity[0] = usuario;               // ID Usuario
        data_userActivity[1] = currentUser.fullName;      // Nombre real
        data_userActivity[2] = currentUser.role;      // rol
        data_userActivity[3] = fecha_actual.toISOString();     // Fecha y hora actual en formato ISO

        enviarDatos("UserActivity", fila, data_userActivity, 1);

      }

    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });



  function enviarDatos(pagina, fila, datos, tipo) {

    fetch(WEB_ACTV_999, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pagina, fila, datos, tipo })
    })
      .catch(error => {
        // console.error('Error al enviar datos:', error);
        // mostrarToast('Error al enviar los datos.', '#e74c3c');
        // alert('Error al enviar los datos');
      })
      .then(() => {
        // mostrarToast('Datos enviados exitosamente 🎉', '#27ae60');
        // alert('Datos enviados exitosamente');
      })
      .finally(() => {
        // console.log('Datos enviados correctamente');
      });

  }

}
