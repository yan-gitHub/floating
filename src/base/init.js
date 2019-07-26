import closeImg from '../img/icn_hide@3x.png';
import wechart from '../img/icn_wechat@3x.png';

/*
1、判断页面有没有盒子，有？追加生成的元素，无？创建元素追加
2、追加元素前先生成所需要的元素
3、格式化接口请求过来的数据：如接口请求回来无需显示浮窗，则不向下加载
4、元素追加后，绑定点击事件，分别对点击点击事件处理
5、元素的拖拽，当元素在右边悬浮时，点击浮窗，需要从左边出来
6、全局的点击事件，浮窗打开状态，点击其它位置，浮窗缩回悬浮 ：
  考虑到Js是添加在别的游戏界面，如果添加全局点击事件，有可能会与当前界面的持有者方法事情 冲突，
  为了避免这个问题，不显示全局事情 ，使用浮球无展开状态时，倒计时3秒无操作，则缩回半浮窗状态
7、悬浮列表接口请求回来统一处理，只能是跳转到其它地址，无其它交互 
8、拖拽兼容了移动与pc，但移动端的拖拽会稍复杂，有橡皮劲的
*/

class Init {
  constructor(data) {
    this.data = data;
    this.logMap = {
      open: 1, //展开
      hide: 2, //隐藏
      delete: 3, //删除
      erpv: 4, //二维码展开
      target: 5 //跳转的按钮
    };
    this.searchWidth = window.screen.availWidth;
    this.searchHeight = window.screen.availHeight;
    this.clickHandler = null;
    this.timer = null;
  }

  render() {
    //创建html
    this.createHtml();
    // 绑定事件
    this.bindEvent();
  }

  createFlotation(isEvent = false) {
    const data = this.data;
    //创建弹窗
    var floatEle = $(`<div class="fixed-section-block"><div class="fixed-content-box" flex="main:center cross:center">
      <div class="fixed-bg-box">
        <div class="wechart-erweima-sec">
          <h3 class="bg-title">关注公众号更多精彩游戏</h3>
          <div class="bg-erweima">
            <img
              src="${data.qr_img || ''}"
              onerror="this.style.opacity = 0;" onload="this.style.opacity = 1;" style="opacity: 0;"
            />
          </div>
          <p class="bg-dicr">微信公众号.in游戏竞技场</p>
          <div class="bg-tip">${
            this.isWeiXin ? '微信扫一扫' : '长按识别二维码'
          }</div>
        </div>
        <div id="button-group-box"></div>
        <div class="close-button"></div>
      </div>
    </div></div>`);
    return floatEle;
  }

  createButton() {
    const buttonEle = $(`<div class="button-group" id="button-group">
          仍要退出
        </div>`);

    buttonEle.appendTo($('#button-group-box'));
  }

  //判断是否是微信浏览器的函数
  isWeiXin() {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true;
    } else {
      return false;
    }
  }

  createHtml() {
    const data = this.data;
    const leng = (data.button || []).length;
    const list = (data.button || []).map((v, idx) => {
      if (+v.is_active !== 1) {
        return '';
      }
      if (idx == 0) {
        return `<li class="hide-floating">
                <img src="https://xcx.api.test.1hocang.com/static/img/icn_hide@3x.png" onerror="this.style.opacity = 0;" onload="this.style.opacity = 1;" style="opacity: 0;"/>
                <span>隐藏</span>
              </li>`;
      } else if (idx == leng - 1) {
        return `<li class="wechart">
                <img src="https://xcx.api.test.1hocang.com/static/img/icn_wechat@3x.png" onerror="this.style.opacity = 0;" onload="this.style.opacity = 1;" style="opacity: 0;" />
                <span>微信公众号</span>
              </li>`;
      } else {
        return `<li class="target">
                <a href="${v.url || ''}">
                  <img src="${v.img ||
                    ''}" onerror="this.style.opacity = 0;" onload="this.style.opacity = 1;" style="opacity: 0;"/>
                  <span>${(v.title || '').substr(0, 4)}</span>
                </a>
              </li>`;
      }
    });
    //正常样式 <ul flex="main:left cross:center">
    // <div id="floating-container" class="floating-container flex-dir-right">
    //反转样式 <ul class="flex-dir-right" flex="cross:center">
    let container = $(`
       <div id="floating-container" class="floating-container">
        <div class="content-box">
          <div class="button-icon-box">
            <img src="${
              data.open_img
            }" onerror="this.style.opacity = 0;" onload="this.style.opacity = 1;" style="opacity: 0;"/>
          </div>
          <div class="list-box">
            <ul flex="main:left cross:center box:last">
            ${list.join('')}
            </ul>
          </div>
        </div>
      </div>
    `);
    container.appendTo($('body'));
    this.createFlotation().appendTo($('body'));
  }
  toggleListbox() {
    const container = $('#floating-container');
    const listBox = $('.list-box');
    let floatIcon = $('.button-icon-box');
    // 如果浮球在右边显示要修正一下位置
    if (container.hasClass('flex-dir-right')) {
      if (listBox.hasClass('hidden')) {
        //如果展开状态，那么隐藏，并修正小球位置
        listBox.removeClass('hidden');
        container.css({
          left: this.searchWidth
        });
      } else {
        //展开并修正位置
        listBox.addClass('hidden');
        floatIcon.css({
          left: 'calc(100% - 50px)'
        });
        container.css({
          left: this.searchWidth - listBox.outerWidth()
        });
      }
    } else {
      listBox.toggleClass('hidden');
      container.css({
        left: 0
      });
    }
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
  adLog(params = {}, eventType = 'action') {
    switch (eventType) {
      case 'click':
        $.post('https://h5game.api.crotnet.com/loating/api/cilck', params);
        break;
      case 'action':
        $.post('https://h5game.api.crotnet.com/loating/api/action', params);
        break;
    }
  }
  hideFloating() {
    let container = $('#floating-container');
    let listBox = $('.list-box');
    if (!listBox.hasClass('hidden')) {
      clearTimeout(this.timer);
      const isLeft = container.hasClass('flex-dir-right');
      const left = this.searchWidth - 25 + 'px';
      this.timer = setTimeout(() => {
        container.css({
          left: !isLeft ? '-25px' : left,
          opacity: 0.5
        });
      }, 3000);
    }
  }
  correctPosition(payload = {}) {
    let container = $('#floating-container');
    let floatIcon = $('.button-icon-box');
    let listBox = $('.list-box');
    let center = $(window).width() / 2;
    let boxW = floatIcon.width();
    let { x, y } = payload;
    if (listBox.hasClass('hidden')) {
      boxW = listBox.outerWidth();
    }
    let divCenter = boxW / 2;
    // const { x, center, divCenter } = payload;
    if (center >= x + divCenter) {
      x = 0;
    } else {
      // console.log('宽度', $(window).width(), container.width());
      // (boxW > 50 ? boxW : 0)
      x = this.searchWidth - (boxW > 50 ? boxW : 50);
      container.addClass('flex-dir-right');
    }
    if (y < 0) {
      y = 0;
    } else if (y > this.searchHeight) {
      y = this.searchHeight - 50;
    }
    container.css({
      left: x + 'px',
      top: y + 'px'
    });
  }
  bindEvent() {
    let container = $('#floating-container');
    let blankFloating = $('.fixed-section-block');
    let floatIcon = $('.button-icon-box');
    let listBox = $('.list-box');
    let eventName = this.isMobile() ? 'touchend' : 'click';
    // 弹窗添加事件
    blankFloating.on(eventName, ev => {
      if ($(ev.target).hasClass('close-button')) {
        blankFloating.removeClass('show-floating');
      } else if ($(ev.target).hasClass('button-group')) {
        blankFloating.removeClass('show-floating');
        //仍要退出去哪里？
        window.location.href = '';
      }
    });
    // 页面返回事件弹窗比正常的多一个按钮，直接写在弹窗事件里添加rpqm
    // this.createButton();
    let domRect = container[0].getBoundingClientRect();
    let oriPos = container.offset();
    let y = 0;
    let x = 0;
    let distenceX = '';
    let distenceY = '';
    let isMover = false;
    container.Tdrag({
      scope: '',
      // animation_options: {
      //   duration: 200, //每次动画的事件
      //   easing: 'ease-in' //动画特效 ease-out、ease-in、linear
      // },
      cbStart: ev => {
        domRect = container[0].getBoundingClientRect();
        let curPos = container.offset();
        let touchX = ev.clientX || ev.originalEvent.changedTouches[0].clientX;
        let touchY = ev.clientY || ev.originalEvent.changedTouches[0].clientY;
        distenceX = touchX - curPos.left;
        distenceY = touchY - curPos.top;
        container.css('opacity', 1);
      },
      cbMove: (obj, self, ev) => {
        if (!ev.cancelable) {
          return;
        }
        clearTimeout(this.timer);
        isMover = true;
        let touchX = ev.clientX || ev.originalEvent.changedTouches[0].clientX;
        let touchY = ev.clientY || ev.originalEvent.changedTouches[0].clientY;
        x = touchX - distenceX;
        y = touchY - distenceY;
        let boxW = floatIcon.outerWidth();
        if (listBox.hasClass('hidden')) {
          boxW = listBox.outerWidth();
        }
        const moveRect = container[0].getBoundingClientRect();
        if (moveRect.left + boxW / 2 < this.searchWidth / 2) {
          container.removeClass('flex-dir-right');
          floatIcon.css({
            left: 0
          });
        } else {
          container.addClass('flex-dir-right');
          if (listBox.hasClass('hidden')) {
            floatIcon.css({
              left: 'calc(100% - 50px)'
            });
          } else {
            floatIcon.css({
              left: '100%'
            });
          }
        }
      },
      cbEnd: ev => {
        // 1、拖拽结束后修正拖出窗口的问题
        // 2、根据抬起后停留的位置，计算悬浮位置
        // 根据开始拖拽的位置与结束后的位置对比，看是否执行点击事件
        let endRevt = container[0].getBoundingClientRect();

        const mx = parseInt(endRevt.left) - parseInt(domRect.left);
        const my = parseInt(endRevt.top) - parseInt(domRect.top);

        if (!isMover || (Math.abs(mx) <= 15 && Math.abs(my) <= 15)) {
          if ($(ev.target).hasClass('button-icon-box')) {
            //浮球与隐藏做的事情
            ev.preventDefault();
            ev.stopPropagation();
            if (!isMover) {
              this.toggleListbox();
              this.adLog(
                {
                  float_id: 7,
                  button_id: 5
                },
                'click'
              );
              this.adLog({
                float_id: 7,
                type: this.logMap['open']
              });
            }
          } else if ($(ev.target).hasClass('hide-floating')) {
            // 删除整个浮层与浮球
            container.remove();
            blankFloating.remove();
            this.adLog({
              float_id: 7,
              type: this.logMap['hide']
            });
          } else if ($(ev.target).hasClass('wechart')) {
            //微信公众号做的事情
            ev.preventDefault();
            ev.stopPropagation();
            blankFloating.addClass('show-floating');
            // listBox.removeClass('hidden');
            this.toggleListbox();
            // this.adLog({
            //   float_id: 7,
            //   type: this.logMap['erpv']
            // });
          } else {
            this.adLog({
              float_id: 7,
              type: this.logMap['target']
            });
            // 为了保证打点发出去，延迟跳转
            setTimeout(() => {
              // console.log('跳转', $(ev.target).href);
              window.location.href = $(ev.target).href;
              //其它menu跳转,无特殊处理
              // this.updateFloatStatus('toggleListbox');
            }, 50);
          }
          clearTimeout(this.timer);
        } else {
          // 修正拖拽结束后，浮球的位置
          this.correctPosition({ x, y });
        }

        isMover = false;
        // end后，如列表未展开，则倒计划隐藏一半，如展开或中途操作，则清除到计划
        this.hideFloating();
      }
    });

    $(document).on('click', ev => {
      let touchX = ev.clientX || ev.originalEvent.changedTouches[0].clientX;
      let touchY = ev.clientY || ev.originalEvent.changedTouches[0].clientY;
      ev.preventDefault();
      ev.stopPropagation();
      if (listBox.hasClass('hidden')) {
        let tempRect = container[0].getBoundingClientRect();
        const { top, right, bottom, left } = tempRect;
        // (touchX < left || touchX > right) &&
        // (touchY < top || touchY > bottom)
        if (
          !(touchX > left && touchX < right && touchY > top && touchY < bottom)
        ) {
          listBox.removeClass('hidden');
          if (container.hasClass('flex-dir-right')) {
            container.css({
              left: this.searchWidth
            });
          }
        }
      }
    });
  }
}

export default Init;
