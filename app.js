const express = require('express')
const axios = require('axios')
const cors = require('cors');
const shedule = require('node-schedule');
const { JSDOM } = require('jsdom');
const TelegramBot = require('node-telegram-bot-api');

const app = express()

app.use(
	cors()
);
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(
	`Server started on port ${PORT}`));

app.get('/',(req,res)=>{
    res.send("Ok")
})

const bot = new TelegramBot(process.env.TOKEN,{polling: true});


const fetchApp = async ()=>{
    const data = await axios.get('http://moed.gov.sy/moed-apps/download.php')
    const html = data.data

	const dom = new JSDOM(html);
	const document = dom.window.document;
    const version = document.querySelector('.version')
    return version.textContent
}



const sendToTelegram = async ()=>{
    const ver = await fetchApp()
    if(ver == 'النسخة 1.7' ){
        console.log("same")
    }else{
        bot.sendMessage('245853116', "🔴🔴🔴 إصدااار جدييد 🔴🔴🔴" , { parse_mode: 'HTML' })
        			.then(() => {
        				console.log('Message sent successfully');
        			})
        			.catch((error) => {
        				console.error(error);
        			});
    }
}



shedule.scheduleJob("* * * * *", function () {
    sendToTelegram()
    })