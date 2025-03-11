import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Stars, Stats } from "@react-three/drei";
import React, { Suspense, useEffect, useState } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

const LoadingSpinner = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-2"></div>
      <p className="text-sm text-gray-400">Loading model...</p>
    </div>
  </div>
);

// New screenshot button component
const ScreenshotButton = () => {
  const takeScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.download = `cad-model-${Date.now()}.png`;
    
    // Convert canvas content to data URL
    canvas.toBlob((blob) => {
      link.href = URL.createObjectURL(blob);
      link.click();
      
      // Clean up
      URL.revokeObjectURL(link.href);
    }, 'image/png');
  };
  
  return (
    <button
      onClick={takeScreenshot}
      className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-1 px-2 rounded text-xs flex items-center shadow-sm transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      Screenshot
    </button>
  );
};

const Model = ({ fileUrl }) => {
  const geometry = useLoader(STLLoader, fileUrl);
  const meshRef = React.useRef();
  const { camera, scene } = useThree();
  const [isScaled, setIsScaled] = useState(false);

  useEffect(() => {
    if (meshRef.current && geometry && !isScaled) {
      // Center the geometry
      geometry.center();

      // Create a bounding box
      const box = new THREE.Box3().setFromObject(meshRef.current);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Find the max dimension
      const maxDim = Math.max(size.x, size.y, size.z);

      // Scale model to a reasonable size
      const scaleFactor = 5 / Math.max(0.1, maxDim);
      meshRef.current.scale.setScalar(scaleFactor);

      // Position camera to fit the object
      const cameraPosition = new THREE.Vector3(1, 0.5, 1);
      cameraPosition.normalize();
      cameraPosition.multiplyScalar(maxDim * 2.5);
      camera.position.copy(cameraPosition);
      camera.lookAt(center);

      // Reset orbit controls target to model center
      scene.userData.controls?.target.copy(center);

      setIsScaled(true);
    }
  }, [geometry, camera, scene, isScaled]);

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshPhongMaterial
        color="#94a3b8" // Changed to a silver color (slate-400)
        specular="#aaaaaa"
        shininess={40}
        flatShading={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const CameraController = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.near = 0.01;
    camera.far = 10000;
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};

const ViewerControls = ({
  controlsRef,
  showGrid,
  setShowGrid,
  showStats,
  setShowStats,
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <div className="absolute top-2 right-2 flex flex-col space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={() => controlsRef.current?.reset()}
            className="bg-white/90 hover:bg-white text-gray-400 font-medium py-1 px-2 rounded text-xs flex items-center shadow-sm transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset
          </button>

          <ScreenshotButton />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`${
              showGrid ? "bg-blue-500 text-white" : "bg-white/90 text-gray-400"
            } hover:bg-blue-600 hover:text-white font-medium py-1 px-2 rounded text-xs flex items-center shadow-sm transition`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Grid
          </button>

          <button
            onClick={() => setShowStats(!showStats)}
            className={`${
              showStats ? "bg-blue-500 text-white" : "bg-white/90 text-gray-400"
            } hover:bg-blue-600 hover:text-white font-medium py-1 px-2 rounded text-xs flex items-center shadow-sm transition`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Stats
          </button>

          <button
            onClick={() => setShowHelp(!showHelp)}
            className="bg-white/90 hover:bg-white text-gray-400 font-medium py-1 px-2 rounded text-xs flex items-center shadow-sm transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="absolute bottom-10 right-2 bg-white/90 p-3 rounded shadow-sm text-xs text-gray-400 w-48">
          <div className="font-medium mb-2">Controls</div>
          <ul className="space-y-1">
            <li className="flex">
              <span className="font-medium w-24">Left click + drag:</span>{" "}
              Rotate
            </li>
            <li className="flex">
              <span className="font-medium w-24">Right click + drag:</span> Pan
            </li>
            <li className="flex">
              <span className="font-medium w-24">Scroll:</span> Zoom
            </li>
            <li className="flex">
              <span className="font-medium w-24">Reset button:</span> Reset view
            </li>
          </ul>
          <button
            className="mt-2 text-blue-600 hover:text-blue-800"
            onClick={() => setShowHelp(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

const ModelViewer = ({ fileUrl }) => {
  const controlsRef = React.useRef();
  const [showGrid, setShowGrid] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const handleCreated = (state) => {
    if (controlsRef.current) {
      state.scene.userData.controls = controlsRef.current;
    }
  };

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{
          position: [20, 20, 20],
          fov: 45,
          near: 0.01,
          far: 10000,
        }}
        className="w-full h-full"
        shadows
        onCreated={handleCreated}
        dpr={[1, 2]}
      >
        {/* Scene lighting */}
        <color attach="background" args={["#f8f9fa"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.7} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <hemisphereLight
          color="#ffffff"
          groundColor="#b9b9b9"
          intensity={0.3}
        />
        <Stars radius={100} depth={50} count={1000} factor={4} fade />

        <CameraController />

        {/* Reference grid */}
        {showGrid && (
          <Grid
            renderOrder={-1}
            position={[0, -0.5, 0]}
            infiniteGrid
            cellSize={0.6}
            cellThickness={0.6}
            sectionSize={3}
            sectionThickness={1}
            sectionColor="#6b7280"
            fadeDistance={50}
          />
        )}

        <Suspense fallback={null}>
          <Model fileUrl={fileUrl} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={0.1}
          maxDistance={1000}
          target={[0, 0, 0]}
          makeDefault
          zoomSpeed={1}
          enableDamping={true}
          dampingFactor={0.05}
        />

        {showStats && <Stats />}
      </Canvas>

      <Suspense fallback={<LoadingSpinner />} />

      <ViewerControls
        controlsRef={controlsRef}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showStats={showStats}
        setShowStats={setShowStats}
      />
      
      <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs text-gray-400 shadow-sm">
        Use mouse to rotate, right-click to pan, scroll to zoom
      </div>
    </div>
  );
};

export default ModelViewer;
