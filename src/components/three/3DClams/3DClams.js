import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Konva from "konva";
import { PhotoshopPicker } from "react-color";

import { getTraits } from "./main";
import decodeDna from "./decodeDna";

import { OrbitControls, MapControls } from "../../../loaders/OrbitControls";
import GLTFLoader from "../../../loaders/GLTFLoader";
import lighting from "./config/lighting-setup-2.json";
import { Button } from "react-bootstrap";

const clock = new THREE.Clock();

THREE.Cache.enabled = true;

const loadTexture = (url) => {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(url, resolve);
  });
};

const loadGLTF = (url) => {
  return new Promise((resolve) => {
    new GLTFLoader().load(url, resolve);
  });
};

const loadObj = (url) => {
  return new Promise((resolve) => {
    new THREE.ObjectLoader().load(url, resolve);
  });
};

const imageArray = [];
let containers = [];
const sliderValues = {
  //   h: 150,
  //   s: -2,
  //   v: -2,
  r: 100,
  g: 100,
  b: 100,
};

const Clams3D = ({ width, height, clamDna, decodedDna }) => {
  const mapRef = useRef(null);
  const mapRef1 = useRef(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState(sliderValues);
  const [layers, setLayers] = useState([]);
  const [scene, setScene] = useState("");
  const [renderer, setRenderer] = useState("");
  const [traits, setTraits] = useState({});
  const [clamDir, setClamDir] = useState("");

  if (!clamDna) return <div>No Clam to see!</div>;

  useEffect(() => {
    const defaultTraits = getTraits(clamDna);
    // const defaultTraits = decodeDna(decodedDna);
    const defaultClamDir = `/clam-models/${defaultTraits.shellShape.replace(/\s+/g, "-").toLowerCase()}/`;
    setTraits(defaultTraits);
    setClamDir(defaultClamDir);

    if (defaultClamDir) {
      console.log('set up renderer', decodedDna)
      create3DScene(mapRef.current, setLayers, setScene, setRenderer, defaultTraits, defaultClamDir, takePhoto);
    }
  }, [mapRef]);

  useEffect(() => {
    if(decodedDna && scene) {
      refreshTraits();
    }
  }, [decodedDna, scene]);

  const handleChangeComplete = (color) => {
    // console.log(color);
    // setKonvaLayerTexture(layers[0], color.rgb);
    // setKonvaLayerTexture(layers[1], color.rgb);
    // setKonvaLayerTexture(layers[2], color.rgb);
    // setKonvaLayerTexture(layers[3], color.rgb);
    // updateShellTextures(scene, layers);
    // setColor(color.rgb);
  };

  const takePhoto = () => {
    const canvas = mapRef.current.querySelector("canvas");
    const src = canvas.toDataURL("image/jpeg");
    let img = mapRef1.current;
    img.src = src;
  };

  const refreshTraits = async () => {
    // const traits = getTraits(clamDna);
    const traits = decodeDna(decodedDna);
    console.log(traits);
    const clamDir =
      "/clam-models/" +
      traits.shellShape.replace(/\s+/g, "-").toLowerCase() +
      "/";
    setTraits(traits);
    setClamDir(clamDir);

    scene.clear();
    await loadModels(scene, clamDir, traits);
    const layers = await loadAllTextures(traits, clamDir);
    setLayers(layers);
    setScene(scene);
    updateShellTextures(scene, layers, traits, takePhoto);
  };

  return (
    <>
      {/* <div className="flex flex-col w-full justify-center bg-gray-50"> */}
        {/* <div className="flex items-center justify-between w-full">
          <Button className="flex flex-col items-center h-18 py-2" onClick={takePhoto}>
            Take Photo
          </Button>
          <Button className="flex flex-col items-center h-18 py-2" onClick={refreshTraits}>
            Refresh Traits
          </Button>
        </div> */}

        <div className="mt-4 mb-4">
          <div className="three-container mt-4 mb-10" ref={mapRef} style={{ width, height }}></div>
        </div>

        {/* <div>
        <PhotoshopPicker
          style={{}}
          color={color}
          onChangeComplete={handleChangeComplete}
        />
      </div> */}

        {/* <img className="hidden" src="" ref={mapRef1} style={{ width, height }} /> */}
      {/* </div> */}
      <div className="mt-4 mb-4">SC Converted to JS Interpreter: {JSON.stringify(traits, null, 4)}</div>
      <br />
      <div className="mt-4 mb-4">SC Interpreter: {JSON.stringify(decodedDna, null, 4)}</div>
    </>
  );
};

// const traits = getTraits();
// const clamDir =
//   "clam-models/" + traits.shellShape.replace(/\s+/g, "-").toLowerCase() + "/";

// CREATE A 3D SCENE
const create3DScene = async (element, setLayers, setScene, setRenderer, traits, clamDir, takePhoto) => {
  // create a 3d renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  renderer.gammaOutput = true;
  renderer.setSize(element.offsetWidth, element.offsetHeight);

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
  camera.updateProjectionMatrix();

  // orbit controls to pan and zoom
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  const txloader = new THREE.TextureLoader();
  const bgTexture = txloader.load("/clam-models/clam-template-bg-3.png");
  const scene = new THREE.Scene();
  scene.background = bgTexture;

  // await loadModels(scene, clamDir, traits);
  // const layers = await loadAllTextures(traits, clamDir);
  // setLayers(layers);
  setScene(scene);
  // updateShellTextures(scene, layers, traits, takePhoto);

  // load animation after models load
  animate({
    scene,
    camera,
    controls,
    renderer,
  });
};

const loadModels = async (scene, clamDir, traits) => {
  // load lighting
  // const sc = await loadObj("./config/lighting-setup-2.json");
  const loader = new THREE.ObjectLoader();
  const sc = loader.parse(lighting);
  let objs = sc.children;
  do {
    scene.add(objs[0]);
  } while (objs.length > 0);

  const rotator = new THREE.Object3D();
  const clamGroup = new THREE.Group();

  // load clam model
  const clamModel = await loadGLTF(clamDir + "clam.glb");
  const clamRoot = clamModel.scene;
  clamRoot.traverse((n) => {
    if (n.isMesh) {
      n.castShadow = true;
      n.receiveShadow = true;
      if (n.material.map) n.material.map.anisotropy = 16;
    }
  });
  clamRoot.name = "shell";
  clamGroup.add(clamRoot);

  // load tongue model
  const tongueTex = await loadTexture("/clam-models/tongue-normal.png");
  const tongueModel = await loadGLTF(clamDir + "Tongues/" + (traits.tongue || "Common").toLowerCase() + ".glb");
  const tongueRoot = tongueModel.scene;
  tongueRoot.traverse((n) => {
    if (n.isMesh) {
      n.castShadow = true;
      n.receiveShadow = true;
      n.material.normalMap = tongueTex;
      //n.material.map.anisotropy = 16;
    }
  });
  tongueRoot.name = "tongue";
  clamGroup.add(tongueRoot);

/*  switch (traits.shellShape) {
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
*/
  rotator.add(clamGroup);
  scene.add(rotator);
  rotator.position.z = -0.05;
  clamGroup.position.z = 0.05;
};

const setKonvaLayerTexture = (layer, color) => {
  //   layer.hue(parseFloat(color.h));
  //   layer.saturation(parseFloat(color.s));
  //   layer.value(parseFloat(color.v));
  layer.hue(parseFloat(color[0]));
  layer.saturation(parseFloat(color[1] / 100));
  layer.value(parseFloat(color[2] / 100));
  layer.batchDraw();
};

// const loadTextureKonva = async function (obj, textureFile) {
const loadTextureKonva = async (object, texture, base) => {
  const obj = object.type;
  const img = texture.image;
  const sliders = ["hue", "saturation", "value"];

  const div = document.createElement("div");

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

  setKonvaLayerTexture(layer, object.color);

  return layer;
};

const loadAllTextures = async (traits, clamDir) => {
  const textures = [
    {
      type: "os",
      img: "outerPBS_basecolor.png",
      color: traits.shellColour.HSVadj,
    },
    {
      type: "is",
      img: "innerPBS_basecolor.png",
      color: traits.innerColour.HSVadj,
    },
    { type: "lip", img: "lip_basecolor.png", color: traits.lipColour.HSVadj },
    {
      type: "tongue",
      img: "tongue_BaseColor.png",
      color: traits.tongueColour.HSVadj,
    },
  ];

  const loaded = await Promise.all(textures.map((k) => loadTexture(clamDir + k.img)));
  const base = await loadTexture("/clam-models/patterns/" + traits.pattern.toLowerCase() + "_basecolor.png");

  return Promise.all(textures.map((k, i) => loadTextureKonva(k, loaded[i], base)));
};

const updateShellTextures = (scene, containers, traits, takePhoto) => {
  const osCanvas = containers[0].toCanvas();
  const isCanvas = containers[1].toCanvas();
  const lipCanvas = containers[2].toCanvas();
  const tongueCanvas = containers[3].toCanvas();

  let shell = 0;
  let tongue = 0;

  if (osCanvas && isCanvas && lipCanvas && tongueCanvas) {
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

        if(half.name == "crown") {
          half.material.map = osTexture;
        } else if (half.name == "lips") {
          half.material.map = lipTexture;
        } else {

          half.children[1].material.map = osTexture;
          if (traits.shellShape == "Fan" || traits.shellShape == "Heart" || traits.shellShape == "Sharp Tooth" || traits.shellShape == "Hamburger") {
            half.children[0].material.map = lipTexture
          } else {
            if (traits.shellShape != "Maxima") {
              half.children[2].material.map = lipTexture;
            }
          }

          (traits.shellShape == "Fan" || traits.shellShape == "Heart" || traits.shellShape == "Sharp Tooth" || traits.shellShape == "Hamburger") ?
              half.children[2].material.map = isTexture
              : half.children[0].material.map = isTexture;
        }
    });

    if (tongue.children[0]) {
      tongue.children[0].children[0].material.map = tongueTexture;
    }

    osTexture.needsUpdate = true;
    isTexture.needsUpdate = true;
    lipTexture.needsUpdate = true;
    tongueTexture.needsUpdate = true;
    // setTimeout(() => {
    //   takePhoto();
    // }, 1000);
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
