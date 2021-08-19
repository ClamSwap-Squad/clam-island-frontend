import React, { useEffect, useRef, useState } from "react";
// import { useHistory } from "react-router-dom";

// font awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus, faSearchMinus } from "@fortawesome/free-solid-svg-icons";


// THREE.JS LIBRARIES
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { OrbitControls } from "../../loaders/OrbitControls";
import loadGLTF from "./loaders/gltf_loader";

// local file functions
import "./3d_map.scss";
import { ISLAND_OBJECTS } from "./constants";
import createWater from "./create_water";
import createSky from "./create_sky";
import clamIcon from "../../assets/clam-icon.png";

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let outlinePass;
let hoverStr;
let composer;
let hotMeshArr;
let camera;

THREE.Cache.enabled = true;

const Map3D = () => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const [hoverName, setHoverName] = useState('');
  var [controls, setControls] = useState({});
  var renderer, scene, camera, totalGroup, water;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let bank, farm, market, vault, lighthouse, bridge, rocks, lilly, boats, ship, sailboat, seagulls, dolphins;
  let hotModelBank, hotModelFarm, hotModelMarket, hotModelVault;
  let composer, outlinePass, effectFXAA, hotMeshArr = [], hoverStr = '';
  let bankSign, farmSign, marketSign, safeSign, infoSign, shopSign;

  useEffect(() => {
    create3DScene(mapRef.current, setLoading, setControls, setHoverName);

  }, [mapRef]);

  const zoomIn = () => {
    controls.dollyIn();
  };

  const zoomOut = () => {
    controls.dollyOut();
  };

  const create3DScene = async (element, setLoading) => {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    //renderer.toneMapping = THREE.ACESFilmicToneMapping;
    //renderer.toneMappingExposure = 1.2;
    // renderer.gammaOutput = true;
    // renderer.gammaFactor = 2.2;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById("container").appendChild(renderer.domElement);
		renderer.setClearColor(0xe1e1e1, 1);
    //renderer.physicallyCorrectLights = true;

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(650, 350, 500);
    console.log(camera);

    controls = new OrbitControls(camera, renderer.domElement);
    // controls.minZoom = 1;
    // controls.maxZoom = 3;
    controls.minDistance = 800;
    controls.maxDistance = 1500;
    controls.maxPolarAngle = 1.5;
    controls.enablePan = false;

    scene = new THREE.Scene();

    water = createWater({ scene });
    createSky({ scene, water, renderer });
    addLights();

    bank = await loadGLTF("glb_files/Bank_Island.glb", scene);
    farm = await loadGLTF("glb_files/Farm_Island.glb", scene);
    market = await loadGLTF("glb_files/Market_Island.glb", scene);
    vault = await loadGLTF("glb_files/Vault_Island.glb", scene);
    bridge = await loadGLTF("glb_files/Bridges.glb", scene, "bridge");
    rocks = await loadGLTF("glb_files/Rocks.glb", scene, "rocks");
    //lilly = await loadGLTF('glb_files/LillyPads.glb', scene, 'lillies');
    lighthouse = await loadGLTF("glb_files/Info_Island.glb", scene, "island", "lighthouse");
    boats = await loadGLTF("glb_files/Boats.glb", scene);
    ship = await loadGLTF("glb_files/ship-2.glb", scene, "ship");
    sailboat = await loadGLTF("glb_files/sailboat.glb", scene, "sailboat");

    bankSign = await loadGLTF("glb_files/bank_sign.glb", scene, "island", "bank_sign");
    farmSign = await loadGLTF("glb_files/farm_sign.glb", scene, "island", "farm_sign");
    // marketSign = await loadGLTF("glb_files/market_sign.glb", scene, "island", "market_sign");
    safeSign = await loadGLTF("glb_files/safe_sign.glb", scene, "island", "safe_sign");
    infoSign = await loadGLTF("glb_files/info_sign.glb", scene, "island", "info_sign");
    shopSign = await loadGLTF("glb_files/shop_sign.glb", scene, "island", "shop_sign");

    seagulls = await loadGLTF("glb_files/seagull.glb", scene, "seagull");
    dolphins = await loadGLTF("glb_files/dolphin.glb", scene, "dolphin");
    hotModelBank = await loadGLTF("glb_files/hot_bank.glb", scene);
    hotModelFarm = await loadGLTF("glb_files/hot_farm.glb", scene);
    hotModelMarket = await loadGLTF("glb_files/hot_market.glb", scene);
    hotModelVault = await loadGLTF("glb_files/hot_vault.glb", scene);
    setHotModel();

    setLoading(false);
    composer = new EffectComposer( renderer );

    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );

    outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
    outlinePass.edgeStrength = 10;
    outlinePass.edgeThickness = 2;
    outlinePass.pulsePeriod = 2;
    outlinePass.edgeGlow = 0.2;
    outlinePass.visibleEdgeColor.set( 0x38dcdc );
    outlinePass.hiddenEdgeColor.set( 0x38dcdc );
    composer.addPass( outlinePass );

    effectFXAA = new ShaderPass( FXAAShader );
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    composer.addPass( effectFXAA );

    renderer.domElement.addEventListener( 'mousemove', onMouseMove );
    renderer.domElement.addEventListener( 'pointerdown', onMouseDown );
    renderer.domElement.addEventListener( 'mouseup', onMouseUp );
    renderer.domElement.addEventListener( 'click', onMouseClick );

    animate();
  };

  const addLights = () => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight.position.set(500, 400, -100);
    directionalLight.rotation.set(0, 0.3, -0.55);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.scale.set(150, 150, 150);
    directionalLight.shadow.mapSize.set(2048, 2048);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-2700, 2000, 900);
    directionalLight2.rotation.set(0, 0.3, 0.6);

    scene.add(directionalLight2);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe0fffc, 0.4);
    scene.add(hemiLight);
    console.log(scene);
  };

  const setHotModel = () => {
    hotMeshArr = [];
    [hotModelBank, hotModelFarm, hotModelMarket, hotModelVault].forEach(obj => {
      const hotMesh = obj.children[0];
      hotMesh.material = new THREE.MeshBasicMaterial({transparent:true, opacity:0});
      hotMeshArr.push(hotMesh);
    });
  }

  const animate = () => {
    requestAnimationFrame(animate);
    if (water) water.material.uniforms["time"].value += 1.0 / 60.0;

    let t = clock.getElapsedTime();
    const tdelta = clock.getDelta();
    giveBuoyancy(ship, t, 4, 35);
    giveBuoyancy(bank, t, 2, -5);
    giveBuoyancy(bankSign, t, 2, -5);
    giveBuoyancy(market, t, 2, 2);
    giveBuoyancy(shopSign, t, 2, 2);
    giveBuoyancy(vault, t, 2, 2);
    giveBuoyancy(safeSign, t, 2, 2);
    giveBuoyancy(lighthouse, t, 2, 2);

    giveBuoyancy(hotModelBank, t, 2, -5);
    giveBuoyancy(hotModelMarket, t, 2, 2);
    giveBuoyancy(hotModelVault, t, 2, 2);

    giveBuoyancy(bridge, t, 2, 30);
    giveBuoyancy(boats, t, 1.5, 1);
    //giveBuoyancy(lilly, t, 0.3, 32);
    giveBuoyancy(sailboat, t, 2, 38);

    flyingSeagulls(seagulls, tdelta);
    swimmingDolphins(dolphins, t);

    // renderer.render(scene, camera);
    composer.render();
  };

  const giveBuoyancy = (obj, t, factor, init) => {
    if (obj) {
      const delta = Math.sin(factor + t);
      const newPos = delta * factor;
      obj.position.y = init + newPos;
    }
  };

  const flyingSeagulls = (seagulls, t) => {
    if (seagulls) {
      seagulls.forEach((seagull, i) => {
        seagull.pivot.rotation.y += seagull.pivot.userData.speed + 0.01;
      });
    }
  };

  const swimmingDolphins = (dolphins, t) => {
    if (dolphins) {
      dolphins.forEach((dolphin, i) => {
        dolphin.pivot.rotation.x += 0.02;
        if (i < 2) {
          var zpos = Math.random() * 225 - 500;
          var xpos = Math.random() * 70 - 150;
        } else {
          var zpos = Math.random() * 100 + 350;
          var xpos = Math.random() * 100 - 250;
        }
        if (
          THREE.Math.radToDeg(dolphin.pivot.rotation.x) % 360 > 120 &&
          !dolphin.pivot.under
        ) {
          dolphin.pivot.position.z = zpos;
          dolphin.pivot.position.x = xpos;
          dolphin.pivot.rotation.x += THREE.Math.degToRad(Math.random() * 90);
          dolphin.pivot.under = true;
        } else if (
          THREE.Math.radToDeg(dolphin.pivot.rotation.x) % 360 <= 120 &&
          THREE.Math.radToDeg(dolphin.pivot.rotation.x) % 360 >= 60
        ) {
          dolphin.pivot.under = false;
        }
      });
    }
  };

  const onMouseMove = ( event ) => {
    if ( event.isPrimary === false ) return;
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    checkIntersection(event);
  }

  const onMouseDown = ( ) => {
    if (hoverStr !== '') controls.enabled = false;
  }

  const onMouseUp = () => {
    controls.enabled = true;
  }

  const onMouseClick = () => {
    if (hoverStr === '') return;
    var newUrlStr = '';
    if (hoverStr==='bank') newUrlStr = '';
    else if (hoverStr==='farm') newUrlStr = '';
    else if (hoverStr==='market') newUrlStr = '';
    window.open('', '_self');
  }

  const checkIntersection = (event) => {
    raycaster.setFromCamera( mouse, camera );
    const intersect = raycaster.intersectObjects( hotMeshArr, true )[0];
    if ( intersect ) {
      const interObject = intersect.object;
      if (hoverStr !== interObject.name) {
        hoverStr = interObject.name;
        const hoverLabel = document.getElementById('hoverLabel');
        hoverLabel.style.left = (event.clientX + 50)+'px';
        hoverLabel.style.top = (event.clientY - 100)+'px';
        hoverLabel.style.display='block';
        setHoverName(hoverStr);
        var selMeshArr = [];
        hotMeshArr.forEach(hotMesh => {
          if (hotMesh.name === hoverStr)
            selMeshArr.push(hotMesh);
        });
        outlinePass.selectedObjects = selMeshArr;
      }
    } else {
      if (hoverStr !== '') {
        hoverStr = '';
        outlinePass.selectedObjects = [];
        const hoverLabel = document.getElementById('hoverLabel');
        hoverLabel.style.display='none';
        setHoverName('');
      }
    }
  }

  return (
    <div>
      <div className={!loading ? "loading-screen hide" : "loading-screen"}>
        <div className="loading-elems">
          <img src={clamIcon} />
          <p>Taking you to Clam Island...</p>
        </div>
      </div>
      <button className="zoom-btn zoom-in text-blue-500" onClick={zoomIn}>
        <FontAwesomeIcon icon={faSearchPlus} />
      </button>
      <button className="zoom-btn zoom-out text-blue-500" onClick={zoomOut}>
        <FontAwesomeIcon icon={faSearchMinus} />
      </button>
      <div className={`three-container ${hoverName!==''?'hover':''}`} id='container' ref={mapRef}></div>
      <div id='hoverLabel'>Opening Soon</div>
    </div>
  );
};

const setHotModel = (models) => {
  const hotMeshArr = models.map(obj => {
    const hotMesh = obj.children[0];
    hotMesh.material = new THREE.MeshBasicMaterial({transparent:true, opacity:0});
    return hotMesh;
  });
  return hotMeshArr;
};

// ADD LIGHTS
const addLights = (scene) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
  directionalLight.position.set(500, 400, -100);
  directionalLight.rotation.set(0, 0.3, -0.55);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.scale.set(150, 150, 150);
  directionalLight.shadow.mapSize.set(2048, 2048);
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-2700, 2000, 900);
  directionalLight2.rotation.set(0, 0.3, 0.6);

  scene.add(directionalLight2);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe0fffc, 0.4);
  scene.add(hemiLight);
};

// CALL ANIMATE EVERY SECOND TO DISPLAY
const animate = ({
  scene,
  camera,
  water,
  controls,
  renderer,
  seagulls,
  dolphins,
  setControls,
  objects,
  hotModelBank,
  hotModelMarket,
  hotModelVault
}) => {
  window.requestAnimationFrame(() => {
    animate({
      scene,
      water,
      camera,
      controls,
      renderer,
      seagulls,
      dolphins,
      setControls,
      objects,
      hotModelBank,
      hotModelMarket,
      hotModelVault
    });
  });
  controls.update();
  setControls(controls);
  water.material.uniforms["time"].value += 1.0 / 60.0;

  let t = clock.getElapsedTime();
  const tdelta = clock.getDelta();

  if(objects) {
    giveBuoyancy(objects.find(k => k.name === 'ship'), t, 4, 35);
    giveBuoyancy(objects.find(k => k.name === 'bank'), t, 2, -5);
    giveBuoyancy(objects.find(k => k.name === 'market'), t, 2, 2);
    giveBuoyancy(objects.find(k => k.name === 'vault'), t, 2, 2);

    giveBuoyancy(objects.find(k => k.name === 'bridge'), t, 2, 30);
    giveBuoyancy(objects.find(k => k.name === 'boats'), t, 1.5, 1);
    giveBuoyancy(objects.find(k => k.name === 'sailboat'), t, 2, 38);
  }

  giveBuoyancy(hotModelBank, t, 2, -5);
  giveBuoyancy(hotModelMarket, t, 2, 2);
  giveBuoyancy(hotModelVault, t, 2, 2);

  flyingSeagulls(seagulls, tdelta);
  swimmingDolphins(dolphins, t);

  renderer.render(scene, camera);
};

const giveBuoyancy = (obj, t, factor, init) => {
  if (obj) {
    const delta = Math.sin(factor + t);
    const newPos = delta * factor;
    obj.position.y = init + newPos;
  }
};

const flyingSeagulls = (seagulls) => {
  if (seagulls) {
    seagulls.forEach((seagull) => {
      seagull.pivot.rotation.y += seagull.pivot.userData.speed + 0.01;
    });
  }
};

const swimmingDolphins = (dolphins) => {
  if (dolphins) {
    dolphins.forEach((dolphin, i) => {
      dolphin.pivot.rotation.x += 0.02;
      if (i < 2) {
        var zpos = Math.random() * 225 - 500;
        var xpos = Math.random() * 70 - 150;
      } else {
        var zpos = Math.random() * 100 + 350;
        var xpos = Math.random() * 100 - 250;
      }
      if (
        THREE.Math.radToDeg(dolphin.pivot.rotation.x) % 360 > 120 &&
        !dolphin.pivot.under
      ) {
        dolphin.pivot.position.z = zpos;
        dolphin.pivot.position.x = xpos;
        dolphin.pivot.rotation.x += THREE.Math.degToRad(Math.random() * 90);
        dolphin.pivot.under = true;
      } else if (
        THREE.Math.radToDeg(dolphin.pivot.rotation.x) % 360 <= 120 &&
        THREE.Math.radToDeg(dolphin.pivot.rotation.x) % 360 >= 60
      ) {
        dolphin.pivot.under = false;
      }
    });
  }
};

const onMouseMove = ({ event, setHoverName }) => {
  if ( event.isPrimary === false ) return;
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  checkIntersection(setHoverName);
};


const checkIntersection = (setHoverName) => {
  raycaster.setFromCamera( mouse, camera );
  const intersect = raycaster.intersectObjects( hotMeshArr, true )[0];
  if ( intersect ) {
    const interObject = intersect.object;
    if (hoverStr !== interObject.name) {
      hoverStr = interObject.name;
      setHoverName(hoverStr);
      const selMeshArr = [];
      hotMeshArr.forEach(hotMesh => {
        if (hotMesh.name === hoverStr)
          selMeshArr.push(hotMesh);
      });
      outlinePass.selectedObjects = selMeshArr;
    }
  } else {
    if (hoverStr !== '') {
      hoverStr = '';
      outlinePass.selectedObjects = [];
      setHoverName('');
    }
  }
};

export default Map3D;
