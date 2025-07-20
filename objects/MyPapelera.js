import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
 
class MyPapelera extends THREE.Object3D {
  constructor(gui,titleGui, color) {
    super();

    // Creamos un objeto para la caja englobante
    this.cajaEnglobante = new THREE.Box3();

    // Creamos la papelera
    this.papelera = this.createPapelera();
    
    // Y lo añadimos como hijo del Object3D (el this)
    this.add(this.papelera);

    // Calculamos la caja englobante para las colisiones
    this.cajaEnglobante.setFromObject(this);
  }

  createPapelera () {
    // El nodo del que van a colgar todas las partes de la estructura
    var nodoPapelera = new THREE.Object3D();

    // Un Mesh se compone de geometría y material
    var papeleraGeom = new THREE.CylinderGeometry (1.5,1.5,3, 36);

    // Como material se crea uno a partir de una textura
    var textureRejilla = new THREE.TextureLoader().load('imgs/rejilla2.jpg');
    var materialPapelera = new THREE.MeshPhongMaterial({map: textureRejilla});
    
    // Ya podemos construir los Mesh que necesitamos
    var cilindroExterior = new THREE.Mesh (papeleraGeom, materialPapelera);
    var cilindroAQuitar = new THREE.Mesh (papeleraGeom, materialPapelera);

    // Las geometrías se crean centradas en el origen.
    // Situamos los cilindros según queremos para hacer luego operaciones csg
    cilindroExterior.position.y = 1.5;

    cilindroAQuitar.scale.x = 0.9;
    cilindroAQuitar.scale.z = 0.9;

    cilindroAQuitar.position.y += 1.8;

    // Creamos el objeto CSG y operamos con él
    var csg = new CSG();

    csg.subtract([cilindroExterior,cilindroAQuitar]);    // Le quitamos la parte del medio a los rollos

    // Asignamos la llave al objeto csg
    var papelera = csg.toMesh();

    // Y añadimos todo como hijos del Object3D (el this)
    nodoPapelera.add(papelera);

    return nodoPapelera;
  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    // Actualizamos la caja englobante para las colisiones
    this.cajaEnglobante.setFromObject(this);
  }
}

export { MyPapelera };
