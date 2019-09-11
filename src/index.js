import './style.css';
import './img';
// import './base/orientationchange-fix';
import * as UTIL from './base/util';
import { baseUrl } from './config';

// 暴漏全部的jqery
// require('expose-loader?$!jquery');
import $ from 'jquery';
window.$ = $;
window.jquery = $;

require('./base/drag');
import Init from './base/init';
import Design from './base/design';

const urlParams = UTIL.queryToJson(window.location.href);
$(() => {
  let direction = UTIL.isStand();
  const getDatasource = async () => {
    const result = await $.post(
      `${baseUrl}/loating/api/show`,
      {
        game_id: urlParams[game_id] || '',
        channer_id: urlParams[channer_id] || ''
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
    // 测试
    // new Init(data);
  };

  const getAdData = async () => {
    let data = (await $.post(`${baseUrl}/loating/api/ad_show`, {}, 'json'))
      .data;
    data[0]['direction'] = direction;
    new Design(data);
  };

  function addToClassHandler() {
    let body = $('body');
    body.removeClass('skin-body-portrait-block');
    body.removeClass('skin-body-landscape-block');
    direction = UTIL.isStand();
    body.addClass(`skin-body-${direction}-block`);
  }
  // addToClassHandler();

  // 浮窗
  getDatasource();

  // 广告
  getAdData();

  // let resizeTimer = null;
  // $(window).resize(function() {
  //   resizeTimer = clearTimeout(resizeTimer);
  //   resizeTimer = setTimeout(() => {
  //     addToClassHandler();
  //   }, 50);
  // });
});
