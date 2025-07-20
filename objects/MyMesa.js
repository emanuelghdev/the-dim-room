import * as THREE from '../libs/three.module.js'
import * as MTLLOADER from '../libs/MTLLoader.js'
import * as OBJLOADER from '../libs/OBJLoader.js'
 
class MyMesa extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Creamos los objetos que necesitamos
    this.modelo = new THREE.Object3D();
    this.cajaEnglobante = new THREE.Box3();

    // Necesitamos las bibliotecas MTLLoader y OBJLoader
    var materialLoader = new MTLLOADER.MTLLoader();
    var objectLoader = new OBJLOADER.OBJLoader();

    // Cada funcion load('archivo', function(materials/object))
    materialLoader.load('models/desk/Office_desks2.mtl', //Cambio la ruta para poner la ruta relativa
    (materials) => {
      objectLoader.setMaterials (materials);
      objectLoader.load('models/desk/Office_desks2.obj',
    (object) => {
      // object.children[0] -> estructura de la mesa
      // object.children[1] -> cajon de abajo a la izquierda de la mesa
      // object.children[2] -> cajon del medio a la izquierda de la mesa
      // object.children[3] -> cajon de arriba a la izquierda de la mesa
      // object.children[4] -> cajon de abajo a la derecha de la mesa
      // object.children[5] -> cajon del medio a la derecha de la mesa
      // object.children[6] -> cajon de arriba a la derecha de la mesa
      
      this.modelo = object;
      this.add(this.modelo);

      // Abrimos un cajón
      this.modelo.children[1].position.z += 0.1;

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

export { MyMesa };
