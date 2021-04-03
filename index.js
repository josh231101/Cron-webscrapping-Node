const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");
const axios = require('axios').default;
const cheerio = require('cheerio');
const cron = require('node-cron');
const {BreakingNew } = require('./models');
mongoose.connect(MONGO_URI,{useNewUrlParser : true});

// SCHEDULE FUNCTION PARAMS
/**
 * Cron expression -> TIME OR PERIOD WHEN THE CALLBACK WILL BE FIRED
 * CALLBACK -> Function that gets fired
 * IN this example * * * * * indicates every minute
 */
cron.schedule("* * * * *", async() => {
    console.log("CRON activated");
    const html = await axios.get("https://cnnespanol.cnn.com/");
    const $ = cheerio.load(html.data);
    const titles = $(".news__title");
    const breakingNews = []
    titles.each((_,element) => {
        breakingNews.push({
            title : $(element).text().toString().trim(),
            link : $(element).children().attr("href")
        })

    });
    BreakingNew.create(breakingNews);
    console.log("saved");
})


