import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PRINTER_COMPONENTS, PrinterComponentId } from '../data/printerData';
import {
  createContactShadowTexture,
  createDeskSurfaceTexture,
  createFuserWarningTexture,
  createNfcBadgePadTexture,
  createPaperTexture,
  createPlasticRoughnessTexture,
  createPrinterLcdTexture,
} from './proceduralTextures';

export interface SceneCallbacks {
  onSelectComponent: (id: PrinterComponentId) => void;
  onToggleDoor: () => void;
  onHoverComponent: (id: PrinterComponentId | 'door' | null) => void;
  onAnimationProgress?: (progress: number, finished: boolean) => void;
  onContextLost?: () => void;
}

interface ComponentRig {
  id: PrinterComponentId;
  group: THREE.Group;
  accentMaterials: THREE.MeshStandardMaterial[];
  baseEmissiveColors: THREE.Color[];
  baseEmissiveIntensities: number[];
  restPosition: THREE.Vector3;
  pullOffset: THREE.Vector3;
}

// Module-scope scratch math objects to prevent GC in render loop
const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _vec3C = new THREE.Vector3();
const _vec3D = new THREE.Vector3();
const _xAxisVec = new THREE.Vector3(1, 0, 0);
const _mat4A = new THREE.Matrix4();
const _quatA = new THREE.Quaternion();

const OVERVIEW_POS = new THREE.Vector3(2.45, 2.05, 3.15);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0.78, 0.05);
const OPEN_INTERIOR_POS = new THREE.Vector3(1.65, 1.72, 3.05);
const OPEN_INTERIOR_TARGET = new THREE.Vector3(0, 0.82, 0.1);

export class PrinterSceneController {
  private container: HTMLElement;
  private callbacks: SceneCallbacks;
  private isSoftwareGl: boolean;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  private doorPivot: THREE.Group;
  private doorAngleCurrent = 0;
  private doorAngleTarget = 0;
  private isDoorOpen = false;

  private componentRigs = new Map<PrinterComponentId, ComponentRig>();
  private raycastTargets: THREE.Object3D[] = [];
  private externalRaycastTargets: THREE.Object3D[] = [];
  private doorHitMeshes: THREE.Object3D[] = [];

  private selectedId: PrinterComponentId | null = null;
  private hoveredTarget: PrinterComponentId | 'door' | null = null;
  private pulseHighlightId: PrinterComponentId | null = null;

  // Camera smooth transition state
  private cameraTransitionActive = false;
  private camTargetPos = new THREE.Vector3().copy(OVERVIEW_POS);
  private camTargetLook = new THREE.Vector3().copy(OVERVIEW_TARGET);

  // Paper path animation state
  private paperMesh: THREE.Mesh;
  private paperBlankMat: THREE.MeshStandardMaterial;
  private paperPrintedMat: THREE.MeshStandardMaterial;
  private paperCurve: THREE.CatmullRomCurve3;
  private laserBeamMesh: THREE.Mesh;
  private laserSpotLight: THREE.PointLight;
  private isAnimatingPaper = false;
  private isPaperPaused = false;
  private paperProgress = 0; // 0..1
  private paperDurationSec = 11.0;

  // Rendering & loop management
  private raycaster = new THREE.Raycaster();
  private pointerNdc = new THREE.Vector2();
  private pointerDownPos = new THREE.Vector2();
  private lastHoverCheckMs = 0;
  private frameId = 0;
  private renderBusy = false;
  private renderDirty = false;
  private isContinuousLoop = false;
  private lastFrameTimeMs = performance.now();
  private disposed = false;

  private disposables: { dispose: () => void }[] = [];

  constructor(container: HTMLElement, callbacks: SceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.isSoftwareGl = this.detectSoftwareWebGL();

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 240);

    // Scene & horizon-matched fog
    this.scene = new THREE.Scene();
    const bgHex = 0xeef2f6;
    this.scene.background = new THREE.Color(bgHex);
    this.scene.fog = new THREE.Fog(bgHex, 9.5, 22);

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 60);
    this.camera.position.copy(OVERVIEW_POS);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = this.renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.outline = 'none';
    this.container.appendChild(canvas);

    // Studio IBL Environment Map
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    this.scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmrem.dispose();
    this.disposables.push(envTarget);

    // OrbitControls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.copy(OVERVIEW_TARGET);
    this.controls.enableDamping = !this.isSoftwareGl;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 1.45;
    this.controls.maxDistance = 6.2;
    this.controls.minPolarAngle = 0.18;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03;
    this.controls.enablePan = true;

    this.controls.addEventListener('start', () => {
      // Never fight user manual camera movement
      this.cameraTransitionActive = false;
    });
    this.controls.addEventListener('change', () => {
      this.requestRender();
    });

    // Studio Lighting Rig + Environment Floor
    this.setupLighting();
    this.setupStudioFloor();

    // Build Composite 3D Office Laser Printer
    this.doorPivot = new THREE.Group();
    const { paperMesh, paperBlankMat, paperPrintedMat, paperCurve, laserBeam, laserLight } =
      this.buildLaserPrinter();
    this.paperMesh = paperMesh;
    this.paperBlankMat = paperBlankMat;
    this.paperPrintedMat = paperPrintedMat;
    this.paperCurve = paperCurve;
    this.laserBeamMesh = laserBeam;
    this.laserSpotLight = laserLight;

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    // Bind events
    this.bindEvents(canvas);

    // Initial render
    this.requestRender();
  }

  private detectSoftwareWebGL(): boolean {
    try {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param) || '');
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      return false;
    }
  }

  private setupLighting(): void {
    // Cool sky/ground hemisphere fill
    const hemi = new THREE.HemisphereLight(0xdbeafe, 0xcbd5e1, 0.85);
    hemi.position.set(0, 6, 0);
    this.scene.add(hemi);

    // Warm key directional light with tight shadow frustum
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.85);
    keyLight.position.set(3.8, 5.6, 4.2);
    keyLight.castShadow = !this.isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 16;
    const d = 2.6;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.02;
    this.scene.add(keyLight);

    // Soft cool fill light from front-left to illuminate inside cavity
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.72);
    fillLight.position.set(-3.5, 2.5, 3.8);
    this.scene.add(fillLight);

    // Rim light from rear-right to separate silhouette & illuminate Duplex bay
    const rimLight = new THREE.DirectionalLight(0xf8fafc, 0.85);
    rimLight.position.set(2.4, 2.8, -4.0);
    this.scene.add(rimLight);
  }

  private setupStudioFloor(): void {
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    const deskTex = createDeskSurfaceTexture();
    deskTex.anisotropy = maxAniso;
    this.disposables.push(deskTex);

    const floorGeo = new THREE.CircleGeometry(14, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      map: deskTex,
      roughness: 0.88,
      metalness: 0.02,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);
    this.disposables.push(floorGeo, floorMat);

    // Soft contact shadow directly underneath printer base
    const contactTex = createContactShadowTexture();
    this.disposables.push(contactTex);
    const shadowGeo = new THREE.PlaneGeometry(3.2, 2.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: contactTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, 0.004, 0.04);
    this.scene.add(contactShadow);
    this.disposables.push(shadowGeo, shadowMat);
  }

  private buildLaserPrinter() {
    const printerRoot = new THREE.Group();
    this.scene.add(printerRoot);

    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    const roughnessTex = createPlasticRoughnessTexture();
    roughnessTex.anisotropy = maxAniso;
    this.disposables.push(roughnessTex);

    // Calibrated PBR Material Library (varied roughness & metalness across adjacent parts)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.48,
      roughnessMap: roughnessTex,
      metalness: 0.05,
    });
    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.42,
      metalness: 0.18,
    });
    const interiorSteelMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.32,
      metalness: 0.72,
    });
    const chromeShaftMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.16,
      metalness: 0.92,
    });
    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.02,
    });
    const trimAccentMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.28,
      metalness: 0.65,
    });
    this.disposables.push(
      bodyMat,
      darkChassisMat,
      interiorSteelMat,
      chromeShaftMat,
      rubberMat,
      trimAccentMat
    );

    // Helper to track geometries
    const regGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      this.disposables.push(g);
      return g;
    };

    // 1. Rubberized Feet (flush on y = 0)
    const footGeo = regGeo(new THREE.CylinderGeometry(0.08, 0.09, 0.04, 16));
    const footPositions: [number, number][] = [
      [-0.86, 0.66],
      [0.86, 0.66],
      [-0.86, -0.66],
      [0.86, -0.66],
    ];
    for (const [fx, fz] of footPositions) {
      const foot = new THREE.Mesh(footGeo, rubberMat);
      foot.position.set(fx, 0.02, fz);
      foot.castShadow = true;
      printerRoot.add(foot);
    }

    // 2. Lower Base Plinth
    const baseGeo = regGeo(new THREE.BoxGeometry(2.04, 0.1, 1.62));
    const baseMesh = new THREE.Mesh(baseGeo, darkChassisMat);
    baseMesh.position.set(0, 0.09, 0);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    printerRoot.add(baseMesh);

    // 3. Paper Cassette Drawer (Front Lower)
    const cassetteGroup = new THREE.Group();
    const trayFrontGeo = regGeo(new THREE.BoxGeometry(1.56, 0.22, 0.14));
    const trayFront = new THREE.Mesh(trayFrontGeo, bodyMat);
    trayFront.position.set(0, 0.23, 0.78);
    trayFront.castShadow = true;
    cassetteGroup.add(trayFront);

    const trayHandleGeo = regGeo(new THREE.BoxGeometry(0.46, 0.05, 0.06));
    const trayHandle = new THREE.Mesh(trayHandleGeo, darkChassisMat);
    trayHandle.position.set(0, 0.24, 0.84);
    cassetteGroup.add(trayHandle);

    // Paper stack inside cassette
    const paperStackGeo = regGeo(new THREE.BoxGeometry(1.26, 0.11, 1.15));
    const paperStackMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.78,
      metalness: 0.0,
    });
    this.disposables.push(paperStackMat);
    const paperStack = new THREE.Mesh(paperStackGeo, paperStackMat);
    paperStack.position.set(0, 0.21, 0.2);
    cassetteGroup.add(paperStack);
    printerRoot.add(cassetteGroup);

    // 4. Sculpted Side Walls using beveled ExtrudeGeometry
    const sideShape = new THREE.Shape();
    sideShape.moveTo(-0.82, 0.14);
    sideShape.lineTo(0.82, 0.14);
    sideShape.lineTo(0.82, 1.28);
    sideShape.lineTo(0.68, 1.44);
    sideShape.lineTo(-0.82, 1.44);
    sideShape.closePath();

    const sideWallGeo = regGeo(
      new THREE.ExtrudeGeometry(sideShape, {
        depth: 0.14,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.025,
        bevelSegments: 3,
      })
    );
    sideWallGeo.rotateY(Math.PI / 2);

    const leftWall = new THREE.Mesh(sideWallGeo, bodyMat);
    leftWall.position.set(-1.02, 0, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    printerRoot.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, bodyMat);
    rightWall.position.set(0.88, 0, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    printerRoot.add(rightWall);

    // Side ventilation louvers (accent detail)
    const louverGeo = regGeo(new THREE.BoxGeometry(0.03, 0.028, 0.42));
    for (let i = 0; i < 6; i++) {
      const lLeft = new THREE.Mesh(louverGeo, darkChassisMat);
      lLeft.position.set(-1.045, 0.56 + i * 0.075, -0.15);
      printerRoot.add(lLeft);

      const lRight = new THREE.Mesh(louverGeo, darkChassisMat);
      lRight.position.set(1.045, 0.56 + i * 0.075, -0.15);
      printerRoot.add(lRight);
    }

    // Internal dark frame rails
    const frameFloorGeo = regGeo(new THREE.BoxGeometry(1.72, 0.04, 1.46));
    const frameFloor = new THREE.Mesh(frameFloorGeo, interiorSteelMat);
    frameFloor.position.set(0, 0.34, 0.02);
    frameFloor.receiveShadow = true;
    printerRoot.add(frameFloor);

    // Rear upper backplate (leaves lower-rear open for Duplexing Assembly visibility!)
    const rearUpperGeo = regGeo(new THREE.BoxGeometry(1.76, 0.52, 0.1));
    const rearUpper = new THREE.Mesh(rearUpperGeo, bodyMat);
    rearUpper.position.set(0, 1.18, -0.77);
    rearUpper.castShadow = true;
    printerRoot.add(rearUpper);

    // Top Deck & Recessed Output Tray
    const topRearGeo = regGeo(new THREE.BoxGeometry(1.88, 0.14, 0.72));
    const topRear = new THREE.Mesh(topRearGeo, bodyMat);
    topRear.position.set(0, 1.42, -0.46);
    topRear.castShadow = true;
    topRear.receiveShadow = true;
    printerRoot.add(topRear);

    const outputFloorGeo = regGeo(new THREE.BoxGeometry(1.66, 0.05, 0.92));
    const outputFloor = new THREE.Mesh(outputFloorGeo, darkChassisMat);
    outputFloor.position.set(0, 1.31, 0.24);
    outputFloor.rotation.x = 0.08;
    outputFloor.receiveShadow = true;
    printerRoot.add(outputFloor);

    // Paper Output Stopper Lip
    const stopperGeo = regGeo(new THREE.BoxGeometry(0.6, 0.05, 0.04));
    const stopper = new THREE.Mesh(stopperGeo, trimAccentMat);
    stopper.position.set(0, 1.29, 0.68);
    stopper.rotation.x = -0.45;
    printerRoot.add(stopper);

    // Control Panel, Backlit LCD, NFC Badge Reader & Rear I/O Ports ('interface' component)
    const interfaceGroup = new THREE.Group();
    printerRoot.add(interfaceGroup);

    const interfaceAccentMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      roughness: 0.34,
      metalness: 0.25,
    });
    this.disposables.push(interfaceAccentMat);

    const panelHousingGeo = regGeo(new THREE.BoxGeometry(0.76, 0.12, 0.3));
    const panelHousing = new THREE.Mesh(panelHousingGeo, darkChassisMat);
    panelHousing.position.set(0.58, 1.43, 0.65);
    panelHousing.rotation.x = 0.38;
    panelHousing.castShadow = true;
    interfaceGroup.add(panelHousing);

    const lcdTex = createPrinterLcdTexture();
    lcdTex.anisotropy = maxAniso;
    this.disposables.push(lcdTex);
    const lcdGeo = regGeo(new THREE.PlaneGeometry(0.4, 0.15));
    const lcdMat = new THREE.MeshStandardMaterial({
      map: lcdTex,
      emissiveMap: lcdTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.45,
      roughness: 0.18,
    });
    this.disposables.push(lcdMat);
    const lcdScreen = new THREE.Mesh(lcdGeo, lcdMat);
    lcdScreen.position.set(0.44, 1.488, 0.675);
    lcdScreen.rotation.x = -Math.PI / 2 + 0.38;
    interfaceGroup.add(lcdScreen);

    // Physical tactile buttons next to LCD
    const btnGeo = regGeo(new THREE.CylinderGeometry(0.022, 0.022, 0.025, 16));
    const greenBtnMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
    });
    const orangeBtnMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.3,
    });
    this.disposables.push(greenBtnMat, orangeBtnMat);
    const startBtn = new THREE.Mesh(btnGeo, greenBtnMat);
    startBtn.position.set(0.7, 1.486, 0.655);
    startBtn.rotation.x = 0.38;
    interfaceGroup.add(startBtn);

    const stopBtn = new THREE.Mesh(btnGeo, orangeBtnMat);
    stopBtn.position.set(0.76, 1.486, 0.655);
    stopBtn.rotation.x = 0.38;
    interfaceGroup.add(stopBtn);

    // NFC Badge Reader Pad on front-right panel
    const nfcTex = createNfcBadgePadTexture();
    nfcTex.anisotropy = maxAniso;
    this.disposables.push(nfcTex);
    const nfcPadBase = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(0.15, 0.03, 0.15)),
      interfaceAccentMat
    );
    nfcPadBase.position.set(0.87, 1.465, 0.66);
    nfcPadBase.rotation.x = 0.38;
    interfaceGroup.add(nfcPadBase);

    const nfcStickerMat = new THREE.MeshStandardMaterial({
      map: nfcTex,
      roughness: 0.32,
    });
    this.disposables.push(nfcStickerMat);
    const nfcSticker = new THREE.Mesh(
      regGeo(new THREE.PlaneGeometry(0.125, 0.125)),
      nfcStickerMat
    );
    nfcSticker.position.set(0.87, 1.482, 0.668);
    nfcSticker.rotation.x = -Math.PI / 2 + 0.38;
    interfaceGroup.add(nfcSticker);

    // Right-Side Rear I/O Cluster (Ethernet RJ-45, USB, Power Switch)
    const ioPlate = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(0.05, 0.34, 0.28)),
      darkChassisMat
    );
    ioPlate.position.set(1.035, 0.44, -0.5);
    interfaceGroup.add(ioPlate);

    const ethPort = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(0.03, 0.075, 0.08)),
      interfaceAccentMat
    );
    ethPort.position.set(1.055, 0.5, -0.44);
    interfaceGroup.add(ethPort);

    const usbPort = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(0.03, 0.06, 0.06)),
      chromeShaftMat
    );
    usbPort.position.set(1.055, 0.5, -0.56);
    interfaceGroup.add(usbPort);

    const powerSwitch = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(0.03, 0.065, 0.085)),
      orangeBtnMat
    );
    powerSwitch.position.set(1.055, 0.36, -0.5);
    interfaceGroup.add(powerSwitch);

    // 5. Articulated Front Access Door (opens forward & downward)
    this.doorPivot.position.set(0, 0.36, 0.8);
    printerRoot.add(this.doorPivot);

    const doorPanelGeo = regGeo(new THREE.BoxGeometry(1.72, 0.92, 0.07));
    const doorPanel = new THREE.Mesh(doorPanelGeo, bodyMat);
    doorPanel.position.set(0, 0.46, 0);
    doorPanel.castShadow = true;
    doorPanel.receiveShadow = true;
    doorPanel.userData.isDoor = true;
    this.doorPivot.add(doorPanel);
    this.doorHitMeshes.push(doorPanel);

    // Brushed metal latch bar on front door
    const latchGeo = regGeo(new THREE.BoxGeometry(0.64, 0.06, 0.05));
    const latchMesh = new THREE.Mesh(latchGeo, trimAccentMat);
    latchMesh.position.set(0, 0.84, 0.04);
    latchMesh.userData.isDoor = true;
    this.doorPivot.add(latchMesh);
    this.doorHitMeshes.push(latchMesh);

    // Door release blue accent tab
    const releaseTabGeo = regGeo(new THREE.BoxGeometry(0.18, 0.04, 0.06));
    const releaseTabMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.35,
      metalness: 0.1,
    });
    this.disposables.push(releaseTabMat);
    const releaseTab = new THREE.Mesh(releaseTabGeo, releaseTabMat);
    releaseTab.position.set(0, 0.89, 0.045);
    releaseTab.userData.isDoor = true;
    this.doorPivot.add(releaseTab);
    this.doorHitMeshes.push(releaseTab);

    // =========================================================
    // 6. THE 6 CLICKABLE INTERNAL LASER PRINTER COMPONENTS
    // =========================================================

    const registerComponent = (
      id: PrinterComponentId,
      group: THREE.Group,
      accentMaterials: THREE.MeshStandardMaterial[],
      pullOffset: THREE.Vector3,
      isExternal = false
    ) => {
      const baseEmissiveColors = accentMaterials.map((m) => m.emissive.clone());
      const baseEmissiveIntensities = accentMaterials.map(
        (m) => m.emissiveIntensity
      );
      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.userData.componentId = id;
          child.castShadow = true;
          child.receiveShadow = true;
          if (isExternal) {
            this.externalRaycastTargets.push(child);
          } else {
            this.raycastTargets.push(child);
          }
        }
      });
      this.componentRigs.set(id, {
        id,
        group,
        accentMaterials,
        baseEmissiveColors,
        baseEmissiveIntensities,
        restPosition: group.position.clone(),
        pullOffset,
      });
    };

    // Register external interface assembly
    registerComponent(
      'interface',
      interfaceGroup,
      [interfaceAccentMat],
      new THREE.Vector3(0, 0.02, 0),
      true
    );

    // --- External Component: Top ADF & Flatbed Scanner Glass ---
    // Pillars lifting scanner deck slightly above output bin so printed pages stay visible
    const pillarGeo = regGeo(new THREE.BoxGeometry(0.14, 0.22, 0.56));
    const leftPillar = new THREE.Mesh(pillarGeo, bodyMat);
    leftPillar.position.set(-0.88, 1.54, -0.42);
    printerRoot.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, bodyMat);
    rightPillar.position.set(0.88, 1.54, -0.42);
    printerRoot.add(rightPillar);

    const adfGroup = new THREE.Group();
    adfGroup.position.set(0, 1.66, -0.1);
    printerRoot.add(adfGroup);

    const adfAccentMat = new THREE.MeshStandardMaterial({
      color: 0x0891b2,
      roughness: 0.32,
      metalness: 0.2,
    });
    const scannerGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xa5f3fc,
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.72,
    });
    this.disposables.push(adfAccentMat, scannerGlassMat);

    // Scanner flatbed frame
    const scannerBed = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(1.88, 0.06, 1.24)),
      bodyMat
    );
    adfGroup.add(scannerBed);

    // Flatbed glass window strip (visible at front lip & under ADF)
    const scannerGlass = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(1.6, 0.015, 1.04)),
      scannerGlassMat
    );
    scannerGlass.position.set(0, 0.032, 0.02);
    adfGroup.add(scannerGlass);

    // Top ADF Document Feeder lid
    const adfLid = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(1.78, 0.055, 1.12)),
      bodyMat
    );
    adfLid.position.set(0, 0.075, -0.02);
    adfGroup.add(adfLid);

    // ADF Automatic Document Feeder roller housing on left side of lid
    const adfFeederUnit = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(0.56, 0.13, 1.02)),
      darkChassisMat
    );
    adfFeederUnit.position.set(-0.56, 0.145, -0.02);
    adfGroup.add(adfFeederUnit);

    // Cyan ADF accent strip & guide bar
    const adfAccentStrip = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(0.08, 0.035, 1.04)),
      adfAccentMat
    );
    adfAccentStrip.position.set(-0.26, 0.14, -0.02);
    adfGroup.add(adfAccentStrip);

    // Original paper sheet resting in ADF input tray
    const adfInputSheet = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(0.72, 0.012, 0.78)),
      paperStackMat
    );
    adfInputSheet.position.set(0.24, 0.115, -0.02);
    adfGroup.add(adfInputSheet);

    registerComponent(
      'adf',
      adfGroup,
      [adfAccentMat],
      new THREE.Vector3(0, 0.04, 0),
      true
    );

    // --- Component 1: Pickup Rollers & Separation Pad ---
    const pickupGroup = new THREE.Group();
    pickupGroup.position.set(0, 0.42, 0.56);
    printerRoot.add(pickupGroup);

    const pickupAccentMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.72,
      metalness: 0.05,
    });
    const sepPadMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.9,
      metalness: 0.0,
    });
    this.disposables.push(pickupAccentMat, sepPadMat);

    const pickupShaft = new THREE.Mesh(
      regGeo(new THREE.CylinderGeometry(0.022, 0.022, 1.32, 16)),
      chromeShaftMat
    );
    pickupShaft.rotation.z = Math.PI / 2;
    pickupGroup.add(pickupShaft);

    const rollerGeo = regGeo(new THREE.CylinderGeometry(0.068, 0.068, 0.12, 24));
    for (const rx of [-0.42, 0, 0.42]) {
      const roller = new THREE.Mesh(rollerGeo, pickupAccentMat);
      roller.rotation.z = Math.PI / 2;
      roller.position.set(rx, 0, 0);
      pickupGroup.add(roller);
    }

    // Separation Pad angled beneath center roller
    const sepPadBase = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(0.32, 0.035, 0.14)),
      sepPadMat
    );
    sepPadBase.position.set(0, -0.075, 0.04);
    sepPadBase.rotation.x = 0.28;
    pickupGroup.add(sepPadBase);

    registerComponent(
      'pickup',
      pickupGroup,
      [pickupAccentMat, sepPadMat],
      new THREE.Vector3(0, 0.04, 0.08)
    );

    // --- Component 2: Toner Cartridge ---
    const tonerGroup = new THREE.Group();
    tonerGroup.position.set(0, 1.08, 0.28);
    printerRoot.add(tonerGroup);

    const tonerBodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.42,
      metalness: 0.2,
    });
    const tonerAccentMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.35,
      metalness: 0.12,
    });
    this.disposables.push(tonerBodyMat, tonerAccentMat);

    const hopperCyl = new THREE.Mesh(
      regGeo(new THREE.CylinderGeometry(0.115, 0.115, 1.38, 24)),
      tonerBodyMat
    );
    hopperCyl.rotation.z = Math.PI / 2;
    tonerGroup.add(hopperCyl);

    const tonerShroud = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(1.42, 0.13, 0.24)),
      tonerBodyMat
    );
    tonerShroud.position.set(0, 0.04, 0.04);
    tonerGroup.add(tonerShroud);

    // Ergonomic pull handle in front
    const handleBar = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(0.56, 0.045, 0.07)),
      tonerAccentMat
    );
    handleBar.position.set(0, 0.04, 0.19);
    tonerGroup.add(handleBar);

    // Side drive gear
    const gearCap = new THREE.Mesh(
      regGeo(new THREE.CylinderGeometry(0.125, 0.125, 0.04, 14)),
      tonerAccentMat
    );
    gearCap.rotation.z = Math.PI / 2;
    gearCap.position.set(0.71, 0, 0);
    tonerGroup.add(gearCap);

    registerComponent(
      'toner',
      tonerGroup,
      [tonerAccentMat, tonerBodyMat],
      new THREE.Vector3(0, 0.02, 0.14)
    );

    // --- Component 3: Imaging Drum / EP Drum ---
    const drumGroup = new THREE.Group();
    drumGroup.position.set(0, 0.84, 0.14);
    printerRoot.add(drumGroup);

    const opcDrumMat = new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      roughness: 0.16,
      metalness: 0.72,
    });
    const pcrMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5,
      metalness: 0.3,
    });
    this.disposables.push(opcDrumMat, pcrMat);

    const drumCylinder = new THREE.Mesh(
      regGeo(new THREE.CylinderGeometry(0.11, 0.11, 1.38, 32)),
      opcDrumMat
    );
    drumCylinder.rotation.z = Math.PI / 2;
    drumGroup.add(drumCylinder);

    // End flanges
    const flangeGeo = regGeo(new THREE.CylinderGeometry(0.125, 0.125, 0.04, 24));
    for (const fx of [-0.71, 0.71]) {
      const flange = new THREE.Mesh(flangeGeo, interiorSteelMat);
      flange.rotation.z = Math.PI / 2;
      flange.position.set(fx, 0, 0);
      drumGroup.add(flange);
    }

    // Primary Charge Roller (PCR) sitting behind/above drum
    const pcrRoller = new THREE.Mesh(
      regGeo(new THREE.CylinderGeometry(0.032, 0.032, 1.34, 20)),
      pcrMat
    );
    pcrRoller.rotation.z = Math.PI / 2;
    pcrRoller.position.set(0, 0.11, -0.09);
    drumGroup.add(pcrRoller);

    // Laser scanner beam & glow light for Exposing step animation
    const laserBeamGeo = regGeo(new THREE.PlaneGeometry(1.28, 0.025));
    const laserBeamMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    this.disposables.push(laserBeamMat);
    const laserBeam = new THREE.Mesh(laserBeamGeo, laserBeamMat);
    laserBeam.position.set(0, 0.94, 0.06);
    laserBeam.rotation.x = -0.35;
    printerRoot.add(laserBeam);

    const laserLight = new THREE.PointLight(0xef4444, 0, 1.4);
    laserLight.position.set(0, 0.96, 0.18);
    printerRoot.add(laserLight);

    registerComponent(
      'drum',
      drumGroup,
      [opcDrumMat],
      new THREE.Vector3(0, 0.03, 0.1)
    );

    // --- Component 4: Transfer Belt / Roller ---
    const transferGroup = new THREE.Group();
    transferGroup.position.set(0, 0.62, 0.04);
    printerRoot.add(transferGroup);

    const transferBeltMat = new THREE.MeshStandardMaterial({
      color: 0x3b0764,
      roughness: 0.55,
      metalness: 0.15,
    });
    const transferAccentMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      roughness: 0.32,
      metalness: 0.35,
    });
    this.disposables.push(transferBeltMat, transferAccentMat);

    // Transfer belt deck
    const beltSpan = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(1.34, 0.07, 0.42)),
      transferBeltMat
    );
    transferGroup.add(beltSpan);

    // Front and rear tension rollers
    const tRollerGeo = regGeo(new THREE.CylinderGeometry(0.045, 0.045, 1.38, 20));
    const frontTRoller = new THREE.Mesh(tRollerGeo, transferAccentMat);
    frontTRoller.rotation.z = Math.PI / 2;
    frontTRoller.position.set(0, 0, 0.21);
    transferGroup.add(frontTRoller);

    const rearTRoller = new THREE.Mesh(tRollerGeo, transferAccentMat);
    rearTRoller.rotation.z = Math.PI / 2;
    rearTRoller.position.set(0, 0, -0.21);
    transferGroup.add(rearTRoller);

    registerComponent(
      'transfer',
      transferGroup,
      [transferAccentMat, transferBeltMat],
      new THREE.Vector3(0, 0.02, 0.08)
    );

    // --- Component 5: Fuser Assembly (warm glowing red/orange) ---
    const fuserGroup = new THREE.Group();
    fuserGroup.position.set(0, 1.16, -0.36);
    printerRoot.add(fuserGroup);

    const fuserHeatMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      emissive: 0xdc2626,
      emissiveIntensity: 0.55,
      roughness: 0.26,
      metalness: 0.45,
    });
    const fuserPressureMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.62,
      metalness: 0.12,
    });
    const fuserWarnTex = createFuserWarningTexture();
    fuserWarnTex.anisotropy = maxAniso;
    this.disposables.push(fuserHeatMat, fuserPressureMat, fuserWarnTex);

    // Heated Upper Roller
    const heatRoller = new THREE.Mesh(
      regGeo(new THREE.CylinderGeometry(0.075, 0.075, 1.38, 24)),
      fuserHeatMat
    );
    heatRoller.rotation.z = Math.PI / 2;
    heatRoller.position.set(0, 0.04, 0.04);
    fuserGroup.add(heatRoller);

    // Lower Pressure Roller
    const pressureRoller = new THREE.Mesh(
      regGeo(new THREE.CylinderGeometry(0.062, 0.062, 1.38, 24)),
      fuserPressureMat
    );
    pressureRoller.rotation.z = Math.PI / 2;
    pressureRoller.position.set(0, -0.07, -0.04);
    fuserGroup.add(pressureRoller);

    // Top Guard Shield with Warning Label
    const fuserCage = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(1.42, 0.04, 0.18)),
      interiorSteelMat
    );
    fuserCage.position.set(0, 0.14, 0);
    fuserGroup.add(fuserCage);

    const warnLabelMat = new THREE.MeshStandardMaterial({
      map: fuserWarnTex,
      roughness: 0.4,
    });
    this.disposables.push(warnLabelMat);
    const warnLabel = new THREE.Mesh(
      regGeo(new THREE.PlaneGeometry(0.56, 0.12)),
      warnLabelMat
    );
    warnLabel.position.set(0, 0.162, 0);
    warnLabel.rotation.x = -Math.PI / 2;
    fuserGroup.add(warnLabel);

    registerComponent(
      'fuser',
      fuserGroup,
      [fuserHeatMat],
      new THREE.Vector3(0, 0.05, 0.05)
    );

    // --- Component 6: Duplexing Assembly (Rear U-turn path) ---
    const duplexGroup = new THREE.Group();
    duplexGroup.position.set(0, 0.66, -0.66);
    printerRoot.add(duplexGroup);

    const duplexAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.38,
      metalness: 0.25,
    });
    const duplexPlateMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.45,
      metalness: 0.35,
    });
    this.disposables.push(duplexAccentMat, duplexPlateMat);

    // Rear housing plate
    const duplexPlate = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(1.46, 0.48, 0.1)),
      duplexPlateMat
    );
    duplexPlate.position.set(0, 0, -0.04);
    duplexGroup.add(duplexPlate);

    // Amber guide ribs & reversing rollers visible from back & side
    const ribGeo = regGeo(new THREE.BoxGeometry(0.06, 0.42, 0.14));
    for (const rx of [-0.52, -0.18, 0.18, 0.52]) {
      const rib = new THREE.Mesh(ribGeo, duplexAccentMat);
      rib.position.set(rx, 0, 0.02);
      duplexGroup.add(rib);
    }

    const dupRoller = new THREE.Mesh(
      regGeo(new THREE.CylinderGeometry(0.042, 0.042, 1.38, 20)),
      duplexAccentMat
    );
    dupRoller.rotation.z = Math.PI / 2;
    dupRoller.position.set(0, -0.14, 0.06);
    duplexGroup.add(dupRoller);

    registerComponent(
      'duplex',
      duplexGroup,
      [duplexAccentMat],
      new THREE.Vector3(0, 0, -0.1)
    );

    // =========================================================
    // 7. ANIMATED PAPER SHEET PATH (7-STEP LASER PRINTING)
    // =========================================================
    const blankTex = createPaperTexture(false);
    const printedTex = createPaperTexture(true);
    blankTex.anisotropy = maxAniso;
    printedTex.anisotropy = maxAniso;
    this.disposables.push(blankTex, printedTex);

    const paperBlankMat = new THREE.MeshStandardMaterial({
      map: blankTex,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    const paperPrintedMat = new THREE.MeshStandardMaterial({
      map: printedTex,
      roughness: 0.72,
      side: THREE.DoubleSide,
    });
    this.disposables.push(paperBlankMat, paperPrintedMat);

    const paperGeo = regGeo(new THREE.PlaneGeometry(0.68, 0.88, 1, 8));
    const paperMesh = new THREE.Mesh(paperGeo, paperBlankMat);
    paperMesh.visible = false;
    paperMesh.castShadow = true;
    printerRoot.add(paperMesh);

    const paperCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.24, 0.25), // 0.00: inside cassette
      new THREE.Vector3(0, 0.37, 0.58), // 0.16: pickup roller & separation pad
      new THREE.Vector3(0, 0.69, 0.36), // 0.32: approaching drum/transfer
      new THREE.Vector3(0, 0.71, 0.05), // 0.54: transfer zone under OPC drum
      new THREE.Vector3(0, 0.96, -0.25), // 0.72: climbing to fuser
      new THREE.Vector3(0, 1.17, -0.35), // 0.82: fusing rollers
      new THREE.Vector3(0, 1.36, -0.15), // 0.90: exiting rear top slot
      new THREE.Vector3(0, 1.35, 0.26), // 1.00: resting in output tray
    ]);

    return {
      paperMesh,
      paperBlankMat,
      paperPrintedMat,
      paperCurve,
      laserBeam,
      laserLight,
    };
  }

  private bindEvents(canvas: HTMLCanvasElement): void {
    const getNdc = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      this.pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      this.pointerDownPos.set(e.clientX, e.clientY);
    };

    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - this.pointerDownPos.x;
      const dy = e.clientY - this.pointerDownPos.y;
      if (dx * dx + dy * dy > 36) return; // Dragging OrbitControls, not a click

      getNdc(e.clientX, e.clientY);
      this.raycaster.setFromCamera(this.pointerNdc, this.camera);

      // Check clickable targets: external parts + door always; internal parts when door is open
      const targets = this.isDoorOpen
        ? [
            ...this.raycastTargets,
            ...this.externalRaycastTargets,
            ...this.doorHitMeshes,
          ]
        : [...this.externalRaycastTargets, ...this.doorHitMeshes];

      const intersects = this.raycaster.intersectObjects(targets, false);
      if (intersects.length === 0) return;

      const hit = intersects[0].object;
      if (hit.userData.isDoor) {
        this.callbacks.onToggleDoor();
      } else if (hit.userData.componentId) {
        this.callbacks.onSelectComponent(
          hit.userData.componentId as PrinterComponentId
        );
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - this.lastHoverCheckMs < 45) return;
      this.lastHoverCheckMs = now;

      getNdc(e.clientX, e.clientY);
      this.raycaster.setFromCamera(this.pointerNdc, this.camera);

      const targets = this.isDoorOpen
        ? [
            ...this.raycastTargets,
            ...this.externalRaycastTargets,
            ...this.doorHitMeshes,
          ]
        : [...this.externalRaycastTargets, ...this.doorHitMeshes];
      const intersects = this.raycaster.intersectObjects(targets, false);

      let nextHover: PrinterComponentId | 'door' | null = null;
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData.isDoor) {
          nextHover = 'door';
        } else if (hit.userData.componentId) {
          nextHover = hit.userData.componentId as PrinterComponentId;
        }
      }

      if (nextHover !== this.hoveredTarget) {
        this.hoveredTarget = nextHover;
        canvas.style.cursor = nextHover ? 'pointer' : 'grab';
        this.callbacks.onHoverComponent(nextHover);
        this.updateComponentHighlights();
        this.requestRender();
      }
    };

    const onResize = () => {
      if (this.disposed) return;
      const w = Math.max(this.container.clientWidth, 320);
      const h = Math.max(this.container.clientHeight, 240);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.requestRender();
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      this.callbacks.onContextLost?.();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('webglcontextlost', onContextLost);
    window.addEventListener('resize', onResize);

    this.disposables.push({
      dispose: () => {
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        window.removeEventListener('resize', onResize);
      },
    });
  }

  public setDoorOpen(open: boolean, focusInterior = false): void {
    this.isDoorOpen = open;
    this.doorAngleTarget = open ? 1.24 : 0;
    if (focusInterior && !this.selectedId) {
      this.camTargetPos.copy(open ? OPEN_INTERIOR_POS : OVERVIEW_POS);
      this.camTargetLook.copy(open ? OPEN_INTERIOR_TARGET : OVERVIEW_TARGET);
      this.cameraTransitionActive = true;
    }
    this.requestRender();
  }

  public selectComponent(id: PrinterComponentId | null, focusCamera = true): void {
    this.selectedId = id;
    if (id && focusCamera) {
      const info = PRINTER_COMPONENTS.find((c) => c.id === id);
      if (info) {
        this.camTargetPos.set(...info.cameraPosition);
        this.camTargetLook.set(...info.cameraTarget);
        this.cameraTransitionActive = true;
      }
    }
    this.updateComponentHighlights();
    this.requestRender();
  }

  public setStepHighlightComponent(id: PrinterComponentId | null): void {
    this.pulseHighlightId = id;
    this.updateComponentHighlights();
    this.requestRender();
  }

  public resetCamera(): void {
    this.selectedId = null;
    this.camTargetPos.copy(this.isDoorOpen ? OPEN_INTERIOR_POS : OVERVIEW_POS);
    this.camTargetLook.copy(
      this.isDoorOpen ? OPEN_INTERIOR_TARGET : OVERVIEW_TARGET
    );
    this.cameraTransitionActive = true;
    this.updateComponentHighlights();
    this.requestRender();
  }

  public startPaperAnimation(): void {
    this.isDoorOpen = true;
    this.doorAngleTarget = 1.24;
    this.isAnimatingPaper = true;
    this.isPaperPaused = false;
    this.paperProgress = 0;
    this.paperMesh.visible = true;
    this.paperMesh.material = this.paperBlankMat;
    this.camTargetPos.set(1.95, 1.75, 2.75);
    this.camTargetLook.set(0, 0.85, 0.06);
    this.cameraTransitionActive = true;
    this.startContinuousLoop();
  }

  public setPaperPaused(paused: boolean): void {
    this.isPaperPaused = paused;
    if (!paused && this.isAnimatingPaper) {
      this.startContinuousLoop();
    }
  }

  public setPaperProgressManual(progress: number): void {
    this.isDoorOpen = true;
    this.doorAngleTarget = 1.24;
    this.isAnimatingPaper = true;
    this.isPaperPaused = true;
    this.paperProgress = THREE.MathUtils.clamp(progress, 0, 1);
    this.paperMesh.visible = true;
    this.applyPaperTransform(this.paperProgress);
    this.requestRender();
  }

  public stopPaperAnimation(): void {
    this.isAnimatingPaper = false;
    this.isPaperPaused = false;
    this.paperMesh.visible = false;
    const beamMat = this.laserBeamMesh.material as THREE.MeshBasicMaterial;
    beamMat.opacity = 0;
    this.laserSpotLight.intensity = 0;
    this.pulseHighlightId = null;
    this.updateComponentHighlights();
    this.requestRender();
  }

  private updateComponentHighlights(): void {
    for (const [id, rig] of this.componentRigs) {
      const isSelected = id === this.selectedId;
      const isHovered = id === this.hoveredTarget;
      const isStepActive = id === this.pulseHighlightId;

      rig.accentMaterials.forEach((mat, i) => {
        const baseColor = rig.baseEmissiveColors[i];
        const baseIntensity = rig.baseEmissiveIntensities[i];
        if (isSelected || isStepActive) {
          mat.emissive.set(mat.color);
          mat.emissiveIntensity = Math.max(baseIntensity, 0.55);
        } else if (isHovered) {
          mat.emissive.set(mat.color);
          mat.emissiveIntensity = Math.max(baseIntensity, 0.32);
        } else {
          mat.emissive.copy(baseColor);
          mat.emissiveIntensity = baseIntensity;
        }
      });
    }
  }

  private applyPaperTransform(t: number): void {
    const clampedT = THREE.MathUtils.clamp(t, 0, 1);
    this.paperCurve.getPointAt(clampedT, _vec3A);
    this.paperCurve.getTangentAt(clampedT, _vec3B);

    this.paperMesh.position.copy(_vec3A);

    // Orient plane normal perpendicular to travel direction, facing upward/frontward
    _vec3C.crossVectors(_vec3B, _xAxisVec).normalize();
    _vec3D.copy(_vec3A).add(_vec3C);
    _mat4A.lookAt(_vec3A, _vec3D, _vec3B);
    _quatA.setFromRotationMatrix(_mat4A);
    this.paperMesh.quaternion.copy(_quatA);

    // Swap from blank to printed paper as sheet passes transfer/fuser
    const targetMat = clampedT >= 0.58 ? this.paperPrintedMat : this.paperBlankMat;
    if (this.paperMesh.material !== targetMat) {
      this.paperMesh.material = targetMat;
    }

    // Laser beam glow during Exposing phase (0.28..0.43)
    const beamMat = this.laserBeamMesh.material as THREE.MeshBasicMaterial;
    if (clampedT >= 0.27 && clampedT <= 0.44) {
      const phase = (clampedT - 0.27) / 0.17;
      beamMat.opacity = 0.78;
      this.laserBeamMesh.position.x = Math.sin(phase * Math.PI * 6) * 0.48;
      this.laserSpotLight.intensity = 2.2;
      this.laserSpotLight.position.x = this.laserBeamMesh.position.x;
    } else {
      beamMat.opacity = 0;
      this.laserSpotLight.intensity = 0;
    }

    // Highlight active component for current progress
    let activePart: PrinterComponentId | null = null;
    if (clampedT > 0 && clampedT < 0.12) activePart = 'interface';
    else if (clampedT >= 0.12 && clampedT < 0.28) activePart = 'pickup';
    else if (clampedT >= 0.28 && clampedT < 0.44) activePart = 'drum';
    else if (clampedT >= 0.44 && clampedT < 0.58) activePart = 'toner';
    else if (clampedT >= 0.58 && clampedT < 0.74) activePart = 'transfer';
    else if (clampedT >= 0.74 && clampedT < 0.90) activePart = 'fuser';
    else if (clampedT >= 0.90) activePart = 'drum';

    if (activePart !== this.pulseHighlightId) {
      this.pulseHighlightId = activePart;
      this.updateComponentHighlights();
    }
  }

  private stepSimulation(dt: number): boolean {
    let needsMoreFrames = false;

    // Smooth door hinge
    if (Math.abs(this.doorAngleCurrent - this.doorAngleTarget) > 0.002) {
      this.doorAngleCurrent = THREE.MathUtils.damp(
        this.doorAngleCurrent,
        this.doorAngleTarget,
        7.5,
        dt
      );
      this.doorPivot.rotation.x = this.doorAngleCurrent;
      needsMoreFrames = true;
    } else if (this.doorAngleCurrent !== this.doorAngleTarget) {
      this.doorAngleCurrent = this.doorAngleTarget;
      this.doorPivot.rotation.x = this.doorAngleCurrent;
    }

    // Subtle component pull-out highlight when selected
    for (const [id, rig] of this.componentRigs) {
      const isActive = id === this.selectedId;
      _vec3A.copy(rig.restPosition);
      if (isActive && (this.isDoorOpen || id === 'adf' || id === 'interface')) {
        _vec3A.add(rig.pullOffset);
      }
      if (rig.group.position.distanceToSquared(_vec3A) > 0.00001) {
        rig.group.position.x = THREE.MathUtils.damp(
          rig.group.position.x,
          _vec3A.x,
          8,
          dt
        );
        rig.group.position.y = THREE.MathUtils.damp(
          rig.group.position.y,
          _vec3A.y,
          8,
          dt
        );
        rig.group.position.z = THREE.MathUtils.damp(
          rig.group.position.z,
          _vec3A.z,
          8,
          dt
        );
        needsMoreFrames = true;
      }
    }

    // Smooth camera preset transition
    if (this.cameraTransitionActive) {
      this.camera.position.x = THREE.MathUtils.damp(
        this.camera.position.x,
        this.camTargetPos.x,
        6,
        dt
      );
      this.camera.position.y = THREE.MathUtils.damp(
        this.camera.position.y,
        this.camTargetPos.y,
        6,
        dt
      );
      this.camera.position.z = THREE.MathUtils.damp(
        this.camera.position.z,
        this.camTargetPos.z,
        6,
        dt
      );
      this.controls.target.x = THREE.MathUtils.damp(
        this.controls.target.x,
        this.camTargetLook.x,
        6,
        dt
      );
      this.controls.target.y = THREE.MathUtils.damp(
        this.controls.target.y,
        this.camTargetLook.y,
        6,
        dt
      );
      this.controls.target.z = THREE.MathUtils.damp(
        this.controls.target.z,
        this.camTargetLook.z,
        6,
        dt
      );

      const posDist = this.camera.position.distanceToSquared(this.camTargetPos);
      const tgtDist = this.controls.target.distanceToSquared(this.camTargetLook);
      if (posDist < 0.0004 && tgtDist < 0.0004) {
        this.camera.position.copy(this.camTargetPos);
        this.controls.target.copy(this.camTargetLook);
        this.cameraTransitionActive = false;
      } else {
        needsMoreFrames = true;
      }
    }

    // Paper animation
    if (this.isAnimatingPaper && !this.isPaperPaused) {
      this.paperProgress += dt / this.paperDurationSec;
      if (this.paperProgress >= 1) {
        this.paperProgress = 1;
        this.applyPaperTransform(1);
        this.isPaperPaused = true;
        this.callbacks.onAnimationProgress?.(1, true);
      } else {
        this.applyPaperTransform(this.paperProgress);
        this.callbacks.onAnimationProgress?.(this.paperProgress, false);
        needsMoreFrames = true;
      }
    }

    return needsMoreFrames;
  }

  private afterDraw(cb: () => void): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    if (!gl || !gl.fenceSync) {
      this.frameId = window.setTimeout(cb, 80);
      return;
    }
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private startContinuousLoop(): void {
    if (this.isContinuousLoop || this.disposed) return;
    this.isContinuousLoop = true;
    this.lastFrameTimeMs = performance.now();

    const tick = () => {
      if (this.disposed) return;
      const now = performance.now();
      const dt = Math.min((now - this.lastFrameTimeMs) / 1000, 0.08);
      this.lastFrameTimeMs = now;

      const keepRunning = this.stepSimulation(dt);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);

      if (keepRunning && this.isAnimatingPaper && !this.isPaperPaused) {
        if (this.isSoftwareGl) {
          this.afterDraw(tick);
        } else {
          this.frameId = requestAnimationFrame(tick);
        }
      } else {
        this.isContinuousLoop = false;
        if (keepRunning) {
          this.requestRender();
        }
      }
    };

    if (this.isSoftwareGl) {
      this.afterDraw(tick);
    } else {
      this.frameId = requestAnimationFrame(tick);
    }
  }

  public requestRender(): void {
    if (this.disposed || this.isContinuousLoop) return;
    if (this.renderBusy) {
      this.renderDirty = true;
      return;
    }
    this.renderBusy = true;

    this.frameId = requestAnimationFrame(() => {
      if (this.disposed) return;
      this.renderDirty = false;
      const now = performance.now();
      const dt = Math.min(Math.max((now - this.lastFrameTimeMs) / 1000, 0.001), 0.08);
      this.lastFrameTimeMs = now;

      const moreFrames = this.stepSimulation(dt);
      const controlsMoved = this.controls.update();
      this.renderer.render(this.scene, this.camera);

      const done = () => {
        this.renderBusy = false;
        if (this.renderDirty || moreFrames || controlsMoved) {
          this.requestRender();
        }
      };

      if (this.isSoftwareGl) {
        this.afterDraw(done);
      } else {
        done();
      }
    });
  }

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    this.controls.dispose();
    for (const item of this.disposables) {
      item.dispose();
    }
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
