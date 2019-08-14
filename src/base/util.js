//判断是否是微信浏览器的函数
export const isWeiXin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
};

// 是不是移动端
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isStand = () => {
  const supportOrientation =
    typeof window.orientation == 'number' &&
    typeof window.onorientationchange == 'object';
  const orientation = window.orientation;
  let direction = 'portrait';
  if (supportOrientation) {
    switch (orientation) {
      case 90:
      case -90:
        direction = 'landscape';
        break;
      default:
        direction = 'portrait';
    }
  } else {
    direction =
      window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }
  return direction;
};
