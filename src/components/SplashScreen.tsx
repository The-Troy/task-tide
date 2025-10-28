"use client";
import { motion } from 'framer-motion';
import { FileText, Folder, Users } from 'lucide-react';

interface Icon {
  id: number;
  type: 'document' | 'folder' | 'group';
  startX: number;
  startY: number;
  angle: number;
  isPrimary: boolean;
}

export default function SplashScreen() {
  const icons: Icon[] = [
    { id: 1, type: 'document', startX: 15, startY: 20, angle: 0, isPrimary: true },
    { id: 2, type: 'document', startX: 85, startY: 30, angle: 60, isPrimary: false },
    { id: 3, type: 'document', startX: 30, startY: 70, angle: 120, isPrimary: false },
    { id: 4, type: 'folder', startX: 70, startY: 15, angle: 40, isPrimary: true },
    { id: 5, type: 'folder', startX: 25, startY: 45, angle: 100, isPrimary: false },
    { id: 6, type: 'folder', startX: 80, startY: 75, angle: 160, isPrimary: false },
    { id: 7, type: 'group', startX: 45, startY: 25, angle: 80, isPrimary: true },
    { id: 8, type: 'group', startX: 60, startY: 85, angle: 140, isPrimary: false },
    { id: 9, type: 'group', startX: 10, startY: 55, angle: 200, isPrimary: false },
  ];

  const getIconComponent = (type: Icon['type']) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'folder':
        return Folder;
      case 'group':
        return Users;
    }
  };

  const getOrbitPath = (angle: number, time: number) => {
    const radius = 120;
    const angleInRadians = ((angle + time * 360) * Math.PI) / 180;
    return {
      x: Math.cos(angleInRadians) * radius,
      y: Math.sin(angleInRadians) * radius,
    };
  };

  const getFinalPosition = (type: Icon['type']) => {
    const positions = {
      document: -80,
      folder: 0,
      group: 80,
    };
    return { x: positions[type], y: 100 };
  };

  const getMergePosition = (type: Icon['type']) => {
    const positions = {
      document: -80,
      folder: 0,
      group: 80,
    };
    return { x: positions[type], y: -60 };
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#ECEFF1' }}>
      <motion.div
        className="absolute inset-0 origin-left"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #673AB7 50%, transparent 100%)',
          opacity: 0.3,
        }}
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.2,
          delay: 0.5,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(63, 81, 181, 0.3) 0%, transparent 70%)',
            width: '300px',
            height: '300px',
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: 1.5,
            delay: 1.7,
            ease: 'easeOut',
          }}
        />

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1
            className="text-6xl tracking-tight"
            style={{
              color: '#673AB7',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            TaskTide
          </h1>
          <motion.div
            className="h-1 mt-3 rounded-full"
            style={{ backgroundColor: '#3F51B5' }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
        </motion.div>
      </motion.div>

      {icons.map((icon) => {
        const IconComponent = getIconComponent(icon.type);
        const finalPos = getFinalPosition(icon.type);
        const mergePos = getMergePosition(icon.type);

        return (
          <motion.div
            key={icon.id}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: '-16px',
              marginTop: '-16px',
            }}
            initial={{
              x: `${(icon.startX - 50) * 10}px`,
              y: `${(icon.startY - 50) * 8}px`,
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              x: [
                `${(icon.startX - 50) * 10}px`,
                getOrbitPath(icon.angle, 0.3).x,
                getOrbitPath(icon.angle, 0.6).x,
                mergePos.x,
                icon.isPrimary ? `${finalPos.x}px` : mergePos.x,
              ],
              y: [
                `${(icon.startY - 50) * 8}px`,
                getOrbitPath(icon.angle, 0.3).y,
                getOrbitPath(icon.angle, 0.6).y,
                mergePos.y,
                icon.isPrimary ? `${finalPos.y}px` : mergePos.y,
              ],
              opacity: [0, 1, 1, 1, icon.isPrimary ? 1 : 0],
              scale: [0.8, 1, 1, icon.isPrimary ? 1 : 0.5, icon.isPrimary ? 1 : 0],
            }}
            transition={{
              duration: 2.5,
              delay: 0.3,
              times: [0, 0.3, 0.5, 0.7, 1],
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            <motion.div
              animate={icon.isPrimary ? {
                y: [0, -8, 0],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2.8,
              }}
            >
              <IconComponent
                size={32}
                strokeWidth={1.5}
                style={{ color: icon.type === 'document' ? '#673AB7' : icon.type === 'folder' ? '#3F51B5' : '#5C6BC0' }}
              />
            </motion.div>
          </motion.div>
        );
      })}

      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.02) 100%)'
      }} />
    </div>
  );
}