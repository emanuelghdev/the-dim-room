import * as THREE from '../libs/three.module.js'
import * as MTLLOADER from '../libs/MTLLoader.js'
import * as OBJLOADER from '../libs/OBJLoader.js'
 
class MyCajaFuerte extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    this.modelo = new THREE.Object3D();

    // Necesitamos las bibliotecas MTLLoader y OBJLoader
    var materialLoader = new MTLLOADER.MTLLoader();
    var objectLoader = new OBJLOADER.OBJLoader();

    // Cada funcion load('archivo', function(materials/object))
    materialLoader.load('models/Safe/Safe.mtl', // Cambio la ruta para poner la ruta relativa
    (materials) => {
      objectLoader.setMaterials (materials);
      objectLoader.load('models/Safe/Safe.obj',
    (object) => {
      // object.children[0] -> estructura
      // object.children[1] -> balda
      // object.children[2] -> visagras anclaje
      // object.children[3] -> puerta
      // object.children[4] -> barras
      // object.children[5] -> circulo puerta
      // object.children[6] -> pestillo
      // object.children[7] -> circulo pestillo
      // object.children[8] -> manivela
      // object.children[9] -> visagras parte movil

      this.modelo = object;
      this.add(this.modelo);

      object.children[3].removeFromParent();    // Quitamos del modelo la puerta
      object.children[4].removeFromParent();    // el circulo de la puerta (cada vez que removemos un hijo hay un hijo menos)
      object.children[4].removeFromParent();    // el pestillo
      object.children[4].removeFromParent();    // el circulo del pestillo
      object.children[4].removeFromParent();    // la manivela
      object.children[4].removeFromParent();    // y la parte móvil de las visagras

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

export { MyCajaFuerte };
