
  // A2 modificamos lista de inputs con valores aleatorios
  // A3 pares de pruebas lista de decision_input(1) inputs con valores aleatorios
  // A5 Increment iter For mutant CONDITIONALS_BOUNDARY
  // A7 Increment iter For mutant MATH
  // A8 Increment iter For mutant INCREMENTS
  // A9 Increment iter For mutant INCREMENTS profFin 10
  // B1 combinacion de pares con profFin = 500 mutantes 0 1 2 3 -> generadorPrograma no genera Programa
  // B2 combinacion de pares con profFin = 200 mutantes 0 1 2 3 -> generadorPrograma no genera Programa

  // F1 F1_0123_
  // M_0  listaDecision = 1
  // M_1  listaDecision = 1
  // M_2  listaDecision = 1
  // M_3  listaDecision = 1
/*
  "INCREMENTS"                    # 0
  "MATH"                          # 1
  "CONDITIONALS_BOUNDARY"         # 2
  "NEGATE_CONDITIONALS"           # 3
  "INVERT_NEGS"                   # 4
  "RETURN_VALS"                   # 5
  "VOID_METHOD_CALLS"             # 6
  "CONSTRUCTOR_CALLS"             # 7
  "INLINE_CONSTS"                 # 8
  "NON_VOID_METHOD_CALLS"         # 9
  "REMOVE_CONDITIONALS"           # 10
  "EXPERIMENTAL_MEMBER_VARIABLE"  # 11
  "EXPERIMENTAL_SWITCH")          # 12
  */
  var prefijo = "2Tutoria_"
  var listaMutantes = "0 1 2"
  var tamPrueba = 10;
  var contPrueba = 0;
  var parametroCont =   [3,1,1,1,1,1,1,1,1,1,1];
  var parametroIncremento =  [1,1,1,1,1,1,1,1,1,1,1];
  var parametroTam =        [5,5,5,5,5,5,5,5,5,5,5];
  var listaPruebas = [[0]]; // Aqui meter los casos
  var contListaPruebas = 0
  var pruebaAEjecutar = listaPruebas[contListaPruebas];
  var listaNombrePrueba = [ "DesicionInput_",    // 0
                            "AnidWhile_", // 1
                            "IterWhile_", // 2
                            "AnidFor_",   // 3
                            "IterFor_",   // 4
                            "CondLog_",   // 5
                            "ExprLog_",   // 6
                            "ExprArit_",  // 7
                            "ExprsSeg_",  // 8
                            "NumFun_",    // 9
                            "SizeTests"   // 10
                          ];
  function generadorDeProgramasAutomaticoListasPruebasV8() {
      if (contPrueba === tamPrueba) {
        if (contListaPruebas === listaPruebas.length ){
          return;
        } else {
          contListaPruebas++;
          pruebaAEjecutar=listaPruebas[contListaPruebas];
          parametroCont = [1,1,1,1,1,1,1,1,1,1,1];
          contPrueba = 0;
          console.log(pruebaAEjecutar);
          if (pruebaAEjecutar === undefined) {
            return;
          }
        }
      }else {
        contPrueba++;
      }

    var nombreProyecto = "";
    for (var i = 0; i < pruebaAEjecutar.length; i++) {
      parametroCont[pruebaAEjecutar[i]] += parametroIncremento[pruebaAEjecutar[i]];
    }
    for (var i = 0; i < pruebaAEjecutar.length; i++) {
      nombreProyecto += listaNombrePrueba[pruebaAEjecutar[i]]+ "_";
    }


    var datosPrograma = {
      numeroAnidacionesIf: parametroCont[1],
      numeroAnidacionesWhile: parametroCont[1],
      numeroIteracionesWhile: parametroCont[2],
      numeroAnidacionesFor: parametroCont[3],
      numeroIteracionesFor: parametroCont[4],
      numeroCondicionesLogicas: parametroCont[5],
      numeroExpresionesLogicas: parametroCont[6],
      numeroExpresionesAritmeticas: parametroCont[7],
      numeroExpresionesSeguidas: parametroCont[8],
      listaInputsComprobacion: getListaInputs(-100,100, 201),  // para (-5,5) -> devuelve -5,-4,-3,-2,-1,0,1,2,3,4,5,
      numeroFuncion: parametroCont[9],
      decicionInputs: getListaDecision(parametroCont[0]), //  Para (3) -> Devuelve 0,0,0,
      size_tests: parametroCont[10],
      listaMutantes: listaMutantes
    }

    nombreProyecto = prefijo + nombreProyecto + "("
    +datosPrograma.numeroAnidacionesIf + ", "
    +datosPrograma.numeroAnidacionesWhile + ", "
    +datosPrograma.numeroIteracionesWhile + ", "
    +datosPrograma.numeroAnidacionesFor + ", "
    +datosPrograma.numeroIteracionesFor + ", "
    +datosPrograma.numeroCondicionesLogicas + ", "
    +datosPrograma.numeroExpresionesLogicas + ", "
    +datosPrograma.numeroExpresionesAritmeticas + ", "
    +datosPrograma.numeroExpresionesSeguidas + ", "
    +datosPrograma.numeroFuncion + ", "
    +datosPrograma.size_tests + " "
    +")";
    console.log(nombreProyecto);
    $.when(generarPrograma(datosPrograma, nombreProyecto)).done(function() {
      generadorDeProgramasAutomaticoListasPruebasV8();
    });
  }
