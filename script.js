// Este es el programa que se encarga de procesar lo que aparece en pantalla en cada momento y de recoger los datos introducidos

var distribuciones;
var eleccionesDocente = "";
var eleccionesAlumnos = "";

function leerDocente() {
  let e = document.getElementById("archivo-docente");
  let file = e.files[0];
  if (!file) {
    return;
  }
  document.getElementById("boton-docente").value = document.getElementById("archivo-docente").value.match(/[^\\\/]+$/)[0];
  
  let reader = new FileReader();
  reader.onload = function() {
    let contents = reader.result;
    eleccionesDocente = contents;
  };
  reader.readAsText(file);
}

function leerAlumnos() {
  e = document.getElementById("archivo-alumnos");
  let file = e.files[0];
  if (!file) {
    return;
  }
  document.getElementById("boton-alumnos").value = document.getElementById("archivo-alumnos").value.match(/[^\\\/]+$/)[0];
  
  let reader = new FileReader();
  reader.onload = function() {
    let contents = reader.result;
    eleccionesAlumnos = contents;
  };
  reader.readAsText(file);
}

function displayContents(contents) {
  let elemento = document.getElementById("tabla");

  elemento.innerHTML = Datos.textoATabla(contents);
}

function validarDatos(){
  let eleccionesDocenteLista;
  if(eleccionesDocente == ""){
    alert("No has escogido un archivo para las elecciones del docente.");
    return;
  } else {
    try{
      eleccionesDocenteLista = Datos.textoALista(eleccionesDocente);
    } catch (e) {
      alert("Asegúrate de haber escogido el archivo correcto para las elecciones del docente.");
      return;
    }
    if(!Datos.esMatrizCuadrada(eleccionesDocenteLista) || eleccionesDocenteLista[0].length <= 1){
      alert("Asegúrate de haber escogido el archivo correcto para las elecciones del docente.");
      return;
    }
  }

  console.log(eleccionesDocenteLista)

  let pesoDocente = document.getElementById("peso-docente").value;
  let pesoDocenteNumero = Number(pesoDocente)
  if (pesoDocente == "" || pesoDocenteNumero == NaN || pesoDocenteNumero < 0){
    document.getElementById("peso-docente").value = 1;
    alert("El peso de las elecciones del docente ha de ser un número positivo.");
    return;
  }
  
  let eleccionesAlumnosLista;
  if(eleccionesAlumnos == ""){
    alert("No has escogido un archivo para las elecciones de los alumnos.")
    return;
  } else {
    try{
      eleccionesAlumnosLista = Datos.textoALista(eleccionesAlumnos);
    } catch (e) {
      alert("Asegúrate de haber escogido el archivo correcto para las elecciones de los alumnos.");
      return;
    }
    if(!Datos.esMatrizCuadrada(eleccionesDocenteLista) || eleccionesDocenteLista[0].length <= 1){
      alert("Asegúrate de haber escogido el archivo correcto para las elecciones de los alumnos.");
      return;
    }
  }

  let pesoAlumnos = document.getElementById("peso-alumnos").value;
  let pesoAlumnosNumero = Number(pesoAlumnos)
  if (pesoAlumnos == "" || pesoAlumnosNumero == NaN || pesoAlumnosNumero < 0){
    document.getElementById("peso-alumnos").value = 1;
    alert("El peso de las elecciones de los alumnos ha de ser un número positivo.");
    return;
  }

  let columnas = document.getElementById("columnas").value;
  let columnasNumero = Number(columnas)
  if (columnas == "" || columnasNumero == NaN || columnasNumero < 1 || !Number.isInteger(columnasNumero)){
    document.getElementById("columnas").value = 4;
    alert("El número de filas ha de ser un entero igual o mayor que 1.");
    return;
  }

  let ponderacion = document.getElementById("ponderacion").value;
  let ponderacionLista = ponderacion.replace(" ", "").split(",").map(Number);
  if(ponderacion == ("") || ponderacionLista.includes(NaN) || ponderacionLista.length % 2 == 0){
    document.getElementById("ponderacion").value = "-3, -1, 0, 1, 3";
    alert("Las ponderaciones han de ser un de valores (de menor a mayor) separados por comas. Si quieres introducir decimales, utiliza el punto como separador decimal.")
    return;
  }

  let distribucionesEnParalelo = document.getElementById("distribuciones-en-paralelo").value;
  let distribucionesEnParaleloNumero = Number(distribucionesEnParalelo)
  if (distribucionesEnParalelo == "" || distribucionesEnParaleloNumero == NaN || distribucionesEnParaleloNumero < 2 || !Number.isInteger(distribucionesEnParaleloNumero)){
    document.getElementById("distribuciones-en-paralelo").value = 10;
    alert("El número de distribuciones en paralelo ha de ser un entero igual o mayor que 2.");
    return;
  }

  let valorMutacion = document.getElementById("valor-mutacion").value;
  let valorMutacionNumero = Number(valorMutacion);
  if (valorMutacion == "" || valorMutacionNumero == NaN || valorMutacionNumero > 1 || valorMutacionNumero < 0){
    document.getElementById("valor-mutacion").value = 0.05;
    alert("El valor de mutación ha de ser un número entre 0 y 1.");
    return;
  }

  let valorMuerte = document.getElementById("valor-muerte").value;
  let valorMuerteNumero = Number(valorMuerte);
  if (valorMuerte == "" || valorMuerteNumero == NaN || valorMuerteNumero > 1 || valorMuerteNumero < 0){
    document.getElementById("valor-muerte").value = 0.01;
    alert("El valor de muerte ha de ser un número entre 0 y 1.");
    return;
  }

  let listaDeAlumnos = Datos.listaDeAlumnos(eleccionesAlumnos);

  distribuciones = new Distribuciones(distribucionesEnParaleloNumero, columnasNumero, listaDeAlumnos, Datos.listaAElecciones(eleccionesAlumnosLista), Datos.listaAElecciones(eleccionesDocenteLista), pesoAlumnosNumero, pesoDocenteNumero, ponderacionLista, valorMutacionNumero, valorMuerteNumero);

  comenzarDistribuciones();
}

function comenzarDistribuciones(){
  document.getElementById("introducir-datos").style = "display: none";
  document.getElementById("calcular-distribuciones").style = "display: block";

  actualizarMejorDistribucion();
}

function avanzarGeneraciones(){
  let generacionesAAvanzar = document.getElementById("generaciones-a-avanzar").value;
  let generacionesAAvanzarNumero = Number(generacionesAAvanzar);

  if(generacionesAAvanzar == "" || generacionesAAvanzarNumero == NaN || !Number.isInteger(generacionesAAvanzarNumero) || generacionesAAvanzarNumero < 1){
    document.getElementById("generaciones-a-avanzar").value = 100;
    alert("El número de generaciones a avanzar ha de ser un entero igual o mayor que uno.")
    return;
  }

  distribuciones.avanzarGeneraciones(generacionesAAvanzarNumero);

  actualizarMejorDistribucion();
}

function actualizarMejorDistribucion(){
  document.getElementById("mejor-distribucion").innerHTML = Datos.listaATabla(distribuciones.mostrarDistribucion(distribuciones.mejorDistribucion()));

  let informacion = distribuciones.informacionDeControl();

  let puntuacionMaxima = (Math.round(informacion[0][1] * 1000) / 1000).toString();
  
  let puntuacionMediana = (Math.round(informacion[1][1] * 1000) / 1000).toString();
  let puntuacionMinima = (Math.round(informacion[2][1] * 1000) / 1000).toString();

  document.getElementById("informacion-progreso").innerHTML = "Puntuación máxima: " + puntuacionMaxima + "<br />Puntuación mediana: " + puntuacionMediana + "<br />Puntuación mínima: " + puntuacionMinima;
}