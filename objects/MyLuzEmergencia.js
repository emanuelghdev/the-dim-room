import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
 
class MyLuzEmergencia extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Creamos la estructura principal
    this.estructura = this.createEstructura();

    // Creamos el foco
    this.foco = this.createFoco();
    
    // Y añadimos todo como hijo del Object3D (el this)
    this.add (this.estructura);
    this.add (this.foco);

    // Las geometrías se crean centradas en el origen.
    // Subimos el objeto para que esté encima del eje de coordenadas
    this.position.y += 4;
  }

  createEstructura (){
    // El nodo del que van a colgar todas las partes de la estructura
    var nodoEstructura = new THREE.Object3D();

    // La geometría necesaria para la parte de atrás de la estructura será una caja
    // Para completar la estructura también necesitaremos una geometría de esfera y cilindro 
    var geometryTabla = new THREE.BoxGeometry (40,8,20);
    var geometryPrisma = new THREE.CylinderGeometry (0.5,0.5,1,6); 
    this.geometryEsfera = new THREE.SphereGeometry (15,32,16); 

    // Como material se crean a partir de unas texturas
    var textureMetal1 = new THREE.TextureLoader().load('imgs/metal3.jpg');
    var materialMetal1 = new THREE.MeshPhongMaterial ({map: textureMetal1});
    var textureMetal2 = new THREE.TextureLoader().load('imgs/metal2.jpg');
    var materialMetal2 = new THREE.MeshPhongMaterial ({map: textureMetal2});

    // Construimos los mesh correspondientes
    var tablaAtras = new THREE.Mesh (geometryTabla, materialMetal2);
    var esferaPerfilar = new THREE.Mesh (this.geometryEsfera, materialMetal2);
    var esferaAQuitar = new THREE.Mesh (this.geometryEsfera, materialMetal2);
    var alaIzq = new THREE.Mesh (this.geometryEsfera, materialMetal2);
    var alaDch = new THREE.Mesh (this.geometryEsfera, materialMetal2);
    var tuercaIzq = new THREE.Mesh (geometryPrisma, materialMetal1);
    var tuercaDch = new THREE.Mesh (geometryPrisma, materialMetal1);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    esferaPerfilar.scale.x = 1.2;

    esferaAQuitar.scale.y = 0.5;
    esferaAQuitar.scale.z = 0.6;

    esferaAQuitar.position.y += 4;

    alaDch.scale.x = 0.1;
    alaDch.scale.y = 0.4;
    alaDch.scale.z = 0.4;
    alaDch.rotateZ(-Math.PI/2);
    alaDch.position.x += 18;
    alaDch.position.y -= 2.8;

    alaIzq.scale.x = 0.1;
    alaIzq.scale.y = 0.4;
    alaIzq.scale.z = 0.4;
    alaIzq.rotateZ(Math.PI/2);
    alaIzq.position.x -= 18;
    alaIzq.position.y -= 2.8;

    tuercaDch.position.x += 20;
    tuercaDch.position.y -= 1.4;

    tuercaIzq.position.x -= 20;
    tuercaIzq.position.y -= 1.4;


    // Creamos un objeto CSG y operamos con él
    var csg = new CSG();

    csg.intersect([tablaAtras,esferaPerfilar]);    	// Perfilamos la tabla
    csg.subtract([esferaAQuitar]);					// Quitamos el hueco donde debe situarse el foco

    // Asignamos la tabla al objeto csg
    var tabla = csg.toMesh();

    // Añadimos al nodo de la estructura todos los mesh creados
    nodoEstructura.add(tabla);
    nodoEstructura.add(alaIzq);
    nodoEstructura.add(alaDch);
    nodoEstructura.add(tuercaIzq);
    nodoEstructura.add(tuercaDch);

    return nodoEstructura;
  }

  createFoco(){
  	// El nodo del que van a colgar todas las partes de la estructura
    var nodoFoco = new THREE.Object3D();

    // Usamos la geometría de toros para hacer una especie de rejas alrededor de la lámpara
    var geometryToro = new THREE.TorusGeometry (9,1,8,12);
    var geometryTabla = new THREE.BoxGeometry (40,12,20);

    // Como material se crea uno a partir del color negro y otro a partir de una textura
    var textureVidrio = new THREE.TextureLoader().load('imgs/vidrio.jpg');
    var materialFoco = new THREE.MeshLambertMaterial({map: textureVidrio, transparent: true, opacity: 0.5, emissive: 0xFFFFFF, emissiveIntensity: 1});
    var textureMetal = new THREE.TextureLoader().load('imgs/metal2.jpg');
    var materialMetal = new THREE.MeshPhongMaterial ({map: textureMetal});

    // Construimos los mesh correspondientes
    var foco = new THREE.Mesh (this.geometryEsfera, materialFoco);
    var reja1 = new THREE.Mesh (geometryToro, materialMetal);
    var reja2 = new THREE.Mesh (geometryToro, materialMetal);
    var reja3 = new THREE.Mesh (geometryToro, materialMetal);
    var cajaAQuitar = new THREE.Mesh (geometryTabla, materialMetal);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    foco.scale.x = 0.94;
    foco.scale.y = 0.44;
    foco.scale.z = 0.54;

    foco.position.y += 3.8;

    reja1.scale.x = 1.7;
    reja1.scale.y = 1.3;

    reja2.scale.y = 1.2;
    reja2.rotateY(Math.PI/2);
    reja2.position.x += 5;


    reja3.scale.y = 1.2;
    reja3.rotateY(Math.PI/2);
    reja3.position.x -= 5;

    cajaAQuitar.position.y -= 8;

    // Creamos un objeto CSG y operamos con él
    var csg = new CSG();

    csg.union([reja1,reja2,reja3]);     // Unimos las rejas que vamos a añadir
    csg.subtract([foco]);               // Le quitamos lo que ocupa el foco
    csg.subtract([cajaAQuitar]);        // Le quitamos la parte de atrás a los toros

    // Asignamos la tabla al objeto csg
    var decoracion = csg.toMesh();

  	// Añadimos al nodo de la estructura todos los mesh creados
    nodoFoco.add(foco);
    nodoFoco.add(decoracion);

    return nodoFoco;
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

export { MyLuzEmergencia };
