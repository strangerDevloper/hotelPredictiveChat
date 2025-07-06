import { useEffect, useState } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsLandscape(width > height);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const isAndroid = () => {
    return /Android/.test(navigator.userAgent);
  };

  const isStandalone = () => {
    return window.matchMedia('(display-mode: standalone)').matches;
  };

  const getSafeAreaInsets = () => {
    return {
      top: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0'),
      bottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0'),
      left: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sal') || '0'),
      right: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sar') || '0'),
    };
  };

  return {
    isMobile,
    isTablet,
    isLandscape,
    screenSize,
    isTouchDevice: isTouchDevice(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isStandalone: isStandalone(),
    getSafeAreaInsets,
  };
};
