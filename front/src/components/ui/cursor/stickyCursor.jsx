import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function StickyCursor() {
  const cursorSize = 50;
  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0)
  };

  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions)
  };

  const [isVisible, setIsVisible] = useState(true);
  const [isOnFooter, setIsOnFooter] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const manageMouseMove = (e) => {
    if (!isVisible) return; // Выходим, если курсор не должен быть виден

    const { clientX, clientY } = e;
    mouse.x.set(clientX - cursorSize / 3.35);
    mouse.y.set(clientY - cursorSize / 3);

    // Определяем положение курсора относительно футера
    const footer = document.querySelector('footer');
    if (footer) {
      const rect = footer.getBoundingClientRect();
      const isWithinFooter = clientY >= rect.top && clientY <= rect.bottom;
      setIsOnFooter(isWithinFooter);
    }

    // Проверяем, находится ли курсор над элементом с классом 'b-point' или его родителями
    let elementUnderCursor = document.elementFromPoint(clientX, clientY);
    let isClickable = false;

    while (elementUnderCursor) {
      if (elementUnderCursor.classList && elementUnderCursor.classList.contains('b-point')) {
        isClickable = true;
        break;
      }
      elementUnderCursor = elementUnderCursor.parentElement;
    }

    setIsPointer(isClickable);
  };

  useEffect(() => {
    const handleResize = () => {
      const isScreenLarge = window.innerWidth >= 1024;
      setIsVisible(isScreenLarge);

      // Сбрасываем состояние курсора при изменении видимости
      if (!isScreenLarge) {
        document.body.style.cursor = 'default';
      } else {
        document.body.style.cursor = 'none';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    if (isVisible) {
      window.addEventListener('mousemove', manageMouseMove);
    } else {
      window.removeEventListener('mousemove', manageMouseMove);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', manageMouseMove);
    };
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [isVisible]);

  return (
    <div>
      {isVisible && (
        <motion.div
          style={{
            left: smoothMouse.x,
            top: smoothMouse.y,
          }}
          className={`fixed h-[45px] w-[45px] rounded-full pointer-events-none ${
            isPointer ? 'bg-pointer bg-contain' : 'bg-bird bg-contain'
          }`}
        >
        </motion.div>
      )}
    </div>
  );
}
