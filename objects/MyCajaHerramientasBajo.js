import * as THREE from '../libs/three.module.js'
import * as MTLLOADER from '../libs/MTLLoader.js'
import * as OBJLOADER from '../libs/OBJLoader.js'
 
class MyCajaHerramientasBajo extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    this.modelo = new THREE.Object3D();

    // Necesitamos las bibliotecas MTLLoader y OBJLoader
    var materialLoader = new MTLLOADER.MTLLoader();
    var objectLoader = new OBJLOADER.OBJLoader();

    // Cada funcion load('archivo', function(materials/object))
    materialLoader.load('models/cajaherramientas/Box.mtl', //Cambio la ruta para poner la ruta relativa
    (materials) => {
      objectLoader.setMaterials (materials);
      objectLoader.load('models/cajaherramientas/Box.obj',
    (object) => {
      // object.children[0] -> parte de abajo de la caja
      // object.children[1] -> parte de arriba de la caja
      // object.children[2] -> pestaña derecha de la caja
      // object.children[3] -> asa izquierda de la caja
      // object.children[4] -> asa derecha de la caja
      // object.children[5] -> pestaña izquierda de la caja
      
      this.modelo = object.children[0];
      this.add(this.modelo);

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

export { MyCajaHerramientasBajo };
