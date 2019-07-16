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
          <div class="bg-tip">长按识别二维码</div>
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

  createHtml() {
    const data = this.data;
    const list = (data.button || []).map(v => {
      if (+v.is_active !== 1) {
        return '';
      }
      return `<li class="target">
              <a href="${v.url || ''}">
                <img src="${v.img ||
                  ''}" onerror="this.style.opacity = 0;" onload="this.style.opacity = 1;" style="opacity: 0;"/>
                <span>${(v.title || '').substr(0, 4)}</span>
              </a>
            </li>`;
    });
    //正常样式 <ul flex="main:left cross:center">
    // <div id="floating-container" class="floating-container flex-dir-right">
    //反转样式 <ul class="flex-dir-right" flex="cross:center">
    let container = $(`
       <div id="floating-container" class="floating-container">
        <div class="content-box">
          <div class="button-icon-box">
            <span></span>
          </div>
          <div class="list-box">
            <ul flex="main:left cross:center box:last">

              <li class="hide-floating">
                <img src="${data.open_img ||
                  ''}" onerror="this.style.opacity = 0;" onload="this.style.opacity = 1;" style="opacity: 0;"/>
                <span>隐藏</span>
              </li>
            ${list.join('')}
              <li class="wechart">
                <img src="./img/icn_wechat@3x(1).png" onerror="this.style.opacity = 0;" onload="this.style.opacity = 1;" style="opacity: 0;" />
                <span>微信公众号</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `);
    container.appendTo($('body'));
    this.createFlotation().appendTo($('body'));
  }
  updateFloatStatus(status) {
    const mapFun = {
      hideFloating: e => {
        $('.floating-container').remove();
        $('.fixed-section-block').remove();
      },
      toggleListbox: e => {
        $('.list-box').toggleClass('hidden');
      },
      showBlankFloating: e => {
        $('.fixed-section-block').addClass('show-floating');
        $('.list-box').removeClass('hidden');
      }
    };

    mapFun[status]();
  }
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
  adLog(params = {}, eventType = 'action') {
    switch (eventType) {
      case 'click':
        $.post('http://h5game.api.crotnet.com/loating/api/cilck', params);
        break;
      case 'action':
        $.post('http://h5game.api.crotnet.com/loating/api/action', params);
        break;
    }
  }
  bindEvent() {
    let container = $('#floating-container');
    let blankFloating = $('.fixed-section-block');
    let eventName = this.isMobile() ? 'touchend' : 'click';
    // 弹窗添加事件
    blankFloating.on(eventName, ev => {
      if ($(ev.target).hasClass('close-button')) {
        $('.fixed-section-block').removeClass('show-floating');
      } else if ($(ev.target).hasClass('button-group')) {
        $('.fixed-section-block').removeClass('show-floating');
        //仍要退出去哪里？
        window.location.href = '';
      }
    });
    // 页面返回事件弹窗比正常的多一个按钮，直接写在弹窗事件里添加rpqm
    // this.createButton();

    let domRect = container[0].getBoundingClientRect();
    let moveRevt = container[0].getBoundingClientRect();
    let isFacing = false;
    let oriPos = container.offset();
    let y = 0;
    let x = 0;
    let distenceX = '';
    let distenceY = '';
    let timer = null;
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
      },
      cbMove: (obj, self, ev) => {
        if (!ev.cancelable) {
          return;
        }
        // moveRevt = container[0].getBoundingClientRect();

        // const mx = parseInt(moveRevt.left) - parseInt(domRect.left);
        // const my = parseInt(moveRevt.top) - parseInt(domRect.top);
        // console.log(mx, my);
        // if (Math.abs(mx) <= 5 && Math.abs(my) <= 5) {
        //   return;
        // }

        let touchX = ev.clientX || ev.originalEvent.changedTouches[0].clientX;
        let touchY = ev.clientY || ev.originalEvent.changedTouches[0].clientY;
        x = touchX - distenceX;
        y = touchY - distenceY;
        let boxW = 0;
        // console.log('22222222222222', x, y);
        if ($('.list-box').hasClass('hidden')) {
          boxW = $('.list-box').width() + $('.button-icon-box').width();
        } else {
          boxW = $('.button-icon-box').width();
        }
        if (x < 0) {
          container.removeClass('flex-dir-right');
          x = 0;
        } else if (x > $(document).width() - boxW) {
          container.addClass('flex-dir-right');
          x = $(document).width() - boxW;
        }
        if (y < 0) {
          y = 0;
        } else if (y > $(document).height() - $('.list-box').height()) {
          y = $(document).height() - $('.list-box').height();
        }

        container.css({
          left: x + 'px',
          top: y + 'px'
        });
        clearTimeout(timer);
      },
      cbEnd: ev => {
        // 1、拖拽结束后修正拖出窗口的问题
        // 2、根据抬起后停留的位置，计算悬浮位置
        // 根据开始拖拽的位置与结束后的位置对比，看是否执行点击事件
        let curPos = container.offset();
        moveRevt = container[0].getBoundingClientRect();
        let touchY = ev.clientY || ev.originalEvent.changedTouches[0].clientY;
        let absX = Math.abs(oriPos.left - curPos.left);
        let absY = Math.abs(oriPos.top - curPos.top);

        const mx = parseInt(moveRevt.left) - parseInt(domRect.left);
        const my = parseInt(moveRevt.top) - parseInt(domRect.top);

        let dir = 'left';
        let center = $(window).width() / 2;
        let boxW = 0;
        // console.log('22222222222222', x, y);
        if ($('.list-box').hasClass('hidden')) {
          boxW = $('.list-box').width() + $('.button-icon-box').width();
        } else {
          boxW = $('.button-icon-box').width();
        }
        let divCenter = boxW / 2;
        console.log(
          'hahah',
          $('.button-icon-box').width(),
          $('.list-box').width(),
          ($('.list-box').width() + $('.button-icon-box').width()) / 2,
          $(window).width()
        );
        // ( + )/2;
        // let divCenter = 25;
        if (center > x + divCenter) {
          x = 0;
          dir = 'left';
        } else {
          // console.log('宽度', $(window).width(), container.width());
          x = $(window).width() - boxW;
          dir = 'right';
        }
        // console.log('111111', mx, my);
        if (Math.abs(mx) <= 5 && Math.abs(my) <= 5) {
          let isHide = $('.list-box').hasClass('hidden');
          if ($(ev.target).hasClass('button-icon-box')) {
            //浮球与隐藏做的事情
            ev.preventDefault();
            ev.stopPropagation();
            this.updateFloatStatus('toggleListbox');
            this.isFacing = !this.isFacing;
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
          } else if ($(ev.target).hasClass('hide-floating')) {
            // 删除整个浮层与浮球
            this.updateFloatStatus('hideFloating');
            this.adLog({
              float_id: 7,
              type: this.logMap['hide']
            });
          } else if ($(ev.target).hasClass('wechart')) {
            //微信公众号做的事情
            ev.preventDefault();
            ev.stopPropagation();
            this.updateFloatStatus('showBlankFloating');
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

          y = touchY - distenceY;
          console.log('isHide', isHide);
          if (isHide) {
            let limitX = dir == 'left' ? 0 : $(window).width() - 50;
            console.log('limit', limitX);
            container.css({
              left: limitX + 'px',
              top: y + 'px'
            });
          } else {
            container.css({
              left: x + 'px',
              top: y + 'px'
            });
          }

          // console.log('相等曲', container.css('left'));
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (dir == 'left') {
              if ($('.list-box').hasClass('hidden')) {
                container.css({
                  left: '0px'
                });
              } else {
                container.css({
                  left: '-25px'
                });
              }
            } else {
              if ($('.list-box').hasClass('hidden')) {
                container.css({
                  left: $(window).width() - divCenter + 'px'
                });
              } else {
                container.css({
                  left: $(window).width() - 25 + 'px'
                });
              }
            }
            isFacing = true;
            clearTimeout(timer);
          }, 3000);
          //list-box不显示的时候，开始到计时3秒以后，根据当前的位置来隐藏一半自己
        } else {
          container.css({
            left: x + 'px',
            top: y + 'px'
          });
          // console.log('相等曲', container.css('left'));
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (dir == 'left') {
              if ($('.list-box').hasClass('hidden')) {
                container.css({
                  left: '0px'
                });
              } else {
                container.css({
                  left: '-25px'
                });
              }
            } else {
              if ($('.list-box').hasClass('hidden')) {
                container.css({
                  left: $(window).width() - boxW + 'px'
                });
              } else {
                container.css({
                  left: $(window).width() - divCenter + 'px'
                });
              }
            }
            isFacing = true;
            clearTimeout(timer);
          }, 3000);
        }
      }
    });
  }
}

export default Init;
