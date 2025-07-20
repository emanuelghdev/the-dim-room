import * as THREE from '../libs/three.module.js'
import * as MTLLOADER from '../libs/MTLLoader.js'
import * as OBJLOADER from '../libs/OBJLoader.js'
 
class MyEscritorio extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    this.modelo = new THREE.Object3D();
    this.cajaEnglobante = new THREE.Box3();

    // Necesitamos las bibliotecas MTLLoader y OBJLoader
    var materialLoader = new MTLLOADER.MTLLoader();
    var objectLoader = new OBJLOADER.OBJLoader();

    // Cada funcion load('archivo', function(materials/object))
    materialLoader.load('models/desk/Office_desks3.mtl', //Cambio la ruta para poner la ruta relativa
    (materials) => {
      objectLoader.setMaterials (materials);
      objectLoader.load('models/desk/Office_desks3.obj',
    (object) => {
      // object.children[0] -> estructura de la mesa princiapal
      // object.children[1] -> cajon de abajo de la mesa principal
      // object.children[2] -> cajon del medio de la mesa principal
      // object.children[3] -> cajon de arriba de la mesa principal
      // object.children[4] -> cajon de abajo de la mesa secundaria
      // object.children[5] -> estructura de la mesa secundaria
      // object.children[6] -> cajon de arriba de la mesa secundaria
      
      this.modelo = object;
      this.add(this.modelo);

      // Calculamos la caja englobante para las colisiones
      this.cajaEnglobante.setFromObject(object);

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

    // Actualizamos la caja englobante para las colisiones
    this.cajaEnglobante.setFromObject(this.modelo);
  }
}

export { MyEscritorio };
