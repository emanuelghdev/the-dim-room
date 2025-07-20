import * as THREE from '../libs/three.module.js'
 
class MyPapeles extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Creamos los papeles
    this.papeles = this.createPapeles();

    // Y lo añadimoscomo hijo del Object3D (el this)
    this.add(this.papeles);
    
    // Las geometrías se crean centradas en el origen.
  }

  createPapeles () {
    // El nodo del que van a colgar todas las partes de los papeles
    var nodoPapeles = new THREE.Object3D();

    // Un Mesh se compone de geometría y material
    var hojaGeom = new THREE.BoxGeometry (3.5,0.05,5);

    // Como material se crea uno a partir de un color
    var hojaMat = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
    
    // Ya podemos construir los Mesh correspondientes
    var hoja1 = new THREE.Mesh (hojaGeom, hojaMat);
    var hoja2 = new THREE.Mesh (hojaGeom, hojaMat);
    var hoja3 = new THREE.Mesh (hojaGeom, hojaMat);
    var hoja4 = new THREE.Mesh (hojaGeom, hojaMat);
    var hoja5 = new THREE.Mesh (hojaGeom, hojaMat);
    var hoja6 = new THREE.Mesh (hojaGeom, hojaMat);
    var hoja7 = new THREE.Mesh (hojaGeom, hojaMat);
    var hoja8 = new THREE.Mesh (hojaGeom, hojaMat);
    var hoja9 = new THREE.Mesh (hojaGeom, hojaMat);
    var hoja10 = new THREE.Mesh (hojaGeom, hojaMat);
    var hoja11 = new THREE.Mesh (hojaGeom, hojaMat);
    var hoja12 = new THREE.Mesh (hojaGeom, hojaMat);

    // Hacemos las transformaciones necesarios para aparentar un monton de papeles
    // Sitaundolos siempre uno encima de otro y luego girando y moviendo algunos
    hoja1.position.y += 0.06;

    hoja2.position.y += 0.12;

    hoja3.position.y += 0.18;

    hoja4.position.y += 0.24;

    hoja5.position.y += 0.3;

    hoja6.position.y += 0.36;

    hoja7.position.y += 0.42;
    hoja7.position.x += 0.3;

    hoja8.position.y += 0.48;
    hoja8.position.x += 0.4;
    hoja8.position.z += 0.1;

    hoja9.position.y += 0.54;
    hoja9.position.x += 0.8;
    hoja9.position.z -= 0.3;
    hoja9.rotateY(Math.PI/8);

    hoja10.position.y += 0.6;
    hoja10.position.x += 0.8;
    hoja10.position.z -= 0.3;
    hoja10.rotateY(Math.PI/7);

    hoja12.position.y += 0.66;
    hoja12.position.x += 0.8;
    hoja12.position.z -= 0.3;
    hoja12.rotateY(Math.PI/6);

    // Añadimos al nodo de los papeles todos los mesh creados
    nodoPapeles.add(hoja1);
    nodoPapeles.add(hoja2);
    nodoPapeles.add(hoja3);
    nodoPapeles.add(hoja4);
    nodoPapeles.add(hoja5);
    nodoPapeles.add(hoja6);
    nodoPapeles.add(hoja7);
    nodoPapeles.add(hoja8);
    nodoPapeles.add(hoja9);
    nodoPapeles.add(hoja10);
    nodoPapeles.add(hoja11);
    nodoPapeles.add(hoja12);

    return nodoPapeles;
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

export { MyPapeles };
