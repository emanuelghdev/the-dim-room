
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'
import { FirstPersonControls } from '../libs/FirstPersonControls.js'

// Clases de mi proyecto

import { MyPuerta } from './MyPuerta.js'
import { MyMarcoPuerta } from './MyMarcoPuerta.js'
import { MyEscritorio } from './MyEscritorio.js'
import { MyMesa } from './MyMesa.js'
import { MyArmario } from './MyArmario.js'
import { MyLuzEmergencia } from './MyLuzEmergencia.js'
import { MyCajaHerramientas } from './MyCajaHerramientas.js'
import { MyCajaHerramientasBajo } from './MyCajaHerramientasBajo.js'
import { MyLlaveInglesa } from './MyLlaveInglesa.js'
import { MyOrdenador } from './MyOrdenador.js'
import { MyOrdenadorEncendido } from './MyOrdenadorEncendido.js'
import { MyCajaFuerte } from './MyCajaFuerte.js'
import { MyCajaFuertePuerta } from './MyCajaFuertePuerta.js'
import { MyLlaveSeguridad } from './MyLlaveSeguridad.js'
import { MyTaza} from './MyTaza.js'
import { MyPapeles } from './MyPapeles.js'
import { MyRollos } from './MyRollos.js'
import { MyLibro } from './MyLibro.js'
import { MyLibros } from './MyLibros.js'
import { MyVela } from './MyVela.js'
import { MyVelas } from './MyVelas.js'
import { MyPapelera } from './MyPapelera.js'
import { MyCajaElectrica } from './MyCajaElectrica.js'
import { MyVentilador } from './MyVentilador.js'
import { MyCajaFusibles } from './MyCajaFusibles.js'

 
/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI ();
    
    this.initStats();

    // Iniciamos todas las variables
    this.initVariables();
    
    // Construimos los distinos elementos que tendremos en la escena
    
    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera ();
    
    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights ();

    // Creamos un objeto que albergue la vista de todas las colisiones
    this.cajasVisibles = new THREE.Object3D();
    this.cajasVisibles.visible = false;
    this.add(this.cajasVisibles);
    
    // Un suelo 
    this.createParedes ();
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    // Ponemos su visibilidad a false, puesto que solo nos interesan en el modo desarrollador
    this.axis = new THREE.AxesHelper (200);
    this.axis.visible = false;
    this.add (this.axis);

    // Inicializamos la música y cargamos todos los audios a usar en la escena
    this.initMusica();

    // Por último creamos los modelos.
    // Los modelos puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a 
    // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.

    // Añadimos la puerta que hemos exportado de un .obj
    this.puerta = new MyPuerta(null, "");

    // La movemos para que la parte que tiene que rotar quede justo en el eje Y
    // y lo añadimos a otro objeto, de forma que al rotar el objeto roto sobre este punto
    this.puerta.position.y = -0.5;
    this.puerta.position.x = 3.75;

    this.puertaNodo = new THREE.Object3D();
    this.puertaNodo.add(this.puerta);
    
    // Ahora ya podemos posicionarla correctamente y la añadimos a la escena
    this.puertaNodo.scale.x = 14;     // Multiplicamos por 17 para conseguir unos 200 cm de altura y 82 cm de ancho
    this.puertaNodo.scale.y = 17;
    this.puertaNodo.scale.z = 17;
    this.puertaNodo.position.x -= 197;
    this.puertaNodo.position.z += 300;
    this.puertaNodo.position.y -= 9;

    // Para que las colisiones se vean
    var cajaVisiblePuerta = new THREE.Box3Helper(this.puerta.cajaEnglobante, 0xCF0000)
    this.cajasVisibles.add(cajaVisiblePuerta);

    this.add (this.puertaNodo);


    // Añadimos el marco de la puerta que hemos exportado de un .obj
    this.marcoPuerta = new MyMarcoPuerta(null, "");
    
    // Lo posicionamos correctamente y lo añadimos a la escena
    this.marcoPuerta.scale.x = 14;     // Multiplicamos por 17 para conseguir unos 200 cm de altura y 82 cm de ancho
    this.marcoPuerta.scale.y = 17;
    this.marcoPuerta.scale.z = 17;
    this.marcoPuerta.position.x -= 144.5;
    this.marcoPuerta.position.z += 300;
    this.marcoPuerta.position.y -= 17.5;

    // Para que las colisiones se vean
    var cajaVisibleMarcoPuerta = new THREE.Box3Helper(this.marcoPuerta.cajaEnglobante, 0xCF0000)
    this.cajasVisibles.add(cajaVisibleMarcoPuerta);

    this.add (this.marcoPuerta);


    // Añadimos el escritorio que hemos exportado de un .obj
    this.escritorio = new MyEscritorio(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.escritorio.scale.x = 120;     // Multiplicamos por 120 para conseguir unos 120 cm de altura
    this.escritorio.scale.y = 120;
    this.escritorio.scale.z = 120;
    this.escritorio.position.x -= 185;
    this.escritorio.position.z -= 245;

    // Para que las colisiones se vean
    var cajaVisibleEscritorio = new THREE.Box3Helper(this.escritorio.cajaEnglobante, 0xCF0000)
    this.cajasVisibles.add(cajaVisibleEscritorio);

    this.add (this.escritorio);


    // Añadimos el escritorio que hemos exportado de un .obj
    this.mesa = new MyMesa(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.mesa.scale.x = 120;     // Multiplicamos por 120 para conseguir unos 120 cm de altura
    this.mesa.scale.y = 120;
    this.mesa.scale.z = 120;
    this.mesa.rotateY(Math.PI/2);
    this.mesa.position.x -= 235;
    this.mesa.position.z -= 170;

    // Para que las colisiones se vean
    var cajaVisibleMesa = new THREE.Box3Helper(this.mesa.cajaEnglobante, 0xCF0000)
    this.cajasVisibles.add(cajaVisibleMesa);

    this.add (this.mesa);


    // Añadimos el armario que hemos creado en MyArmario.js
    this.armarioDerecha = new MyArmario(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.armarioDerecha.scale.x = 9;     // Multiplicamos por 9 y 12 para conseguir unos 90 cm de ancho y unos 120 cm de altura
    this.armarioDerecha.scale.y = 12;
    this.armarioDerecha.scale.z = 6;
    this.armarioDerecha.rotateY(-Math.PI/2);
    this.armarioDerecha.position.x += 295;
    this.armarioDerecha.position.z += 80;

    // Para que las colisiones se vean
    var cajaVisibleArmarioDcha = new THREE.Box3Helper(this.armarioDerecha.cajaEnglobante, 0xCF0000)
    this.cajasVisibles.add(cajaVisibleArmarioDcha);

    this.add (this.armarioDerecha);


    // Añadimos el armario que hemos creado en MyArmario.js
    this.armarioIzquierda = new MyArmario(null, "");

    // Quitamos la puerta de la izquierda
    this.armarioIzquierda.children[2].removeFromParent();

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.armarioIzquierda.scale.x = 9;     // Multiplicamos por 9 y 12 para conseguir unos 90 cm de ancho y unos 120 cm de altura
    this.armarioIzquierda.scale.y = 12;
    this.armarioIzquierda.scale.z = 6;
    this.armarioIzquierda.rotateY(Math.PI/2);
    this.armarioIzquierda.position.x -= 290;
    this.armarioIzquierda.position.z += 180;

    // Para que las colisiones se vean
    var cajaVisibleArmarioIzq = new THREE.Box3Helper(this.armarioIzquierda.cajaEnglobante, 0xCF0000)
    this.cajasVisibles.add(cajaVisibleArmarioIzq);

    this.add (this.armarioIzquierda);


    // Añadimos la luz de emergencia que hemos creado
    this.luzEmergencia = new MyLuzEmergencia(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.luzEmergencia.scale.x = 1.2;
    this.luzEmergencia.scale.y = 1.2;
    this.luzEmergencia.scale.z = 1.2;
    this.luzEmergencia.rotateX(-Math.PI/2);
    this.luzEmergencia.position.x -= 148;
    this.luzEmergencia.position.y += 230;
    this.luzEmergencia.position.z += 295;

    this.add (this.luzEmergencia);


    // Añadimos la caja de herramientas que hemos exportado de un .obj
    this.cajaHerr = new MyCajaHerramientas(null, "");

    // La movemos para que la parte que tiene que rotar quede justo en el eje Z
    // y lo añadimos a otro objeto, de forma que al rotar el objeto roto sobre este punto
    this.cajaHerr.position.x += 135;
    this.cajaHerr.position.y -= 40;

    this.puertaCajaHerr = new THREE.Object3D();
    this.puertaCajaHerr.add(this.cajaHerr);

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.puertaCajaHerr.scale.x = 0.5;     // Multiplicamos por 0.5 para que tenga unos 5o cm de ancho
    this.puertaCajaHerr.scale.y = 0.5;
    this.puertaCajaHerr.scale.z = 0.8;
    this.puertaCajaHerr.rotateY(Math.PI);
    this.puertaCajaHerr.position.x += 283.5;
    this.puertaCajaHerr.position.y += 45;
    this.puertaCajaHerr.position.z += 80;

    this.add (this.puertaCajaHerr);


    // Añadimos la parte de abajo de la caja de herramientas que hemos exportado de un .obj
    this.cajaHerrBajo = new MyCajaHerramientasBajo(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.cajaHerrBajo.scale.x = 0.5;     // Multiplicamos por 0.5 para que tenga unos 50 cm de ancho
    this.cajaHerrBajo.scale.y = 0.5;
    this.cajaHerrBajo.scale.z = 0.8;
    this.cajaHerrBajo.rotateY(Math.PI);
    this.cajaHerrBajo.position.x += 216;
    this.cajaHerrBajo.position.y += 25;
    this.cajaHerrBajo.position.z += 80;

    this.add (this.cajaHerrBajo);


    // Añadimos la parte de abajo de la caja de herramientas que hemos exportado de un .obj
    this.llaveInglesa = new MyLlaveInglesa(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.llaveInglesa.scale.x = 0.78;     // Multiplicamos por 0.8 para que quepa en la caja de herramienta
    this.llaveInglesa.scale.y = 0.8;
    this.llaveInglesa.scale.z = 0.8;
    this.llaveInglesa.rotateY(Math.PI/2);
    this.llaveInglesa.position.x += 260;
    this.llaveInglesa.position.y += 35;
    this.llaveInglesa.position.z += 77;

    this.add (this.llaveInglesa);


    // Añadimos el ordenador que hemos importado de un .obj
    this.ordenador = new MyOrdenador(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.ordenador.position.x += 200;
    this.ordenador.position.y += 57;
    this.ordenador.position.z -= 260;

    this.add (this.ordenador);


    // Añadimos el ordenador encendido que hemos importado de un .obj
    this.ordenadorEncendido = new MyOrdenadorEncendido(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.ordenadorEncendido.position.x += 200;
    this.ordenadorEncendido.position.y += 57;
    this.ordenadorEncendido.position.z -= 260;

    // Lo volvemos invisible hasta que se cumplan las condiciones para que se encienda
    this.ordenadorEncendido.visible = false;

    this.add (this.ordenadorEncendido);


    // Añadimos la caja de herramientas que hemos exportado de un .obj
    this.parteCajaFuerte = new MyCajaFuertePuerta(null, "");

    // La movemos para que la parte que tiene que rotar quede justo en el eje Y
    // y lo añadimos a otro objeto, de forma que al rotar el objeto roto sobre este punto
    this.parteCajaFuerte.position.x -= 54;
    this.parteCajaFuerte.position.z += 47;
    this.parteCajaFuerte.rotateY(Math.PI/2);
    

    this.puertaCajaFuerte = new THREE.Object3D();
    this.puertaCajaFuerte.add(this.parteCajaFuerte);

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.puertaCajaFuerte.scale.x = 0.5;
    this.puertaCajaFuerte.scale.y = 0.5;
    this.puertaCajaFuerte.scale.z = 0.5;
    this.puertaCajaFuerte.position.x -= 223;
    this.puertaCajaFuerte.position.y += 91;
    this.puertaCajaFuerte.position.z -= 263.5;

    this.add (this.puertaCajaFuerte);


    // Añadimos el reproductor que hemos importado de un .obj
    this.cajaFuerte = new MyCajaFuerte(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.cajaFuerte.scale.x = 0.5;
    this.cajaFuerte.scale.y = 0.5;
    this.cajaFuerte.scale.z = 0.5;
    this.cajaFuerte.rotateY(Math.PI/2);
    this.cajaFuerte.position.x -= 250;
    this.cajaFuerte.position.y += 91;
    this.cajaFuerte.position.z -= 240;

    this.add (this.cajaFuerte);


    // Añadimos el reproductor que hemos importado de un .obj
    this.llaveSeguridad = new MyLlaveSeguridad(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.llaveSeguridad.scale.x = 0.2;
    this.llaveSeguridad.scale.y = 0.2;
    this.llaveSeguridad.scale.z = 0.2;
    this.llaveSeguridad.rotateY(Math.PI/1.8);
    this.llaveSeguridad.position.x -= 240;
    this.llaveSeguridad.position.y += 93;
    this.llaveSeguridad.position.z -= 240;

    this.add (this.llaveSeguridad);


    // Añadimos una taza del modelo que hemos creado
    this.taza1 = new MyTaza(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.taza1.position.x += 65;
    this.taza1.position.y += 96;
    this.taza1.position.z -= 270;

    this.add (this.taza1);


    // Añadimos una taza del modelo que hemos creado
    this.taza2 = new MyTaza(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.taza2.rotateY(Math.PI/1.5);
    this.taza2.position.x += 80;
    this.taza2.position.y += 96;
    this.taza2.position.z -= 260;

    this.add (this.taza2);


    // Añadimos una taza del modelo hemos creado
    this.taza3 = new MyTaza(null, "");

    // Lo posicionamos correctamente y lo añadimos a la escena
    this.taza3.rotateY(Math.PI/1.5);
    this.taza3.position.x -= 200;
    this.taza3.position.y += 97;
    this.taza3.position.z -= 170;

    this.add (this.taza3);


    // Añadimos los papeles que hemos creado
    this.papeles1 = new MyPapeles(null, "");

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.papeles1.scale.x = 8;
    this.papeles1.scale.y = 9;
    this.papeles1.scale.z = 8;
    this.papeles1.position.x += 63;
    this.papeles1.position.y += 20;
    this.papeles1.position.z -= 240;

    this.add (this.papeles1);


    // Añadimos los papeles que hemos creado
    this.papeles2 = new MyPapeles(null, "");

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.papeles2.scale.x = 8;
    this.papeles2.scale.y = 9;
    this.papeles2.scale.z = 8;
    this.papeles2.rotateY(Math.PI/2);
    this.papeles2.position.x += 255;
    this.papeles2.position.y += 81;
    this.papeles2.position.z -= 150;

    this.add (this.papeles2);


    // Añadimos los papeles que hemos creado
    this.papeles3 = new MyPapeles(null, "");

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.papeles3.scale.x = 8;
    this.papeles3.scale.y = 9;
    this.papeles3.scale.z = 8;
    this.papeles3.rotateY(Math.PI/2);
    this.papeles3.position.x -= 220;
    this.papeles3.position.y += 68;
    this.papeles3.position.z -= 258;

    this.add (this.papeles3);


    // Añadimos los rollos de papel higienico que hemos creado
    this.rollos1 = new MyRollos(null, "");

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.rollos1.scale.x = 7;
    this.rollos1.scale.y = 7;
    this.rollos1.scale.z = 7;
    this.rollos1.rotateY(Math.PI/2);
    this.rollos1.position.x -= 245;
    this.rollos1.position.y += 25;
    this.rollos1.position.z += 140;

    this.add (this.rollos1);


    // Añadimos los rollos de papel higienico que hemos creado
    this.rollos2 = new MyRollos(null, "");

    this.rollos2.children[0].children[3].removeFromParent();    // Le quitamos uno de los rollos

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.rollos2.scale.x = 7;
    this.rollos2.scale.y = 7;
    this.rollos2.scale.z = 7;
    this.rollos2.rotateY(-Math.PI/2);
    this.rollos2.position.x += 252;
    this.rollos2.position.y += 122;
    this.rollos2.position.z += 140;

    this.add (this.rollos2);


    // Añadimos los rollos de papel higienico que hemos creado
    this.rollos3 = new MyRollos(null, "");

    this.rollos3.children[0].children[2].removeFromParent();    // Le quitamos uno de los rollos
    this.rollos3.children[0].children[1].removeFromParent();    // Le quitamos uno de los rollos

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.rollos3.scale.x = 7;
    this.rollos3.scale.y = 7;
    this.rollos3.scale.z = 7;
    this.rollos3.position.x += 245;
    this.rollos3.position.y += 18;
    this.rollos3.position.z -= 85;

    this.add (this.rollos3);


    // Añadimos los libros que hemos creado
    this.libros1 = new MyLibros(null, "", 0x804000, 0x008000, 0xC999AF, 0x00008B);    // Le pasamos los colores de los libros
                                                                                      // Marron, verde, rosa, azul
    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.libros1.scale.x = 8;
    this.libros1.scale.y = 8;
    this.libros1.scale.z = 8;
    this.libros1.rotateY(Math.PI/2);
    this.libros1.position.x -= 250;
    this.libros1.position.y += 91;
    this.libros1.position.z -= 160;

    this.add (this.libros1);

    // Añadimos los libros que hemos creado
    this.libros2 = new MyLibros(null, "", 0x494343, 0x804000, 0xFF9300, 0);   // Gris, marrón, mostaza

    this.libros2.children[3].removeFromParent();    // Le quitamos uno de los libros

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.libros2.scale.x = 8;
    this.libros2.scale.y = 8;
    this.libros2.scale.z = 8;
    this.libros2.rotateY(Math.PI/2);
    this.libros2.position.x -= 240;
    this.libros2.position.y += 20;
    this.libros2.position.z -= 260;

    this.add (this.libros2);


    // Añadimos un libro que hemos creado
    this.libro1 = new MyLibro(null, "", 0xC51D34);    // Le pasamos el color del libro, en este caso rojo pálido

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.libro1.scale.x = 8;
    this.libro1.scale.y = 8;
    this.libro1.scale.z = 8;
    this.libro1.rotateY(-Math.PI/2.5);
    this.libro1.position.x += 258;
    this.libro1.position.y += 50;
    this.libro1.position.z -= 90;

    this.add (this.libro1);


    // Añadimos un libro que hemos creado
    this.libro2 = new MyLibro(null, "", 0x44D1CD);    // Le pasamos el color del libro, en este caso azul celeste

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.libro2.scale.x = 8;
    this.libro2.scale.y = 8;
    this.libro2.scale.z = 8;
    this.libro2.rotateY(Math.PI/5);
    this.libro2.position.x += 115;
    this.libro2.position.y += 92;
    this.libro2.position.z -= 250;

    this.add (this.libro2);


    // Añadimos un libro que hemos creado
    this.libro3 = new MyLibro(null, "", 0x707C74);    // Le pasamos el color del libro, en este caso gris

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.libro3.scale.x = 8;
    this.libro3.scale.y = 8;
    this.libro3.scale.z = 8;
    this.libro3.rotateX(Math.PI/2);
    this.libro3.rotateZ(Math.PI);
    this.libro3.position.x -= 270;
    this.libro3.position.y += 140;
    this.libro3.position.z += 99;

    this.add (this.libro3);


    // Añadimos un libro que hemos creado
    this.libro4 = new MyLibro(null, "", 0x707C74);    // Le pasamos el color del libro, en este caso amarillo mostaza

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.libro4.scale.x = 8;
    this.libro4.scale.y = 8;
    this.libro4.scale.z = 8;
    this.libro4.rotateX(Math.PI/2);
    this.libro4.rotateZ(Math.PI);
    this.libro4.position.x -= 270;
    this.libro4.position.y += 140;
    this.libro4.position.z += 107;

    this.add (this.libro4);


    // Añadimos un libro que hemos creado
    this.libro5 = new MyLibro(null, "", 0x707C74);    // Le pasamos el color del libro, en este caso rojo

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.libro5.scale.x = 8;
    this.libro5.scale.y = 8;
    this.libro5.scale.z = 8;
    this.libro5.rotateY(-Math.PI/8);
    this.libro5.rotateZ(Math.PI);
    this.libro5.position.x -= 270;
    this.libro5.position.y += 130;
    this.libro5.position.z += 130;

    this.add (this.libro5);


    // Añadimos las velas que hemos creado
    this.velas1 = new MyVelas(null, "", 0x000000, 0x008000, 0xFFFF00, 0xDF02F1);    // Le pasamos los colores de las velas
                                                                                    // Negro, verde, amarillo, violeta

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.velas1.scale.x = 2;
    this.velas1.scale.y = 3;
    this.velas1.scale.z = 2;
    this.velas1.position.x -= 260;
    this.velas1.position.y += 122;
    this.velas1.position.z += 230;

    this.add (this.velas1);


    // Añadimos las velas que hemos creado
    this.velas2 = new MyVelas(null, "", 0xC6E2E9, 0xDAB894, 0xFFFF00, 0xFF0000);   // Azul celeste, marron, amarillo, rojo

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.velas2.scale.x = 2;
    this.velas2.scale.y = 2.2;
    this.velas2.scale.z = 2;
    this.velas2.position.x -= 200;
    this.velas2.position.y += 50;
    this.velas2.position.z -= 65;

    this.add (this.velas2);


    // Añadimos una vela que hemos creado
    this.vela1 = new MyVela(null, "", 0x014156);    // Le pasamos el color de la vela, en este caso azul oscuro

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.vela1.scale.x = 2;
    this.vela1.scale.y = 2.5;
    this.vela1.scale.z = 2;
    this.vela1.position.x += 280;
    this.vela1.position.y += 81;
    this.vela1.position.z -= 80;

    this.add (this.vela1);


    // Añadimos una vela que hemos creado
    this.vela2 = new MyVela(null, "", 0xF1FFC4);    // Le pasamos el color de la vela, en este caso azul oscuro

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.vela2.scale.x = 2;
    this.vela2.scale.y = 2.5;
    this.vela2.scale.z = 2;
    this.vela2.rotateY(Math.PI/1.8);
    this.vela2.rotateZ(Math.PI/2);
    this.vela2.position.x -= 190;
    this.vela2.position.y += 52;
    this.vela2.position.z -= 90;

    this.add (this.vela2);


    // Añadimos la papelera que hemos creado
    this.papelera = new MyPapelera(null, "");   

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.papelera.scale.x = 12;
    this.papelera.scale.y = 15;
    this.papelera.scale.z = 12;
    this.papelera.position.x += 10;
    this.papelera.position.z -= 250;

    // Para que las colisiones se vean
    var cajaVisiblePapelera = new THREE.Box3Helper(this.papelera.cajaEnglobante, 0xCF0000)
    this.cajasVisibles.add(cajaVisiblePapelera);

    this.add (this.papelera);


    // Añadimos la caja eléctrica que hemos creado
    this.cajaElectrica = new MyCajaElectrica(null, "");   

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.cajaElectrica.scale.x = 0.25;
    this.cajaElectrica.scale.y = 0.25;
    this.cajaElectrica.scale.z = 0.25;
    this.cajaElectrica.rotateX(Math.PI/2);
    this.cajaElectrica.rotateZ(Math.PI);
    this.cajaElectrica.position.x += 160;
    this.cajaElectrica.position.y += 120;
    this.cajaElectrica.position.z += 287.5;

    // Para que las colisiones se vean
    var cajaVisibleElectrica = new THREE.Box3Helper(this.cajaElectrica.cajaEnglobante, 0xCF0000)
    this.cajasVisibles.add(cajaVisibleElectrica);

    this.add (this.cajaElectrica);


    // Añadimos la caja eléctrica que hemos creado
    this.ventilador = new MyVentilador(null, "");   

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.ventilador.scale.x = 0.6;
    this.ventilador.scale.y = 0.6;
    this.ventilador.scale.z = 0.6;
    this.ventilador.rotateY(Math.PI/3);
    this.ventilador.position.x -= 200;
    this.ventilador.position.y += 66;
    this.ventilador.position.z -= 93;

    // Añadimos el sonido al ventilador
    this.ventilador.add(this.sonidoVentilador);

    this.add (this.ventilador);


    // Añadimos la caja eléctrica que hemos creado
    this.cajaFusibles = new MyCajaFusibles(null, "");   

    // Lo escalamos y lo posicionamos correctamente, luego lo añadimos a la escena
    this.cajaFusibles.scale.x = 1.2;
    this.cajaFusibles.scale.y = 1.2;
    this.cajaFusibles.scale.z = 1.4;
    this.cajaFusibles.rotateX(Math.PI/2);
    this.cajaFusibles.rotateZ(Math.PI);
    this.cajaFusibles.position.x -= 20;
    this.cajaFusibles.position.y += 160;
    this.cajaFusibles.position.z += 292;

    // Para que las colisiones se vean
    var cajaVisibleFusibles = new THREE.Box3Helper(this.cajaFusibles.cajaEnglobante, 0xCF0000)
    this.cajasVisibles.add(cajaVisibleFusibles);

    this.add (this.cajaFusibles);


    // Cuando están puestos ya todos los objetos de la escena, los añadimos a los candidatos a colisionar
    this.setCandidatosColisiones();
  }
  
  initStats() {
  
    var stats = new Stats();
    
    stats.setMode(0); // 0: fps, 1: ms
    
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    
    $("#Stats-output").append( stats.domElement );
    
    this.stats = stats;
  }

  initVariables() {
    // Modo desarrolador
    this.modoDesarrollador = false;

    // Modo juego terminado
    this.modoJuegoTerminado = false;

    // Intensidad de la luz ambiental
    this.ambientLightIntensidad = 0.1;

    // Variable para saber si un objeto está en movimiento y evitar que se solapen los movimientos de lso objetos
    this.enMovimiento = [0];

    // Creamos las variables necesarias para el picking
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    // Creamos también las variables necesarias para las colisiones
    this.posicion = new THREE.Vector3();
    this.direccion = new THREE.Vector3();
    this.figura = new THREE.Object3D();
    this.rayo = new THREE.Raycaster();

    this.candidatosColisiones = [];

    // Creamos los bool necesarios para abrir los cajones y las puertas de los armarios
    this.cajonesEscritorio = [false, false, false, false, false];
    this.cajonesMesa = [false, false, false, false, false, false];
    this.puertasArmarioDcha = [false, false];
    this.puertasArmarioIzq = [false, false];
    this.tapaCajaHerr = false;
    this.tapaCajaFuerte = false;

    // También necesitamos una variable para saber si hemos cogido la llave inglesa o la llave de seguridad
    this.poseerLlaveInglesa = [false];
    this.poseerLlaveSeguridad = [false];

    // Creamos también una variable para saber si la palanca está arriba o no
    this.palancaArriba = [true];

    // Creamos una variable para saber si ha sido reparada la electricidad
    this.luzReparada = [false];

    // Creamos los materiales para cambiar el color de los cristales de la caja eléctrica
    this.cristalRojo = new THREE.MeshPhongMaterial ({color: 0xFF0000, transparent: true, opacity: 0.8});
    this.cristalVerde = new THREE.MeshPhongMaterial ({color: 0x008000, transparent: true, opacity: 0.8});
    this.cristalBlanco = new THREE.MeshPhongMaterial ({color: 0xFFFFFF, transparent: true, opacity: 0.8});

    // Inicializamos las variables para abrir/cerrar la puerta de la caja de fusibles y saber si están todos subidos
    this.puertaCajaFusibles = [false];
    this.fusiblesSubidos = [false];

    // Creamos variables para cambiar los mensajes que se mostrarán al jugador cuando interactúe con objetos inservibles
    this.mensajeLibros = 0;
    this.mensajeTazas = 0;
    this.mensajeRollos = 0;
    this.mensajePapeles = 0;
    this.mensajeVelas = 0;
    this.mensajeOrdenador1 = 0;
    this.mensajeOrdenador2 = 0;
    this.mensajeVentilador1 = 0;
    this.mensajeVentilador2 = 0;
    this.mensajePapelera = 0;
  }

  initMusica() {
    // Creamos un listener que escuche la música y lo añadimos a la cámara
    // para que sea esta a la que se siga la posicion desde donde se escucha todo el audio de la escena
    const listener = new THREE.AudioListener();

    this.camera.add(listener);

    // Creamos también un audioloader para cargar todos los documentos de sonido
    const audioLoader = new THREE.AudioLoader();

    // Guardamos la referencia al this
    var that = this;

    // Creamos música de fondo
    this.musicaFondo = new THREE.Audio(listener);

    // Cargamos el documento de sonido
    audioLoader.load('sounds/cancion_pantera_rosa.mp3', function ( buffer ){
      that.musicaFondo.setBuffer(buffer);
      that.musicaFondo.setLoop(true);
      that.musicaFondo.setVolume(0.01);
      that.musicaFondo.play();
    });

    // Creamos un efecto de sonido de abrir/cerrar los cajones
    this.sonidoCajones = new THREE.Audio(listener);

    // Cargamos el documento de sonido
    audioLoader.load('sounds/sonido_cajon.mp3', function ( buffer ){
      that.sonidoCajones.setBuffer(buffer);
      that.sonidoCajones.setLoop(false);
      that.sonidoCajones.setVolume(0.3);
    });

    // Creamos un efecto de sonido de abrir/cerrar las puertas de los armarios
    this.sonidoArmario = new THREE.Audio(listener);

    // Cargamos el documento de sonido
    audioLoader.load('sounds/sonido_armario.mp3', function ( buffer ){
      that.sonidoArmario.setBuffer(buffer);
      that.sonidoArmario.setLoop(false);
      that.sonidoArmario.setVolume(0.3);
    });

    // Creamos un efecto de sonido para cuando resolvamos un puzzle al abrir algo
    // que nos permita encontrar un objeto clave
    this.sonidoPuzzleResuelto = new THREE.Audio(listener);

    // Cargamos el documento de sonido
    audioLoader.load('sounds/puzzle_resuelto.mp3', function ( buffer ){
      that.sonidoPuzzleResuelto.setBuffer(buffer);
      that.sonidoPuzzleResuelto.setLoop(false);
      that.sonidoPuzzleResuelto.setVolume(0.2);
    });

    // Creamos un efecto de sonido para el ventilador
    this.sonidoVentilador = new THREE.PositionalAudio(listener);

    // Cargamos el documento de sonido
    audioLoader.load('sounds/sonido_ventilador.mp3', function ( buffer ){
      that.sonidoVentilador.setBuffer(buffer);
      that.sonidoVentilador.setRefDistance(50);
      that.sonidoVentilador.setLoop(true);
      that.sonidoVentilador.setVolume(0.6);
    });

    // Creamos un efecto de sonido de electricidad para cuando se repare la luz y se recupere la corriente
    this.sonidoElectricidad = new THREE.Audio(listener);

    // Cargamos el documento de sonido
    audioLoader.load('sounds/sonido_electricidad.mp3', function ( buffer ){
      that.sonidoElectricidad.setBuffer(buffer);
      that.sonidoElectricidad.setLoop(false);
      that.sonidoElectricidad.setVolume(0.4);
    });

    // Creamos un efecto de sonido para cuando se abra o se cierre la caja de fusibles
    this.sonidoCajaMetal = new THREE.Audio(listener);

    // Cargamos el documento de sonido
    audioLoader.load('sounds/sonido_cajon_metal.mp3', function ( buffer ){
      that.sonidoCajaMetal.setBuffer(buffer);
      that.sonidoCajaMetal.setLoop(false);
      that.sonidoCajaMetal.setVolume(0.3);
    });

    // Creamos un efecto de sonido para cuando se suba o baje un fusible
    this.sonidoClic = new THREE.Audio(listener);

    // Cargamos el documento de sonido
    audioLoader.load('sounds/sonido_click.mp3', function ( buffer ){
      that.sonidoClic.setBuffer(buffer);
      that.sonidoClic.setLoop(false);
      that.sonidoClic.setVolume(0.9);
    });

    // Creamos un efecto de sonido para cuando se resuelva el scape room
    this.sonidoFinalResuelto = new THREE.Audio(listener);

    // Cargamos el documento de sonido
    audioLoader.load('sounds/final_resuelto.mp3', function ( buffer ){
      that.sonidoFinalResuelto.setBuffer(buffer);
      that.sonidoFinalResuelto.setLoop(false);
      that.sonidoFinalResuelto.setVolume(0.3);
    });
  }

  setCandidatosColisiones() {
    // Las paredes
    this.candidatosColisiones.push(this.paredes.clone(true));

    // La puerta y el marco
    this.candidatosColisiones.push(this.puerta);
    this.candidatosColisiones.push(this.marcoPuerta);

    // El escritorio
    this.candidatosColisiones.push(this.escritorio);

    // La mesa
    this.candidatosColisiones.push(this.mesa);

    // Los armarios
    this.candidatosColisiones.push(this.armarioDerecha);
    this.candidatosColisiones.push(this.armarioIzquierda);
  }

  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightIntensity : 0.5,
      axisOnOff   : false,
      colisiones  : false
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Parámetros');
    
    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1)
      .name('Intensidad de la Luz : ')
      .onChange ( (value) => this.setLightIntensity (value) );
    
    // Otro para mostrar u ocultar los ejes
    folder.add (this.guiControls, 'axisOnOff')
      .name ('Mostrar ejes : ')
      .onChange ( (value) => this.setAxisVisible (value) );

    // Y otro para mostrar u ocultar las colisiones
    folder.add (this.guiControls, 'colisiones')
      .name ('Colisiones : ')
      .onChange ( (value) => this.setColisionesVisible (value) );

    gui.domElement.style.visibility = 'hidden';
    
    return gui;
  }

  setLightIntensity (valor) {
    this.linternaLight.intensity = valor;
  }
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }

  setColisionesVisible (valor) {
    this.cajasVisibles.visible = valor;
  }

  GUIUpdate () {
    // Actualizamos la visibilidad de la gui
    // Ocultamos la gui a menos de que estemos en modo desarrollador
    if(this.modoDesarrollador == false){
      this.gui.domElement.style.visibility = 'hidden';
    }
    else{
      this.gui.domElement.style.visibility = 'visible';
    }
  }
  
  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // El modo de juego normal crea una cámara en primera persona
    if(this.modoDesarrollador == false){
      // También se indica dónde se coloca
      this.camera.position.set (0, 180, 0);   // 180 = 1.8m 
      // Y hacia dónde mira
      var look = new THREE.Vector3 (0,600,-600);
      this.camera.lookAt(look);
      this.add (this.camera);

      this.cameraControl = new FirstPersonControls(this.camera, this.renderer.domElement);

      // Inicializamos las propiedades de la cámara en primera persona
      this.cameraControl.movementSpeed = 2.5;
      this.cameraControl.lookSpeed = 0.005;
      this.cameraControl.constrainVertical = true;    // Delimitar verticalmente hasta donde se puede mirar
      this.cameraControl.verticalMin = 1.0;
      this.cameraControl.verticalMax = Math.PI - 0.4;
    }
    else{       // El modo desarrollador crea una cámara como la utilizada en la práctica 1
      // También se indica dónde se coloca
      this.camera.position.set (10, 10, 10);
      // Y hacia dónde mira
      var look = new THREE.Vector3 (0,0,0);
      this.camera.lookAt(look);
      this.add (this.camera);

      this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);

      // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    
      // Se configuran las velocidades de los movimientos
      this.cameraControl.rotateSpeed = 5;
      this.cameraControl.zoomSpeed = -2;
      this.cameraControl.panSpeed = 0.5;

      // Debe orbitar con respecto al punto de mira de la cámara
      this.cameraControl.target = look;
    }
  }

  corregirCamera () {
    // El personaje deberá de estar siempre a la altura donde lo hemos situado al principio
    if(this.camera.position.y != 180 && this.modoDesarrollador == false){     // Si estamos en modo desarrollador no movemos la camara
      this.camera.position.y = 180;
    }
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como var y va a ser una variable local a este método
    // se hace así puesto que no va a ser accedida desde otros métodos
    this.ambientLight = new THREE.AmbientLight(0xccddee, this.ambientLightIntensidad); 
    
    // La añadimos a la escena
    this.add (this.ambientLight);

    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo para que sea un atributo accesible desde otros métodos.
    this.linternaLight = new THREE.SpotLight( 0x404040, this.guiControls.lightIntensity );

    // Inicializamos las propiedades de la luz, como la posición de esta y las dimensiones del cono que ilumina
    this.linternaLight.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    this.linternaLight.angle = Math.PI/15;

    // Para lograr que el punto de mira de la luz sea el deseado creamos un objeto3D que tenga que seguir (tracking)
    // y deberemos también añadir este mismo objeto a la escena
    this.targetObject = new THREE.Object3D();
    this.targetObject.position.set(this.cameraControl.targetPosition.x,this.cameraControl.targetPosition.y,
                                   this.cameraControl.targetPosition.z);
    this.add(this.targetObject);

    // Añadimos el objeto que tiene que seguir a la luz
    this.linternaLight.target = this.targetObject;

    // Añadimos la luz a la escena
    this.add (this.linternaLight);


    // Creamos una luz puntual para el panel de luz de la caja eléctrica
    this.panelLight = new THREE.PointLight( 0xFF0000, 2, 80);

    // Inicializamos las propiedades de la luz, como la posición de esta y las dimensiones del cono que ilumina
    this.panelLight.position.set(160, 140, 250);

    // Añadimos la luz a la escena
    this.add (this.panelLight);


    // Creamos una luz puntual para la luz de emergencia que ilumine toda la escena
    this.emergenciaLight = new THREE.PointLight( 0xFFE991, 2, 300);

    // Inicializamos las propiedades de la luz, como la posición de esta y las dimensiones del cono que ilumina
    this.emergenciaLight.position.set(-165, 240, 240);

    // La hacemos inviisble hasta que se arregle el sistema eléctrico
    this.emergenciaLight.visible = false;

    // Añadimos la luz a la escena
    this.add (this.emergenciaLight);
  }

  lightsUpdate () {
    // Actulizamos la luz de la linterna

    // Para hacer esto actualizamos la posicion de la luz con respecto a la posición de la cámara
    this.targetObject.position.set(this.cameraControl.targetPosition.x,this.cameraControl.targetPosition.y,
                                   this.cameraControl.targetPosition.z);

    // y la posicion del punto de mira de la luz con respecto a la posicion del punto de mira de la cámara
    this.linternaLight.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);

    // Si se ha reparado la luz y la palanca de la corriente eléctrica está arriba encendemos la luz de emergencia
    if(this.luzReparada[0] && this.palancaArriba[0]){
        this.emergenciaLight.visible = true;
    }
    else if(this.luzReparada[0]){
        this.emergenciaLight.visible = false;
    }
  }

  createParedes () {
    // El suelo es un Mesh, necesita una geometría y un material.
    
    // La geometría es una caja con muy poca altura
    var geometryPared = new THREE.BoxGeometry (100,0.2,100);    // 100 = 1m 
    var geometrySuelo = new THREE.BoxGeometry (250,0.2,250);    // 250 = 2,5m 
    
    // El material se hará con una textura de madera
    var texturePared = new THREE.TextureLoader().load('imgs/ladrillo-difuso.png');
    var textureParedBump = new THREE.TextureLoader().load('imgs/ladrillo-bump.png');
    var textureSuelo = new THREE.TextureLoader().load('imgs/suelo-tierra.jpg');
    var textureSueloNormal = new THREE.TextureLoader().load('imgs/suelo-tierra-mapaNormal.png');
    var materialPared = new THREE.MeshPhongMaterial ({map: texturePared, bumpMap: textureParedBump});
    var materialSuelo = new THREE.MeshPhongMaterial ({map: textureSuelo, normalMap: textureSueloNormal});
    
    // Ya se puede construir el Mesh
    // Construimos los mesh correspondientes al suelo para que la textura no se deforme
    var suelo1 = new THREE.Mesh (geometrySuelo, materialSuelo);
    var suelo2 = new THREE.Mesh (geometrySuelo, materialSuelo);
    var suelo3 = new THREE.Mesh (geometrySuelo, materialSuelo);
    var suelo4 = new THREE.Mesh (geometrySuelo, materialSuelo);
    var suelo5 = new THREE.Mesh (geometrySuelo, materialSuelo);
    var suelo6 = new THREE.Mesh (geometrySuelo, materialSuelo);
    var suelo7 = new THREE.Mesh (geometrySuelo, materialSuelo);
    var suelo8 = new THREE.Mesh (geometrySuelo, materialSuelo);
    var suelo9 = new THREE.Mesh (geometrySuelo, materialSuelo);
    var suelo10 = new THREE.Mesh (geometrySuelo, materialSuelo);
    var suelo11 = new THREE.Mesh (geometrySuelo, materialSuelo);
    var suelo12 = new THREE.Mesh (geometrySuelo, materialSuelo);

    // Construimos los mesh correspondientes al techo para que la textura no se deforme
    var techo1 = new THREE.Mesh (geometryPared, materialPared);
    var techo2 = new THREE.Mesh (geometryPared, materialPared);
    var techo3 = new THREE.Mesh (geometryPared, materialPared);
    var techo4 = new THREE.Mesh (geometryPared, materialPared);
    var techo5 = new THREE.Mesh (geometryPared, materialPared);
    var techo6 = new THREE.Mesh (geometryPared, materialPared);
    var techo7 = new THREE.Mesh (geometryPared, materialPared);
    var techo8 = new THREE.Mesh (geometryPared, materialPared);
    var techo9 = new THREE.Mesh (geometryPared, materialPared);
    var techo10 = new THREE.Mesh (geometryPared, materialPared);
    var techo11 = new THREE.Mesh (geometryPared, materialPared);
    var techo12 = new THREE.Mesh (geometryPared, materialPared);
    var techo13 = new THREE.Mesh (geometryPared, materialPared);
    var techo14 = new THREE.Mesh (geometryPared, materialPared);
    var techo15 = new THREE.Mesh (geometryPared, materialPared);
    var techo16 = new THREE.Mesh (geometryPared, materialPared);
    var techo17 = new THREE.Mesh (geometryPared, materialPared);
    var techo18 = new THREE.Mesh (geometryPared, materialPared);
    var techo19 = new THREE.Mesh (geometryPared, materialPared);
    var techo20 = new THREE.Mesh (geometryPared, materialPared);
    var techo21 = new THREE.Mesh (geometryPared, materialPared);
    var techo22 = new THREE.Mesh (geometryPared, materialPared);
    var techo23 = new THREE.Mesh (geometryPared, materialPared);
    var techo24 = new THREE.Mesh (geometryPared, materialPared);
    var techo25 = new THREE.Mesh (geometryPared, materialPared);
    var techo26 = new THREE.Mesh (geometryPared, materialPared);
    var techo27 = new THREE.Mesh (geometryPared, materialPared);
    var techo28 = new THREE.Mesh (geometryPared, materialPared);
    var techo29 = new THREE.Mesh (geometryPared, materialPared);
    var techo30 = new THREE.Mesh (geometryPared, materialPared);
    var techo31 = new THREE.Mesh (geometryPared, materialPared);
    var techo32 = new THREE.Mesh (geometryPared, materialPared);
    var techo33 = new THREE.Mesh (geometryPared, materialPared);
    var techo34 = new THREE.Mesh (geometryPared, materialPared);
    var techo35 = new THREE.Mesh (geometryPared, materialPared);
    var techo36 = new THREE.Mesh (geometryPared, materialPared);

    // Construimos los mesh correspondientes a la pared de enfrente para que la textura no se deforme
    var paredEnfrente1 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente2 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente3 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente4 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente5 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente6 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente7 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente8 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente9 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente10 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente11 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente12 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente13 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente14 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente15 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente16 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente17 = new THREE.Mesh (geometryPared, materialPared);
    var paredEnfrente18 = new THREE.Mesh (geometryPared, materialPared);

    // Construimos los mesh correspondientes a la pared derecha para que la textura no se deforme
    var paredDerecha1 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha2 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha3 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha4 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha5 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha6 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha7 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha8 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha9 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha10 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha11 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha12 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha13 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha14 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha15 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha16 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha17 = new THREE.Mesh (geometryPared, materialPared);
    var paredDerecha18 = new THREE.Mesh (geometryPared, materialPared);
 
    // Construimos los mesh correspondientes a la pared de detrás para que la textura no se deforme
    var paredDetras1 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras2 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras3 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras4 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras5 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras6 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras7 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras8 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras9 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras10 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras11 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras12 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras13 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras14 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras15 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras16 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras17 = new THREE.Mesh (geometryPared, materialPared);
    var paredDetras18 = new THREE.Mesh (geometryPared, materialPared);

    // Construimos los mesh correspondientes a la pared izquierda para que la textura no se deforme
    var paredIzquierda1 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda2 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda3 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda4 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda5 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda6 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda7 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda8 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda9 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda10 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda11 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda12 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda13 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda14 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda15 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda16 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda17 = new THREE.Mesh (geometryPared, materialPared);
    var paredIzquierda18 = new THREE.Mesh (geometryPared, materialPared);
    
    // Todas las figuras se crean centradas en el origen.
    // Creamos un objeto que agrupe todos los trozos del suelo y los distribuimos correctamente
    var suelo = new THREE.Object3D();   

    suelo1.position.x = -375;
    suelo1.position.z = -125;

    suelo2.position.x = -125;
    suelo2.position.z = -125;

    suelo3.position.x = 125;
    suelo3.position.z = -125;

    suelo4.position.x = 375;
    suelo4.position.z = -125;

    suelo5.position.x = -375;
    suelo5.position.z = 125;

    suelo6.position.x = -125;
    suelo6.position.z = 125;

    suelo7.position.x = 125;
    suelo7.position.z = 125;

    suelo8.position.x = 375;
    suelo8.position.z = 125;

    suelo9.position.x = -375;
    suelo9.position.z = 375;

    suelo10.position.x = -125;
    suelo10.position.z = 375;

    suelo11.position.x = 125;
    suelo11.position.z = 375;

    suelo12.position.x = 375;
    suelo12.position.z = 375;

    suelo.add(suelo1);
    suelo.add(suelo2);
    suelo.add(suelo3);
    suelo.add(suelo4);
    suelo.add(suelo5);
    suelo.add(suelo6);
    suelo.add(suelo7);
    suelo.add(suelo8);
    suelo.add(suelo9);
    suelo.add(suelo10);
    suelo.add(suelo11);
    suelo.add(suelo12);

    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    // Y lo escalamos para que haya suelo fuera de la habitación
    suelo.scale.x = 1.5;       
    suelo.scale.z = 1.5;          
    suelo.position.y = -0.1;

    // Calculamos la caja englobante para las colisiones
    this.cajaEnglobanteSuelo = new THREE.Box3();
    this.cajaEnglobanteSuelo.setFromObject(suelo);

    // Para que las colisiones se vean
    var cajaVisibleSuelo = new THREE.Box3Helper(this.cajaEnglobanteSuelo, 0xFFFF00)
    this.cajasVisibles.add(cajaVisibleSuelo);


    // Creamos un grupo que agrupe todos los trozos del suelo y los distribuimos correctamente
    var techo = new THREE.Object3D();   // 6x6m

    techo1.position.x = -250;
    techo1.position.z = -250;

    techo2.position.x = -150;
    techo2.position.z = -250;

    techo3.position.x = -50;
    techo3.position.z = -250;

    techo4.position.x = 50;
    techo4.position.z = -250;

    techo5.position.x = 150;
    techo5.position.z = -250;

    techo6.position.x = 250;
    techo6.position.z = -250;

    techo7.position.x = -250;
    techo7.position.z = -150;

    techo8.position.x = -150;
    techo8.position.z = -150;

    techo9.position.x = -50;
    techo9.position.z = -150;

    techo10.position.x = 50;
    techo10.position.z = -150;

    techo11.position.x = 150;
    techo11.position.z = -150;

    techo12.position.x = 250;
    techo12.position.z = -150;

    techo13.position.x = -250;
    techo13.position.z = -50;

    techo14.position.x = -150;
    techo14.position.z = -50;

    techo15.position.x = -50;
    techo15.position.z = -50;

    techo16.position.x = 50;
    techo16.position.z = -50;

    techo17.position.x = 150;
    techo17.position.z = -50;

    techo18.position.x = 250;
    techo18.position.z = -50;

    techo19.position.x = -250;
    techo19.position.z = 50;

    techo20.position.x = -150;
    techo20.position.z = 50;

    techo21.position.x = -50;
    techo21.position.z = 50;

    techo22.position.x = 50;
    techo22.position.z = 50;

    techo23.position.x = 150;
    techo23.position.z = 50;

    techo24.position.x = 250;
    techo24.position.z = 50;

    techo25.position.x = -250;
    techo25.position.z = 150;

    techo26.position.x = -150;
    techo26.position.z = 150;

    techo27.position.x = -50;
    techo27.position.z = 150;

    techo28.position.x = 50;
    techo28.position.z = 150;

    techo29.position.x = 150;
    techo29.position.z = 150;

    techo30.position.x = 250;
    techo30.position.z = 150;

    techo31.position.x = -250;
    techo31.position.z = 250;

    techo32.position.x = -150;
    techo32.position.z = 250;

    techo33.position.x = -50;
    techo33.position.z = 250;

    techo34.position.x = 50;
    techo34.position.z = 250;

    techo35.position.x = 150;
    techo35.position.z = 250;

    techo36.position.x = 250;
    techo36.position.z = 250;

    techo.add(techo1);
    techo.add(techo2);
    techo.add(techo3);
    techo.add(techo4);
    techo.add(techo5);
    techo.add(techo6);
    techo.add(techo7);
    techo.add(techo8);
    techo.add(techo9);
    techo.add(techo10);
    techo.add(techo11);
    techo.add(techo12);
    techo.add(techo13);
    techo.add(techo14);
    techo.add(techo15);
    techo.add(techo16);
    techo.add(techo17);
    techo.add(techo18);
    techo.add(techo19);
    techo.add(techo20);
    techo.add(techo21);
    techo.add(techo22);
    techo.add(techo23);
    techo.add(techo24);
    techo.add(techo25);
    techo.add(techo26);
    techo.add(techo27);
    techo.add(techo28);
    techo.add(techo29);
    techo.add(techo30);
    techo.add(techo31);
    techo.add(techo32);
    techo.add(techo33);
    techo.add(techo34);
    techo.add(techo35);
    techo.add(techo36);
    
    // El techo lo subimos para que se ajuste a las paredes
    techo.position.y = 300;     // El techo se situará a 3m y la habitación será de 6x6 m2

    // Calculamos la caja englobantes para las colisiones
    this.cajaEnglobanteTecho = new THREE.Box3();
    this.cajaEnglobanteTecho.setFromObject(techo);

    // Para que las colisiones se vean
    var cajaVisibleTecho = new THREE.Box3Helper(this.cajaEnglobanteTecho, 0xFFFF00)
    this.cajasVisibles.add(cajaVisibleTecho);


    // Y las paredes las giramos y las situamos en los bordes del techo y suelo
    // Creamos un grupo que agrupe todos los trozos de la pared de enfrente y los distribuimos correctamente
    var paredEnfrente = new THREE.Object3D();   // 6x3m

    paredEnfrente1.position.x = -250;
    paredEnfrente1.position.z = -100;

    paredEnfrente2.position.x = -150;
    paredEnfrente2.position.z = -100;

    paredEnfrente3.position.x = -50;
    paredEnfrente3.position.z = -100;

    paredEnfrente4.position.x = 50;
    paredEnfrente4.position.z = -100;

    paredEnfrente5.position.x = 150;
    paredEnfrente5.position.z = -100;

    paredEnfrente6.position.x = 250;
    paredEnfrente6.position.z = -100;

    paredEnfrente7.position.x = -250;
    paredEnfrente7.position.z = 0;

    paredEnfrente8.position.x = -150;
    paredEnfrente8.position.z = 0;

    paredEnfrente9.position.x = -50;
    paredEnfrente9.position.z = 0;

    paredEnfrente10.position.x = 50;
    paredEnfrente10.position.z = 0;

    paredEnfrente11.position.x = 150;
    paredEnfrente11.position.z = 0;

    paredEnfrente12.position.x = 250;
    paredEnfrente12.position.z = 0;

    paredEnfrente13.position.x = -250;
    paredEnfrente13.position.z = 100;

    paredEnfrente14.position.x = -150;
    paredEnfrente14.position.z = 100;

    paredEnfrente15.position.x = -50;
    paredEnfrente15.position.z = 100;

    paredEnfrente16.position.x = 50;
    paredEnfrente16.position.z = 100;

    paredEnfrente17.position.x = 150;
    paredEnfrente17.position.z = 100;

    paredEnfrente18.position.x = 250;
    paredEnfrente18.position.z = 100;

    paredEnfrente.add(paredEnfrente1);
    paredEnfrente.add(paredEnfrente2);
    paredEnfrente.add(paredEnfrente3);
    paredEnfrente.add(paredEnfrente4);
    paredEnfrente.add(paredEnfrente5);
    paredEnfrente.add(paredEnfrente6);
    paredEnfrente.add(paredEnfrente7);
    paredEnfrente.add(paredEnfrente8);
    paredEnfrente.add(paredEnfrente9);
    paredEnfrente.add(paredEnfrente10);
    paredEnfrente.add(paredEnfrente11);
    paredEnfrente.add(paredEnfrente12);
    paredEnfrente.add(paredEnfrente13);
    paredEnfrente.add(paredEnfrente14);
    paredEnfrente.add(paredEnfrente15);
    paredEnfrente.add(paredEnfrente16);
    paredEnfrente.add(paredEnfrente17);
    paredEnfrente.add(paredEnfrente18);

    // Rotamos la pared para situarla enfrente y la colocamos en el borde correspendiente del techo
    paredEnfrente.rotateX(Math.PI/2);
    paredEnfrente.position.y = 150;
    paredEnfrente.position.z = -300;

    // Calculamos la caja englobante para las colisiones
    this.cajaEnglobanteParedEnfrente = new THREE.Box3();
    this.cajaEnglobanteParedEnfrente.setFromObject(paredEnfrente);

    // Para que las colisiones se vean
    var cajaVisibleParedEnfrente = new THREE.Box3Helper(this.cajaEnglobanteParedEnfrente, 0xFFFF00)
    this.cajasVisibles.add(cajaVisibleParedEnfrente);


    // Creamos un grupo que agrupe todos los trozos de la pared de detrás y los distribuimos correctamente
    var paredDetras = new THREE.Object3D();   // 6x3m

    paredDetras1.position.x = -250;
    paredDetras1.position.z = -100;

    paredDetras2.position.x = -150;
    paredDetras2.position.z = -100;

    paredDetras3.position.x = -50;
    paredDetras3.position.z = -100;

    paredDetras4.position.x = 50;
    paredDetras4.position.z = -100;

    paredDetras5.position.x = 150;
    paredDetras5.position.z = -100;

    paredDetras6.position.x = 250;
    paredDetras6.position.z = -100;

    paredDetras7.position.x = -250;
    paredDetras7.position.z = 0;

    paredDetras8.position.x = -150;
    paredDetras8.position.z = 0;

    paredDetras9.position.x = -50;
    paredDetras9.position.z = 0;

    paredDetras10.position.x = 50;
    paredDetras10.position.z = 0;

    paredDetras11.position.x = 150;
    paredDetras11.position.z = 0;

    paredDetras12.position.x = 250;
    paredDetras12.position.z = 0;

    paredDetras13.position.x = -250;
    paredDetras13.position.z = 100;

    paredDetras14.position.x = -150;
    paredDetras14.position.z = 100;

    paredDetras15.position.x = -50;
    paredDetras15.position.z = 100;

    paredDetras16.position.x = 50;
    paredDetras16.position.z = 100;

    paredDetras17.position.x = 150;
    paredDetras17.position.z = 100;

    paredDetras18.position.x = 250;
    paredDetras18.position.z = 100;

    paredDetras.add(paredDetras1);
    paredDetras.add(paredDetras2);
    paredDetras.add(paredDetras3);
    paredDetras.add(paredDetras4);
    //paredDetras.add(paredDetras5);    // QUitamos el hueco de la puerta en la pared
    paredDetras.add(paredDetras6);
    paredDetras.add(paredDetras7);
    paredDetras.add(paredDetras8);
    paredDetras.add(paredDetras9);
    paredDetras.add(paredDetras10);
    //paredDetras.add(paredDetras11);   // Quitamos el hueco de la puerta en la pared
    paredDetras.add(paredDetras12);
    paredDetras.add(paredDetras13);
    paredDetras.add(paredDetras14);
    paredDetras.add(paredDetras15);
    paredDetras.add(paredDetras16);
    paredDetras.add(paredDetras17);
    paredDetras.add(paredDetras18);

    // Rotamos la pared para situarla detrás y la colocamos en el borde correspendiente del techo
    paredDetras.rotateX(Math.PI/2);
    paredDetras.rotateY(Math.PI);
    paredDetras.position.y = 150;
    paredDetras.position.z = 300;

    // Calculamos la caja englobante para las colisiones
    this.cajaEnglobanteParedDetras = new THREE.Box3();
    this.cajaEnglobanteParedDetras.setFromObject(paredDetras);

    // Para que las colisiones se vean
    var cajaVisibleParedDetras = new THREE.Box3Helper(this.cajaEnglobanteParedDetras, 0xFFFF00)
    this.cajasVisibles.add(cajaVisibleParedDetras);


    // Creamos un grupo que agrupe todos los trozos de la pared de la derecha y los distribuimos correctamente
    var paredDerecha = new THREE.Object3D();   // 6x3m

    paredDerecha1.position.x = -250;
    paredDerecha1.position.z = -100;

    paredDerecha2.position.x = -150;
    paredDerecha2.position.z = -100;

    paredDerecha3.position.x = -50;
    paredDerecha3.position.z = -100;

    paredDerecha4.position.x = 50;
    paredDerecha4.position.z = -100;

    paredDerecha5.position.x = 150;
    paredDerecha5.position.z = -100;

    paredDerecha6.position.x = 250;
    paredDerecha6.position.z = -100;

    paredDerecha7.position.x = -250;
    paredDerecha7.position.z = 0;

    paredDerecha8.position.x = -150;
    paredDerecha8.position.z = 0;

    paredDerecha9.position.x = -50;
    paredDerecha9.position.z = 0;

    paredDerecha10.position.x = 50;
    paredDerecha10.position.z = 0;

    paredDerecha11.position.x = 150;
    paredDerecha11.position.z = 0;

    paredDerecha12.position.x = 250;
    paredDerecha12.position.z = 0;

    paredDerecha13.position.x = -250;
    paredDerecha13.position.z = 100;

    paredDerecha14.position.x = -150;
    paredDerecha14.position.z = 100;

    paredDerecha15.position.x = -50;
    paredDerecha15.position.z = 100;

    paredDerecha16.position.x = 50;
    paredDerecha16.position.z = 100;

    paredDerecha17.position.x = 150;
    paredDerecha17.position.z = 100;

    paredDerecha18.position.x = 250;
    paredDerecha18.position.z = 100;

    paredDerecha.add(paredDerecha1);
    paredDerecha.add(paredDerecha2);
    paredDerecha.add(paredDerecha3);
    paredDerecha.add(paredDerecha4);
    paredDerecha.add(paredDerecha5);
    paredDerecha.add(paredDerecha6);
    paredDerecha.add(paredDerecha7);
    paredDerecha.add(paredDerecha8);
    paredDerecha.add(paredDerecha9);
    paredDerecha.add(paredDerecha10);
    paredDerecha.add(paredDerecha11);
    paredDerecha.add(paredDerecha12);
    paredDerecha.add(paredDerecha13);
    paredDerecha.add(paredDerecha14);
    paredDerecha.add(paredDerecha15);
    paredDerecha.add(paredDerecha16);
    paredDerecha.add(paredDerecha17);
    paredDerecha.add(paredDerecha18);

    // Rotamos la pared para situarla a la derecha y la colocamos en el borde correspendiente del techo
    paredDerecha.rotateX(Math.PI/2);
    paredDerecha.rotateZ(Math.PI/2);
    paredDerecha.position.y = 150;
    paredDerecha.position.x = 300;

    // Calculamos la caja englobante para las colisiones
    this.cajaEnglobanteParedDerecha = new THREE.Box3();
    this.cajaEnglobanteParedDerecha.setFromObject(paredDerecha);

    // Para que las colisiones se vean
    var cajaVisibleParedDerecha = new THREE.Box3Helper(this.cajaEnglobanteParedDerecha, 0xFFFF00)
    this.cajasVisibles.add(cajaVisibleParedDerecha);


    // Creamos un grupo que agrupe todos los trozos de la pared de la izquierda y los distribuimos correctamente
    var paredIzquierda = new THREE.Object3D();   // 6x3m

    paredIzquierda1.position.x = -250;
    paredIzquierda1.position.z = -100;

    paredIzquierda2.position.x = -150;
    paredIzquierda2.position.z = -100;

    paredIzquierda3.position.x = -50;
    paredIzquierda3.position.z = -100;

    paredIzquierda4.position.x = 50;
    paredIzquierda4.position.z = -100;

    paredIzquierda5.position.x = 150;
    paredIzquierda5.position.z = -100;

    paredIzquierda6.position.x = 250;
    paredIzquierda6.position.z = -100;

    paredIzquierda7.position.x = -250;
    paredIzquierda7.position.z = 0;

    paredIzquierda8.position.x = -150;
    paredIzquierda8.position.z = 0;

    paredIzquierda9.position.x = -50;
    paredIzquierda9.position.z = 0;

    paredIzquierda10.position.x = 50;
    paredIzquierda10.position.z = 0;

    paredIzquierda11.position.x = 150;
    paredIzquierda11.position.z = 0;

    paredIzquierda12.position.x = 250;
    paredIzquierda12.position.z = 0;

    paredIzquierda13.position.x = -250;
    paredIzquierda13.position.z = 100;

    paredIzquierda14.position.x = -150;
    paredIzquierda14.position.z = 100;

    paredIzquierda15.position.x = -50;
    paredIzquierda15.position.z = 100;

    paredIzquierda16.position.x = 50;
    paredIzquierda16.position.z = 100;

    paredIzquierda17.position.x = 150;
    paredIzquierda17.position.z = 100;

    paredIzquierda18.position.x = 250;
    paredIzquierda18.position.z = 100;

    paredIzquierda.add(paredIzquierda1);
    paredIzquierda.add(paredIzquierda2);
    paredIzquierda.add(paredIzquierda3);
    paredIzquierda.add(paredIzquierda4);
    paredIzquierda.add(paredIzquierda5);
    paredIzquierda.add(paredIzquierda6);
    paredIzquierda.add(paredIzquierda7);
    paredIzquierda.add(paredIzquierda8);
    paredIzquierda.add(paredIzquierda9);
    paredIzquierda.add(paredIzquierda10);
    paredIzquierda.add(paredIzquierda11);
    paredIzquierda.add(paredIzquierda12);
    paredIzquierda.add(paredIzquierda13);
    paredIzquierda.add(paredIzquierda14);
    paredIzquierda.add(paredIzquierda15);
    paredIzquierda.add(paredIzquierda16);
    paredIzquierda.add(paredIzquierda17);
    paredIzquierda.add(paredIzquierda18);

    // Rotamos la pared para situarla a la izquierda y la colocamos en el borde correspendiente del techo
    paredIzquierda.rotateX(Math.PI/2);
    paredIzquierda.rotateZ(Math.PI/2);
    paredIzquierda.rotateY(Math.PI);
    paredIzquierda.position.y = 150;
    paredIzquierda.position.x = -300;

    // Calculamos la caja englobante para las colisiones
    this.cajaEnglobanteParedIzquierda = new THREE.Box3();
    this.cajaEnglobanteParedIzquierda.setFromObject(paredIzquierda);

    // Para que las colisiones se vean
    var cajaVisibleParedIzquierda = new THREE.Box3Helper(this.cajaEnglobanteParedIzquierda, 0xFFFF00)
    this.cajasVisibles.add(cajaVisibleParedIzquierda);


    // Añadimos todas las paredes de la habitacion
    this.paredes = new THREE.Object3D();

    this.paredes.add(suelo);
    this.paredes.add(techo);
    this.paredes.add(paredEnfrente);
    this.paredes.add(paredDetras);
    this.paredes.add(paredDerecha);
    this.paredes.add(paredIzquierda);
    
    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add (this.paredes);
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  onKeyDown (event){
    // Si estamos en pausa (card abierta), no hacer nada
    if (window.isPaused) return;

    var x = event.wich || event.key;

    // Creamos el string que saldrá cuanto se pulse "Q" por ayuda y "P" por la pista
    var str1 = "Las acciones que se pueden realizar son las siguientes:" +
                  "\n\n-Mover el personaje: Pulsar las teclas del cursor o las teclas WASD" +
                  "\n\n-Mover la cámara: Mover el puntero del ratón" +
                  "\n\n-Interaccionar con los objetos: Clic izquierdo con el ratón" +
                  "\n\n-Mostrar una pista (solo en caso de ser estrictamente necesario): Pulsar la tecla P" +
                  "\n\n-Activar/desactivar el modo desarrollador: Pulsar la tecla R" +
                  "\n\n\nNOTA: Para abrir la puerta es necesario hacer clic sobre el POMO de la puerta ";

    var str2 = "La clave está en los OBJETOS ROJOS... aunque no en todos...";

    // Según la tecla que se pulse hacemos un tratamiento u otro
    switch(x){
      // Si se pulsa la Q se muestra un mensaje
      case "q":
        showCard(str1);
      break;

      // Si se pulsa la D se activa/desactiva el modo desarrollador
      case "r":
        if(this.modoDesarrollador == false){
          this.modoDesarrollador = true; 
        }
        else{
          this.modoDesarrollador = false; 
        }
        // Creamos la cámara cada vez que cambiamos de modo
        this.createCamera(); 
      break;

      // Si se pulsa la P se muestra una pequeña pista
      case "p":
        showCard(str2);
      break;
    }
  }

  onMouseDown(event) {
    // Si estamos en pausa (card abierta), no hacer nada
    if (window.isPaused) return;

    // Reutilizamos esos objetos, evitamos construirlos en cada pulsación
    // Se obtiene la posicion del clic
    // en coordenadas de dispositivo normalizado
    // − La esquina inferior izquierda tiene la coordenada (−1,−1)
    // − La esquina superior derecha tiene la coordenada (1 , 1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1 ;
    this.mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

    // Se actualiza un rayo que parte de la cámara (el ojo del usuario)
    // y que pasa por la posición donde se ha hecho clic
    this.raycaster.setFromCamera (this.mouse, this.camera);

    // Hay que buscar qué objetos intersecan con el rayo
    // Es una operación costosa, solo se buscan intersecciones
    // con los objetos que interesan en cada momento
    // Las referencias de dichos objetos se guardan en un array

    // Cambiamos el procesamiento de los objetos seleccionados dependiendo de cuál objeto sobre el que se hace picking

    // Hacemos primero el picking para objetos con los que no queremos ninguna interacción
    // y simplemente se avisará al jugador de esto

    // Inicializamos las variables que nos indican si estamos haciendo el pick con este mismo rayo a un objeto
    this.libroClicado = false;
    this.rolloClicado = false;
    this.papelClicado = false;
    this.velaClicado = false;

    // Libros
    this.pickingLibros(this.raycaster, this.libros1);
    this.pickingLibros(this.raycaster, this.libros2);
    this.pickingLibros(this.raycaster, this.libro1); 
    this.pickingLibros(this.raycaster, this.libro2);
    this.pickingLibros(this.raycaster, this.libro3);
    this.pickingLibros(this.raycaster, this.libro4);
    this.pickingLibros(this.raycaster, this.libro5);

    // Tazas
    this.pickingTazas(this.raycaster, this.taza1);
    this.pickingTazas(this.raycaster, this.taza2);
    this.pickingTazas(this.raycaster, this.taza3);

    // Papel higiénico
    this.pickingRollos(this.raycaster, this.rollos1);
    this.pickingRollos(this.raycaster, this.rollos2);
    this.pickingRollos(this.raycaster, this.rollos3);

    // Papeles
    this.pickingPapeles(this.raycaster, this.papeles1);
    this.pickingPapeles(this.raycaster, this.papeles2);
    this.pickingPapeles(this.raycaster, this.papeles3);

    // Velas
    this.pickingVelas(this.raycaster, this.velas1);
    this.pickingVelas(this.raycaster, this.velas2);
    this.pickingVelas(this.raycaster, this.vela1);
    this.pickingVelas(this.raycaster, this.vela2);
    
    // Ordenador
    this.pickingOrdenador(this.raycaster, this.ordenador);

    // Ventilador
    this.pickingVentilador(this.raycaster, this.ventilador);

    // Papelera
    this.pickingPapelera(this.raycaster, this.papelera);


    // Evitamos que con el mismo rayo se pueda seleccionar el objeto dentro de otro y provocar un picking en este
    if(this.libroClicado || this.rolloClicado || this.papelClicado || this.velaClicado){
      return;
    }

    // Hacemos también el picking para ahora sí aquellos objetos que se necesitan para salir de la habitación

    // Para que los cajones del escritorio se abran y se cierren
    this.pickingEscritorio(this.raycaster, this.escritorio);

    // Para que los cajones de la mesa se abran y se cierren
    this.pickingMesa(this.raycaster, this.mesa);

    // Para la caja de herramientas y la llave inglesa
    this.pickingLlaveInglesa(this.raycaster, this.llaveInglesa);
    this.pickingCajaHerr(this.raycaster, this.cajaHerr);

    // Para que las puertas de los armarios se abran y se cierren
    this.pickingArmarioDerecha(this.raycaster, this.armarioDerecha);
    this.pickingArmarioIzquierda(this.raycaster, this.armarioIzquierda);
    
    // Para la caja eléctrica
    this.pickingCajaElectrica(this.raycaster, this.cajaElectrica);

    // Para la caja fuerte y la llave dentro
    this.pickingLlaveSeguridad(this.raycaster, this.llaveSeguridad);
    this.pickingCajaFuerte(this.raycaster, this.parteCajaFuerte);

    // Para la caja de fusbiles
    this.pickingCajaFusibles(this.raycaster, this.cajaFusibles);

    // Para que la puerta se abra, si y solo si se han completado todas las condiciones para ello
    this.pickingPuerta(this.raycaster, this.puerta);
  }

  pickingLibros (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.mensajeLibros < 2) {
      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object;

      // Evitamos que se pueda seleccionar un libro dentro de un cajón o un armario sin haberlo abierto
      if(!(selectedObject.parent.parent == this.libro1 && this.cajonesEscritorio[4] == false) &&
         !(selectedObject.parent.parent.parent == this.libros2 && this.cajonesMesa[4] == false) &&
         !((selectedObject.parent.parent == this.libro3 || selectedObject.parent.parent == this.libro4
         || selectedObject.parent.parent == this.libro5) && this.puertasArmarioIzq[0] == false)){

        // Procesamos el mensaje que se le mostrará al jugador
        if(this.mensajeLibros){
          showCard("Es un libro, definitivamente no es nada interesante");
        }
        else {
          showCard("Es un libro, no parece especialmente interesante");  
        }

        // Sumamos uno a las veces se ha mostrado el mensaje
        this.mensajeLibros++;

        // Inidcamos que un libro ha sido clicado
        this.libroClicado = true;
      }
    }
  }

  pickingTazas (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.mensajeTazas < 4) {
      // Procesamos el mensaje que se le mostrará al jugador
      if(this.mensajeTazas < 3){
        showCard("Esta taza parece algo inservible, está vacía aunque aún huele a café");
      }
      else {
        showCard("El olor del café proveniente de la taza podría provocarle sed a cualquiera, " +
                     "lástima que por aquí no parece haber nada parecido");
      }

      // Sumamos uno a las veces se ha mostrado el mensaje
      this.mensajeTazas++;
    }
  }

  pickingRollos (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.mensajeRollos < 1) { 
      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object;

      if(!(selectedObject.parent.parent == this.rollos1 && this.puertasArmarioIzq[0] == false) &&
         !(selectedObject.parent.parent == this.rollos2 && this.puertasArmarioDcha[0] == false) &&
         !(selectedObject.parent.parent == this.rollos3 && this.cajonesEscritorio[3] == false)){
        
        // Procesamos el mensaje que se le mostrará al jugador
        showCard("Parece un rollo de papel higiénico, no se ve nada útil");

        // Sumamos uno a las veces se ha mostrado el mensaje
        this.mensajeRollos++;

        // Indicamos que un rollo ha sido clicado
        this.rolloClicado = true;

      }
    }
  }

  pickingPapeles (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.mensajePapeles < 1) { 
      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object;

      if(!(selectedObject.parent.parent == this.papeles1 && this.cajonesEscritorio[0] == false) &&
         !(selectedObject.parent.parent == this.papeles3 && this.cajonesMesa[6] == false)){
        
        // Procesamos el mensaje que se le mostrará al jugador
        showCard("Solo es un montón de hojas de papel");

        // Sumamos uno a las veces se ha mostrado el mensaje
        this.mensajePapeles++;

        // Indicamos que un rollo ha sido clicado
        this.papelClicado = true;

      }
    }
  }

  pickingVelas (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.mensajeVelas < 1) { 
      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object;

      if(!((selectedObject.parent.parent == this.vela2 || selectedObject.parent.parent.parent == this.velas2) &&
            this.cajonesMesa[2] == false)){
        
        // Procesamos el mensaje que se le mostrará al jugador
        showCard("Es una vela aromática, parece no servir para absolutamente nada");

        // Sumamos uno a las veces se ha mostrado el mensaje
        this.mensajeVelas++;

        // Indicamos que un rollo ha sido clicado
        this.velaClicado = true;
      }
    }
  }

  pickingOrdenador (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0) { 
      // Procesamos el mensaje que se le mostrará al jugador
      if(this.luzReparada[0] && this.palancaArriba[0] && this.mensajeOrdenador1 < 1){
        showCard("El ordenador ahora está encendido. Aunque no parece ser de mucha ayuda igualmente");

        // Sumamos uno a las veces se ha mostrado el mensaje
        this.mensajeOrdenador1++;
      }
      else if(this.mensajeOrdenador2 < 1){
        showCard("El ordenador está completamente apagado. De esta forma no parece ser de mucha ayuda");

        // Sumamos uno a las veces se ha mostrado el mensaje
        this.mensajeOrdenador2++;
      }
    }
  }

  pickingVentilador (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0) { 
      // Procesamos el mensaje que se le mostrará al jugador
      if(this.luzReparada[0] && this.palancaArriba[0] && this.mensajeVentilador1 < 1){
        showCard("¡Qué refrescante!");

        // Sumamos uno a las veces se ha mostrado el mensaje
        this.mensajeVentilador1++;
      }
      else if((this.luzReparada[0] == false || this.palancaArriba[0] == false) && this.mensajeVentilador2 < 1){
        showCard("Si se pudiera encender de alguna forma seguro que refrescaría un poco el ambiente, aunque realmente eso no parezca ayudar en nada");
        
        // Sumamos uno a las veces se ha mostrado el mensaje
        this.mensajeVentilador2++;
      }
    }
  }

  pickingPapelera (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.mensajePapelera < 1) {
      // Procesamos el mensaje que se le mostrará al jugador
      showCard("La papelera no tiene ninguna bolsa puesta, mejor no tirar nada dentro");

      // Sumamos uno a las veces se ha mostrado el mensaje
      this.mensajePapelera++;
    }
  }

  pickingEscritorio (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.enMovimiento[0] < 1) {
      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object;

      // Variables temporales para retener el valor a sumar a la posición de los cajones y de los objetos dentro
      var tmp1 = 0;     
      var tmp2 = 0; 

      // Guardamos la referencia al this
      var that = this;

      // Si es uno de los cajones paralelo al eje X o al eje Z hacemos que salgan correctamente dependiendo de cada uno
      switch(selectedObject){
        // Cajón de abajo de la mesa principal
        case objetos.modelo.children[1]:
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Si está el cajón abierto lo cerramos y si está cerrado lo abrimos
          if(this.cajonesEscritorio[0]){
            tmp1 = -0.4;
            tmp2 = -60;
            this.cajonesEscritorio[0] = false;
          }
          else{
            tmp1 = 0.4;
            tmp2 = 60;
            this.cajonesEscritorio[0] = true;
          }

          // Accionamos el sonido de los cajones
          this.sonidoCajones.play();

          // Variables locales con los parámetros de interpolación, en este caso que el cajon se abra
          var origen1 = selectedObject.position;
          var destino1 = {z: origen1.z+tmp1};
          var origen2 = this.papeles1.position;
          var destino2 = {z: origen2.z+tmp2};

          // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
          var movimiento1 = new TWEEN.Tween(origen1).to(destino1,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
          var movimiento2 = new TWEEN.Tween(origen2).to(destino2,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
        break;

        // Cajón del medio de la mesa principal
        case objetos.modelo.children[2]:
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Si está el cajón abierto lo cerramos y si está cerrado lo abrimos
          if(this.cajonesEscritorio[1]){
            tmp1 = -0.4;
            this.cajonesEscritorio[1] = false;
          }
          else{
            tmp1 = 0.4;
            this.cajonesEscritorio[1] = true;
          }

          // Accionamos el sonido de los cajones
          this.sonidoCajones.play();

          // Variables locales con los parámetros de interpolación, en este caso que el cajon se abra
          var origen1 = selectedObject.position;
          var destino1 = {z: origen1.z+tmp1};

          // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
          var movimiento1 = new TWEEN.Tween(origen1).to(destino1,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
        break;

        // Cajón de arriba de la mesa principal
        case objetos.modelo.children[3]:
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Si está el cajón abierto lo cerramos y si está cerrado lo abrimos
          if(this.cajonesEscritorio[2]){
            tmp1 = -0.4;
            this.cajonesEscritorio[2] = false;
          }
          else{
            tmp1 = 0.4;
            this.cajonesEscritorio[2] = true;
          }

          // Accionamos el sonido de los cajones
          this.sonidoCajones.play();

          // Variables locales con los parámetros de interpolación, en este caso que el cajon se abra
          var origen1 = selectedObject.position;
          var destino1 = {z: origen1.z+tmp1};

          // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
          var movimiento1 = new TWEEN.Tween(origen1).to(destino1,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
        break;

        // Cajón de abajo de la mesa secundaria
        case objetos.modelo.children[4]:
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Si está el cajón abierto lo cerramos y si está cerrado lo abrimos
          if(this.cajonesEscritorio[3]){
            tmp1 = 0.4;
            tmp2 = 45;
            this.cajonesEscritorio[3] = false;
          }
          else{
            tmp1 = -0.4;
            tmp2 = -45;
            this.cajonesEscritorio[3] = true;
          }

          // Accionamos el sonido de los cajones
          this.sonidoCajones.play();

          // Variables locales con los parámetros de interpolación, en este caso que el cajon se abra
          var origen1 = selectedObject.position;
          var destino1 = {x: origen1.x+tmp1};
          var origen2 = this.rollos3.position;
          var destino2 = {x: origen2.x+tmp2};

          // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
          var movimiento1 = new TWEEN.Tween(origen1).to(destino1,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
          var movimiento2 = new TWEEN.Tween(origen2).to(destino2,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
        break;

        // Cajón de arriba de la mesa secundaria
        case objetos.modelo.children[6]:
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Si está el cajón abierto lo cerramos y si está cerrado lo abrimos
          if(this.cajonesEscritorio[4]){
            tmp1 = 0.4;
            tmp2 = 45;
            this.cajonesEscritorio[4] = false;
          }
          else{
            tmp1 = -0.4;
            tmp2 = -45;
            this.cajonesEscritorio[4] = true;
          }

          // Accionamos el sonido de los cajones
          this.sonidoCajones.play();

          // Variables locales con los parámetros de interpolación, en este caso que el cajon se abra
          var origen1 = selectedObject.position;
          var destino1 = {x: origen1.x+tmp1};
          var origen2 = this.libro1.position;
          var destino2 = {x: origen2.x+tmp2};

          // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
          var movimiento1 = new TWEEN.Tween(origen1).to(destino1,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
          var movimiento2 = new TWEEN.Tween(origen2).to(destino2,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
        break;
      }
    }
  }

  pickingMesa (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.enMovimiento[0] < 1) {
      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object;

      // Variables temporales para retener el valor a sumar a la posición de los cajones y de los objetos dentro
      var tmp1 = 0;     
      var tmp2 = 0;  

      // Guardamos la referencia al this
      var that = this;

      // Si es uno de los cajones hacemos que salgan correctamente dependiendo de cada uno
      switch(selectedObject){
        // Cajón de abajo a la izquierda de la mesa
        case objetos.modelo.children[1]:
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Si está el cajón abierto lo cerramos y si está cerrado lo abrimos
          if(this.cajonesMesa[1]){
            tmp1 = 0.4;
            this.cajonesMesa[1] = false;
          }
          else{
            tmp1 = -0.4;
            this.cajonesMesa[1] = true;
          }

          // Accionamos el sonido de los cajones
          this.sonidoCajones.play();

          // Variables locales con los parámetros de interpolación, en este caso que el cajon se abra
          var origen1 = selectedObject.position;
          var destino1 = {z: origen1.z+tmp1};

          // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
          var movimiento1 = new TWEEN.Tween(origen1).to(destino1,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
        break;

        // Cajón del medio a la izquierda de la mesa
        case objetos.modelo.children[2]:
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Si está el cajón abierto lo cerramos y si está cerrado lo abrimos
          if(this.cajonesMesa[2]){
            tmp1 = -0.4;
            tmp2 = -30;
            this.cajonesMesa[2] = false;
          }
          else{
            tmp1 = 0.4;
            tmp2 = 30;
            this.cajonesMesa[2] = true;
          }

          // Accionamos el sonido de los cajones
          this.sonidoCajones.play();

          // Variables locales con los parámetros de interpolación, en este caso que el cajon se abra
          var origen1 = selectedObject.position;
          var destino1 = {z: origen1.z+tmp1};
          var origen2 = this.velas2.position;
          var destino2 = {x: origen2.x+tmp2};
          var origen3 = this.vela2.position;
          var destino3 = {x: origen3.x+tmp2};

          // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
          var movimiento1 = new TWEEN.Tween(origen1).to(destino1,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
          var movimiento2 = new TWEEN.Tween(origen2).to(destino2,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
          var movimiento3 = new TWEEN.Tween(origen3).to(destino3,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
        break;

        // Cajón de arriba a la izquierda de la mesa
        case objetos.modelo.children[3]:
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Si está el cajón abierto lo cerramos y si está cerrado lo abrimos
          if(this.cajonesMesa[3]){
            tmp1 = -0.4;
            this.cajonesMesa[3] = false;
          }
          else{
            tmp1 = 0.4;
            this.cajonesMesa[3] = true;
          }

          // Accionamos el sonido de los cajones
          this.sonidoCajones.play();

          // Variables locales con los parámetros de interpolación, en este caso que el cajon se abra
          var origen1 = selectedObject.position;
          var destino1 = {z: origen1.z+tmp1};

          // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
          var movimiento1 = new TWEEN.Tween(origen1).to(destino1,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
        break;

        // Cajón de abajo a la derecha de la mesa
        case objetos.modelo.children[4]:
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Si está el cajón abierto lo cerramos y si está cerrado lo abrimos
          if(this.cajonesMesa[4]){
            tmp1 = -0.4;
            tmp2 = -70;
            this.cajonesMesa[4] = false;
          }
          else{
            tmp1 = 0.4;
            tmp2 = 70;
            this.cajonesMesa[4] = true;
          }

          // Accionamos el sonido de los cajones
          this.sonidoCajones.play();

          // Variables locales con los parámetros de interpolación, en este caso que el cajon se abra
          var origen1 = selectedObject.position;
          var destino1 = {z: origen1.z+tmp1};
          var origen2 = this.libros2.position;
          var destino2 = {x: origen2.x+tmp2};

          // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
          var movimiento1 = new TWEEN.Tween(origen1).to(destino1,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
          var movimiento2 = new TWEEN.Tween(origen2).to(destino2,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
        break;

        // Cajón del medio a la derecha de la mesa
        case objetos.modelo.children[5]:
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Si está el cajón abierto lo cerramos y si está cerrado lo abrimos
          if(this.cajonesMesa[5]){
            tmp1 = -0.4;
            this.cajonesMesa[5] = false;
          }
          else{
            tmp1 = 0.4;
            this.cajonesMesa[5] = true;
          }

          // Accionamos el sonido de los cajones
          this.sonidoCajones.play();

          // Variables locales con los parámetros de interpolación, en este caso que el cajon se abra
          var origen1 = selectedObject.position;
          var destino1 = {z: origen1.z+tmp1};

          // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
          var movimiento1 = new TWEEN.Tween(origen1).to(destino1,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
        break;

        // Cajón de arriba a la derecha de la mesa
        case objetos.modelo.children[6]:
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Si está el cajón abierto lo cerramos y si está cerrado lo abrimos
          if(this.cajonesMesa[6]){
            tmp1 = -0.4;
            tmp2 = -50;
            this.cajonesMesa[6] = false;
          }
          else{
            tmp1 = 0.4;
            tmp2 = 50;
            this.cajonesMesa[6] = true;
          }

          // Accionamos el sonido de los cajones
          this.sonidoCajones.play();

          // Variables locales con los parámetros de interpolación, en este caso que el cajon se abra
          var origen1 = selectedObject.position;
          var destino1 = {z: origen1.z+tmp1};
          var origen2 = this.papeles3.position;
          var destino2 = {x: origen2.x+tmp2};

          // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
          var movimiento1 = new TWEEN.Tween(origen1).to(destino1,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
          var movimiento2 = new TWEEN.Tween(origen2).to(destino2,800).start().onComplete(function(){that.enMovimiento[0] = 0;});
        break;
      }
    }
  }

  pickingArmarioDerecha (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.enMovimiento[0] < 1) {

      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object; 

      // Usamos userData para poder acceder al objeto completo y no solo al mesh
      if(selectedObject.userData){
        // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
        this.enMovimiento[0]++;

        // Accionamos el sonido de las puertas de los armarios
        this.sonidoArmario.play();

        // Recibimos clic con la funcion que hemos programado en el objeto
        selectedObject.userData.recibeClic(selectedObject, this.puertasArmarioDcha, this.enMovimiento);    
      }
    }
  }

  pickingArmarioIzquierda (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.enMovimiento[0] < 1) {

      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object; 

      // Usamos userData para poder acceder al objeto completo y no solo al mesh
      if(selectedObject.userData){
        // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
        this.enMovimiento[0]++;

        // Accionamos el sonido de las puertas de los armarios
        this.sonidoArmario.play();

        // Recibimos clic con la funcion que hemos programado en el objeto
        selectedObject.userData.recibeClic(selectedObject, this.puertasArmarioIzq, this.enMovimiento);    
      }
    }
  }

  pickingCajaHerr (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true);

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.enMovimiento[0] < 1) {
      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object;

      // Variable temporal para retener el valor a sumar a la rotacion de la tapa de la caja de herramientas
      var tmp;

      // Guardamos la referencia al this
      var that = this;  

      // Solo abrimos la caja de herramientas si alguna puerta del armario está abierta
      if(this.puertasArmarioDcha[0] || this.puertasArmarioDcha[1]){
        // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
        this.enMovimiento[0]++;

        // Si no está abierta la abrimos y si no la cerramos
        if(this.tapaCajaHerr == false){
          // Accionamos el sonido de haber resuelto un puzzle
          this.sonidoPuzzleResuelto.play();

          tmp = Math.PI/3.5;
          this.tapaCajaHerr = true;
        }
        else{
          tmp = -Math.PI/3.5;
          this.tapaCajaHerr = false;
        }

        // Variables locales con los parámetros de interpolación, en este caso que el tapa de la caja de herramientas se abra
        var origen = this.puertaCajaHerr.rotation;
        var destino = {z: origen.z+tmp};

        // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
        var movimiento = new TWEEN.Tween(origen).to(destino,1000).start().onComplete(function(){that.enMovimiento[0] = 0;});
      }
    }
  }

  pickingLlaveInglesa(raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0) {

      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object;

      // Si clicamos en la llave hacemos que desaparezca de la escena y almacenamos la llave para el jugador
      if(this.tapaCajaHerr == true && this.poseerLlaveInglesa[0] == false){
        selectedObject.visible = false;
        this.poseerLlaveInglesa[0] = true;

        showCard("Has obtenido LLAVE INGLESA");
      }
    }
  }

  pickingCajaElectrica (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.enMovimiento[0] < 1) {
      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object; 
      var tmp = this.palancaArriba[0];

      // Usamos userData para poder acceder al objeto completo y no solo al mesh
      if(selectedObject.userData){

        if(selectedObject.parent.parent == this.cajaElectrica.palanca){
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;
        }

        // Recibimos clic con la funcion que hemos programado en el objeto
        selectedObject.userData.recibeClic(selectedObject, this.palancaArriba, this.poseerLlaveInglesa, this.luzReparada, this.enMovimiento);    
      }

      // Procesamos las luces si desactivamos/activamos la corriente
      if(tmp != this.palancaArriba[0]){            // Si ha cambiado la posición de la palanca
        if(this.palancaArriba[0] == false){
          this.panelLight.visible = false;                                    // Luz apagada
          this.cajaElectrica.cajaAQuitar.material = this.cristalBlanco;       // Cristal blanco
        }
        else if(this.luzReparada[0] == true){
          // Accionamos el sonido de la electricidad cuando está restaurada, así como el del ventilador
          this.sonidoElectricidad.play();
          this.sonidoVentilador.play(); 

          // Aumentamos también el sonido de la música
          this.musicaFondo.setVolume(0.04);

          this.panelLight.color = new THREE.Color(0x008000);                  // Luz verde
          this.panelLight.visible = true;
          this.cajaElectrica.cajaAQuitar.material = this.cristalVerde;        // Cristal verde
        }
        else{
          this.panelLight.color = new THREE.Color(0xFF0000);                  // Luz roja
          this.panelLight.visible = true;                                     
          this.cajaElectrica.cajaAQuitar.material = this.cristalRojo;       // Cristal rojo
        }
      }
    }
  }

  pickingCajaFuerte (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.enMovimiento[0] < 1) {
      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object;

      // Guardamos la referencia al this
      var that = this; 

      // Si no está abierta la abrimos y si no la cerramos
      if(this.tapaCajaFuerte == false && this.luzReparada[0] && this.palancaArriba[0]){
        // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
        this.enMovimiento[0]++;

        // Accionamos el sonido de haber resuelto un puzzle
        this.sonidoPuzzleResuelto.play();

        // Variables locales con los parámetros de interpolación, en este caso que la puerta de la caja fuerte se abra
        var origen = this.puertaCajaFuerte.rotation;
        var destino = {y: origen.y+Math.PI/2};

        // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
        var movimiento = new TWEEN.Tween(origen).to(destino,2000).start().onComplete(function(){that.enMovimiento[0] = 0;});

        this.tapaCajaFuerte = true;
      }
      else if(this.luzReparada[0] && this.palancaArriba[0]){
        // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
        this.enMovimiento[0]++;

        // Variables locales con los parámetros de interpolación, en este caso que la puerta de la caja fuerte se abra
        var origen = this.puertaCajaFuerte.rotation;
        var destino = {y: origen.y-Math.PI/2};

        // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
        var movimiento = new TWEEN.Tween(origen).to(destino,2000).start().onComplete(function(){that.enMovimiento[0] = 0;});

        this.tapaCajaFuerte = false;
      }
      else {
        showCard("Se trata de una caja fuerte electroimantada, se necesita de corriente eléctrica para abrirla" +
                     "\n\nEs necesario REPARAR LA ELECTRICIDAD primero");
      }
    }
  }

  pickingLlaveSeguridad(raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0) {

      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object;

      // Si clicamos en la llave hacemos que desaparezca de la escena y almacenamos la llave para el jugador
      if(this.tapaCajaFuerte == true && this.poseerLlaveSeguridad[0] == false){
        selectedObject.visible = false;
        this.poseerLlaveSeguridad[0] = true;

        showCard("Has obtenido LLAVE DE SEGURIDAD");
      }
    }
  }

  pickingCajaFusibles (raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.enMovimiento[0] < 1) {
      // Se puede referenciar el Mesh clicado
      var selectedObject = pickedObjects[0].object;

      // Usamos userData para poder acceder al objeto completo y no solo al mesh
      if(selectedObject.userData){

        if((selectedObject.parent.parent == this.cajaFusibles.tapa && this.poseerLlaveSeguridad[0]) ||
          selectedObject.parent.parent == this.cajaFusibles.fusible7){
          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Dependiendo de lo que clicamos tenemos efectos de sonido distinto
          if(selectedObject.parent.parent == this.cajaFusibles.fusible7){
            this.sonidoClic.play();
          }
          else{
            this.sonidoCajaMetal.play();
          }
        }

        // Recibimos clic con la funcion que hemos programado en el objeto
        selectedObject.userData.recibeClic(selectedObject, this.puertaCajaFusibles, this.fusiblesSubidos, this.poseerLlaveSeguridad, this.enMovimiento);    
      }
    }
  }

  pickingPuerta(raycaster, objetos) {
    // objetos es el array de objetos donde se van a buscar intersecciones con el rayo
    // Los objetos alcanzados por el rayo, entre los seleccionables, se devuelven en otro array
    var pickedObjects = raycaster.intersectObjects(objetos.children, true) ;

    // pickedObjects es un vector ordenado desde el objeto más cercano
    if (pickedObjects.length > 0 && this.enMovimiento[0] < 1) {

      // Si ya se puede abrir la puerta al haber completado todos los pasos
      if(this.fusiblesSubidos[0] && this.palancaArriba[0]){
        // Se puede referenciar el Mesh clicado
        var selectedObject = pickedObjects[0].object;
        
        if(selectedObject == objetos.modelo.children[4]){

          // Indicamos que está un objeto en movimiento para que no se pueda forzar un movimiento mientras otro se está produciendo
          this.enMovimiento[0]++;

          // Rotamos el pomo
          objetos.modelo.children[4].rotateZ(Math.PI/4);
          objetos.modelo.children[4].position.x = 5.47;
          objetos.modelo.children[4].position.y = 0.3;

          // Accionamos el sonido de haber resuelto el scape room y paramos la música de fondo
          this.sonidoFinalResuelto.play();
          this.musicaFondo.stop();

          // Variables locales con los parámetros de interpolación, en este caso que la puerta se abra
          var origen = this.puertaNodo.rotation;
          var destino = {y: -Math.PI/1.8};

          // Guardamos la referencia al this
          var that = this;

          // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
          var movimiento1 = new
          TWEEN.Tween(origen).to(destino,2000)
          .onComplete(function(){
            setTimeout(function(){
              finalJuego(that);
            }, 450);
          })
          .start();
        }
      }
      else {
        // Mostramos un mensaje tras tocar la puerta
        if(this.luzReparada[0] && this.palancaArriba[0]){
          // Se muestra el mensaje sin haber terminado de completar todos los pasos
          showCard("La puerta se abre eléctricamente, pero por algún motivo parece no estar conectada a la luz" +
                     "\n\nEs necesario ACTIVAR LA CORRIENTE DE LA PUERTA primero");
        }
        else{
          // Se muestra el mensaje sin haber encendido la luz aún
          showCard("La puerta se abre eléctricamente, pero parece no haber corriente" +
                     "\n\nEs necesario REPARAR LA ELECTRICIDAD primero");
        }
      }
    }

    function finalJuego (that) {
      // Creamos el string que saldrá al pasarse el juego
      var str = "----------------------------------------THE DIM ROOM---------------------------------------" +
                "\n\nHas podido salir de la habitacion" +
                "\n\n¡Felicidades, te has pasado el juego!";

      // Se muestra el mensaje tras abrir la puerta
      showCard(str);

      that.modoJuegoTerminado = true;
    }
  }

  comprobarColisiones (){
    // Configuramos la posicion de la figura y el rayo
    this.figura.getWorldPosition(this.posicion);

    // Cambiamos la posicion en y para que la colisión se produzca a la altura de las rodillas del personaje
    // para así poder colisionar con los escritorios y mesas
    this.posicion.y = 80;

    // Calculamos el rayo con la direccion debe estar normalizada
    this.rayo.set(this.posicion, this.direccion.normalize());  

    // Procesamos las colisiones con cada uno de los candidatos a colisionar
    for(let i=0; i<this.candidatosColisiones.length; i++){
      this.actualizarColisiones(this.candidatosColisiones[i]);
    }
  }

  actualizarColisiones (candidato) {
    // Obtenemos un array de figuras impactadas
    var impactados = this.rayo.intersectObjects(candidato.children, true);

    // Si hemos impactado con algún objeto
    if(impactados.length > 0){
      var distanciaMasCercano = impactados[0].distance;     // Calculamos la distancia al punto impactado

      // Si la distancia es menor a 80 evitamos que la cámara avance
      if(distanciaMasCercano <= 80){
        // Para ello movemos la cámara a una posición justo anterior antes de la colisión
        this.cameraControl.movementSpeed = -10;
        var offset = this.direccion.clone().multiplyScalar(distanciaMasCercano/200);    // Calculamos el offset en base a la distancia
        this.posicion.sub(offset);                                                      // Actualizamos la posicion

        // Subimos la posición para la colisión que antes hemos bajado
        this.posicion.y = 180;

        // Actualizamos la cámara con la posiicón que queremos 
        this.camera.position.copy(this.posicion);
        this.cameraControl.movementSpeed = 2.5;
      }
    }
  }

  update () {
    
    // Si hemos pausado (al mostrar una card), paramos aquí
    if (window.isPaused) return;

    if (this.stats) this.stats.update();
    
    // Se actualizan los elementos de la escena para cada frame

    // Lo primero que actualizamos es el movimiento de la cámara
    // Corregimos su posicion para que que no pueda avanzar o retroceder sobre el eje Y
    this.corregirCamera();
    
    // Se actualiza la posición de la cámara según su controlador
    if(this.modoJuegoTerminado == false){         // Si el juego no está terminado
      this.cameraControl.update(1);
      this.comprobarColisiones();
    }
    else if(this.modoDesarrollador == true){      // Si está terminado y queremos verlo en modo desarrollador
      this.cameraControl.update(1);
    }

    // Se actualiza la GUI
    this.GUIUpdate();
    
    // Se actualizan todos los objetos
    this.puerta.update();
    this.escritorio.update();
    this.mesa.update();
    this.armarioDerecha.update();
    this.armarioIzquierda.update();
    this.cajaHerr.update();
    this.papeles1.update();
    this.libros2.update();
    this.libro1.update();
    this.velas2.update();
    this.papelera.update();
    this.cajaElectrica.update();
    this.parteCajaFuerte.update();
    this.cajaFusibles.update();

    // Actualizamos los movimientos tween
    TWEEN.update(); 

    // Actualizamos algunos elementos según si estamos en modo desarrollador o no o si vamos progresando en el juego
    if(this.modoDesarrollador == true){
      // Se escribe un mensaje que aparecerá en pantalla
      this.setMessage("Modo desarrolador");
    }
    else if(this.modoJuegoTerminado == false){
      this.setMessage("Pulsa Q para obtener ayuda");

      // Se actualiza la luz según la posición de la cámara y la posición a la que apunta
      this.lightsUpdate();

      // Actualizamos las variables para las colsiones
      this.figura.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
      this.direccion.set(this.cameraControl.targetPosition.x, this.cameraControl.targetPosition.y,this.cameraControl.targetPosition.z);
    }
    else{
      this.setMessage("Felicidades");
    }

    // Actualizamos según si está la corriente eléctrica reestablecida
    if(this.luzReparada[0] && this.palancaArriba[0]){
      // Encendemos el ordenador
      this.ordenadorEncendido.visible = true;
      this.ordenador.visible = false;

      // Hacemos que se active la animación del ventilador y su sonido
      this.ventilador.update();

      // Cambiamos la intensidad de la luz ambiental
      this.ambientLight.intensity = 1;

      // Apagamos la luz de la linterna
      this.linternaLight.visible = false;
    }
    else if(this.luzReparada[0]){
      // Apagamos el ordenador
      this.ordenadorEncendido.visible = false;
      this.ordenador.visible = true;

      // Y apagamos el sonido del ventilador
      this.sonidoVentilador.pause();

      // Cambiamos la intensidad de la luz ambiental
      this.ambientLight.intensity = this.ambientLightIntensidad;
    }
    
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }


  setMessage(str){
    document.getElementById("Messages").innerHTML = "<h2>" + str + "</h2>";
  }
}


/// La función main
$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");
  window.scene = scene;

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());

  // Se añaden los listener para leer cuando se presione una tecla
  window.addEventListener ("keydown", (event) => scene.onKeyDown(event));

  // Se añaden los listener para leer cuando se clica el ratón
  window.addEventListener ("mousedown", (event) => scene.onMouseDown(event));
  
  // Que no se nos olvide, la primera visualización.
  scene.update();
});