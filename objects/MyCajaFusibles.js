import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'
 
class MyCajaFusibles extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Creamos un objeto para la caja englobante
    this.cajaEnglobante = new THREE.Box3();

    // Creamos la estructura principal
    this.estructura = this.createEstructura();

    // Creamos la tapa de la caja
    this.tapa = this.createTapa();

    // Creamos los fusibles
    this.fusibles = this.createFusibles();
    
    // Y añadimos todo como hijo del Object3D (el this)
    this.add (this.estructura);
    this.add (this.tapa);
    this.add (this.fusibles);
    
    // Las geometrías se crean centradas en el origen.
    // Movemos el objeto para que esté sobre el eje de coordenadas
    this.position.y += 6;
  }

  recibeClic(objeto, abierta, subidos, llave, enMovimiento){
    // Procesamos el clic según si clicamos en la puerta o en el fusible de la puerta
    if(objeto.parent.parent == this.tapa && abierta[0] == false && llave[0]){  // Si el objeto clicado es la puerta y tenemos la llave lo abrimos
        // Variables locales con los parámetros de interpolación, en este caso que la palanca se suba
        var origen = this.tapa.rotation;
        var destino = {z: origen.z+Math.PI/1.5};
        
        // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
        var movimiento = new TWEEN.Tween(origen).to(destino,1000).start().onComplete(function(){enMovimiento[0] = 0;});

        abierta[0] = true;
    }
    else if(objeto.parent.parent == this.tapa && abierta[0] == false){  // Si el objeto clicado es la puerta y no tenemos la llave
        showCard("La caja de fusibles está cerrada y parece necesitar una llave para poder abrirse" +
                     "\n\nEs necesario OBTENER LA LLAVE primero" +
                     "\n\nNo parece algo de lo que preocuparse sin tener la red eléctrica activa");
    }
    else if(objeto.parent.parent == this.tapa){          // Si el objeto clicado es la puerta y está abierta la cerramos
        // Variables locales con los parámetros de interpolación, en este caso que la palanca se suba
        var origen = this.tapa.rotation;
        var destino = {z: origen.z-Math.PI/1.5};
        
        // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
        var movimiento = new TWEEN.Tween(origen).to(destino,1000).start().onComplete(function(){enMovimiento[0] = 0;});

        abierta[0] = false;
    }
    else if (objeto.parent.parent == this.fusible7 && subidos[0] == false){    // Si el obj clicado es el fusible de la puerta lo subimos
        // Variables locales con los parámetros de interpolación, en este caso que la palanca se suba
        var origen = this.fusible7.rotation;
        var destino = {x: origen.x-2*(Math.PI/2.8)};
        
        // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
        var movimiento = new TWEEN.Tween(origen).to(destino,100).start().onComplete(function(){enMovimiento[0] = 0;});

        subidos[0] = true;
    }
    else if (objeto.parent.parent == this.fusible7){    // Si el obj clicado es el fusible de la puerta y está subido lo bajamos
        // Variables locales con los parámetros de interpolación, en este caso que la palanca se suba
        var origen = this.fusible7.rotation;
        var destino = {x: origen.x+2*(Math.PI/2.8)};
        
        // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
        var movimiento = new TWEEN.Tween(origen).to(destino,100).start().onComplete(function(){enMovimiento[0] = 0;});

        subidos[0] = false;
    }
  }

  createEstructura (){
    // El nodo del que van a colgar todas las partes de la estructura
    var nodoEstructura = new THREE.Object3D();

    // La geometría necesaria para la estructura será una caja 
    var geometryTabla = new THREE.BoxGeometry (50,12,30);

    // Como material se crea uno a partir de una textura
    var textureMetal = new THREE.TextureLoader().load('imgs/metal3.jpg');
    var materialMetal = new THREE.MeshPhongMaterial ({map: textureMetal});

    // Construimos los mesh correspondientes
    var bloque = new THREE.Mesh (geometryTabla, materialMetal);
    var tapa = new THREE.Mesh (geometryTabla, materialMetal);
    var tablaAQuitar = new THREE.Mesh (geometryTabla, materialMetal);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    tablaAQuitar.scale.x = 0.95;
    tablaAQuitar.scale.y = 0.9;
    tablaAQuitar.scale.z = 0.9;

    tablaAQuitar.position.y += 3;

    // Creamos objetos CSG y operamos con ellos
    var csg = new CSG();

    csg.subtract([bloque,tablaAQuitar]);     // Quitamos al bloque otro ligeramente más pequeño para obtener solo el borde

    // Asignamos la tabla al objeto csg
    var estructuraExterna = csg.toMesh();

    // Añadimos al nodo de la estructura todos los mesh creados
    nodoEstructura.add(estructuraExterna);

    // Seteamos el userData para el picking
    estructuraExterna.userData = null;

    return nodoEstructura;
  }

  createTapa () {
    // El nodo del que van a colgar todas las partes de la tapa
    var nodoTapa = new THREE.Object3D();
    var nodoTapaFinal = new THREE.Object3D();

    // La geometría necesaria para la tapa será una caja
    // Para completar la tapa también necesitaremos una geometría cilindro 
    var geometryTabla = new THREE.BoxGeometry (50,1.2,30);
    var geometryCilindro = new THREE.CylinderGeometry (1,1,29.9,32);

    // Como material se crea uno a partir de una textura y otra a partir de un color
    var textureMetal = new THREE.TextureLoader().load('imgs/metal3.jpg');
    var materialMetal = new THREE.MeshPhongMaterial ({map: textureMetal});
    var textureCartel = new THREE.TextureLoader().load('imgs/cartel-electrico.jpg');
    var materialCartel = new THREE.MeshPhongMaterial ({map: textureCartel});

    // Construimos los mesh correspondientes
    var tapa = new THREE.Mesh (geometryTabla, materialMetal);
    var visagra = new THREE.Mesh (geometryCilindro, materialMetal);
    var pegatina = new THREE.Mesh (geometryTabla, materialCartel);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    tapa.position.y += 6.4;

    visagra.rotateX(Math.PI/2);

    visagra.position.x -= 25;
    visagra.position.y += 7;

    pegatina.scale.x = 0.99;
    pegatina.scale.z = 0.99;

    pegatina.position.y += 6.62;

    // Creamos objetos CSG y operamos con ellos
    var csg = new CSG();

    csg.subtract([tapa,pegatina]);     // Quitamos a la tapa lo que ocupa la tapa con pegatina

    // Asignamos la tabla al objeto csg
    var tapaFinal = csg.toMesh();

    // Añadimos al nodo de la tapa todos los mesh creados
    nodoTapa.add(tapaFinal);
    nodoTapa.add(visagra);
    nodoTapa.add(pegatina);

    // Movemos el nodo de la tapa para que al provocar un giro sobre Z gire sobre donde debería girar
    nodoTapa.position.x += 25;
    nodoTapa.position.y -= 6.8;

    // Hacemos tranformaciones para que la tapa vuelva a su posición correcta
    nodoTapaFinal.position.x -= 25;
    nodoTapaFinal.position.y += 6.8;
    nodoTapaFinal.add(nodoTapa);

    // Seteamos el userData para el picking
    tapaFinal.userData = this;
    visagra.userData = this;
    pegatina.userData = this;

    return nodoTapaFinal;
  }

  createFusibles () {
    // El nodo del que van a colgar todas las partes de los fusibles
    var nodoFusibles = new THREE.Object3D();

    // La geometría necesaria para los fusibles será una caja
    // Para completar los fusibles también necesitaremos una geometría cilindro 
    var geometryTabla = new THREE.BoxGeometry (4,1.2,7.5);
    var geometryCilindro = new THREE.CylinderGeometry (1,1,3.5,32);
    var geometryCaja = new THREE.BoxGeometry (3,0.1,3);

    // Como material se crea unos a partir de unas texturas
    var textureMetal = new THREE.TextureLoader().load('imgs/metal3.jpg');
    var materialMetal = new THREE.MeshPhongMaterial ({map: textureMetal});
    var texturePlasticoRojo = new THREE.TextureLoader().load('imgs/plastico-rojo.avif');
    var materialPlasticoRojo = new THREE.MeshPhongMaterial ({map: texturePlasticoRojo});
    var texturePegatina = new THREE.TextureLoader().load('imgs/pegatina-puerta.jpg');
    var materialPegatina = new THREE.MeshPhongMaterial ({map: texturePegatina});


    // Construimos los mesh correspondientes
    var caja = new THREE.Mesh (geometryTabla, materialMetal);
    var cajaAQuitar1 = new THREE.Mesh (geometryTabla, materialMetal);
    var cajaAQuitar2 = new THREE.Mesh (geometryTabla, materialMetal);
    var cajaAQuitar3 = new THREE.Mesh (geometryTabla, materialMetal);
    var cajaAQuitar4 = new THREE.Mesh (geometryTabla, materialMetal);
    var cajaAQuitar5 = new THREE.Mesh (geometryTabla, materialMetal);
    var cajaAQuitar6 = new THREE.Mesh (geometryTabla, materialMetal);
    var cajaAQuitar7 = new THREE.Mesh (geometryTabla, materialMetal);
    var pegatina = new THREE.Mesh (geometryCaja, materialPegatina);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    caja.scale.x = 10;
    caja.scale.y = 5;
    caja.scale.z = 2;

    cajaAQuitar1.position.x -= 15;
    cajaAQuitar1.position.y += 2.5;
    cajaAQuitar1.position.z += 2;

    cajaAQuitar2.position.x -= 10;
    cajaAQuitar2.position.y += 2.5;
    cajaAQuitar2.position.z += 2;

    cajaAQuitar3.position.x -= 5;
    cajaAQuitar3.position.y += 2.5;
    cajaAQuitar3.position.z += 2;

    cajaAQuitar4.position.y += 2.5;
    cajaAQuitar4.position.z += 2;

    cajaAQuitar5.position.x += 5;
    cajaAQuitar5.position.y += 2.5;
    cajaAQuitar5.position.z += 2;

    cajaAQuitar6.position.x +=10;
    cajaAQuitar6.position.y += 2.5;
    cajaAQuitar6.position.z += 2;

    cajaAQuitar7.position.x += 15;
    cajaAQuitar7.position.y += 2.5;
    cajaAQuitar7.position.z += 2;

    // Creamos objetos CSG y operamos con ellos
    var csg = new CSG();

    csg.subtract([caja,cajaAQuitar1]);     // Quitamos los huecos donde irá un fusible
    csg.subtract([cajaAQuitar2]);
    csg.subtract([cajaAQuitar3]);
    csg.subtract([cajaAQuitar4]);
    csg.subtract([cajaAQuitar5]);
    csg.subtract([cajaAQuitar6]);
    csg.subtract([cajaAQuitar7]);

    // Asignamos la tabla al objeto csg
    var bloqueFusibles = csg.toMesh();

    // Creamos cada fusible
    var fusible1 = this.createFusible();
    var fusible2 = this.createFusible();
    var fusible3 = this.createFusible();
    var fusible4 = this.createFusible();
    var fusible5 = this.createFusible();
    var fusible6 = this.createFusible();
    this.fusible7 = this.createFusible();

    // Y los giramos y posicionamos correctamente
    fusible1.rotateX(-Math.PI/2.8);

    fusible1.position.x -= 15;

    fusible2.rotateX(-Math.PI/2.8);

    fusible2.position.x -= 10;

    fusible3.rotateX(-Math.PI/2.8);

    fusible3.position.x -= 5;

    fusible4.rotateX(-Math.PI/2.8);

    fusible5.rotateX(-Math.PI/2.8);

    fusible5.position.x += 5;

    fusible6.rotateX(-Math.PI/2.8);

    fusible6.position.x += 10;

    this.fusible7.rotateX(Math.PI/2.8);

    this.fusible7.position.x += 15;

    // Hacemos que el último fusible sea de color rojo
    this.fusible7.children[0].children[3].material = materialPlasticoRojo;

    // Añadimos una pegatina que indique el fusible de la puerta
    pegatina.position.x += 15;
    pegatina.position.y += 3;
    pegatina.position.z -= 5;

    // Añadimos al nodo de los fusibles todos los mesh creados
    nodoFusibles.add(bloqueFusibles);
    nodoFusibles.add(fusible1);
    nodoFusibles.add(fusible2);
    nodoFusibles.add(fusible3);
    nodoFusibles.add(fusible4);
    nodoFusibles.add(fusible5);
    nodoFusibles.add(fusible6);
    nodoFusibles.add(this.fusible7);
    nodoFusibles.add(pegatina);

    // Seteamos el userData para el picking
    bloqueFusibles.userData = null;
    pegatina.userData = null;

    return nodoFusibles;
  }

  createFusible () {
    // El nodo del que van a colgar todas las partes del fusible
    var nodoFusible = new THREE.Object3D();
    var nodoFusibleFinal = new THREE.Object3D();

    // La geometría necesaria para cada fusible será un cilindro
    var geometryCilindro = new THREE.CylinderGeometry (1,1,3,32);

    // Como material se crea uno a partir de una textura
    var textureMetal = new THREE.TextureLoader().load('imgs/metal3.jpg');
    var materialMetal = new THREE.MeshPhongMaterial ({map: textureMetal});
    var texturePlasticoNegro = new THREE.TextureLoader().load('imgs/plastico-negro.jpg');
    var materialPlasticoNegro = new THREE.MeshPhongMaterial ({map: texturePlasticoNegro});

    // Construimos los mesh correspondientes
    var baseFusible = new THREE.Mesh (geometryCilindro, materialMetal);
    var parteIzq = new THREE.Mesh (geometryCilindro, materialMetal);
    var parteDch = new THREE.Mesh (geometryCilindro, materialMetal);
    var cilindroFusible = new THREE.Mesh (geometryCilindro, materialPlasticoNegro);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    baseFusible.scale.x = 1.2;
    baseFusible.scale.z = 1.5;

    baseFusible.rotateX(Math.PI/2);
    baseFusible.rotateZ(Math.PI/2);

    parteIzq.scale.x = 0.2;
    parteIzq.scale.y = 0.7;
    parteIzq.scale.z = 0.2;

    parteIzq.position.x -= 1.3;
    parteIzq.position.y += 2.2;

    parteDch.scale.x = 0.2;
    parteDch.scale.y = 0.7;
    parteDch.scale.z = 0.2;

    parteDch.position.x += 1.3;
    parteDch.position.y += 2.2;

    cilindroFusible.scale.x = 0.7;
    cilindroFusible.scale.y = 1.2;
    cilindroFusible.scale.z = 1.1;

    cilindroFusible.rotateX(Math.PI/2);
    cilindroFusible.rotateZ(Math.PI/2);

    cilindroFusible.position.y += 4;

    // Añadimos al nodo del fusible todos los mesh creados
    nodoFusible.add(baseFusible);
    nodoFusible.add(parteIzq);
    nodoFusible.add(parteDch);
    nodoFusible.add(cilindroFusible);

    // Hacemos tranformaciones para que el fusible vuelva a su posición correcta
    nodoFusibleFinal.position.y += 2.2;
    nodoFusibleFinal.position.z += 2;
    nodoFusibleFinal.add(nodoFusible);

    // Seteamos el userData para el picking
    baseFusible.userData = null;
    parteIzq.userData = null;
    parteDch.userData = null;
    cilindroFusible.userData = this;

    return nodoFusibleFinal;
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

export { MyCajaFusibles };
