import * as THREE from '../libs/three.module.js'

import { MyLibro } from './MyLibro.js'
 
class MyLibros extends THREE.Object3D {
  constructor(gui,titleGui, color1, color2, color3, color4) {
    super();
    
    // Creamos todos los libros que queremos
    var libro1 = new MyLibro(this.gui, "", color1);
    var libro2 = new MyLibro(this.gui, "", color2);
    var libro3 = new MyLibro(this.gui, "", color3); 
    var libro4 = new MyLibro(this.gui, "", color4);

    // Los posicionamos correctamente
    libro2.position.x += 0.4;
    libro2.position.y += 1.0;

    libro3.rotateY(Math.PI/8);
    libro3.position.x += 0.4;
    libro3.position.y += 2.0;

    libro4.rotateY(Math.PI/8);
    libro4.rotateZ(Math.PI/3);
    libro4.position.x -= 2.65;
    libro4.position.y += 1.7;

    // Y por último, los añadimos al modelo
    this.add (libro1);
    this.add (libro2);
    this.add (libro3);
    this.add (libro4);
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

export { MyLibros };
