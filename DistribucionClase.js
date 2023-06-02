// Este es el programa que se encarga procesar las distintas distribuciones y de buscar la mejor posible

class Distribuciones {
  constructor(distribucionesEnParalelo, columnas, listaDeAlumnos, eleccionesAlumnos, eleccionesDocente, pesoAlumnos, pesoDocente, ponderacion, valorMutacion, valorMuerte) {
    this.distribucionesEnParalelo = distribucionesEnParalelo;
    this.columnas = columnas;
    this.listaDeAlumnos = listaDeAlumnos;
    this.eleccionesAlumnos = eleccionesAlumnos;
    this.eleccionesDocente = eleccionesDocente;
    this.pesoAlumnos = pesoAlumnos;
    this.pesoDocente = pesoDocente;
    this.ponderacion = ponderacion;
    this.valorMutacion = valorMutacion;
    this.valorMuerte = valorMuerte;

    for(let i = 0; i < this.eleccionesDocente.length; i++){
      for(let j = 0; j < this.eleccionesDocente[0].length; j++){
        if(this.eleccionesDocente[i][j] == 0){
          this.eleccionesDocente[i][j] = Math.ceil((this.ponderacion.length - 1) / 2);
        }
        
        if(this.eleccionesAlumnos[i][j] == 0){
          this.eleccionesAlumnos[i][j] = Math.ceil((this.ponderacion.length - 1) / 2);
        }
      }
    }

    this.crearDistribucionesIniciales();
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

  static hacerCuadrado(listaEntrada, columnas) {
    let filas = Math.ceil(listaEntrada.length / columnas)
    let listaCuadrada = Distribuciones.listaCuadradaEnBlanco(filas, columnas);

    for (let i = 0; i < listaEntrada.length; i++) {
      listaCuadrada[Math.floor(i / columnas)][i % columnas] = listaEntrada[i];
    }

    return (listaCuadrada);
  }

  static hacerLinea(listaEntrada) {
    let listaLinea = [];

    for (let fila = 0; fila < listaEntrada.length; fila++) {
      for (let col = 0; col < listaEntrada[0].length; col++) {
        if (listaEntrada[fila][col] != undefined) {
          listaLinea.push(listaEntrada[fila][col]);
        }
      }
    }

    return listaLinea;
  }

  calcularPuntuaciones(listaAPuntuar) {
    let puntuaciones = Distribuciones.listaCuadradaEnBlanco(listaAPuntuar.length, listaAPuntuar[0].length);

    for (let i = 0; i < listaAPuntuar.length; i++) {
      for (let j = 0; j < listaAPuntuar[0].length; j++) {
        if (listaAPuntuar[i][j] != undefined) {
          let sumaTemporal = 0;

          for (let i1 = 0; i1 < listaAPuntuar.length; i1++) {
            for (let j1 = 0; j1 < listaAPuntuar[0].length; j1++) {
              if (listaAPuntuar[i1][j1] != undefined && (i1 != i || j1 != j)) {
                let puntuacionAlumno = this.ponderacion[this.eleccionesAlumnos[listaAPuntuar[i][j]][listaAPuntuar[i1][j1]] - 1];
                let puntuacionDocente = this.ponderacion[this.eleccionesDocente[listaAPuntuar[i][j]][listaAPuntuar[i1][j1]]- 1]
                let distanciaAsientos = Math.sqrt((i - i1) ** 2 + (j - j1) ** 2);
                sumaTemporal += (this.pesoAlumnos * puntuacionAlumno + this.pesoDocente * puntuacionDocente) / (distanciaAsientos* (this.pesoAlumnos + this.pesoDocente));
              }
            }
          }

          puntuaciones[i][j] = sumaTemporal;

        }
      }
    }

    return puntuaciones;

  }

  puntuacionGeneral(listaAPuntuar) {
    let valores = Distribuciones.hacerLinea(this.calcularPuntuaciones(listaAPuntuar));

    let suma = 0;

    for (let i = 0; i < valores.length; i++) {
      suma += valores[i];
    }

    return suma;
  }

  static ajustar(valor, entradaMinima, entradaMaxima, salidaMinima, salidaMaxima) {
    return (x - entradaMinima) * (salidaMaxima - salidaMinima) / (entradaMaxima - entradaMinima) + salidaMinima;
  }

  static copiar(lista) {
    if (typeof (lista) != "object") {
      return lista;
    }

    let listaResultado = [];

    for (let i = 0; i < lista.length; i++) {
      listaResultado.push(Distribuciones.copiar(lista[i]));
    }

    return listaResultado;
  }

  static mezclar(listaAMezclar) {
    let listaPorMezclar = Distribuciones.copiar(listaAMezclar);

    let listaMezclada = [];

    for (let i = 0; i < listaAMezclar.length; i++) {
      let elemento = Math.floor(Math.random() * listaPorMezclar.length);
      listaMezclada.push(listaPorMezclar[elemento]);
      listaPorMezclar.splice(elemento, 1);
    }

    return listaMezclada;
  }

  crearDistribucionesIniciales() {
    let distribuciones = [];

    let listaNumerica = [];

    for (let i = 0; i < this.listaDeAlumnos.length; i++) {
      listaNumerica.push(i);
    }

    for (let i = 0; i < this.distribucionesEnParalelo; i++) {
      distribuciones.push(Distribuciones.hacerCuadrado(Distribuciones.mezclar(listaNumerica), this.columnas));
    }

    this.distribuciones = Distribuciones.copiar(distribuciones);
    //return distribuciones;
  }

  mutarDistribucion(listaDistribucion) {
    let listaDistribucionLinea = Distribuciones.hacerLinea(listaDistribucion);

    let puntuaciones = this.calcularPuntuaciones(listaDistribucion);
    let puntuacionesLinea = Distribuciones.hacerLinea(puntuaciones);
    let puntuacionesLineaOrdenadas = puntuacionesLinea.sort();

    let puntuacionMinima = Math.min(...puntuacionesLinea);
    let puntuacionMaxima = Math.max(...puntuacionesLinea);

    let b = (puntuacionMaxima + puntuacionMinima) / 2; //media
    let a = Math.log(1 / this.valorMutacion - 1) / (b - puntuacionMaxima);

    let elementosAMutar = [];
    let posicionesAMutar = [];
    let probabilidadDeMutarLista = [];
    let puntuacionesLineaAMutar = [];

    for (let i = 0; i < puntuacionesLinea.length; i++) {
      let probabilidadDeMutar = 1 / (1 + Math.E ** (-a * (puntuacionesLinea[i] - b)));

      if (isNaN(probabilidadDeMutar)) {
        probabilidadDeMutar = 0.5;
      }

      if (Math.random() < probabilidadDeMutar) {
        elementosAMutar.push(listaDistribucionLinea[i]);
        posicionesAMutar.push(i);
        probabilidadDeMutarLista.push(probabilidadDeMutar);
        puntuacionesLineaAMutar.push(puntuacionesLinea[i]);
      }

    }

    let elementosMutados = Distribuciones.mezclar(elementosAMutar);

    let distribucionMutadaLinea = listaDistribucionLinea;

    for (let i = 0; i < posicionesAMutar.length; i++) {
      distribucionMutadaLinea[posicionesAMutar[i]] = elementosMutados[i];
    }

    let distribucionMutada = Distribuciones.hacerCuadrado(distribucionMutadaLinea, listaDistribucion[0].length);

    return distribucionMutada;
  }

  nuevaGeneracion() {
    let listaDistribuciones = Distribuciones.copiar(this.distribuciones);

    let puntuaciones = [];

    for (let i = 0; i < listaDistribuciones.length; i++) {
      puntuaciones.push(this.puntuacionGeneral(listaDistribuciones[i]));
    }

    //let puntuacionMinima = Math.min(...puntuaciones);
    let puntuacionMaxima = Math.max(...puntuaciones);

    let b = this.informacionDeControl()[1][2]; //mediana
    //let b = (puntuacionMinima + puntuacionMaxima) / 2 //media
    let a = Math.log(1 / this.valorMuerte - 1) / (b - puntuacionMaxima); 

    let elementosNuevos = Distribuciones.copiar(listaDistribuciones);

    while (elementosNuevos.length > listaDistribuciones.length / 2) {
      let i = Math.floor(Math.random() * elementosNuevos.length);

      let probabilidadDeMorir = 1 / (1 + Math.E ** (-a * (puntuaciones[i] - b)));


      if (isNaN(probabilidadDeMorir)) {
        probabilidadDeMorir = /*this.valorMuerte*/0.5;
      }

      if (Math.random() < probabilidadDeMorir) {
        elementosNuevos.splice(i, 1);
      }
    }

    for (let i = 0; i < listaDistribuciones.length / 2; i++) {
      elementosNuevos.push(this.mutarDistribucion(elementosNuevos[i]))
    }

    this.distribuciones = elementosNuevos;
  }

  mejorDistribucion() {
    return this.informacionDeControl()[0][0];
  }

  mostrarDistribucion(listaDistribucion) {
    let listaDistribucionLinea = Distribuciones.hacerLinea(listaDistribucion);

    let distribucionTextoLinea = [];

    for (let i = 0; i < listaDistribucionLinea.length; i++) {
      distribucionTextoLinea.push(this.listaDeAlumnos[listaDistribucionLinea[i]]);
    }

    let distribucionTexto = Distribuciones.hacerCuadrado(distribucionTextoLinea, listaDistribucion[0].length);

    return distribucionTexto;
  }

  informacionDeControl(mostrarEnConsola = false) {
    let listaDistribuciones = Distribuciones.copiar(this.distribuciones);

    let puntuaciones = [];

    for (let i = 0; i < listaDistribuciones.length; i++) {
      puntuaciones.push(this.puntuacionGeneral(listaDistribuciones[i]));
    }

    let puntuacionesOrdenadas = Distribuciones.copiar(puntuaciones);
    puntuacionesOrdenadas.sort(function (a, b) { return a - b });

    let puntuacionMinima = puntuacionesOrdenadas[0];
    let posicionPuntuacionMinima = puntuaciones.indexOf(puntuacionMinima);

    let puntuacionMaxima = puntuacionesOrdenadas[puntuacionesOrdenadas.length - 1];
    let posicionPuntuacionMaxima = puntuaciones.indexOf(puntuacionMaxima);

    let puntuacionMediana = puntuacionesOrdenadas[Math.floor(puntuacionesOrdenadas.length / 2)];
    let posicionPuntuacionMediana = puntuaciones.indexOf(puntuacionMediana);
    let puntuacionMedianaReal = (puntuacionesOrdenadas[Math.floor((puntuacionesOrdenadas.length - 1) / 2)] + puntuacionesOrdenadas[Math.ceil((puntuacionesOrdenadas.length - 1) / 2)]) / 2;

    if(mostrarEnConsola){
      console.log("Puntuación máxima: " + puntuacionMaxima);
      console.log(this.mostrarDistribucion(listaDistribuciones[posicionPuntuacionMaxima]));

      console.log("Puntuación mediana: " + puntuacionMediana + " (" + puntuacionMedianaReal + ")");
      console.log(this.mostrarDistribucion(listaDistribuciones[posicionPuntuacionMediana]));

      console.log("Puntuación mínima: " + puntuacionMinima);
      console.log(this.mostrarDistribucion(listaDistribuciones[posicionPuntuacionMinima]));
    }

    return([[listaDistribuciones[posicionPuntuacionMaxima], puntuacionMaxima], [listaDistribuciones[posicionPuntuacionMediana], puntuacionMediana, puntuacionMedianaReal], [listaDistribuciones[posicionPuntuacionMinima], puntuacionMinima]])
  }

  avanzarGeneraciones(numero) {
    //let listaDistribuciones = Distribuciones.copiar(this.distribuciones);

    if (typeof (numero) == "undefined") {
      numero = 100;
    }

    for (let i = 0; i < numero; i++) {
      this.nuevaGeneracion();
    }

    this.informacionDeControl(true);
  }
}