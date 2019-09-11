import './style.css';
import './img';
// import './base/orientationchange-fix';
import * as UTIL from './base/util';
import { baseUrl, adBaseUrl } from './config';

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
  // const getDatasource = async () => {
  //   const result =
  //     (await $.post(
  //       `${baseUrl}/loating/api/show`,
  //       {
  //         game_id: urlParams['game_id'] || '',
  //         channel_id: urlParams['channel_id'] || ''
  //       },
  //       'json'
  //     )) || {};
  const getDatasource = async () => {
    $.post(
      `${baseUrl}/loating/api/show`,
      {
        game_id: urlParams['game_id'] || '',
        channel_id: urlParams['channel_id'] || ''
      },
      'json'
    ).then(res => {
      if (res.code !== 200) {
        // UTIL.toastr(res.message);
        return;
      }

      let data = res.data;
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
    });
  };

  const getAdData = async () => {
    // let data =
    //   (await $.post(`${baseUrl}/loating/api/ad_show`, {}, 'json')).data || [];
    $.post(`${baseUrl}/loating/api/ad_show`, {}, 'json').then(res => {
      console.log(res);
      if (res.code !== 200) {
        // UTIL.toastr(res.message);
        return;
      }
      const data = res.data || [];
      if (data.length) {
        data[0]['direction'] = direction;
        new Design(data);
      }
    });
  };

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
