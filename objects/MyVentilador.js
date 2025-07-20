import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
 
class MyVentilador extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Creamos la estructura de soporte
    this.base = this.createBase();

    // Creamos las hélices
    this.helices = this.createHelices();

    // Creamos la estructura del ventilador
    this.estructura = this.createEstructura();
    
    // Y añadimos todo como hijo del Object3D (el this)
    this.add (this.base);
    this.add (this.estructura);
    
    // Las geometrías se crean centradas en el origen.
    // Movemos el objeto para que esté sobre el eje de coordenadas
    this.position.y += 65;
    this.position.z += 30;

    // Giramos la estructura hacia la derecha
    this.estructura.rotateY(-Math.PI/4);  

    // Creamos unas variables para poner restricciones en el movimiento del ventilador      
    this.rotacion = 0;
    this.giro = Math.PI/80;
    this.rotacionMax = Math.PI/2;
    this.rotacionMin = -Math.PI/2;
    this.rotacionIzquierda = true;
  }

  createBase (){
    // El nodo del que van a colgar todas las partes de la estructura
    var nodoBase = new THREE.Object3D();

    // La geometría necesaria para la base será un cilindro
    var geometryCilindro = new THREE.CylinderGeometry (20,20,10,32);

    // Como material se crean unos a partir de una textura y otros a partir de colores
    var textureMetalRojo = new THREE.TextureLoader().load('imgs/metal-rojo.jpg');
    var materialMetalRojo = new THREE.MeshPhongMaterial ({map: textureMetalRojo});
    var textureMetalNegro = new THREE.TextureLoader().load('imgs/metal5.jpg');
    var materialMetalNegro = new THREE.MeshPhongMaterial ({map: textureMetalNegro});
    var materialBlanco = new THREE.MeshPhongMaterial ({color: 0xFFFFFF});

    // Construimos los mesh correspondientes
    var base = new THREE.Mesh (geometryCilindro, materialMetalRojo);
    var boton1 = new THREE.Mesh (geometryCilindro, materialMetalNegro);
    var boton2 = new THREE.Mesh (geometryCilindro, materialBlanco);
    var boton3 = new THREE.Mesh (geometryCilindro, materialBlanco);
    var boton4 = new THREE.Mesh (geometryCilindro, materialBlanco);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    base.scale.x = 1.5;

    base.position.y -= 60;
    base.position.z -= 30;

    boton1.scale.x = 0.2;
    boton1.scale.y = 0.5;
    boton1.scale.z = 0.2;

    boton1.position.x += 17;
    boton1.position.y -= 54;
    boton1.position.z -= 28;

    boton2.scale.x = 0.1;
    boton2.scale.y = 0.5;
    boton2.scale.z = 0.1;

    boton2.position.x -= 22;
    boton2.position.y -= 54;
    boton2.position.z -= 32;

    boton3.scale.x = 0.1;
    boton3.scale.y = 0.5;
    boton3.scale.z = 0.1;

    boton3.position.x -= 17;
    boton3.position.y -= 54;
    boton3.position.z -= 28;

    boton4.scale.x = 0.1;
    boton4.scale.y = 0.5;
    boton4.scale.z = 0.1;

    boton4.position.x -= 12;
    boton4.position.y -= 54;
    boton4.position.z -= 23;

    // Añadimos al nodo de la estructura todos los mesh creados
    nodoBase.add(base);
    nodoBase.add(boton1);
    nodoBase.add(boton2);
    nodoBase.add(boton3);
    nodoBase.add(boton4);

    return nodoBase;
  }

  createHelices () {
    // El nodo del que van a colgar todas las partes de las hélice
    var nodoHelices = new THREE.Object3D();

    // La geometría necesaria para las hélices será de cilindro y esfera
    var geometryCilindro1 = new THREE.CylinderGeometry (5,5,30,32);
    var geometryCilindro2 = new THREE.CylinderGeometry (7.5,2,45,32);
    var geometryEsfera = new THREE.SphereGeometry (8,32,16);

    // Como materiales se crean a partir de texturas
    var textureMetalRojo = new THREE.TextureLoader().load('imgs/metal-rojo.jpg');
    var materialMetalRojo = new THREE.MeshPhongMaterial ({map: textureMetalRojo});
    var textureMetal = new THREE.TextureLoader().load('imgs/metal3.jpg');
    var materialMetal = new THREE.MeshPhongMaterial ({map: textureMetal});
    
    // Ya podemos construir el Mesh
    var eje = new THREE.Mesh (geometryCilindro1, materialMetalRojo);
    var ejeEsfera = new THREE.Mesh (geometryEsfera, materialMetalRojo);
    var helice = new THREE.Mesh (geometryCilindro2, materialMetal);
    var esferaPerfilar = new THREE.Mesh (geometryEsfera, materialMetal);

    // Transformamos las partes de el modelo de hélice para el posterior csg
    helice.scale.z = 0.2;
    helice.position.y += 25;

    esferaPerfilar.scale.y = 2;
    esferaPerfilar.position.y += 20;

    // Creamos objetos CSG y operamos con ellos
    var csg = new CSG();

    csg.intersect([helice,esferaPerfilar]);     // Quitamos el hueco donde irá el panel de luz

    // Asignamos la tabla al objeto csg
    var helice1 = csg.toMesh();
    var helice2 = csg.toMesh();
    var helice3 = csg.toMesh();

    // Ahora podemos hacer todas las transformaciones necesarias
    eje.position.z -= 10;
    eje.rotateX(Math.PI/2);

    helice2.rotateZ(2*Math.PI/3);           // Una hélice se posiciona a un tercio del giro completo de la primera 

    helice3.rotateZ(2*(2*Math.PI/3));       // La siguiente a otro de la anterior

    // Y añadirlo como hijo del Object3D (el this)
    nodoHelices.add(eje);
    nodoHelices.add(ejeEsfera);
    nodoHelices.add (helice1);
    nodoHelices.add (helice2);
    nodoHelices.add (helice3);

    return nodoHelices;
  }

  createEstructura (){
    // El nodo del que van a colgar todas las partes de la estructura
    var nodoEstructura = new THREE.Object3D();
    var nodoEstructuraFinal = new THREE.Object3D();

    // La geometría necesaria para la estructura serán toros
    // Para completar la estructura también necesitaremos una geometría esfera y cilindro
    var geometryToro1 = new THREE.TorusGeometry (40,1,12,24);
    var geometryToro2 = new THREE.TorusGeometry (5,1,12,24);
    var geometryCilindro = new THREE.CylinderGeometry (5,5,30,32);
    var geometryEsfera = new THREE.SphereGeometry (8,32,16);
    
    // Como material se crea uno a partir de una textura
    var textureMetalRojo = new THREE.TextureLoader().load('imgs/metal-rojo.jpg');
    var materialMetalRojo = new THREE.MeshPhongMaterial ({map: textureMetalRojo});

    // Construimos los mesh correspondientes
    var rejillaInicial = new THREE.Mesh (geometryToro1, materialMetalRojo);
    var rejillaDelante1 = new THREE.Mesh (geometryToro2, materialMetalRojo);
    var rejillaDelante2 = new THREE.Mesh (geometryToro1, materialMetalRojo);
    var rejillaDelante3 = new THREE.Mesh (geometryToro1, materialMetalRojo);
    var rejillaDelante4 = new THREE.Mesh (geometryToro1, materialMetalRojo);
    var rejillaDetras1 = new THREE.Mesh (geometryToro2, materialMetalRojo);
    var rejillaDetras2 = new THREE.Mesh (geometryToro1, materialMetalRojo);
    var rejillaDetras3 = new THREE.Mesh (geometryToro1, materialMetalRojo);
    var rejillaDetras4 = new THREE.Mesh (geometryToro1, materialMetalRojo);
    var rejillaGirado1 = new THREE.Mesh (geometryToro1, materialMetalRojo);
    var rejillaGirado2 = new THREE.Mesh (geometryToro1, materialMetalRojo);
    var rejillaGirado3 = new THREE.Mesh (geometryToro1, materialMetalRojo);
    var rejillaGirado4 = new THREE.Mesh (geometryToro1, materialMetalRojo);
    var motorCaja = new THREE.Mesh (geometryCilindro, materialMetalRojo);
    var motorEsfera = new THREE.Mesh (geometryEsfera, materialMetalRojo);
    var soporte = new THREE.Mesh (geometryCilindro, materialMetalRojo);

    // Hacemos las tranformaciones necesarios a todos los mesh que necesitamos
    rejillaDelante1.position.z += 20;

    rejillaDelante2.scale.x = 0.61;
    rejillaDelante2.scale.y = 0.64;
    rejillaDelante2.position.z += 15;

    rejillaDelante3.scale.x = 0.83;
    rejillaDelante3.scale.y = 0.86;
    rejillaDelante3.position.z += 10;

    rejillaDelante4.scale.x = 0.93;
    rejillaDelante4.scale.y = 0.96;
    rejillaDelante4.position.z += 5;

    rejillaDetras1.position.z -= 20;

    rejillaDetras2.scale.x = 0.61;
    rejillaDetras2.scale.y = 0.64;
    rejillaDetras2.position.z -= 15;

    rejillaDetras3.scale.x = 0.83;
    rejillaDetras3.scale.y = 0.86;
    rejillaDetras3.position.z -= 10;

    rejillaDetras4.scale.x = 0.93;
    rejillaDetras4.scale.y = 0.96;
    rejillaDetras4.position.z -= 5;

    rejillaGirado1.scale.x = 0.51;
    rejillaGirado1.rotateY(Math.PI/2);

    rejillaGirado2.scale.x = 0.51;
    rejillaGirado2.rotateY(Math.PI/2);
    rejillaGirado2.rotateX(Math.PI/2);

    rejillaGirado3.scale.x = 0.51;
    rejillaGirado3.rotateY(Math.PI/2);
    rejillaGirado3.rotateX(Math.PI/4);

    rejillaGirado4.scale.x = 0.51;
    rejillaGirado4.rotateY(Math.PI/2);
    rejillaGirado4.rotateX(-Math.PI/4);

    motorCaja.scale.x = 2;
    motorCaja.scale.y = 0.67;
    motorCaja.scale.z = 2;
    motorCaja.rotateX(Math.PI/2);
    motorCaja.position.z -= 32;

    motorEsfera.scale.x = 1.25;
    motorEsfera.scale.y = 1.25;
    motorEsfera.scale.z = 1.25;
    motorEsfera.position.z -= 40;

    soporte.scale.x = 0.8;
    soporte.scale.y = 2;
    soporte.scale.z = 0.8;
    soporte.position.y -= 30;
    soporte.position.z -= 35;

    // Creamos un objeto CSG y operamos con él
    var csg = new CSG();

    csg.union([motorCaja,motorEsfera]);     // Unimos media esfera al cilindro que hace de caja

    // Asignamos la tabla al objeto csg
    var motor = csg.toMesh();


    // Añadimos al nodo de la estructura todos los mesh creados
    nodoEstructura.add(rejillaInicial);
    nodoEstructura.add(rejillaDelante1);
    nodoEstructura.add(rejillaDelante2);
    nodoEstructura.add(rejillaDelante3);
    nodoEstructura.add(rejillaDelante4);
    nodoEstructura.add(rejillaDetras1);
    nodoEstructura.add(rejillaDetras2);
    nodoEstructura.add(rejillaDetras3);
    nodoEstructura.add(rejillaDetras4);
    nodoEstructura.add(rejillaGirado1);
    nodoEstructura.add(rejillaGirado2);
    nodoEstructura.add(rejillaGirado3);
    nodoEstructura.add(rejillaGirado4);
    nodoEstructura.add(motor);
    nodoEstructura.add(soporte);
    nodoEstructura.add(this.helices);       // Añadimos las hélices anteriormente creadas para que el movimiento de la
                                            // estructura se aplique también a las aspas

    // Movemos la estructura a la posición correcta para poder girarla entera en el eje Y con el soporte como centro
    nodoEstructura.position.z += 35;

    // Hacemos las tranformaciones para que la estructura a vuelva a su posición correcta
    nodoEstructuraFinal.position.z -= 35;
    nodoEstructuraFinal.add(nodoEstructura);

    return nodoEstructuraFinal;
  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    // Si estamos rotando hacia la izquierda
    if(this.rotacionIzquierda == true){
        this.rotacion += this.giro;            // Aumentamos la rotación unos 0.05

        // Si la rotación es igual a la maxima giramos para el otro lado
        if(this.rotacion == this.rotacionMax){
            this.rotacionIzquierda = false;
        }
    }
    else {
        this.rotacion -= this.giro;            // Reducimos la rotación unos 0.05 

        // Si la rotación es igual a la minima giramos para el otro lado
        if(this.rotacion == this.rotacionMin){
            this.rotacionIzquierda = true;
        }
    }

    // Actualizamos las rotaciones
    this.estructura.rotateY(this.rotacion/40);
    this.helices.rotateZ(0.4);
  }
}

export { MyVentilador };
