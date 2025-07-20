import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
 
class MyRollos extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Creamos los rollos de papel higiénico
    this.rollos = this.createRollos();

    // Y lo añadimos como hijo del Object3D (el this)
    this.add(this.rollos);
  }

  createRollos () {
    // El nodo del que van a colgar todas las partes de los rollos
    var nodoRollos = new THREE.Object3D();

    // Un Mesh se compone de geometría y material
    var rolloGeom = new THREE.CylinderGeometry (1.5,1.5,3, 12);

    // Como material se crea uno a partir de un color
    var rolloMat = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
    
    // Ya podemos construir los Mesh que necesitamos
    var cilindroRollo = new THREE.Mesh (rolloGeom, rolloMat);
    var cilindroAQuitar = new THREE.Mesh (rolloGeom, rolloMat);

    // Las geometrías se crean centradas en el origen.
    // Situamos los rollos según queremos para hacer luego operaciones csg
    cilindroRollo.position.y = 1.5;

    cilindroAQuitar.scale.x = 0.4;
    cilindroAQuitar.scale.z = 0.4;

    cilindroAQuitar.position.y += 1.5;

    // Creamos el objeto CSG y operamos con él
    var csg1 = new CSG();

    csg1.subtract([cilindroRollo,cilindroAQuitar]);    // Le quitamos la parte del medio a los rollos

    // Asignamos la llave al objeto csg
    var rollo1 = csg1.toMesh();
    var rollo2 = csg1.toMesh();
    var rollo3 = csg1.toMesh();
    var rollo4 = csg1.toMesh();

    // Situamos los rollos ya sin la parte del medio donde queremos
    rollo2.position.x -= 2.5;
    rollo2.position.z -= 2;

    rollo3.position.x += 0.4;
    rollo3.position.z -= 3;

    rollo4.rotateY(-Math.PI/4);
    rollo4.rotateZ(Math.PI/2);
    rollo4.position.x += 4;
    rollo4.position.y += 1.5;

    // Añadimos al nodo de los rollos todos los mesh creados
    nodoRollos.add(rollo1);
    nodoRollos.add(rollo2);
    nodoRollos.add(rollo3);
    nodoRollos.add(rollo4);

    return nodoRollos;
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

export { MyRollos };
