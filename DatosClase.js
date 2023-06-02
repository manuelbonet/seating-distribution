// Este es el programa que se encarga de procesar los datos que son introducidos desde la página web

class Datos{
  static listaAElecciones(lista){
    let elecciones = [];

    for (let i = 1; i < lista.length; i++){
      elecciones.push(lista[i].slice(1));
    }

    return elecciones;
  }

  static listaCuadradaEnBlanco(m, n) {
    let lista = [];

    for (let i = 0; i < m; i++) {
      lista.push([]);

      for (let j = 0; j < n; j++) {
        lista[i].push(undefined);
      }

    }

    return lista;
  }

  static transponer(lista){
    let listaFinal = Datos.listaCuadradaEnBlanco(lista[0].length, lista.length);

    for (let i = 0; i < lista[0].length; i++){
      for (let j = 0; j < lista.length; j++){
        listaFinal[i][j] = lista[j][i];
      }
    }

    return listaFinal;
  }

  static copiar(lista) {
    if (typeof (lista) != "object") {
      return lista;
    }

    let listaResultado = [];

    for (let i = 0; i < lista.length; i++) {
      listaResultado.push(Datos.copiar(lista[i]));
    }

    return listaResultado;
  }

  static ordenar(lista){
    let columnasAOrdenar = [];

    for (let i = 1; i < lista.length; i++){
      columnasAOrdenar.push(lista[i][0]);
    }
    
    let columnasOrdenadas = Datos.copiar(columnasAOrdenar).sort();

    let listaIntermedia = Datos.listaCuadradaEnBlanco(lista.length, lista[0].length);

    listaIntermedia[0] = lista[0];

    for (let i = 0; i < columnasAOrdenar.length; i++){
      listaIntermedia[i+1] = lista[columnasAOrdenar.indexOf(columnasOrdenadas[i]) + 1];
    }

    listaIntermedia = Datos.transponer(listaIntermedia); //Fin de parte 1

    columnasAOrdenar = [];

    for (let i = 1; i < listaIntermedia.length; i++){
      columnasAOrdenar.push(listaIntermedia[i][0]);
    }
    
    columnasOrdenadas = Datos.copiar(columnasAOrdenar).sort();

    let listaFinal = Datos.listaCuadradaEnBlanco(listaIntermedia.length, listaIntermedia[0].length);

    listaFinal[0] = listaIntermedia[0];

    for (let i = 0; i < columnasAOrdenar.length; i++){
      listaFinal[i+1] = listaIntermedia[columnasAOrdenar.indexOf(columnasOrdenadas[i]) + 1];
    }

    return Datos.transponer(listaFinal);
  }

  static esMatrizCuadrada(lista) {
    try{
      if(typeof(lista[0]) != "object"){
        return false;
      }
    } catch (_) {
      return false;
    }

    for (let i = 1; i < lista.length; i++){
      if(lista[0].length != lista[i].length){
        return false;
      }
    }

    if (lista.length != lista[0].length){
      return false;
    }

    return true;
  }

  static textoALista(texto, fechas=false){
    let lista = texto.split(/\r?\n/);

    for (let i = 0; i < lista.length; i++){
      lista[i] = lista[i].split(/[,\t](?=(?:[^"']*"[^"']*")*[^"']*$)/);
      fechas?"":lista[i].splice(0, 1);
    }
    console.log(lista)
    if(lista.length > 1){
      return Datos.ordenar(lista);
    } else {
      return lista;
    }
  }

  static listaATabla(lista, header = false){
    let tablaTexto = "<table>";
    for (let i = 0; i < lista.length; i++){
      tablaTexto += "<tr>"
      for (let j = 0; j < lista[0].length; j++){
        tablaTexto += ((i==0 || j==0) && header)? "<th>" : "<td>";
        tablaTexto += (lista[i][j]==undefined)?"":lista[i][j];
        tablaTexto += ((i==0 || j==0) && header)? "</th>" : "</td>";
      }
      tablaTexto += "</tr>"
    }
    tablaTexto += "</table>";

    return tablaTexto;
  }

  static textoATabla(texto, header = false, fechas = false){
    return Datos.listaATabla(Datos.textoALista(texto, fechas), header);
  }

  static listaDeAlumnos(texto){
    return Datos.textoALista(texto)[0].slice(1);
  }

  static eleccionesLista(texto){
    let elecciones = [];

    for (let i = 1; i < Datos.textoALista(texto).length; i++){
      let fila = Datos.textoALista(texto)[i].slice(1);
      for (let j = 0; j < fila.length; j++){
        fila[j] = Number(fila[j]);
      }
      elecciones.push(fila);
    }

    return elecciones;
  }
}