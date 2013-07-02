
var life = function(){
    var cellsx = 10;
    var cellsy = 10;
    var cellSize = 50;
    var canvas;
    var context;
    var prev = [];
    var fillCell = '#000';
    var emptyCell = '#CCC';
    var interval;

    //Pintamos el tablero
    this.board = function(){
        var preview = [];

        //Borramos el tablero si existe
        if(document.getElementById('canvas') !=  null){    
            var cnv = document.getElementById('canvas');
            document.body.removeChild(cnv);
        }

        //Creamos el tablero
        canvas = document.createElement('canvas');
        canvas.id = "canvas";
        canvas.width = cellsx * cellSize;
        canvas.height = cellsy * cellSize;

        document.body.appendChild(canvas);

        context = canvas.getContext('2d');
        context.strokeStyle = '#CCC';

        for (var x = 0; x < cellsx; x++){
            preview[x] = [];
            for (var y = 0; y < cellsy; y++){
                preview[x][y] = false;
                context.strokeRect(x*cellSize, y * cellSize, cellSize, cellSize);
            }
        }                

        prev = preview;

        //Agregamos un evento al hacer click sobre el canvas
        canvas.addEventListener('click', this.fill, false);
    }

    //Pintamos la celda al hacer click
    this.fill = function(e){
        var cell = getCursorPosition(e);
        var x,y = 0;

        x = Math.floor(cell.x / cellSize);
        y = Math.floor(cell.y / cellSize);

        prev[x][y] = (prev[x][y])? false : true;

        //Dibujamos la celda
        drawCell(x,y,prev[x][y])
    }

    //Obtenemos la posición de x,y al hacer click
    var getCursorPosition = function(e){
        var x;
        var y;
        if (e.pageX != undefined && e.pageY != undefined) {
            x = e.pageX;
            y = e.pageY;
        }
        else {
            x = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }

        x = x - canvas.offsetLeft;
        y = y - canvas.offsetTop;

        var cell = {
            'x': x,
            'y': y
        }

        return cell;
    }

    //Calculamos la siguiente generación
    var nextGeneration = function(){
        var count = 0;
        var next = [];
        for(var x = 0; x < cellsx; x++){
            next[x] = [];
            for(var y = 0; y < cellsy; y++){
                //Obtenemos el numero de celdas vecinas
                count = countNeighbours(x,y);
                //console.log('('+x+','+y+') = ',count);

                //Reglas del Juego de la Vida
                if(prev[x][y]){
                    if(count < 2 || count > 3){
                        next[x][y] = false;
                    } else {
                        next[x][y] = true;
                    }
                } else {
                    if(count == 3){
                        next[x][y] = true;
                    } else {
                        next[x][y] = false;
                    }
                }
                //console.log('('+x+','+y+') = '+count+' bool: '+next[x][y]+' count: ',count);

                //Dibujamos la celda
                drawCell(x,y,next[x][y]);
            }

        }

        prev = next;
    }

    // CountNeighbours cuenta el numero de celdas vecinas
    var countNeighbours = function(x,y){
        var count = 0;

        //Obtenemos las celdas vecinas
        var neighbours = [
            prev[x][(y - 1 + cellsy) % cellsy],
            prev[(x + 1 + cellsx) % cellsx][(y - 1 + cellsy) % cellsy],
            prev[(x + 1 + cellsx) % cellsx][y],
            prev[(x + 1 + cellsx) % cellsx][(y + 1 + cellsy) % cellsy],
            prev[x][(y + 1 + cellsy) % cellsy],
            prev[(x - 1 + cellsx) % cellsx][(y + 1 + cellsy) % cellsy],
            prev[(x - 1 + cellsx) % cellsx][y],
            prev[(x - 1 + cellsx) % cellsx][(y - 1 + cellsy) % cellsy],
        ];

        //var r = (y - 1 + cellsy) % cellsy;
        //console.log('('+y+'- 1 +'+cellsy+') %'+cellsy+' = ',r);

        for(var i=0; i < neighbours.length; i++){

            if(neighbours[i]){
                count++;
            }
        }

       //console.log('('+x+','+y+') = '+count);

       return count;
    }

    //Dibujamos la celda con las coordenadas x,y
    var drawCell = function(x,y,active){
        if(active == false){
            context.clearRect(x * cellSize, y * cellSize, cellSize, cellSize);
            context.strokeStyle = emptyCell;
            context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        } else {
            context.fillStyle = fillCell;
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    //Iniciamos la simulación 
    this.start = function(){
        interval = setInterval(nextGeneration,500);
    }

    //Paramos la simulación
    this.stop = function(){
        clearInterval(interval);
    }

    //Enviamos x
    this.setx = function(x){
        cellsx = parseInt(x);
    }

    //Enviamos y
    this.sety = function(y){
        cellsy = parseInt(y);
    }
}