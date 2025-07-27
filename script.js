document.addEventListener('DOMContentLoaded', function() {
  Papa.parse('delitos.csv', {
    download: true,
    header: true,
    complete: function(results) {
      console.log('Datos del CSV:', results.data);
      // Aquí puedes añadir el código para mostrar los datos en tu página
    }
  });
});