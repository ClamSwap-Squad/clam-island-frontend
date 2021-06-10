import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Konva from 'konva';
import { PhotoshopPicker } from 'react-color';

import { getTraits } from './main';

import { OrbitControls, MapControls } from "../../../loaders/OrbitControls";
import GLTFLoader from "../../../loaders/GLTFLoader";
import lighting from "./config/lighting-setup-2.json";
import { Button } from "react-bootstrap";

const clock = new THREE.Clock();

THREE.Cache.enabled = true;

const loadTexture = (url) => {
    return new Promise(resolve => {
        new THREE.TextureLoader().load(url, resolve)
    });
};

const loadGLTF = (url) => {
    return new Promise(resolve => {
        new GLTFLoader().load(url, resolve)
    });
};

const loadObj = (url) => {
    return new Promise(resolve => {
        new THREE.ObjectLoader().load(url, resolve)
    });
};

const imageArray = [];
let containers = [];
const sliderValues = {
    h: 150,
    s: 1,
    v: -1.6
}

const Clams3D = (props) => {
  const mapRef = useRef(null);
  const mapRef1 = useRef(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState('#fff');
  const [layers, setLayers] = useState([]);
  const [scene, setScene] = useState('');
  const [renderer, setRenderer] = useState('');

  useEffect(() => {
    create3DScene(mapRef.current, setLayers, setScene, setRenderer);
  }, [mapRef]);

  const handleChangeComplete = (color) => {
    setKonvaLayerTexture(layers[0], color.hsv);
    setKonvaLayerTexture(layers[1], color.hsv);
    setKonvaLayerTexture(layers[2], color.hsv);
    setKonvaLayerTexture(layers[3], color.hsv);
    updateShellTextures(scene, layers);

    setColor(color.hsv);
  };

  const takePhoto = () => {
    const canvas = mapRef.current.querySelector('canvas');
    const src = canvas.toDataURL('image/jpeg');
    let img = mapRef1.current;
    img.src = src;
  };

  return (
    <>
      <Button onClick={takePhoto}>Take Photo</Button>
      <div className="three-container" ref={mapRef} style={{width: '500px', height: '500px'}} />
      <div style={{position: 'absolute', right: '50px', top: '50px'}}>
        <PhotoshopPicker
          style={{}}
          color={ color }
          onChangeComplete={ handleChangeComplete }
        />
      </div>

      <img src="" ref={mapRef1} style={{ width: '200px', height: '200px', position: 'absolute', right: '150px', top: '400px'}} />
    </>
  );
};

const traits = getTraits();
const clamDir = 'clam-models/' + traits.shellShape.replace(/\s+/g, '-').toLowerCase() + '/';

// CREATE A 3D SCENE
const create3DScene = async (element, setLayers, setScene, setRenderer) => {
  // create a 3d renderer
  const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  renderer.gammaOutput = true;
  renderer.setSize(500, 500);

  element.appendChild(renderer.domElement);

  setRenderer(renderer);

  // create a camera
  const fov = 75;
  const aspect = 1;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = -1.4;
  camera.position.y = 0.9;
  camera.position.x = -0.4;
  camera.zoom = 7;
  camera.updateProjectionMatrix()

  // orbit controls to pan and zoom
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();;

  const txloader = new THREE.TextureLoader();
  const bgTexture = txloader.load('clam-models/clam-template-bg-3.png');
  const scene = new THREE.Scene();
  scene.background = bgTexture;

  await loadModels(scene);
  const layers = await loadAllTextures();
  setLayers(layers);
  setScene(scene);
 
  updateShellTextures(scene, layers);

  // load animation after models load
  animate({
    scene,
    camera,
    controls,
    renderer,
  });
};

const loadModels = async (scene) => {
  // load lighting
  // const sc = await loadObj("./config/lighting-setup-2.json");
  const loader = new THREE.ObjectLoader();
  const sc = loader.parse( lighting );
  let objs = sc.children;
  do {
      scene.add(objs[0]);
  } while (objs.length > 0);

  const rotator = new THREE.Object3D();
  const clamGroup = new THREE.Group();

  // load clam model
  const clamModel = await loadGLTF(clamDir + 'clam.glb');
  const clamRoot = clamModel.scene;
  clamRoot.traverse(n => {
      if (n.isMesh) {
          n.castShadow = true;
          n.receiveShadow = true;
          if (n.material.map) n.material.map.anisotropy = 16;
      }
  });
  clamRoot.name = "shell";
  clamGroup.add(clamRoot);

  // load tongue model
  const tongueTex = await loadTexture("clam-models/tongue-normal.png");
  const tongueModel = await loadGLTF(clamDir + 'Tongues/' + traits.tongue.toLowerCase() + '.glb');
  const tongueRoot = tongueModel.scene;
  tongueRoot.traverse(n => {
      if (n.isMesh) {
          n.castShadow = true;
          n.receiveShadow = true;
          n.material.normalMap = tongueTex;
          //n.material.map.anisotropy = 16;
      }
  });
  tongueRoot.name = "tongue";
  clamGroup.add(tongueRoot);

  switch (traits.shellShape) {
      case "Three Lipped":
          clamGroup.rotation.y += 3;
          clamGroup.scale.set(1.7, 1.7, 1.7);
          break;
      case "Big Mouth":
          clamGroup.scale.set(1.75, 1.75, 1.75);
          break;
      case "Fan":
          clamGroup.scale.set(0.2, 0.2, 0.2);
          break;
      case "Common":
          clamGroup.rotation.set(-0.2, 0, 0.1);
          break;
      case "Spade":
          clamGroup.scale.set(1.25, 1.25, 1.25);
          break;
      case "Heart":
          clamGroup.rotation.set(0.1, -0.1, 0);
          break;
      case "Sharp Tooth":
          clamGroup.rotation.set(0.1, 0, 0);
          clamGroup.scale.set(1.35, 1.35, 1.35);
          clamGroup.position.y += 0.05;
          break;
      default:
          break;
  }

  rotator.add(clamGroup);
  scene.add(rotator);
  rotator.position.z = -0.05;
  clamGroup.position.z = 0.05;
};

const setKonvaLayerTexture = (layer, color) => {
    layer.hue(color.h);
    layer.saturation(color.s);
    layer.value(color.v);
    layer.batchDraw();
};

// const loadTextureKonva = async function (obj, textureFile) {
const loadTextureKonva = async (object, texture, base) => {
    const obj = object.type;
    const img = texture.image;
    const sliders = ['hue', 'saturation', 'value'];

    const div = document.createElement('div');

    const stage = new Konva.Stage({
        container: div, // obj + '-canvas',
        width: 1024,
        height: 1024,
    });
    const layer = new Konva.Layer();

    imageArray[obj] = new Konva.Image({
        x: 0,
        y: 0,
        image: img,
        width: 1024,
        height: 1024,
    });
    layer.add(imageArray[obj]);

    if (obj === "os") {
        const pattern = new Konva.Image({
            x: 0,
            y: 0,
            image: base.image,
            width: 1024,
            height: 1024,
        });
        layer.add(pattern);
    }

    layer.cache();
    layer.filters([Konva.Filters.HSV]);
    stage.add(layer);

    setKonvaLayerTexture(layer, sliderValues);

    return layer;
};

const loadAllTextures = async () => {
    const textures = [
        { type: 'os', img: 'outerPBS_basecolor.png' },
        { type: 'is', img: 'innerPBS_basecolor.png' },
        { type: 'lip', img: 'lip_basecolor.png' },
        { type: 'tongue', img: 'tongue_BaseColor.png' }
    ];

    const loaded = await Promise.all(textures.map(k => loadTexture(clamDir + k.img)));
    const base = await loadTexture(
        'clam-models/patterns/' + traits.pattern.toLowerCase() + '_basecolor.png'
    );

    return Promise.all(textures.map((k, i) => loadTextureKonva(k, loaded[i], base)));
};

const updateShellTextures = (scene, containers) => {
    // const osCanvas = containers[0].querySelectorAll('div canvas')[0]; 
    // const isCanvas = containers[1].querySelectorAll('div canvas')[0]; 
    // const lipCanvas = containers[2].querySelectorAll('div canvas')[0];
    // const tongueCanvas = containers[3].querySelectorAll('div canvas')[0];


    const osCanvas = containers[0].toCanvas(); 
    const isCanvas = containers[1].toCanvas(); 
    const lipCanvas = containers[2].toCanvas();
    const tongueCanvas = containers[3].toCanvas();

    let shell = 0;
    let tongue = 0;

    if(osCanvas && isCanvas && lipCanvas && tongueCanvas) {

        const osTexture = new THREE.CanvasTexture(osCanvas);
        const isTexture = new THREE.CanvasTexture(isCanvas);
        const lipTexture = new THREE.CanvasTexture(lipCanvas);
        const tongueTexture = new THREE.CanvasTexture(tongueCanvas);

        tongueTexture.rotation = Math.random() * Math.PI;

        tongueTexture.flipY = false;
        osTexture.flipY = false;
        isTexture.flipY = false;
        lipTexture.flipY = false;

        if (scene.children[3].children[0].children[0].name == "shell") {
            shell = scene.children[3].children[0].children[0];
            tongue = scene.children[3].children[0].children[1];
        } else {
            shell = scene.children[3].children[0].children[1];
            tongue = scene.children[3].children[0].children[0];
        }

        shell.children[0].children.forEach(half => {
            half.children[1].material.map = osTexture;
            (traits.shellShape == "Fan" || traits.shellShape == "Heart") ?
                half.children[0].material.map = lipTexture
                : half.children[2].material.map = lipTexture;
            (traits.shellShape == "Fan" || traits.shellShape == "Heart") ?
                half.children[2].material.map = isTexture
                : half.children[0].material.map = isTexture;
        });

        if(["Forked", "Heart"].indexOf(traits.tongue) !== -1 && traits.shellShape == "Common") {
            tongue.children[0].material.map = tongueTexture;
        } else {
            tongue.children[0].children[0].material.map = tongueTexture;
        }

        osTexture.needsUpdate = true;
        isTexture.needsUpdate = true;
        lipTexture.needsUpdate = true;
        tongueTexture.needsUpdate = true;
    }
};

// CALL ANIMATE EVERY SECOND TO DISPLAY
const animate = ({ scene, camera, controls, renderer }) => {
  window.requestAnimationFrame(() => {
    animate({
      scene,
      camera,
      controls,
      renderer,
    });
  });
  controls.update();

  renderer.render(scene, camera);
};

export default Clams3D;