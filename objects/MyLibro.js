import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
 
class MyLibro extends THREE.Object3D {
  constructor(gui,titleGui, color) {
    super();

    // Un Mesh se compone de geometría y material
    this.libroGeom = new THREE.BoxGeometry (3.6,0.05,4);

    // Creamos la portada y la contraportada de los libros
    this.estructura = this.createEstructura(color);
    
    // Añadimos también las hojas que componen el libro
    this.hojas = this.createHojas();

    // Y añadimos todo como hijo del Object3D (el this)
    this.add (this.estructura);
    this.add (this.hojas);
    
    // Las geometrías se crean centradas en el origen.
    // SUbimos el libro para que esté sobre el eje de coordenadas
    this.position.y += 0.11;
  }

  createEstructura (color) {
  	// El nodo del que van a colgar todas las partes de las hojas
    var nodoEstructura = new THREE.Object3D();

    // Para hacer el lomo del libro necesitamos una geomtria cilindro
    var lomoGeom = new THREE.CylinderGeometry (0.5,0.5,4.2,24);

    // Como material se crea uno a partir de un color
    var estructuraMat = new THREE.MeshPhongMaterial({color: color});
    var hojaMat = new THREE.MeshPhongMaterial({color: 0xFFFFFF});

    // Ya podemos construir los Mesh correspondientes
    var portada = new THREE.Mesh (this.libroGeom, estructuraMat);
    var contraportada = new THREE.Mesh (this.libroGeom, estructuraMat);
    var imagenPortada = new THREE.Mesh (this.libroGeom, hojaMat);
    var cilindroLomo = new THREE.Mesh (lomoGeom, estructuraMat);
    var cilindroAQuitar = new THREE.Mesh (lomoGeom, estructuraMat);

    // Hacemos las transformaciones necesarios para montar la estructura del libro
    // Ponemos la contraportada debajo de todas las hojas y la portada arriba de estas
    portada.scale.x = 0.95;
    portada.scale.y = 3;
    portada.scale.z = 1.05;

    portada.position.x -= 0.10;
    portada.position.y += 0.80;

    imagenPortada.scale.x = 0.8;
    imagenPortada.scale.y = 0.3;
    imagenPortada.scale.z = 0.2;

    imagenPortada.position.x -= 0.10;
    imagenPortada.position.y += 0.90;
    imagenPortada.position.z -= 1.20;

    contraportada.scale.x = 0.95;
    contraportada.scale.y = 3;
    contraportada.scale.z = 1.05;

    contraportada.position.x -= 0.10;
    contraportada.position.y -= 0.03;
    
    cilindroAQuitar.scale.z = 0.85;
    cilindroAQuitar.position.x += 0.1;

    // Creamos el objeto CSG y operamos con él para conseguir el lomo
    var csg = new CSG();

    csg.subtract([cilindroLomo,cilindroAQuitar]);    // Le quitamos la parte de la derecha al cilindro para conseguir el lomo

    // Asignamos la llave al objeto csg
    var lomo = csg.toMesh();

    // Hacemos las transformaciones para situar correctamente al lomo entre la portada y la contraportada
    lomo.scale.x = 0.6;
    lomo.rotateX(Math.PI/2);
    lomo.position.x -= 1.9;
    lomo.position.y += 0.38;
    
    // Añadimos al nodo de las hojas todos los mesh creados
    nodoEstructura.add(portada);
    nodoEstructura.add(contraportada);
    nodoEstructura.add(imagenPortada);
    nodoEstructura.add(lomo);

    return nodoEstructura;
  }

  createHojas () {
  	// El nodo del que van a colgar todas las partes de las hojas
    var nodoHojas = new THREE.Object3D();

    // Como material se crea uno a partir de un color
    var hojaMat = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
    
    // Ya podemos construir los Mesh correspondientes
    var hoja1 = new THREE.Mesh (this.libroGeom, hojaMat);
    var hoja2 = new THREE.Mesh (this.libroGeom, hojaMat);
    var hoja3 = new THREE.Mesh (this.libroGeom, hojaMat);
    var hoja4 = new THREE.Mesh (this.libroGeom, hojaMat);
    var hoja5 = new THREE.Mesh (this.libroGeom, hojaMat);
    var hoja6 = new THREE.Mesh (this.libroGeom, hojaMat);
    var hoja7 = new THREE.Mesh (this.libroGeom, hojaMat);
    var hoja8 = new THREE.Mesh (this.libroGeom, hojaMat);
    var hoja9 = new THREE.Mesh (this.libroGeom, hojaMat);
    var hoja10 = new THREE.Mesh (this.libroGeom, hojaMat);
    var hoja11 = new THREE.Mesh (this.libroGeom, hojaMat);
    var hoja12 = new THREE.Mesh (this.libroGeom, hojaMat);

    // Hacemos las transformaciones necesarios para aparentar un monton de papeles
    // Situándolos siempre uno encima de otro
    hoja1.position.y += 0.06;

    hoja2.position.y += 0.12;

    hoja3.position.y += 0.18;

    hoja4.position.y += 0.24;

    hoja5.position.y += 0.3;

    hoja6.position.y += 0.36;

    hoja7.position.y += 0.42;

    hoja8.position.y += 0.48;

    hoja9.position.y += 0.54;

    hoja10.position.y += 0.60;

    hoja11.position.y += 0.66;

    hoja12.position.y += 0.72;

    // Añadimos al nodo de las hojas todos los mesh creados
    nodoHojas.add (hoja1);
    nodoHojas.add (hoja2);
    nodoHojas.add (hoja3);
    nodoHojas.add (hoja4);
    nodoHojas.add (hoja5);
    nodoHojas.add (hoja6);
    nodoHojas.add (hoja7);
    nodoHojas.add (hoja8);
    nodoHojas.add (hoja9);
    nodoHojas.add (hoja10);
    nodoHojas.add (hoja11);
    nodoHojas.add (hoja12);

    // Movemos las hojas para que se junten con el lomo
    nodoHojas.position.x -= 0.25;

    return nodoHojas;
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

export { MyLibro };
