import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
 
class MyVela extends THREE.Object3D {
  constructor(gui,titleGui, color) {
    super();
    
    // Creamos la vela
    this.vela = this.createVela(color);

    // Y lo añadimos como hijo del Object3D (el this)
    this.add(this.vela);
  }

  createVela (color) {
    // El nodo del que van a colgar todas las partes de la vela
    var nodoVela = new THREE.Object3D();

    // Un Mesh se compone de geometría y material
    var velaGeom = new THREE.CylinderGeometry (1.5,1.5,3, 36);

    // Como material se crea uno a partir de un color
    var velaMat = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
    var velaExteriorMat = new THREE.MeshPhongMaterial({color: color});
    
    // Ya podemos construir los Mesh que necesitamos
    var cilindroExterior = new THREE.Mesh (velaGeom, velaExteriorMat);
    var cilindroAQuitar = new THREE.Mesh (velaGeom, velaExteriorMat);
    var cilindroInterior = new THREE.Mesh (velaGeom, velaMat);
    var mecha = new THREE.Mesh (velaGeom, velaMat);

    // Las geometrías se crean centradas en el origen.
    // Situamos los cilindros según queremos para hacer luego operaciones csg
    cilindroExterior.position.y = 1.5;

    cilindroAQuitar.scale.x = 0.9;
    cilindroAQuitar.scale.z = 0.9;

    cilindroAQuitar.position.y += 1.8;

    cilindroInterior.scale.x = 0.95;
    cilindroInterior.scale.y = 0.85;
    cilindroInterior.scale.z = 0.95;

    cilindroInterior.position.y += 1.35;

    mecha.scale.x = 0.025;
    mecha.scale.y = 0.5;
    mecha.scale.z = 0.025;

    mecha.rotateZ(-Math.PI/12);

    mecha.position.y += 2.8;

    // Creamos el objeto CSG y operamos con él
    var csg = new CSG();

    csg.subtract([cilindroExterior,cilindroAQuitar]);    // Le quitamos la parte del medio a los rollos

    // Asignamos la llave al objeto csg
    var vela = csg.toMesh();

    // Añadimos al nodo de la estructura todos los mesh creados
    nodoVela.add(vela);
    nodoVela.add(cilindroInterior);
    nodoVela.add(mecha);

    return nodoVela;
  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
  }
}

export { MyVela };
