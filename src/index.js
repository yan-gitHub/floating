import './style.css';
// 暴漏全部的jqery
// require('expose-loader?$!jquery');
import $ from 'jquery';
window.$ = $;
window.jquery = $;

require('./base/drag');
import Init from './base/init';

$(() => {
  const getDatasource = async () => {
    const result = await $.post(
      'http://h5game.api.crotnet.com/loating/api/show',
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
      let point = new Init(data);
      point.render(data);
    }
  };

  window.addEventListener(
    'popstate',
    function(e) {
      alert('我监听到了浏览器的返回按钮事件啦');
    },
    false
  );

  getDatasource();
});
