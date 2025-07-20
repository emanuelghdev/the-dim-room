import * as THREE from '../libs/three.module.js'
import * as MTLLOADER from '../libs/MTLLoader.js'
import * as OBJLOADER from '../libs/OBJLoader.js'
 
class MyOrdenadorEncendido extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    this.modelo = new THREE.Object3D();

    // Necesitamos las bibliotecas MTLLoader y OBJLoader
    var materialLoader = new MTLLOADER.MTLLoader();
    var objectLoader = new OBJLOADER.OBJLoader();

    // Cada funcion load('archivo', function(materials/object))
    materialLoader.load('models/pc_teclado/pc_obj2.mtl', //Cambio la ruta para poner la ruta relativa
    (materials) => {
      objectLoader.setMaterials (materials);
      objectLoader.load('models/pc_teclado/pc_obj.obj',
    (object) => {
      // object.children[0] -> suelo
      // object.children[1] -> pantalla ordenador
      // object.children[2] -> ratón
      // object.children[3] -> cilindro1
      // object.children[4] -> torre del pc
      // object.children[5] -> cilindro2
      // object.children[6] -> cilindro3
      // object.children[7] -> esfera
      // object.children[8] -> cilindro4
      // object.children[9] -> cilindro5
      // ...
      
      this.modelo = object;
      this.add(this.modelo);

      object.children[0].removeFromParent();      // Quitamos el suelo del modelo

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

export { MyOrdenadorEncendido };
