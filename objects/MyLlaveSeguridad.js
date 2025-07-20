import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MyLlaveSeguridad extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Creamos la llave con extrusión
    this.llave = this.createLlave();

    // Perfilamos la llave de seguridad dandole más detalle
    this.llaveSeguridad = this.perfilarLlave();

    // Y lo añadimos como hijo del Object3D (el this)
    this.add(this.llaveSeguridad);

    // Subimos el objeto para que se encuentre por encima del eje de coordenadas
    this.position.y += 6;
  }


  createLlave () {
    // Creamos el contorno para el objeto de extrusion
    var geomShape = new THREE.Shape();

    geomShape.moveTo(0, 0);
    geomShape.lineTo(30, 0);
    geomShape.lineTo(25, 20);
    geomShape.lineTo(18, 20);
    geomShape.lineTo(18, 50);
    geomShape.lineTo(25, 50);
    geomShape.lineTo(25, 52.5);
    geomShape.lineTo(32, 52.5);
    geomShape.lineTo(32, 55);
    geomShape.lineTo(25, 55);
    geomShape.lineTo(25, 60);
    geomShape.lineTo(30, 60);
    geomShape.lineTo(30, 62.5);
    geomShape.lineTo(25, 62.5);
    geomShape.lineTo(25, 65);
    geomShape.lineTo(20, 65);
    geomShape.lineTo(20, 70);
    geomShape.lineTo(30, 70);
    geomShape.lineTo(30, 72.5);
    geomShape.lineTo(25, 72.5);
    geomShape.lineTo(25, 75);
    geomShape.lineTo(25, 77.5);
    geomShape.lineTo(18, 77.5);
    geomShape.lineTo(18, 80);
    geomShape.lineTo(12, 80);
    geomShape.lineTo(12, 20);
    geomShape.lineTo(5, 20);


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
    var llaveGeom = new THREE.ExtrudeGeometry(geomShape,geomextrudeSettings);     // Forma de la extrusion, configuracion de la extrusion

    // Como material se crea uno a partir de un color
    var textureMetal = new THREE.TextureLoader().load('imgs/metal-rojo.jpg');
    this.materialMetalRojo = new THREE.MeshPhongMaterial ({map: textureMetal});
    
    // Ya podemos construir el Mesh que necesitamos
    var nodoLlave = new THREE.Mesh (llaveGeom, this.materialMetalRojo);
    
    return nodoLlave;
  }

  perfilarLlave () {
    // Un Mesh se compone de geometría y material
    var cajaGeom = new THREE.BoxGeometry(61, 1.5, 2);
    var cilindroGeom = new THREE.CylinderGeometry(2.5, 2.5, 12, 32);

    // Ya podemos construir el Mesh
    var cajaAQuitar1 = new THREE.Mesh(cajaGeom, this.materialMetalRojo);
    var cajaAQuitar2 = new THREE.Mesh(cajaGeom, this.materialMetalRojo);
    var cajaAQuitar3 = new THREE.Mesh(cajaGeom, this.materialMetalRojo);
    var cajaAQuitar4 = new THREE.Mesh(cajaGeom, this.materialMetalRojo);
    var cajaAQuitar5 = new THREE.Mesh(cajaGeom, this.materialMetalRojo);
    var cajaAQuitar6 = new THREE.Mesh(cajaGeom, this.materialMetalRojo);
    var cilindroAQuitar = new THREE.Mesh(cilindroGeom, this.materialMetalRojo);
    
    // Las geometrías se crean centradas en el origen.
    // Situamos y rotamos la llave según queremos, en esta caso para que se encuentre en el origen
    this.llave.position.x -= 40;
    this.llave.position.z += 15;

    this.llave.rotateX(Math.PI/2);
    this.llave.rotateZ(-Math.PI/2);

    // Situamos las cajas y el cilindro a quitar en la posición que necesitamos para el posterior csg
    cajaAQuitar1.position.x += 10.5;
    cajaAQuitar1.position.y += 0.25;

    cajaAQuitar2.position.x += 12;
    cajaAQuitar2.position.y += 0.25;
    cajaAQuitar2.position.z -= 6.5;

    cajaAQuitar3.position.x += 12;
    cajaAQuitar3.position.y += 0.25;
    cajaAQuitar3.position.z -= 13;

    cajaAQuitar4.position.x += 10.5;
    cajaAQuitar4.position.y -= 5.5;

    cajaAQuitar5.position.x += 12;
    cajaAQuitar5.position.y -= 5.5;
    cajaAQuitar5.position.z -= 6.5;

    cajaAQuitar6.position.x += 12;
    cajaAQuitar6.position.y -= 5.5;
    cajaAQuitar6.position.z -= 13;

    cilindroAQuitar.position.x -= 32.5;

    // Creamos un objeto CSG y operamos con él
    var csg = new CSG();

    csg.subtract([this.llave,cajaAQuitar1]);    // Perfilamos el relive de la llave por delante
    csg.subtract([cajaAQuitar2]);               
    csg.subtract([cajaAQuitar3]); 
    csg.subtract([cajaAQuitar4]);               // Perfilamos la llave por detrás            
    csg.subtract([cajaAQuitar5]); 
    csg.subtract([cajaAQuitar6]);              
    csg.subtract([cilindroAQuitar]);            // Le hacemos un agujero a la llave

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

export { MyLlaveSeguridad };