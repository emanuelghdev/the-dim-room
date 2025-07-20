import * as THREE from '../libs/three.module.js'
import { MyVela } from './MyVela.js'
 
class MyVelas extends THREE.Object3D {
  constructor(gui,titleGui, color1, color2, color3, color4) {
    super();
    
    // Creamos todos los velas que queremos
    var vela1 = new MyVela(this.gui, "", color1);
    var vela2 = new MyVela(this.gui, "", color2);   
    var vela3 = new MyVela(this.gui, "", color3);
    var vela4 = new MyVela(this.gui, "", color4);

    // Los posicionamos correctamente
    vela2.rotateY(Math.PI);
    vela2.position.x += 2;
    vela2.position.z -= 2.4;

    vela3.rotateY(Math.PI/3);
    vela3.position.x -= 2.4;
    vela3.position.z -= 2.4;

    vela4.position.x -= 0.3;
    vela4.position.z -= 4.6;

    // Y por último, los añadimos al modelo
    this.add (vela1);
    this.add (vela2);
    this.add (vela3);
    this.add (vela4);
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

export { MyVelas };
