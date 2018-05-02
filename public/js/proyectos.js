var idProyectoSeleccionado;
var idTestSeleccionado;
var jsonEstaditicas;
var jsonEstaditicasPrueba;
var jsonMutantes;
var currentNombreProyecto;
var currentNombreTest;

/*
  ACTUALIZAR VISTA
*/
function rellenarProyectos(json) {
  // Limpiamos la tabla de los posibles resultados anteriores.
  $('#tbl-proyecto > tbody').empty();

  // Rellenamos la tabla con la informacion de los proyectos.
  json.forEach(function(proyecto) {
    var nombreProyecto = "'" + proyecto.name+ "'";
    $('#tbl-proyecto > tbody:last-child').append(
      '<tr data-toggle="modal" data-target="#myModal" onClick="">' +
        '<td>' + proyecto.idProyecto +'</td>' +
        '<td>' + proyecto.name +'</td>' +
        '<td>' + proyecto.numTest +'</td>' +
        '<td>' + proyecto.totalTime +'</td>' +
        '<td>' + proyecto.numMutants +'</td>' +
        '<td>' + proyecto.avg_killed +'</td>' +
        '<td>' + proyecto.avg_percent +'</td>' +
        '<td align="right"> <form name="verTestsProyecto" action="javascript:verTestsProyecto(' + proyecto.idProyecto + ', ' + nombreProyecto + ');" > <input id="verTestsProyecto"  class="btn btn-primary btn-success" type="submit" value="Tests" /> </form> </td>' +
        '<td align="right"> <form name="verMutantesKilledProyecto" action="javascript:verMutantesKilledProyecto(' + proyecto.idProyecto + ', ' + nombreProyecto + ');" > <input id="verMutantesKilledProyecto"  class="btn btn-primary btn-success" type="submit" value="Killed mutants" /> </form> </td>' +
        '<td align="right"> <form name="verEstadisticas" action="javascript:verEstadisticas(' + proyecto.idProyecto + ', ' + nombreProyecto + ');" > <input id="verEstadisticas"  class="btn btn-primary btn-success" type="submit" value="Estadísticas" /> </form> </td>' +
      '</tr>'
    );
  });
}

function rellenarTests(json) {
  // Limpiamos la tabla de los posibles resultados anteriores.
  $('#tbl-tests > tbody').empty();

  // Rellenamos la tabla con la informacion de los proyectos.
  json.forEach(function(test) {
    var nombreTest = "'" + test.nombreTest+ "'";
    $('#tbl-tests > tbody:last-child').append(
      '<tr data-toggle="modal" data-target="#myModal" onClick="">' +
        '<td>' + test.id +'</td>' +
        '<td>' + test.nombreTest +'</td>' +
        '<td>' + test.killed +'</td>' +
        '<td>' + test.time +'</td>' +
        '<td>' + test.percent +'</td>' +
        '<td align="right"> <form name="verMutantesKilledTest" action="javascript:verMutantesKilledTest(' + test.id + ', ' + nombreTest + ');" > <input id="verMutantesKilledTest"  class="btn btn-primary btn-success" type="submit" value="Killed mutants" /> </form> </td>' +
      '</tr>'
    );
  });
}

function verTestsProyecto(idProyecto, nombreProyecto) {
  //listaEstadisticas = [];
  idProyectoSeleccionado = idProyecto;
  currentNombreProyecto = nombreProyecto;

  $('.container > div').addClass('hidden');
  $('#listado-tests').removeClass('hidden');
  $.when(getTestProyecto(idProyectoSeleccionado)).done(function(tests) {
    rellenarTests(tests);
  });
}

function verMutantesKilledProyecto(idProyecto, nombreProyecto) {
  //listaEstadisticas = [];
  idProyectoSeleccionado = idProyecto;
  currentNombreProyecto = nombreProyecto;
  $.when(obtenerSumMutantesKilledPorIdProyecto(idProyectoSeleccionado)).done(function(mutantes) {

    jsonMutantes = mutantes;
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChartMutante);

    $('.container > div').addClass('hidden');
    $('#chart').removeClass('hidden');
  });
}

function verMutantesKilledTest(idTest, nombreTest) {
  //listaEstadisticas = [];
  idTestSeleccionado = idTest;
  currentNombreTest = nombreTest;
  $.when(obtenerSumMutantesKilledPorIdTest(idTestSeleccionado)).done(function(mutantes) {

    jsonMutantes = mutantes;
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChartTest);

    $('.container > div').addClass('hidden');
    $('#chart').removeClass('hidden');
  });
}

function verEstadisticas(idProyecto, nombreProyecto) {
  //listaEstadisticas = [];
  idProyectoSeleccionado = idProyecto;
  currentNombreProyecto = nombreProyecto;
  $.when(obtenerEstadisticasPorIdProyecto(idProyectoSeleccionado)).done(function(estadisticas) {

    jsonEstaditicas = estadisticas;
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    $('.container > div').addClass('hidden');
    $('#chart').removeClass('hidden');
  });
}

function verEstadisticasPorPrueba(nombrePrueba) {
  //listaEstadisticas = [];
  $.when(obtenerEstadisticasPorPrueba(nombrePrueba)).done(function(estadisticas) {
    jsonEstaditicasPrueba = estadisticas;
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChartPrueba);

    $('.container > div').addClass('hidden');
    $('#chart').removeClass('hidden');
  });
}

function drawChart() {
  // Create our data table out of JSON data loaded from server.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Nombre test');
  data.addColumn('number', 'killed');
  data.addColumn('number', 'Time');
  data.addColumn('number', 'Distingising rate');
  //data.addColumn('string', 'nombre clase test');

  $.each(jsonEstaditicas, function(i,jsonData)
  {
    var value=jsonData.killed;
    var time=jsonData.time;
    var percent=jsonData.percent;
    var name=jsonData.nombreTest;

    //var nameTest=jsonData.nombreTest;
    data.addRows([ [name, value, time, percent]]);
  });

  var options = {
    title: 'Estadisticas del proyecto ' + currentNombreProyecto,
    //function: 'linear',
    pointSize: 16
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart'));
  google.visualization.events.addListener(chart, 'ready', function() {  });

  chart.draw(data, options);
  /*
  chart=new google.visualization.ColumnChart(document.getElementById('chart'));
  chart=new google.visualization.PieChart(document.getElementById('chart'));
  chart=new google.visualization.BarChart(document.getElementById('chart'));
  chart=new google.visualization.GeoChart(document.getElementById('chart'));
  */
}

function drawChartMutante() {
  // Create our data table out of JSON data loaded from server.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'mutante');
  data.addColumn('number', 'killed');
  //data.addColumn('string', 'nombre clase test');
  $.each(jsonMutantes, function(i,jsonData)
  {
    var value=jsonData.killed;
    var name=jsonData.mutante;

    //var nameTest=jsonData.nombreTest;
    data.addRows([ [name, value]]);
  });

  var options = {
    title: 'Mutantes killed del proyecto ' + currentNombreProyecto,
    //function: 'linear',
    pointSize: 16
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart'));
  //var chart = new google.visualization.BarChart(document.getElementById('chart'));

  google.visualization.events.addListener(chart, 'ready', function() {  });

  chart.draw(data, options);
  /*
  chart=new google.visualization.ColumnChart(document.getElementById('chart'));
  chart=new google.visualization.PieChart(document.getElementById('chart'));
  chart=new google.visualization.BarChart(document.getElementById('chart'));
  chart=new google.visualization.GeoChart(document.getElementById('chart'));
  */
}

function drawChartTest() {
  // Create our data table out of JSON data loaded from server.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'mutante');
  data.addColumn('number', 'killed');
  //data.addColumn('string', 'nombre clase test');
  $.each(jsonMutantes, function(i,jsonData)
  {
    var value=jsonData.killed;
    var name=jsonData.mutante;

    //var nameTest=jsonData.nombreTest;
    data.addRows([ [name, value]]);
  });

  var options = {
    title: 'Mutantes killed del test ' + currentNombreTest,
    //function: 'linear',
    pointSize: 16
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart'));
  //var chart=new google.visualization.BarChart(document.getElementById('chart'));
  google.visualization.events.addListener(chart, 'ready', function() {  });

  chart.draw(data, options);
  /*
  chart=new google.visualization.ColumnChart(document.getElementById('chart'));
  chart=new google.visualization.PieChart(document.getElementById('chart'));
  chart=new google.visualization.BarChart(document.getElementById('chart'));
  chart=new google.visualization.GeoChart(document.getElementById('chart'));
  */
}

function drawChartPrueba() {
  // Create our data table out of JSON data loaded from server.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'mutante');
  data.addColumn('number', 'killed');
  data.addColumn('number', 'mutante');
  data.addColumn('number', 'time');

  $.each(jsonEstaditicasPrueba, function(i,jsonData)
  {
    var time=jsonData.time;
    var mutante=jsonData.numMutants;
    var value=jsonData.killed;
    var name=jsonData.name;

    //var nameTest=jsonData.nombreTest;
    data.addRows([ [name, value, mutante, time]]);
  });

  var options = {
    title: 'Mutantes killed del test ' + currentNombreTest,
    //function: 'linear',
    pointSize: 16
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart'));
  //var chart=new google.visualization.BarChart(document.getElementById('chart'));
  google.visualization.events.addListener(chart, 'ready', function() {  });

  chart.draw(data, options);
  /*
  chart=new google.visualization.ColumnChart(document.getElementById('chart'));
  chart=new google.visualization.PieChart(document.getElementById('chart'));
  chart=new google.visualization.BarChart(document.getElementById('chart'));
  chart=new google.visualization.GeoChart(document.getElementById('chart'));
  */
}
/*
  FUNCIONES AUXILIARES
*/
var i = 1;
var tamPrueba = 20;
var posParam = 3;
var parametroCont = [1,1,1,10,1,1,1,1];
var listaNombrePrueba = [ "Input[1-20]ALLMutants_NumAnidacionesIf",
                          "Input[1-20]ALLMutants_NumAnidacionesWhile",
                          "Input[1-20]ALLMutants_NumIteracionesWhile",
                          "Input[1-20]ALLMutants_NumAnidacionesFor",
                          "Input[1-20]ALLMutants_NumIteracionesFor",
                          "Input[1-20]ALLMutants_NumCondicionesLogicas",
                          "Input[1-20]ALLMutants_NumExpresionesLogicas",
                          "Input[1-20]ALLMutants_NumExpresionesAritmeticas"];

function generadorDeProgramasAutomatico() {
  if (parametroCont[posParam] === tamPrueba) {
    parametroCont[posParam] = 1;
    posParam++;
    if (posParam == 8) {
      return;
    }
    parametroCont[posParam] = 0;
  }

  parametroCont[posParam] = parametroCont[posParam] + 1;
  var nombreProyecto = listaNombrePrueba[posParam]+ "_"+parametroCont[posParam];
  console.log(nombreProyecto);
  var datosPrograma = {
    numeroAnidacionesIf: parametroCont[0],
    numeroAnidacionesWhile: parametroCont[1],
    numeroIteracionesWhile: parametroCont[2],
    numeroAnidacionesFor: parametroCont[3],
    numeroIteracionesFor: parametroCont[4],
    numeroCondicionesLogicas: parametroCont[5],
    numeroExpresionesLogicas: parametroCont[6],
    numeroExpresionesAritmeticas: parametroCont[7],
    listaInputsComprobacion: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,"
  }

  $.when(generarPrograma(datosPrograma, nombreProyecto)).done(function() {
    i++;
    generadorDeProgramasAutomatico();
  });
}

/*
  OBTENER DATOS
*/

function generarPrograma(datosPrograma, nombreProyecto) {
  return   $.ajax({
      type: "POST",
      url: SERVER + 'generarPrograma/'+nombreProyecto,
      contentType: 'application/json',
      data: JSON.stringify(datosPrograma),
      error: function(xhr, status) { alert('Oooops, hubo un error...'); },
      success: function(xhr, status) { console.log("<--- terminado")}
    });
}

function getProyectos() {
  return $.ajax({
    url: SERVER + 'proyectos/',
    type: "GET",
    dataType: 'json',
    error: function (xhr, status) { alert('Oooops, hubo un error...'); },
    complete: function(xhr, status) {}
  });
}

function getTestProyecto(idProyecto) {
  return $.ajax({
    url: SERVER + "proyectos/getTests/" + idProyecto,
    type: "GET",
    dataType: 'json',
    error: function (xhr, status) { alert('Oooops, hubo un error...'); },
    complete: function(xhr, status) {}
  });
}

function obtenerEstadisticasPorIdProyecto(idProyecto) {
  return $.ajax({
    url: SERVER + "proyectos/getEstadisticas/" + idProyecto,
    type: "GET",
    dataType: 'json',
    error: function (xhr, status) { alert('Oooops, hubo un error...'); },
    complete: function(xhr, status) {}
  });
}

function obtenerEstadisticasPorPrueba(nombrePrueba) {
  return $.ajax({
    url: SERVER + "proyectos/getResultadosPrueba/" + nombrePrueba,
    type: "GET",
    dataType: 'json',
    error: function (xhr, status) { alert('Oooops, hubo un error...'); },
    complete: function(xhr, status) {}
  });
}

function obtenerSumMutantesKilledPorIdProyecto(idProyecto) {
  return $.ajax({
    url: SERVER + "proyectos/getSumMutantesKilled/" + idProyecto,
    type: "GET",
    dataType: 'json',
    error: function (xhr, status) { alert('Oooops, hubo un error...'); },
    complete: function(xhr, status) {}
  });
}

function obtenerSumMutantesKilledPorIdTest(idTest) {
  return $.ajax({
    url: SERVER + "proyectos/getSumMutantesKilledPorTest/" + idTest,
    type: "GET",
    dataType: 'json',
    error: function (xhr, status) { alert('Oooops, hubo un error...'); },
    complete: function(xhr, status) {}
  });
}
