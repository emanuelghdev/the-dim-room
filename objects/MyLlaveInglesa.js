import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MyLlaveInglesa extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();    

    // Creamos la llave con extrusión
    this.llave = this.createLlave();

    // Perfilamos la llave inglesa dandole más detalle
    this.llaveInglesa = this.perfilarLlave();

    // Y lo añadimos como hijo del Object3D (el this)
    this.add(this.llaveInglesa);
  }

  createLlave () {
    // Creamos el contorno para el objeto de extrusion
    var geomShape = new THREE.Shape();

    geomShape.moveTo(30, 0);
    geomShape.quadraticCurveTo(20, 35, 10, 0);     // Creamos la curva de una parte de la llave
    geomShape.lineTo(8, 10);
    geomShape.lineTo(16, 25);
    geomShape.lineTo(16, 80);
    geomShape.lineTo(8, 95);
    geomShape.lineTo(10, 105);
    geomShape.quadraticCurveTo(20, 75, 30, 105);   // Creamos la curva de la otra parte de la llave
    geomShape.lineTo(32, 95);
    geomShape.lineTo(26, 80);
    geomShape.lineTo(26, 25);
    geomShape.lineTo(32, 10);


    // Configuramos la extrusion
    var geomextrudeSettings = {
      steps: 10,                        // Segmentos de parte extruida
      depth: 5,                         // Cantidad de extruccion
      bevelEnabled: true,               // Bisel
      bevelThickness: 1,                // En direccion del shape
      bevelSize: 0.5,                   // Tamaño en el plano del shape
      bevelOffset: 0,                   // Distancia a la que comienza el bisel
      bevelSegments: 1                  // Segmentos para suavizar bisel
    };    
    
    // Un Mesh se compone de geometría y material
    this.llaveGeom = new THREE.ExtrudeGeometry(geomShape,geomextrudeSettings);     // Forma de la extrusion, configuracion de la extrusion

    // Como material se crea uno a partir de un color
    this.llaveMat = new THREE.MeshPhysicalMaterial({color: 0xC0C0C0});    // Plateado
    
    // Ya podemos construir el Mesh que necesitamos
    var nodoLlave = new THREE.Mesh (this.llaveGeom, this.llaveMat);
    
    // Las geometrías se crean centradas en el origen.
    // Situamos y rotamos la llave según queremos, en esta caso para que se encuentre en el origen
    nodoLlave.position.x += 52.5;
    nodoLlave.position.y += 2.5;
    nodoLlave.position.z -= 21;

    nodoLlave.rotateX(Math.PI/2);
    nodoLlave.rotateZ(Math.PI/2);

    return nodoLlave;
  }

  perfilarLlave () {
    // Un Mesh se compone de geometría y material, usamos el mismo material, pero usamos la geomtria de una caja
    var cajaGeom = new THREE.BoxGeometry(50, 1.5, 2);

    // Ya podemos construir los Mesh que necesitamos
    var cajaAQuitar1 = new THREE.Mesh(cajaGeom, this.llaveMat);
    var cajaAQuitar2 = new THREE.Mesh(cajaGeom, this.llaveMat);
    var cajaAQuitar3 = new THREE.Mesh(cajaGeom, this.llaveMat);
    var cajaAQuitar4 = new THREE.Mesh(cajaGeom, this.llaveMat);

    // Situamos las cajas a quitar en la posición que necesitamos para el posterior csg
    cajaAQuitar1.position.z += 2;
    cajaAQuitar1.position.y += 3;

    cajaAQuitar2.position.z -= 2;
    cajaAQuitar2.position.y += 3;

    cajaAQuitar3.position.z += 2;
    cajaAQuitar3.position.y -= 3;

    cajaAQuitar4.position.z -= 2;
    cajaAQuitar4.position.y -= 3;

    // Creamos un objeto CSG y operamos con él
    var csg = new CSG();

    csg.subtract([this.llave,cajaAQuitar1]);    // Le quitamos a la llave una caja arriba
    csg.subtract([cajaAQuitar2]);               // Al resultado le quitamos la otra de arriba
    csg.subtract([cajaAQuitar3]);               // A este resultado le quitamos a su vez otra caja
    csg.subtract([cajaAQuitar4]);               // Al resultado le quitamos la otra de abajo

    // Asignamos la llave al objeto csg
    var llavePerfilada = csg.toMesh();

    return llavePerfilada;
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que seaplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
  }
}

export { MyLlaveInglesa };