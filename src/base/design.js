import * as UTIL from './util';
import { baseUrl } from './config';

class Design {
  constructor(data) {
    this.data = data[0];
    this.createAd();
    this.bindEvent();
  }

  createAd() {
    const {
      data,
      data: { vertical_img, orizontal_img }
    } = this;
    let contaner = document.querySelector('.l-contaner-y');
    const imgUrl =
      data['direction'] === 'portrait'
        ? vertical_img || ''
        : orizontal_img || '';
    if (!contaner) {
      contaner = $(`<div id="l-contaner-y" class="l-contaner-y">
                    <div class="ad-canvas">
                      <a class="l-ad-target" href="${data.url}">
                      <img
                          src="${imgUrl}"
                          onerror="this.style.opacity = 0;" onload="this.style.opacity = 1;" style="opacity: 0;"
                        /> 
                      </a>
                      <span class="close-ad"></span>
                    </div>
                  </div>`);
    }

    contaner.appendTo($('body'));
    this.sendClickLog({ type: 1 });
  }

  bindEvent() {
    const that = this;
    const {
      data,
      data: { vertical_img, orizontal_img }
    } = this;
    // 广告跳转事件
    $('.l-ad-target').click(e => {
      e.stopPropagation();
      this.sendClickLog({ type: 2 });
      setTimeout(() => {
        // window.location.href = this.data[0].url;
      }, 100);
    });
    $('.close-ad').click(e => {
      $('.l-contaner-y').remove();
    });
    // 屏切事件
    let timer = null;
    $(window).resize(function(e) {
      timer && this.clearTimeout(timer);
      const direction = UTIL.isStand();
      timer = setTimeout(() => {
        if (direction == data.direction) {
          return;
        }
        that.data['direction'] = direction;
        const imgUrl =
          data['direction'] === 'portrait'
            ? vertical_img || ''
            : orizontal_img || '';
        $('.l-contaner-y .l-ad-target').attr('href', imgUrl);
        e.stopPropagation();
      }, 50);
    });
  }

  sendClickLog(params = {}) {
    const {
      data: { id, direction }
    } = this;
    $.post(`${baseUrl}/loating/api/ad_count`, {
      ad_id: id || '',
      // direction: direction === 'portrait' ? 'v' : 'o',
      ...params
    });
  }
}

export default Design;
