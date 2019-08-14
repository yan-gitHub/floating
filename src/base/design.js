import * as UTIL from './util';

class Design {
  constructor(data) {
    this.data = data;
    this.createAd();
    this.bindEvent();
  }

  createAd() {
    const { data = [] } = this;
    const source = data[0];
    let contaner = document.querySelector('.l-contaner-y');

    if (!contaner) {
      contaner = $(`<div id="l-contaner-y" class="l-contaner-y">
                    <div class="ad-canvas">
                      <a class="l-ad-target" href="${source.url}">
                      <img
                          src="${source.vertical_img || ''}"
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
    $('.l-ad-target').click(() => {
      this.sendClickLog({ type: 2 });
      setTimeout(() => {
        window.location.href = this.data[0].url;
      }, 100);
    });
  }

  // target() {
  //   this.sendClickLog({ type: 2 });
  //   window.location.href = this.data[0].url;
  // }

  sendClickLog(params = {}) {
    $.get('http://h5game.api.crotnet.com/loating/api/ad_count', {
      ad_id: this.data.id,
      ...params
    });
  }
}

export default Design;
