const {format} = require('timeago.js');

const helpers = {};

helpers.timeago = (timestamp) => {

    return format(timestamp);

};

helpers.searchRouteImgRoute = (imgRoute) =>{

    return  '/img/promotionsImages/'+imgRoute;

};

module.exports = helpers;