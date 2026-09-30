"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows, Text, RoundedBox, Html } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// --- HYPER-REALISTIC 3D MODEL ---
function InstrumentModel() {
  const group = useRef<THREE.Group>(null);
  const platform = useRef<THREE.Group>(null);
  const displayHead = useRef<THREE.Group>(null);
  const displayPole = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);
  const lastUpdate = useRef(0);
  const lastScrollY = useRef(0);

  // We use native DOM scroll calculation to avoid any ScrollControls bugs!
  useFrame((state, delta) => {
    const currentScrollY = window.scrollY;

    if (textRef.current) {
      if (currentScrollY !== lastScrollY.current) {
        // Fluctuate wildly while actively scrolling
        if (state.clock.elapsedTime - lastUpdate.current > 0.08) {
          textRef.current.text = `${(Math.random() * 50).toFixed(3)} kg`;
          lastUpdate.current = state.clock.elapsedTime;
        }
      } else {
        // Settle back to zero half a second after scrolling stops
        if (state.clock.elapsedTime - lastUpdate.current > 0.5) {
          textRef.current.text = `0.000 kg`;
        }
      }
    }
    
    lastScrollY.current = currentScrollY;

    if (!group.current) return;
    
    // Calculate exact scroll progress (0 to 1) robustly
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollHeight)) : 0;
    
    // Smooth cinematic rotation based on scroll (starts at an angle, rotates around)
    group.current.rotation.y = THREE.MathUtils.lerp(
      Math.PI / 5,
      Math.PI * 2 + Math.PI / 4,
      progress
    );

    // Shift model left or right based on which scene is active so it doesn't block text
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const xOffset = isMobile ? 0 : 1.8; // Push 1.8 units left/right on desktop
    
    let targetX = xOffset; // Scene 1: text left, model right
    let targetY = -1.2; // Default vertical position
    
    if (progress > 0.75) {
      targetX = 0; // Scene 5 & Footer: center horizontally
      targetY = 6.0; // Move the model completely OFF SCREEN upwards so the final text and footer are 100% clear!
    } else if (progress > 0.55) {
      targetX = -xOffset; // Scene 4: text right, model left
    } else if (progress > 0.35) {
      targetX = xOffset; // Scene 3: text left, model right
    } else if (progress > 0.15) {
      targetX = -xOffset; // Scene 2: text right, model left
    }

    // Smoothly glide the model horizontally and vertically
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x, 
      targetX, 
      delta * 4
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      targetY,
      delta * 4
    );

    // Slowly rotate the decorative floor rings
    if (ring1.current) ring1.current.rotation.z += delta * 0.2;
    if (ring2.current) ring2.current.rotation.z -= delta * 0.1;

    // Explode effect on scroll
    // The explosion starts from 15% scroll to 30% scroll
    const explodeProgress = Math.max(0, Math.min(1, (progress - 0.15) * (1 / 0.15)));
    
    if (platform.current && displayHead.current && displayPole.current) {
      // Platform moves up just slightly to avoid clipping the pole wildly
      platform.current.position.y = THREE.MathUtils.lerp(0, 0.2, explodeProgress);
      // Head moves up further
      displayHead.current.position.y = THREE.MathUtils.lerp(1.7, 2.1, explodeProgress);
      // Pole scales up or moves up slightly
      displayPole.current.position.y = THREE.MathUtils.lerp(0.85, 1.05, explodeProgress);
    }
  });

  return (
    <group ref={group} position={[1, -1.2, 0]} scale={[1.3, 1.3, 1.3]}>
      {/* Decorative Floor Rings (Futuristic scanner vibe from reference) */}
      <mesh ref={ring1} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.75, 1.8, 64]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.52, 64]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Base Frame (Dark matte industrial with rounded corners) */}
      <RoundedBox args={[2.2, 0.12, 2.5]} radius={0.03} smoothness={4} position={[0, 0.1, -0.15]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#111111" metalness={0.7} roughness={0.6} clearcoat={0.1} />
      </RoundedBox>
      
      {/* Rubber Feet */}
      {[-0.9, 0.9].map((x) => 
        [-0.9, 0.9].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.02, z]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.06, 32]} />
            <meshStandardMaterial color="#050505" roughness={0.9} />
          </mesh>
        ))
      )}

      {/* Internal Load Cell */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
      </mesh>

      {/* Stainless Steel Platform (Highly realistic brushed metal) */}
      <group ref={platform} position={[0, 0, 0]}>
        <RoundedBox args={[2.3, 0.06, 2.3]} radius={0.02} smoothness={4} position={[0, 0.4, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color="#e5e5e5" 
            metalness={0.9} 
            roughness={0.15} 
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </RoundedBox>
        {/* Subtle platform rim */}
        <RoundedBox args={[2.25, 0.02, 2.25]} radius={0.01} smoothness={2} position={[0, 0.36, 0]}>
           <meshStandardMaterial color="#333" metalness={0.6} roughness={0.8} />
        </RoundedBox>
      </group>

      {/* Display Pole (Sleek dark aluminum) */}
      <mesh ref={displayPole} position={[0, 0.85, -1.25]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 1.5, 32]} />
        <meshPhysicalMaterial color="#333" metalness={0.85} roughness={0.2} clearcoat={0.8} />
      </mesh>

      {/* Display Head (Angled upwards like the reference) */}
      <group ref={displayHead} position={[0, 1.7, -1.25]} rotation={[-0.25, 0, 0]}>
        {/* Back casing */}
        <RoundedBox args={[1.2, 0.5, 0.12]} radius={0.04} smoothness={4} castShadow>
          <meshPhysicalMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} clearcoat={0.3} />
        </RoundedBox>
        {/* Screen Bezel / Glass Front */}
        <mesh position={[0, 0, 0.061]}>
          <boxGeometry args={[1.15, 0.45, 0.02]} />
          <meshPhysicalMaterial color="#000" metalness={0.9} roughness={0.01} clearcoat={1} transmission={0.2} opacity={0.9} transparent />
        </mesh>
        {/* Glowing Screen Light */}
        <pointLight position={[0, 0, 0.15]} color="#f59e0b" intensity={0.5} distance={1.5} decay={2} />
        {/* Digital Text - Glowing Blue like reference */}
        <Text
          ref={textRef}
          position={[0, 0.02, 0.075]}
          fontSize={0.22}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
        >
          0.000 kg
        </Text>
      </group>
    </group>
  );
}

// --- DOM CONTENT (Native Scrolling) ---
function HTMLContent() {
  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none">
      <div className="w-full relative">
        
        {/* Scene 1 - Platform */}
        <div id="platform" className="h-screen w-full flex items-center justify-between px-8 md:px-24 relative overflow-hidden">
          
          {/* Animated Background Grid & Orbs for Vibrant Expert Look */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] mix-blend-normal" />
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px] mix-blend-normal" />
          </div>

          <div className="max-w-2xl text-left text-foreground pl-6 border-l-[3px] border-primary/40 pointer-events-auto relative z-10">
            <p className="text-xs md:text-sm font-bold tracking-[0.3em] text-primary mb-6 uppercase flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary"></span>
              Welcome to
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-extrabold tracking-tighter leading-[0.8] mb-6 drop-shadow-sm">
              metro<span className="text-primary font-light">LAB</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground tracking-[0.15em] uppercase font-semibold">
              Precision Beyond Compliance
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2 tracking-[0.2em] uppercase">
              An initiative by Team Techxi
            </p>
            <p className="text-sm md:text-base text-muted-foreground mt-8 leading-relaxed max-w-lg font-medium">
              A digital platform for type evaluation of non-automatic weighing instruments as per OIML R76.
            </p>
            <div className="flex gap-4 mt-12">
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground h-14 px-10 text-lg font-bold shadow-[0_0_30px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_40px_rgba(var(--color-primary),0.5)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 group"
              >
                Explore Platform
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right side expert details (Utilizing free space) */}
          <div className="hidden xl:flex flex-col items-end gap-3 text-right text-xs font-mono text-muted-foreground/60 tracking-[0.25em] relative z-10 pointer-events-none mt-20 pr-12">
            <span className="text-primary font-bold shadow-primary drop-shadow-md">ACCURATE</span>
            <span className="hover:text-foreground transition-colors">TRUSTED</span>
            <span className="hover:text-foreground transition-colors">COMPLIANT</span>
          </div>

          {/* Vertical scroll indicator */}
          <div className="absolute left-6 md:left-12 bottom-32 flex flex-col items-center gap-4 text-xs font-mono text-muted-foreground/50 tracking-[0.3em] [writing-mode:vertical-lr] animate-pulse">
             SCROLL
             <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent" />
          </div>
        </div>


        {/* Scene 2 - Features */}
        <div id="features" className="h-screen w-full flex items-center justify-end px-8 md:px-24">
          <div className="max-w-xl text-right text-foreground pr-4 border-r-2 border-primary/20 pointer-events-auto">
            <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-primary mb-4 uppercase">
              02
            </p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              EVERY<br/>GRAM<br/><span className="text-primary font-light">MATTERS.</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg md:text-xl font-light">
              From instrument registration to compliance reporting — fully digital.
            </p>
          </div>
        </div>


        {/* Scene 3 - Workflow */}
        <div id="workflow" className="h-screen w-full flex items-center justify-start px-8 md:px-24">
          <div className="max-w-xl text-left text-foreground pl-4 border-l-2 border-primary/20 pointer-events-auto">
            <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-primary mb-4 uppercase">
              03
            </p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              PRECISION<br/><span className="text-primary font-light">DRIVES</span><br/>TRUST.
            </h2>
            <p className="mt-6 text-muted-foreground text-lg md:text-xl font-light">
              Automated OIML R76 evaluation for non-automatic weighing instruments.
            </p>
          </div>
        </div>
        

        {/* Scene 4 - About */}
        <div id="about" className="h-screen w-full flex items-center justify-end px-8 md:px-24">
          <div className="max-w-xl text-right text-foreground pr-4 border-r-2 border-primary/20 pointer-events-auto">
            <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-primary mb-4 uppercase">
              04
            </p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              A COMPLETE<br/><span className="text-primary font-light">DIGITAL WORKFLOW</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg md:text-xl font-light">
              From instrument details to standardized reports.
            </p>
          </div>
        </div>


        {/* Scene 5 - Interactive Links */}
        <div className="h-screen w-full flex items-center justify-center px-8">
          <div className="text-center max-w-4xl pointer-events-auto">
             <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-primary mb-4 uppercase">
               05
             </p>
             <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-16">
               INSPECT <span className="text-primary font-light">INSTRUMENT</span>
             </h2>
             <div className="flex gap-12 justify-center flex-wrap">
               {[
                 { id: "01", label: "Register", href: "/instruments/new" },
                 { id: "02", label: "Conduct Tests", href: "/evaluations" },
                 { id: "03", label: "Calculate", href: "/evaluations" },
                 { id: "04", label: "Review & Report", href: "/reports" }
               ].map((step, i) => (
                 <Link href={step.href} key={i} className="text-center group block cursor-pointer transition-transform hover:-translate-y-2">
                   <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center mx-auto mb-6 text-primary font-bold text-xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300">
                     {step.id}
                   </div>
                   <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{step.label}</p>
                 </Link>
               ))}
             </div>
          </div>
        </div>

        {/* Traditional Footer Section */}
        <footer className="w-full bg-black/95 border-t border-primary/20 pt-20 pb-10 px-8 md:px-24 pointer-events-auto relative z-50 mt-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Brand & Description */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
                  M
                </div>
                <span className="text-xl font-semibold tracking-tight text-white">
                  metro<span className="text-primary">LAB</span>
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Redefining precision and compliance through an advanced digital workflow for OIML R76 non-automatic weighing instruments.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-colors cursor-pointer">
                  𝕏
                </div>
                <div className="h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-colors cursor-pointer">
                  in
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-6 tracking-wider uppercase text-sm">Platform</h3>
              <ul className="space-y-4">
                <li><Link href="#features" className="text-muted-foreground hover:text-primary transition-colors text-sm">Features</Link></li>
                <li><Link href="#workflow" className="text-muted-foreground hover:text-primary transition-colors text-sm">How it Works</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors text-sm">Evaluation Dashboard</Link></li>
                <li><Link href="/reports" className="text-muted-foreground hover:text-primary transition-colors text-sm">Compliance Reports</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-6 tracking-wider uppercase text-sm">Resources</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Documentation</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">OIML R76 Guidelines</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">API Reference</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Support Center</Link></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-6 tracking-wider uppercase text-sm">Contact Us</h3>
              <ul className="space-y-4">
                <li className="text-muted-foreground text-sm">support@metrolab.com</li>
                <li className="text-muted-foreground text-sm">+1 (555) 123-4567</li>
                <li className="text-muted-foreground text-sm pt-4">
                  123 Precision Avenue<br/>
                  Tech District<br/>
                  Metrology City, MC 90210
                </li>
              </ul>
            </div>
            
          </div>

          <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} metroLAB · An initiative by Team Techxi. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">Privacy Policy</Link>
              <Link href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// --- MAIN EXPORT ---
export function LandingScene() {
  return (
    <div className="w-full relative transition-colors duration-300">
      
      {/* 3D Canvas fixed in background */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none">
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
          {/* Universal studio lighting for both modes */}
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
          
          {/* Studio environment creates realistic reflections on metal */}
          <Environment preset="studio" />

          <Suspense fallback={null}>
            <Float
              speed={1.5} // Animation speed
              rotationIntensity={0.1} // XYZ rotation intensity
              floatIntensity={0.3} // Up/down float intensity
            >
              <InstrumentModel />
            </Float>
          </Suspense>

          <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={15} blur={2.5} far={4} />
        </Canvas>
      </div>

      {/* HTML Scrollable Content layered on top */}
      <HTMLContent />
      
    </div>
  );
}
