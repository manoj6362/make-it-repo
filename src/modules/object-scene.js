import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from "three";

const FACES = [
  "/img/work-2.jpg",
  "/img/hero-1.jpg",
  "/img/hero-3.jpg",
  "/img/work-4.jpg",
  "/img/hero-2.jpg",
  "/img/work-3.jpg",
];

/* A draggable, self-rotating image cube with orbiting satellites. */
export function initObjectScene() {
  const canvas = document.getElementById("objectCanvas");
  if (!canvas) return;

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 8.2);

  const loader = new TextureLoader();
  const materials = FACES.map((src) => {
    const map = loader.load(src);
    map.colorSpace = SRGBColorSpace;
    return new MeshStandardMaterial({ map, roughness: 0.35, metalness: 0.15 });
  });

  const group = new Group();
  const cube = new Mesh(new BoxGeometry(2.3, 2.3, 2.3), materials);
  group.add(cube);

  const satellites = [];
  for (let i = 0; i < 3; i += 1) {
    const sat = new Mesh(
      new IcosahedronGeometry(0.22, 1),
      new MeshPhysicalMaterial({
        color: new Color(i === 1 ? "#ff3b1f" : "#f2f0ee"),
        roughness: 0.15,
        metalness: 0.85,
        clearcoat: 1,
      })
    );
    sat.userData.radius = 2.6 + i * 0.4;
    sat.userData.speed = 0.35 + i * 0.18;
    sat.userData.phase = i * 2.1;
    sat.userData.tilt = i * 0.6;
    satellites.push(sat);
    group.add(sat);
  }
  scene.add(group);

  scene.add(new AmbientLight(0xffffff, 1.15));
  const key = new DirectionalLight(0xffffff, 2.1);
  key.position.set(4, 5, 6);
  scene.add(key);
  const rim = new PointLight(0xff3b1f, 30, 20);
  rim.position.set(-4, -2, 3);
  scene.add(rim);

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  const drag = { active: false, x: 0, y: 0 };
  const vel = { x: 0.0022, y: 0.004 };

  canvas.addEventListener("pointerdown", (e) => {
    drag.active = true;
    drag.x = e.clientX;
    drag.y = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag.active) return;
    vel.y = (e.clientX - drag.x) * 0.006;
    vel.x = (e.clientY - drag.y) * 0.006;
    drag.x = e.clientX;
    drag.y = e.clientY;
  });
  const release = () => {
    drag.active = false;
  };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointerleave", release);

  let visible = true;
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { rootMargin: "200px" }
  );
  io.observe(canvas);

  const clock = { t: 0 };
  const render = () => {
    requestAnimationFrame(render);
    if (!visible) return;

    clock.t += 0.016;
    if (!drag.active) {
      vel.x += (0.0016 - vel.x) * 0.03;
      vel.y += (0.004 - vel.y) * 0.03;
    }
    cube.rotation.x += vel.x;
    cube.rotation.y += vel.y;
    group.position.y = Math.sin(clock.t * 0.9) * 0.12;

    satellites.forEach((sat) => {
      const a = clock.t * sat.userData.speed + sat.userData.phase;
      sat.position.set(
        Math.cos(a) * sat.userData.radius,
        Math.sin(a * 0.8 + sat.userData.tilt) * 0.9,
        Math.sin(a) * sat.userData.radius
      );
      sat.rotation.x += 0.01;
      sat.rotation.y += 0.014;
    });

    renderer.render(scene, camera);
  };
  render();
}
