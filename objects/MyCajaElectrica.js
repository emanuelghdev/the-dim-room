import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { CSG } from '../libs/CSG-v2.js'
 
class MyCajaElectrica extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Creamos un objeto para la caja englobante
    this.cajaEnglobante = new THREE.Box3();
    
    // Creamos la estructura principal
    this.estructura = this.createEstructura();

    // Creamos la palanca de la luz
    this.palanca = this.createPalanca();

    // Creamos la caja de cables que va dentro
    this.caja = this.createCaja();

    // Creamos los tubos
    this.tubos = this.createTubos();
    
    // Y añadimos todo como hijo del Object3D (el this)
    this.add (this.estructura);
    this.add (this.palanca);
    this.add (this.caja);
    this.add (this.tubos);
    
    // Las geometrías se crean centradas en el origen.
    // Subimos el objeto para que esté sobre el eje de coordenadas
    this.position.y += 48;

    // Calculamos la caja englobante para las colisiones
    this.cajaEnglobante.setFromObject(this);
  }

  recibeClic(objeto, arriba, llave, reparada, enMovimiento){
    // Procesamos el clic según si clicamos en la palanca o en el tubo roto
    if(objeto.parent.parent == this.palanca && arriba[0]){  // Si el objeto clicado es la palanca y está arriba la bajamos
        // Variables locales con los parámetros de interpolación, en este caso que la palanca se baje
        var origen = this.palanca.rotation;
        var destino = {x: origen.x+Math.PI/1.5};
        
        // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
        var movimiento = new TWEEN.Tween(origen).to(destino,500).start().onComplete(function(){enMovimiento[0] = 0;});

        arriba[0] = false;
    }
    else if(objeto.parent.parent == this.palanca){          // Si el objeto clicado es la palanca y está bajada la subimos
        // Variables locales con los parámetros de interpolación, en este caso que la palanca se suba
        var origen = this.palanca.rotation;
        var destino = {x: origen.x-Math.PI/1.5};
        
        // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
        var movimiento = new TWEEN.Tween(origen).to(destino,500).start().onComplete(function(){enMovimiento[0] = 0;});

        arriba[0] = true;
    }
    else if (llave[0] && reparada[0] == false && arriba[0] == false){    // Si el obj clicado es el tubo roto lo reparamos
        this.tubo3.rotateZ(Math.PI/8);
        this.tubo3.position.x -= 8;
        this.tubo3.position.z += 7;

        reparada[0] = true;
    }
    else if (reparada[0] == false && arriba[0] == false){       // Si clicamos en el tubo y no está reparada la caja
        window.alert("Parece hacer falta alguna herramienta para reparar el cableado" +
                     "\n\nEs necesario OBTENER LA HERRAMIENTA primero");
    }   
    else if (reparada[0] == false){                             // Si clicamos en el tubo, no está reparada la caja y la corriente está activa
        window.alert("No se puede tocar el cableado eléctrico con la corriente activa" +
                     "\n\nEs necesario DESACTIVAR LA CORRIENTE primero");
    }
  }

  createEstructura (){
    // El nodo del que van a colgar todas las partes de la estructura
    var nodoEstructura = new THREE.Object3D();

    // La geometría necesaria para la estructura será una caja
    // Para completar la estructura también necesitaremos una geometría esfera 
    var geometryTabla = new THREE.BoxGeometry (40,8,20);
    var geometryEsfera = new THREE.SphereGeometry (15,32,16); 

    // Como material se crea uno a partir de una textura
    var textureMetal = new THREE.TextureLoader().load('imgs/metal2.jpg');
    var materialMetal = new THREE.MeshPhongMaterial ({map: textureMetal});

    // Construimos los mesh correspondientes
    var bloqueEstructura = new THREE.Mesh (geometryTabla, materialMetal);
    var esferaPerfilar = new THREE.Mesh (geometryEsfera, materialMetal);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    esferaPerfilar.scale.x = 1.5;

    // Creamos objetos CSG y operamos con ellos
    var csg1 = new CSG();
    var csg2 = new CSG();
    var csg3 = new CSG();

    csg1.intersect([bloqueEstructura,esferaPerfilar]);     // Perfilamos la tabla

    // Asignamos la tabla al objeto csg
    var tabla1 = csg1.toMesh();
    var tabla2 = csg1.toMesh();
    var tablaAQuitar1 = csg1.toMesh();
    var tablaAQuitar2 = csg1.toMesh();

    // Transformamos una tabla igual a la que tenemos para conseguir con csg solo el borde
    tablaAQuitar1.scale.x = 0.9;
    tablaAQuitar1.scale.y = 0.9;
    tablaAQuitar1.scale.z = 0.9;

    tablaAQuitar1.position.y += 0.5;

    tablaAQuitar2.scale.x = 1.5;
    tablaAQuitar2.scale.z = 1.5;

    tablaAQuitar2.position.y -= 0.5;

    csg2.subtract([tabla1,tablaAQuitar1]);                   // Quitamos al bloque uno más pequeño para obtener sus bordes
    csg3.subtract([tabla2,tablaAQuitar2]);                    // Hacemos una operación para obtener una puerta con la misma forma que el bloque

    // Asignamos la estructura final al objeto csg
    var tablaEstructura = csg2.toMesh();  
    var tablaPuerta = csg3.toMesh();        

    // Ahora ya podemos aplicar las transformaciones correspondientes a la tabla
    tablaEstructura.scale.x = 4;
    tablaEstructura.scale.y = 12;
    tablaEstructura.scale.z = 12;

    tablaPuerta.scale.x = 4;
    tablaPuerta.scale.y = 12;
    tablaPuerta.scale.z = 12;

    tablaPuerta.rotateZ(Math.PI/1.2);

    tablaPuerta.position.x -= 126;
    tablaPuerta.position.y += 125;

    // Añadimos al nodo de la estructura todos los mesh creados
    nodoEstructura.add(tablaEstructura);
    nodoEstructura.add(tablaPuerta);

    // Seteamos el userData para el picking
    tablaEstructura.userData = null;
    tablaPuerta.userData = null;

    return nodoEstructura;
  }

  createPalanca () {
    // El nodo del que van a colgar todas las partes de la palanca
    var nodoPalanca = new THREE.Object3D();
    var nodoPalancaFinal = new THREE.Object3D();

    // La geometría necesaria para la palanca será de cilindro y esfera
    var geometryPrisma = new THREE.CylinderGeometry (1,1,4,6);
    var geometryEsfera = new THREE.SphereGeometry (8,32,16);

    // Como materiales se crean a partir de texturas
    var textureMetal1 = new THREE.TextureLoader().load('imgs/metal3.jpg');
    var materialMetal1 = new THREE.MeshPhongMaterial ({map: textureMetal1});
    var textureMetal2 = new THREE.TextureLoader().load('imgs/metal-rojo.jpg');
    var materialMetal2 = new THREE.MeshPhongMaterial ({map: textureMetal2});
    
    // Ya podemos construir el Mesh
    var palanca1 = new THREE.Mesh (geometryPrisma, materialMetal2);
    var palanca2 = new THREE.Mesh (geometryPrisma, materialMetal2);
    var tuerca1 = new THREE.Mesh (geometryPrisma, materialMetal1);
    var tuerca2 = new THREE.Mesh (geometryPrisma, materialMetal1);
    var pomoPalanca = new THREE.Mesh (geometryEsfera, materialMetal2);

    // Transformamos las partes de la palanca
    palanca1.scale.x = 5;
    palanca1.scale.y = 10;
    palanca1.scale.z = 5;

    palanca1.rotateZ(Math.PI/2);

    palanca1.position.x += 80;
    palanca1.position.y -= 8;
    palanca1.position.z += 52;

    palanca2.scale.x = 5;
    palanca2.scale.y = 30;
    palanca2.scale.z = 5;

    palanca2.rotateX(Math.PI/2);

    palanca2.position.x += 100;
    palanca2.position.y -= 8;
    palanca2.position.z -= 4;

    tuerca1.scale.x = 8;
    tuerca1.scale.y = 1.5;
    tuerca1.scale.z = 8;

    tuerca1.rotateX(Math.PI/2);
    tuerca1.rotateZ(Math.PI/2);

    tuerca1.position.x += 62;
    tuerca1.position.y -= 8;
    tuerca1.position.z += 52;

    tuerca2.scale.x = 10;
    tuerca2.scale.y = 1.5;
    tuerca2.scale.z = 8;

    tuerca2.rotateX(Math.PI/2);
    tuerca2.rotateZ(Math.PI/3.5);

    tuerca2.position.x += 98;
    tuerca2.position.y -= 8;
    tuerca2.position.z += 50;

    pomoPalanca.scale.z = 1.2;

    pomoPalanca.position.x += 100;
    pomoPalanca.position.y -= 8;
    pomoPalanca.position.z -= 68;

    // Y añadirlo como hijo del Object3D (el this)
    nodoPalanca.add (palanca1);
    nodoPalanca.add (palanca2);
    nodoPalanca.add (tuerca1);
    nodoPalanca.add (tuerca2);
    nodoPalanca.add (pomoPalanca);

    // Movemos el nodo de la palanca para que al provocar un giro sobre X gire sobre donde debería girar
    nodoPalanca.position.x -= 59;
    nodoPalanca.position.y += 8;
    nodoPalanca.position.z -= 52;

    // Hacemos tranformaciones para que la palanca vuelva a su posición correcta
    nodoPalancaFinal.position.x += 59;
    nodoPalancaFinal.position.y -= 8;
    nodoPalancaFinal.position.z += 52;
    nodoPalancaFinal.add(nodoPalanca);

    // Seteamos el userData para el picking
    palanca1.userData = this;
    palanca2.userData = this;
    tuerca1.userData = this;
    tuerca2.userData = this;
    pomoPalanca.userData = this;

    return nodoPalancaFinal;
  }

  createCaja () {
    // El nodo del que van a colgar todas las partes de la caja
    var nodoCaja = new THREE.Object3D();

    // La geometría necesaria para la caja central será una caja
    var geometryCaja = new THREE.BoxGeometry (120,60,80);

    // Como material se crea uno a partir de una textura
    var textureMetal = new THREE.TextureLoader().load('imgs/metal3.jpg');
    var materialMetal = new THREE.MeshPhongMaterial ({map: textureMetal});
    var panelMat = new THREE.MeshPhongMaterial ({color: 0xFF0000, transparent: true, opacity: 0.8});
    var texturePegatina = new THREE.TextureLoader().load('imgs/cartel-voltaje.jpg');
    var materialPegatina = new THREE.MeshPhongMaterial ({map: texturePegatina});

    // Construimos los mesh correspondientes
    var caja = new THREE.Mesh (geometryCaja, materialMetal);
    this.cajaAQuitar = new THREE.Mesh (geometryCaja, panelMat);
    var pegatina = new THREE.Mesh (geometryCaja, materialPegatina);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    caja.position.y -= 10;
    caja.position.z += 50;

    this.cajaAQuitar.scale.x = 0.2;
    this.cajaAQuitar.scale.y = 0.2;
    this.cajaAQuitar.scale.z = 0.2;

    this.cajaAQuitar.position.x += 35;
    this.cajaAQuitar.position.y += 15;
    this.cajaAQuitar.position.z += 70;

    pegatina.scale.x = 0.3;
    pegatina.scale.y = 0.3;
    pegatina.scale.z = 0.4;

    pegatina.position.x -= 15;
    pegatina.position.y += 12;
    pegatina.position.z += 50;

    // Creamos objetos CSG y operamos con ellos
    var csg = new CSG();

    csg.subtract([caja,this.cajaAQuitar]);     // Quitamos el hueco donde irá el panel de luz

    // Asignamos la tabla al objeto csg
    var caja = csg.toMesh();

    // Añadimos al nodo de los componentes todos los mesh creados
    nodoCaja.add(caja);
    nodoCaja.add(this.cajaAQuitar);
    nodoCaja.add(pegatina);

    // Seteamos el userData para el picking
    caja.userData = null;
    this.cajaAQuitar.userData = null;
    pegatina.userData = null;

    return nodoCaja;
  }

  createTubos() {
    // El nodo del que van a colgar todas las partes de los tubos
    var nodoTubos = new THREE.Object3D();

    // La geometría necesaria para el componente central será una caja
    var geometryPrisma = new THREE.CylinderGeometry (1,1,4,6);

    // Como material se crea uno a partir del color amarillo y otro a partir de una textura
    var tuboMat = new THREE.MeshPhongMaterial ({color: 0xFFBA14}); 
    var textureMetal = new THREE.TextureLoader().load('imgs/metal4.jpg');
    var materialMetal = new THREE.MeshPhongMaterial ({map: textureMetal});

    // Construimos los mesh correspondientes
    var tubo = new THREE.Mesh (geometryPrisma, tuboMat);
    var tuerca = new THREE.Mesh (geometryPrisma, tuboMat);
    var tubo1 = new THREE.Mesh (geometryPrisma, materialMetal);
    var tubo2 = new THREE.Mesh (geometryPrisma, materialMetal);
    this.tubo3 = new THREE.Mesh (geometryPrisma, materialMetal);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    tubo.rotateX(Math.PI/2);

    tuerca.scale.x = 1.2;
    tuerca.scale.y = 0.25;
    tuerca.scale.z = 1.2;

    tuerca.rotateX(Math.PI/2);

    tuerca.position.z -= 2;

    // Creamos objetos CSG y operamos con ellos
    var csg = new CSG();

    csg.union([tubo,tuerca]);     // PQuitamos el hueco donde irá el panel de luz

    // Asignamos los tubos y la tuerca al objeto csg
    var preTubo1 = csg.toMesh();
    var preTubo2 = csg.toMesh();
    var preTubo3 = csg.toMesh();
    var posTubo1 = csg.toMesh();
    var posTubo2 = csg.toMesh();
    var posTubo3 = csg.toMesh();

    // Ahora podemos hacer todas las transformaciones necesarias con cada trozo de tubo y tuerca
    preTubo1.scale.x = 10;
    preTubo1.scale.y = 10;
    preTubo1.scale.z = 8;

    preTubo1.position.x -= 40;
    preTubo1.position.z -= 5;

    tubo1.scale.x = 9;
    tubo1.scale.y = 14;
    tubo1.scale.z = 9;

    tubo1.rotateX(Math.PI/2);

    tubo1.position.x -= 40;
    tubo1.position.z -= 50;

    posTubo1.scale.x = 10;
    posTubo1.scale.y = 10;
    posTubo1.scale.z = 8;

    posTubo1.rotateX(Math.PI);

    posTubo1.position.x -= 40;
    posTubo1.position.z -= 95;

    preTubo2.scale.x = 10;
    preTubo2.scale.y = 10;
    preTubo2.scale.z = 8;

    preTubo2.position.z -= 5;

    posTubo2.scale.x = 10;
    posTubo2.scale.y = 10;
    posTubo2.scale.z = 8;

    tubo2.scale.x = 9;
    tubo2.scale.y = 14;
    tubo2.scale.z = 9;

    tubo2.rotateX(Math.PI/2);

    tubo2.position.z -= 50;

    posTubo2.rotateX(Math.PI);

    posTubo2.position.z -= 95;

    preTubo3.scale.x = 10;
    preTubo3.scale.y = 10;
    preTubo3.scale.z = 8;

    preTubo3.position.x += 40;
    preTubo3.position.z -= 5;

    this.tubo3.scale.x = 9;
    this.tubo3.scale.y = 14;
    this.tubo3.scale.z = 9;

    this.tubo3.rotateX(Math.PI/2);

    // Procesamiento para que el tubo se encuentre desplazado de su posición correcta
    this.tubo3.rotateZ(-Math.PI/8);
    this.tubo3.position.x += 8;
    this.tubo3.position.z -= 7;

    this.tubo3.position.x += 40;
    this.tubo3.position.z -= 50;

    posTubo3.scale.x = 10;
    posTubo3.scale.y = 10;
    posTubo3.scale.z = 8;

    posTubo3.rotateX(Math.PI);

    posTubo3.position.x += 40;
    posTubo3.position.z -= 95;


    // Añadimos al nodo de los componentes todos los mesh creados
    nodoTubos.add(preTubo1);
    nodoTubos.add(tubo1);
    nodoTubos.add(posTubo1);
    nodoTubos.add(preTubo2);
    nodoTubos.add(tubo2);
    nodoTubos.add(posTubo2);
    nodoTubos.add(preTubo3);
    nodoTubos.add(this.tubo3);
    nodoTubos.add(posTubo3);

    // Seteamos el userData para el picking
    preTubo1.userData = null;
    tubo1.userData = null;
    posTubo1.userData = null;
    preTubo2.userData = null;
    tubo2.userData = null;
    posTubo2.userData = null;
    preTubo3.userData = null;
    this.tubo3.userData = this;
    posTubo3.userData = null;

    return nodoTubos;
  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    TWEEN.update();

    // Actualizamos la caja englobante para las colisiones
    this.cajaEnglobante.setFromObject(this);
  }
}

export { MyCajaElectrica };
