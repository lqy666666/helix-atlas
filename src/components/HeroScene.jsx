import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function makeHelix() {
  const helix = new THREE.Group();
  const turns = 3.05;
  const halfHeight = 4.25;
  const radius = 1.45;
  const strands = [[], []];
  const particles = [];
  let seed = 24791;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let side = 0; side < 2; side += 1) {
    for (let step = 0; step <= 190; step += 1) {
      const progress = step / 190;
      const y = (progress * 2 - 1) * halfHeight;
      const phase = progress * Math.PI * 2 * turns + side * Math.PI;
      const x = Math.cos(phase) * radius;
      const z = Math.sin(phase) * radius;
      const center = new THREE.Vector3(x, y, z);
      strands[side].push(center);
      particles.push({ point: center, size: .14, tint: side });

      for (let grain = 0; grain < 18; grain += 1) {
        const angle = random() * Math.PI * 2;
        const spread = Math.sqrt(random()) * .4;
        particles.push({
          point: new THREE.Vector3(
            x + Math.cos(angle) * spread,
            y + (random() - .5) * .26,
            z + Math.sin(angle) * spread,
          ),
          size: .035 + random() * .125,
          tint: side,
        });
      }
    }
  }

  const coreMaterial = new THREE.MeshStandardMaterial({ color: '#99aec7', roughness: .97 });
  for (const strand of strands) {
    const curve = new THREE.CatmullRomCurve3(strand);
    helix.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 380, .12, 7, false), coreMaterial));
  }

  for (let step = 4; step < 190; step += 9) {
    const progress = step / 190;
    const y = (progress * 2 - 1) * halfHeight;
    const phase = progress * Math.PI * 2 * turns;
    for (let rung = 0; rung <= 14; rung += 1) {
      const t = rung / 14;
      const position = new THREE.Vector3(
        Math.cos(phase) * radius * (1 - 2 * t),
        y + (random() - .5) * .07,
        Math.sin(phase) * radius * (1 - 2 * t),
      );
      particles.push({ point: position, size: .07 + random() * .075, tint: 2 });
      if (rung % 2 === 0) {
        particles.push({
          point: position.clone().add(new THREE.Vector3((random() - .5) * .19, (random() - .5) * .16, (random() - .5) * .19)),
          size: .035 + random() * .07,
          tint: 2,
        });
      }
    }
  }

  const sphere = new THREE.IcosahedronGeometry(1, 1);
  const material = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 });
  const cloud = new THREE.InstancedMesh(sphere, material, particles.length);
  const dummy = new THREE.Object3D();
  const palette = ['#b4c7db', '#aebbd5', '#cbd5e6'];
  particles.forEach(({ point, size, tint }, index) => {
    dummy.position.copy(point);
    dummy.scale.setScalar(size);
    dummy.rotation.set(random() * 2, random() * 2, random() * 2);
    dummy.updateMatrix();
    cloud.setMatrixAt(index, dummy.matrix);
    const color = new THREE.Color(palette[tint]);
    color.offsetHSL((random() - .5) * .035, 0, (random() - .5) * .18);
    cloud.setColorAt(index, color);
  });
  cloud.instanceMatrix.needsUpdate = true;
  cloud.instanceColor.needsUpdate = true;
  helix.add(cloud);
  return helix;
}

export default function HeroScene() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight('#ffffff', '#768caf', 1.65));
    const key = new THREE.DirectionalLight('#f9ffff', 2.2);
    key.position.set(-3, 5, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight('#d8b7ee', 1.8);
    rim.position.set(4, -1, -5);
    scene.add(rim);
    const helix = makeHelix();
    helix.rotation.y = -.55;
    scene.add(helix);

    const camera = new THREE.OrthographicCamera(-5, 5, 4.85, -4.85, .1, 50);
    camera.position.set(0, .05, 18);
    camera.lookAt(0, 0, 0);
    let frame = 0;
    let visible = true;
    let lastTime = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      const halfView = width < 600 ? 6.2 : 4.85;
      const aspect = width / height;
      camera.left = -halfView * aspect;
      camera.right = halfView * aspect;
      camera.top = halfView;
      camera.bottom = -halfView;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    };

    const animate = time => {
      if (!visible || document.hidden) { frame = 0; lastTime = 0; return; }
      if (reducedMotion) { renderer.render(scene, camera); frame = 0; return; }
      if (!reducedMotion && lastTime) helix.rotation.y += Math.min((time - lastTime) / 1000, .05) * .52;
      lastTime = time;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(animate);
    });
    const onVisibility = () => {
      if (!document.hidden && visible && !frame) frame = requestAnimationFrame(animate);
    };
    observer.observe(host);
    intersection.observe(host);
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      scene.traverse(object => {
        object.geometry?.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach(item => item.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="entry-helix" ref={hostRef} aria-hidden="true" />;
}
