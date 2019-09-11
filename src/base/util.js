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

/**
 * 解析目标URL中的参数成json对象
 * @param {string} url 目标URL
 * @return {Object} 解析结果对象
 */
export const queryToJson = url => {
  const query = url.substr(url.lastIndexOf('?') + 1);
  let params = query.split('&');
  const len = params.length;
  let result = {};

  for (let i = 0; i < len; i++) {
    if (!params[i]) {
      continue;
    }
    const param = params[i].split('=');
    const key = param[0];
    const value = param[1];

    const item = result[key];
    if ('undefined' === typeof item) {
      result[key] = value;
    } else if (Object.prototype.toString.call(item) == '[object Array]') {
      item.push(value);
    } else {
      // 这里只可能是string了
      result[key] = value;
    }
  }

  return result;
};

let timer = null;
let message = [];
export const toastr = (mes, time) => {
  if (!mes) return;
  message.push(mes);
  if (timer) {
    clearTimeout(timer);
    $('.toastr-box').html(message.join(',\n'));
  } else {
    const toastr = $(`<div class="toastr-box">${mes}</div>`);
    $('body').append(toastr);
  }

  timer = setTimeout(() => {
    $('.toastr-box').remove();
    message = [];
  }, time || 2000);
};
