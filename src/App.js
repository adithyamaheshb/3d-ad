import { useState, useRef } from "react";
import { OrbitControls, Torus } from "@react-three/drei";
import { Canvas, useThree, extend, useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import { Controls, useControl } from "react-three-gui";

import "./App.css";

function Cube(props) {
  const [isBig, setIsBig] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // the best way to update a value without changing the state i.e., rerendering the component is to use "refs"
  const ref = useRef();

  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
    ref.current.rotation.z += 0.01;
  });

  const { size, x } = useSpring({
    size: isBig ? [2, 2, 2] : [1, 1, 1],
    x: isBig ? 2 : 0,
  });

  const color = isHovered ? "pink" : "salmon";

  return (
    <a.mesh
      {...props}
      ref={ref}
      scale={size}
      position-x={x}
      castShadow={true}
      receiveShadow={true}
      onClick={() => setIsBig(!isBig)}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* args: width, height, breadth */}
      <sphereBufferGeometry attach="geometry" args={[1, 8, 6]} />
      <meshPhongMaterial
        flatShading={true}
        roughness={1}
        metalness={0.5}
        attach="material"
        shininess={100}
        color={color}
      />
    </a.mesh>
  );
}

function Plane() {
  return (
    <mesh
      receiveShadow={true}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
    >
      <planeBufferGeometry attach="geometry" args={[20, 20]} />
      <meshStandardMaterial attach="material" color="#D3D3D3" />
    </mesh>
  );
}

function Scene() {
  const positionX = useControl("Position X", {
    type: "number",
    max: 10,
    min: -10,
  });

  const { x, y } = useControl("Rotation", {
    type: "xypad",
    max: 10,
    min: -10,
  });

  const color = useControl("Torus Color", {
    type: "color",
  });

  return (
    <>
      <ambientLight />
      <spotLight castShadow={true} intensity={0.6} position={[0, 10, 4]} />
      <Cube rotation={[x, y, 0]} position={[`${positionX}`, 0, 0]} />
      <Cube rotation={[10, 20, 0]} position={[2, 2, 0]} />
      <Plane />
      <Torus args={[1, 0.3, 10, 30]} position={[-2, 1, -1]}>
        <meshPhongMaterial
          flatShading={true}
          roughness={1}
          metalness={0.5}
          shininess={100}
          attach="material"
          color={color}
        />
      </Torus>
      <OrbitControls />
    </>
  );
}

function App() {
  return (
    <>
      <Controls.Provider>
        <Controls.Canvas shadowMap={true}>
          <Scene />
        </Controls.Canvas>
        <Controls />
      </Controls.Provider>
    </>
  );
}

export default App;
