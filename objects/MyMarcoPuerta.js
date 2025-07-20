import * as THREE from '../libs/three.module.js'
import * as MTLLOADER from '../libs/MTLLoader.js'
import * as OBJLOADER from '../libs/OBJLoader.js'
 
class MyMarcoPuerta extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    this.modelo = new THREE.Object3D();
    this.cajaEnglobante = new THREE.Box3();

    // Necesitamos las bibliotecas MTLLoader y OBJLoader
    var materialLoader = new MTLLOADER.MTLLoader();
    var objectLoader = new OBJLOADER.OBJLoader();

    // Cada funcion load('archivo', function(materials/object))
    materialLoader.load('models/Door/Door.mtl', //Cambio la ruta para poner la ruta relativa
    (materials) => {
      objectLoader.setMaterials (materials);
      objectLoader.load('models/Door/Door.obj',
    (object) => {
      // object.children[0] -> marco
      // object.children[1] -> puerta
      // object.children[2] -> pomo externo
      // object.children[3] -> manivela del pomo externo
      // object.children[4] -> pomo interno
      // object.children[5] -> manivela del pomo interior

      this.modelo = object.children[0];
      this.add(this.modelo);

      // Calculamos la caja englobante para las colisiones
      this.cajaEnglobante.setFromObject(this.modelo);

      },null,null);
    });
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

export { MyMarcoPuerta };
