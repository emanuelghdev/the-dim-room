import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MyTaza extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Creamos la taza
    this.taza = this.createTaza();

    // Y lo añadimos como hijo del Object3D (el this)
    this.add(this.taza);
  }

  createTaza () {
    // Un Mesh se compone de geometría y material
    var cilindroExteriorGeom = new THREE.CylinderGeometry (5, 5, 10, 50, 1);      // Radio tapa de arriba, radio tapa abajo, altura, segmentos radiales
    var cilindroInteriorGeom = new THREE.CylinderGeometry (4.7, 4.7, 10, 50, 1);  // Radio tapa de arriba, radio tapa abajo, altura, segmentos radiales
    var asaGeom = new THREE.TorusGeometry (3, 0.5, 24, 24);                       // Radio, radio tdel tubo, segmentos radiales, segmentos tubulares
    
    // Posicionamos y orientamos las figura
    cilindroInteriorGeom.translate(0,0.3,0); // Asi la taza tiene parte de abajo (no podemos hacer .position.y porque no está credo el mesh)
    asaGeom.translate(-5,0,0);

    // Como material se crea uno a partir de un color
    var tazaMat = new THREE.MeshPhongMaterial({color: 0xFFFFFF, specular: 0x333333}); // Hacemos que se refleje bastante la superficie de la taza

    // Ya podemos construir los Mesh
    var cilindroInterior = new THREE.Mesh(cilindroInteriorGeom, tazaMat);
    var cilindroExterior = new THREE.Mesh(cilindroExteriorGeom, tazaMat);
    var asa = new THREE.Mesh(asaGeom, tazaMat);

    // Creamos un objeto CSG y operamos con él
    var csg = new CSG();

    csg.union ([cilindroExterior, asa]);      // Juntamos asa y cilindro de la taza
    csg.subtract([cilindroInterior]);         // Al resultado le quitamos la parte interior

    // Asignamos la taza al objeto csg
    var nodoTaza = csg.toMesh();

    return nodoTaza;
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que secaplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
  }
}

export { MyTaza };