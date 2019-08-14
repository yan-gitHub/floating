import './style.css';
import './img';
import * as UTIL from './base/util';

// 暴漏全部的jqery
// require('expose-loader?$!jquery');
import $ from 'jquery';
window.$ = $;
window.jquery = $;
const baseUrl = 'https://h5game.api.crotnet.com';

require('./base/drag');
import Init from './base/init';
import Design from './base/design';

$(() => {
  let direction = UTIL.isStand();
  const getDatasource = async () => {
    const result = await $.post(
      `${baseUrl}/loating/api/show`,
      {
        float_id: 7
      },
      'json'
    );
    let data = result.data;
    try {
      data = JSON.parse(data);
    } catch (error) {}
    if (+data.is_active === 1) {
      data = {
        ...data,
        direction
      };
      new Init(data);
    }
  };

  const getAdData = async () => {
    // const data = await $.post(`${baseUrl}/loating/api/ad_show`, {}, 'json');
    const data = [
      {
        id: 1,
        float_id: 0,
        title: '测试广告1',
        vertical_img:
          'http://ingame.oss-cn-hangzhou.aliyuncs.com/ingame/center/2019-08-06/a4f41532ec9951a5d042f8860dcc95.jpg',
        orizontal_img:
          'http://ingame.oss-cn-hangzhou.aliyuncs.com/ingame/center/2019-08-06/a4f41532ec9951a5d042f8860dcc95.jpg',
        url: 'http://h5game.mgr.crotnet.com/admin.php/game/floatad/add.html',
        online_time: '2019-08-06 00:00:00',
        offline_time: '2019-08-07 00:00:00',
        is_active: 1,
        sort: 0,
        create_time: '2019-08-06 09:55:14',
        update_time: '2019-08-06 09:55:14'
      }
    ];
    data[0] = {
      ...data[0],
      direction
    };
    new Design(data);
  };

  function addToClassHandler() {
    let body = $('body');
    body.removeClass('skin-body-portrait-block');
    body.removeClass('skin-body-landscape-block');
    direction = UTIL.isStand();
    body.addClass(`skin-body-${direction}-block`);
  }
  addToClassHandler();

  // 浮窗
  getDatasource();

  // 广告
  getAdData();

  let resizeTimer = null;
  $(window).resize(function() {
    resizeTimer = clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      addToClassHandler();
    }, 50);
  });
});
