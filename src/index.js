import exspress from 'express';

import fetch from 'isomorphic-fetch';
import prom from "bluebird";
import path from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import favicon from 'serve-favicon';
import _ from 'lodash';
import mongoose from 'mongoose';
const users = require('./users');
const app = exspress();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

mongoose.Promise = global.Promise;
app.get('/', async function(req, res, next){
    try {
        let colorquiry = req.query.color;
        const nos = nospace(colorquiry)
        if(nos.indexOf('rgb') == 0){
           const rgb =  getHexRGBColor(nos)
            if(rgb.length > 6){
                return res.send('Invalid color')
            }
            return res.send('#' + rgb)
        }
        const regexp = new RegExp('([A-Z])', 'g')
        const sern = colorquiry.match(regexp);
        if (sern) {
            const lowcolorquiry = colorquiry.toLowerCase()
            return res.send('#' + lowcolorquiry)
        }

        if (colorquiry.indexOf('#') == 0){
            console.log('sdds')
            colorquiry = colorquiry.slice(1);
            console.log(colorquiry)

        }

        if (colorquiry.length == 3) {
            try {
                const arrcolorquiry = ([
                    ...colorquiry
                ])
                const bigquery = arrcolorquiry.map((o) => {
                    console.log(o)
                    const test = o + o
                    return test
                })
                const StringBigquery = bigquery[0] + bigquery[1] + bigquery[2]
                console.log(StringBigquery);
                if (isHexaColor(StringBigquery)) {
                    return res.send('#' + StringBigquery)
                } else {
                    return res.send('Invalid color')
                }
            } catch (err) {
                console.log(err)
            }
        }
        const pop = colorquiry.trim();

        if (isHexaColor(pop) && isColor(pop)) {
            return res.send('#' + pop)
        } else {
            return res.send('Invalid color')
        }

    } catch(err){
        return res.send('Invalid color')
    }
});

app.use('/users', users);

function isHexaColor(sNum){
    return (typeof sNum === "string") && sNum.length >= 6
        && ! isNaN( parseInt(sNum, 16) );
}

function isColor(sNum){
    const resex = new RegExp('(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)', 'i')
    const sern = sNum.match(resex)
    return sern
}

function getHexRGBColor(color) {
    color = color.replace(/\s/g,"");
    var aRGB = color.match(/^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i);
    if(aRGB) {
        color = '';
        for (var i=1;  i<=3; i++) color += Math.round((aRGB[i][aRGB[i].length-1]=="%"?2.55:1)*parseInt(aRGB[i])).toString(16).replace(/^(.)$/,'0$1');
        10
    }
else color = color.replace(/^#?([\da-f])([\da-f])([\da-f])$/i, '$1$1$2$2$3$3');
    return color;

}
function nospace(str) {
    var VRegExp = new RegExp(/^(\s|\u00A0)+/g);
    var VResult = str.replace(VRegExp, '');
    return VResult

}



app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(err)
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('Error')
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});