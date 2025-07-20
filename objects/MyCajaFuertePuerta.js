import * as THREE from '../libs/three.module.js'
import * as MTLLOADER from '../libs/MTLLoader.js'
import * as OBJLOADER from '../libs/OBJLoader.js'
 
class MyCajaFuertePuerta extends THREE.Object3D {
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
      // object.children[2] -> anclaje de las visagras
      // object.children[3] -> puerta
      // object.children[4] -> barras
      // object.children[5] -> circulo puerta
      // object.children[6] -> pestillo
      // object.children[7] -> circulo pestillo
      // object.children[8] -> manivela
      // object.children[9] -> parte movil de las visagras
  
      this.modelo = object;
      this.add(this.modelo);

      object.children[0].removeFromParent();    // Quitamos la estructura
      object.children[0].removeFromParent();    // la balda(cada vez que removemos un hijo hay un hijo menos)
      object.children[0].removeFromParent();    // el anclaje de las visagras
      object.children[1].removeFromParent();    // el anclaje de las visagras
      object.children[3].removeFromParent();    // y el circulo del pestillo

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

export { MyCajaFuertePuerta };
