import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
 
class MyArmario extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Creamos un objeto para la caja englobante
    this.cajaEnglobante = new THREE.Box3();

    // La geometría de todas las partes del armario serán una caja con muy poca altura
    this.geometryArmario = new THREE.BoxGeometry (20,0.2,20);    // 200 = 2m 

    // Como material se crea uno a partir del color blanco
    //this.materialArmario = new THREE.MeshPhongMaterial({color: 0xFFFFFF});

    var textureArmario = new THREE.TextureLoader().load('imgs/wood.jpg');
    this.materialArmario = new THREE.MeshPhongMaterial ({map: textureArmario});
    
    // Creamos la estructura principal
    this.estructura = this.createEstructura();

    // Creamos las puertas
    this.puertaDerecha = this.createPuertaDcha();
    this.puertaIzquierda = this.createPuertaIzq();
    
    // Y añadimos todo como hijo del Object3D (el this)
    this.add (this.estructura);
    this.add (this.puertaDerecha);
    this.add (this.puertaIzquierda);
    
    // Las geometrías se crean centradas en el origen.
    this.estructura.position.y = 0.1;

    // Calculamos la caja englobante para las colisiones
    this.cajaEnglobante.setFromObject(this);
  }

  recibeClic(objeto, abierto, enMovimiento){
    // Variables temporales para almacenar el giro que aumentamos o disminuimos de las puertas
    var tmp1 = 0;
    var tmp2 = 0;

    // Si hacemos clic a la puerta de la derecha y no está abierta
    if((objeto.parent == this.puertaDerecha.children[0] || objeto.parent.parent == this.puertaDerecha.children[0])&& abierto[0] == false){
        tmp1 = Math.PI/1.5;
        abierto[0] = true;
    }   
    else if(objeto.parent == this.puertaDerecha.children[0] || objeto.parent.parent == this.puertaDerecha.children[0]){     // Si está cerrada
        tmp1 = -Math.PI/1.5;
        abierto[0] = false;
    }

    // Si hacemos clic a la puerta de la izquierda y no está abierta
    if((objeto.parent == this.puertaIzquierda.children[0] || objeto.parent.parent == this.puertaIzquierda.children[0]) && abierto[1] == false){
        tmp2 = -Math.PI/1.5;
        abierto[1] = true;
    }
    else if(objeto.parent == this.puertaIzquierda.children[0] || objeto.parent.parent == this.puertaIzquierda.children[0]){ // Si está cerrada
        tmp2 = Math.PI/1.5;
        abierto[1] = false;
    }

    // Variables locales con los parámetros de interpolación, en este caso que la puerta del armario se abra
    var origen1 = this.puertaDerecha.rotation;
    var destino1 = {y: origen1.y+tmp1};
    var origen2 = this.puertaIzquierda.rotation;
    var destino2 = {y: origen2.y+tmp2};
    
    // Definicion de la animacion: origen, destino y tiempo. Hace falta actualizar TWEEN en update()
    var movimiento1 = new TWEEN.Tween(origen1).to(destino1,2500).start().onComplete(function(){enMovimiento[0] = 0;});
    var movimiento2 = new TWEEN.Tween(origen2).to(destino2,2500).start().onComplete(function(){enMovimiento[0] = 0;});
  }

  createEstructura (){
    // El nodo del que van a colgar todas las partes de la estructura
    var nodoEstructura = new THREE.Object3D();

    // Construimos los mesh correspondientes
    var tablaAtras = new THREE.Mesh (this.geometryArmario, this.materialArmario);
    var tablaAbajo = new THREE.Mesh (this.geometryArmario, this.materialArmario);
    var tablaMedio = new THREE.Mesh (this.geometryArmario, this.materialArmario);
    var tablaArriba = new THREE.Mesh (this.geometryArmario, this.materialArmario);
    var tablaIzquierda = new THREE.Mesh (this.geometryArmario, this.materialArmario);
    var tablaDerecha = new THREE.Mesh (this.geometryArmario, this.materialArmario);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    tablaAtras.rotation.x = Math.PI/2;
    tablaAtras.position.y = 10;

    tablaAbajo.scale.y = 10;
    tablaAbajo.scale.z = 1/2;
    tablaAbajo.position.y = 1;
    tablaAbajo.position.z = 5;

    tablaMedio.scale.z = 1/2;
    tablaMedio.position.y = 10;
    tablaMedio.position.z = 5;

    tablaArriba.scale.z = 1/2;
    tablaArriba.position.y = 20;
    tablaArriba.position.z = 5;
    
    tablaIzquierda.scale.z = 1/2;
    tablaIzquierda.rotation.z = Math.PI/2;
    tablaIzquierda.position.x = -10;
    tablaIzquierda.position.y = 10;
    tablaIzquierda.position.z = 5;

    tablaDerecha.scale.z = 1/2;
    tablaDerecha.rotation.z = Math.PI/2;
    tablaDerecha.position.x = 10;
    tablaDerecha.position.y = 10;
    tablaDerecha.position.z = 5;

    // Añadimos al nodo de la estructura todos los mesh creados
    nodoEstructura.add(tablaAtras);
    nodoEstructura.add(tablaAbajo);
    nodoEstructura.add(tablaMedio);
    nodoEstructura.add(tablaArriba);
    nodoEstructura.add(tablaIzquierda);
    nodoEstructura.add(tablaDerecha);

    // Seteamos el userData para el picking
    tablaAtras.userData = null;
    tablaAbajo.userData = null;
    tablaMedio.userData = null;
    tablaArriba.userData = null;
    tablaIzquierda.userData = null;
    tablaDerecha.userData = null;

    return nodoEstructura;
  }

  createPuertaDcha (){
    // El nodo del que van a colgar todas las partes de la puerta
    var nodoPuerta = new THREE.Object3D();
    var nodoPuertaFinal = new THREE.Object3D();

    // Construimos los mesh correspondientes
    var tablaPuerta = new THREE.Mesh (this.geometryArmario, this.materialArmario);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    tablaPuerta.scale.x = 0.9;
    tablaPuerta.scale.z = 0.495;
    tablaPuerta.rotation.z = Math.PI/2;
    tablaPuerta.rotation.y = Math.PI/2;
    tablaPuerta.position.x = 5;
    tablaPuerta.position.y = 11;
    tablaPuerta.position.z = 10;

    // Contruimos el tirador
    var asa = this.createAsaDcha();

    // Añadimos al nodo de la estructura todos los mesh creados
    nodoPuerta.add(tablaPuerta);
    nodoPuerta.add(asa);

    // Movemos el nodo de la puerta para que al provocar un giro sobre Y gire sobre donde debería girar
    nodoPuerta.position.x -= 10;
    nodoPuerta.position.z -= 10;

    // Hacemos tranformaciones para que la puerta vuelva a su posición correcta
    nodoPuertaFinal.position.x = 10;
    nodoPuertaFinal.position.z = 10;
    nodoPuertaFinal.add(nodoPuerta);

    // Seteamos el userData para el picking
    tablaPuerta.userData = this;

    return nodoPuertaFinal;
  }

  createAsaDcha (){
    // El nodo del que van a colgar todas las partes del asa de la puerta
    var nodoAsa = new THREE.Object3D();

    // Cambiamos la geometria a la que necesitamos
    var geometryAsa = new THREE.BoxGeometry (1.5,0.1,1.5);    // 200 = 2m 

    // Como material se crea uno a partir de una textura
    var textureMetal = new THREE.TextureLoader().load('imgs/metal3.jpg');
    var materialMetal = new THREE.MeshPhongMaterial ({map: textureMetal});

    // Construimos los mesh correspondientes
    var tablaAsa1 = new THREE.Mesh (geometryAsa, materialMetal);
    var tablaAsa2 = new THREE.Mesh (geometryAsa, materialMetal);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    tablaAsa1.scale.x = 2;
    tablaAsa1.scale.z = 0.5;

    tablaAsa2.scale.x = 2;
    tablaAsa2.scale.z = 0.5;
    tablaAsa2.rotation.x = -Math.PI/3;
    tablaAsa2.position.y = 0.3;
    tablaAsa2.position.z = -0.16;

    // Añadimos al nodo de la estructura todos los mesh creados
    nodoAsa.add(tablaAsa1);
    nodoAsa.add(tablaAsa2);

    nodoAsa.rotation.y = Math.PI/2;
    nodoAsa.rotation.z = Math.PI/2;
    nodoAsa.position.x = 2.5;
    nodoAsa.position.y = 12;
    nodoAsa.position.z = 10.2;

    // Seteamos el userData para el picking
    tablaAsa1.userData = this;
    tablaAsa2.userData = this;

    return nodoAsa;
  }

  createPuertaIzq (){
    // El nodo del que van a colgar todas las partes de la puerta
    var nodoPuerta = new THREE.Object3D();
    var nodoPuertaFinal = new THREE.Object3D();

    // Construimos los mesh correspondientes
    var tablaPuerta = new THREE.Mesh (this.geometryArmario, this.materialArmario);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    tablaPuerta.scale.x = 0.9;
    tablaPuerta.scale.z = 0.495;
    tablaPuerta.rotation.z = Math.PI/2;
    tablaPuerta.rotation.y = Math.PI/2;
    tablaPuerta.position.x = -5;
    tablaPuerta.position.y = 11;
    tablaPuerta.position.z = 10;

    // Contruimos el tirador
    var asa = this.createAsaIzq();

    // Añadimos al nodo de la estructura todos los mesh creados
    nodoPuerta.add(tablaPuerta);
    nodoPuerta.add(asa);

    // Movemos el nodo de la puerta para que al provocar un giro sobre Y gire sobre donde debería girar
    nodoPuerta.position.x = 10;
    nodoPuerta.position.z -= 10;

    // Hacemos tranformaciones para que la puerta vuelva a su posición correcta
    nodoPuertaFinal.position.x -= 10;
    nodoPuertaFinal.position.z = 10;
    nodoPuertaFinal.add(nodoPuerta);

    // Seteamos el userData para el picking
    tablaPuerta.userData = this;

    return nodoPuertaFinal;
  }

  createAsaIzq (){
    // El nodo del que van a colgar todas las partes del asa de la puerta
    var nodoAsa = new THREE.Object3D();

    // Cambiamos la geometria a la que necesitamos
    var geometryAsa = new THREE.BoxGeometry (1.5,0.1,1.5);    // 200 = 2m 

    // Como material se crea uno a partir de una textura
    var textureMetal = new THREE.TextureLoader().load('imgs/metal3.jpg');
    var materialMetal = new THREE.MeshPhongMaterial ({map: textureMetal});

    // Construimos los mesh correspondientes
    var tablaAsa1 = new THREE.Mesh (geometryAsa, materialMetal);
    var tablaAsa2 = new THREE.Mesh (geometryAsa, materialMetal);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    tablaAsa1.scale.x = 2;
    tablaAsa1.scale.z = 0.5;

    tablaAsa2.scale.x = 2;
    tablaAsa2.scale.z = 0.5;
    tablaAsa2.rotation.x = Math.PI/3;
    tablaAsa2.position.y = 0.3;
    tablaAsa2.position.z = 0.16;


    // Añadimos al nodo de la estructura todos los mesh creados
    nodoAsa.add(tablaAsa1);
    nodoAsa.add(tablaAsa2);

    nodoAsa.rotation.y = Math.PI/2;
    nodoAsa.rotation.z = Math.PI/2;
    nodoAsa.position.x = -2.5;
    nodoAsa.position.y = 12;
    nodoAsa.position.z = 10.2;

    // Seteamos el userData para el picking
    tablaAsa1.userData = this;
    tablaAsa2.userData = this;

    return nodoAsa;
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

export { MyArmario };
