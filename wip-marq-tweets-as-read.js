// ==UserScript==
// @name         Mark tweets as read on scroll with markers.app
// @description  Uses delayed sync in case markers.app is offline.
// @version      0.1
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @run-at document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect markers.app
// ==/UserScript==
/*

FIXME:
- 

TODO:
- become its own markers.app by checking if the tweet is read and 
- collect read tweets into a list
- send read tweets to markers endpoint periodically, or when a limit is set, whichever is first.
    - if sent early, skip the next 
- send the list of read tweets upon tab closed
    window.addEventListener("beforeunload", function(e){
   {
    "state": 1,
    "url": [
        "/waitbutwhy/status/1627991876413321219",
        "/waitbutwhy/status/1717226176966435262",
        "/gunsnrosesgirl3/status/1713157103714546118"
    ]
    }
    });
*/

//CONFIGS - Change here as UI changes.
const bearer_token = '';
const feed = '[aria-label]'; //container that holds all the tweets
const tweetSelector = '[data-testid="tweet"]'; //an individual tweet
const marqer = '.btn-marq'; //markers extension 'mark as read' button
const marqed = 'marqed'; //markers extension 'read tweet' indicator (should be in parent of tweetSelector)
const roots = [
    //apply this script only to these regex paths (recommended to set to stream of tweets)
    //note 'home' can have different tabs such as 'For you', 'Following' and other pinned lists.
    'home',
    'i/lists/.*',
    'search?.*(|&)q=.*(|&).*',
    'i/bookmarks',
    'i/communities/.*',
    'i/topics/.*'
];
var timer = null;

var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

//initialise for the script

const urls = {
    read: GM_getValue('read_urls', {})
};

if (Object.keys(urls.sent).length > 0){urls.sent = {};}

window.addEventListener('beforeunload',()=>{
     GM_setValue('read_urls', urls.read);
  });

const newtweetsadded = new MutationObserver(([mutation]) => {
    for (const node of mutation.addedNodes) {
        if (node.querySelector(tweetSelector)) {
            const node = node.closest('[data-testid="cellInnerDiv"]');
            let nodeIndex = Array.prototype.indexOf.call(node.parentElement.children, node);
            console.debug(`🎣 new tweet added at index ${nodeIndex}: ${node.querySelector('[href*="status"]').href}`);
            //check if tweet is read
            checkRead(node);
            //attach diditgoofftopofscreen to tweet
            diditgoofftopofscreen.observe(node);
        }
    }
});

//diditgoofftopofscreen.observe(document.querySelectorAll(tweetSelector))
const diditgoofftopofscreen = new IntersectionObserver(([tweet]) => {
    if (tweet.boundingClientRect.bottom < (viewportHeight / 2)) {
        if (tweet.target.querySelector(marqer)) {
            console.debug(`👋 off top of screen: ${tweet.target.querySelector('[href*="status"]').href}`);
            marq_read(tweet.target.querySelector(marqer));
        }
    }
});

//tweet = tweetSelector element
//check tweet is in localstorage. If yes, CSS mark as read.
//markers.app should do the same on their side.
function checkRead(tweet) {
    const url = new URL(tweet.querySelector('[href*="status"]').href);
    if (
        urls.read[url.pathname] //if in userscript urls list
    ) {
        //if not marqed already by markers.app, CSS marq it.
        console.debug(`🔥🗒️ already marked: ${url.pathname}`);
        tweet.parentElement.classList.add(marqed);
    }
}

//LET THE CODE BEGIN
(function () {
    'use strict';

    window.addEventListener('resize', () => {
        viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    });

    window.addEventListener('load', () => {
        if (!test_root(window.location.href)) {
            console.debug(`❌ not a feed: ${window.location.href}`);
            return;
        } //if loaded on non-feed page, exit.

        console.debug('page is fully loaded. Waiting a bit for page to load tweetSelector.');
        waitForElementToExist(tweetSelector).then(() => {
            console.debug('✅ feed loaded. Hooking...');
            init();
        });
    });

    navigation.addEventListener('navigate', (e) => {
        if (test_root(e.destination.url)) {//user navs into a feed
            console.debug(`🏠 new root page: ${e.destination.url}`);
            disconnect();
            waitForElementToExist(tweetSelector).then(() => {
                console.debug('✅ feed loaded. Hooking...');
                setTimeout(() => { init(); }, 500);
            });
        } else {
            console.debug(`❌ not a feed: ${e.destination.url}`);
        }
    })

})();

function init() {
    //if last update was unsuccessful, don't move urls from queued to sent
    //if last update was successful, AND markers.app is running, queued_urls should be empty. if not, move them to sent_urls

    // listeners = loadListeners();
    waitForElementToExist(tweetSelector).then(() => {
        newtweetsadded.observe(document.querySelector(tweetSelector).closest(feed), { childList: true, subtree: true });
        //apply to all loaded tweets
        document.querySelectorAll(tweetSelector).forEach((tweet) => {
            diditgoofftopofscreen.observe(tweet);
            const url = new URL(tweet.querySelector('[href*="status"]').href);
            const node = tweet.closest('[data-testid="cellInnerDiv"]');
            let nodeIndex = Array.prototype.indexOf.call(node.parentElement.children, node);
            console.debug(`🎣 new tweet added at index ${nodeIndex}: ${url.href}`);

            checkRead(tweet);
        });
        console.debug('👁️ observing for added tweets in feed');
    });

}

function disconnect() {
    diditgoofftopofscreen.disconnect();
    newtweetsadded.disconnect();
    console.debug('listeners disconnected successfully');
}

function test_root(str) {
    return roots.map((path) => {
        return new RegExp(`http(|s)://(www\.|)twitter.com/${path}`, 'i');
    }).some((regex) => { return regex.test(str) });
}

function waitForElementToExist(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    });
}

function marq_read(marker) {
    const url = new URL(marker.closest(tweetSelector).querySelector('[href*="status"]').href);
    if (marker.closest('.marqed')) {
        console.debug(`🔥⏺️ already marked: ${url.href}`)
        return;
    }

    // replaced node.click(); with manual marqed class and save to urls.queued until successfully sent to markers.app.
    //when successfully sent to markers.app, purge urls.queued and move them to urls.sent
    //this is so the userscript can continue to check urls.sent until page reload and markers.app synchronises.

    urls.queued[url.pathname] = true;

    marker.closest("[data-testid='tweet']").parentElement.classList.add("marqed");

    console.debug(`⏱️ queued to be sent: ${url.href}`);

    clearTimeout(timer);
    timer = setTimeout(() => {
        const queued_urls_arr = Object.keys(urls.queued);
        if (queued_urls_arr.length > 0) {
            send_data(queued_urls_arr);
        }
    }, 5000);

    return;
}


function send_data(queued_urls_arr) {
    return GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://www.markers.app/api/users/826/push/markers/3933',
        headers: {
            'authorization': bearer_token,
            'content-type': 'application/json;charset=UTF-8'
        },
        data: JSON.stringify({ "state": 1, "url": queued_urls_arr }),
        onload: function (response) {
            // if (Math.floor(response.status) === 5 || Math.floor(response.status) === 4) {
            if (Math.floor(response.status / 100) === 5) {
                console.error('⛔ markers.app has a server error. urls kept for next attempt.', response);
                return;
            }

            console.debug(`📨 sent urls to markers.app`, queued_urls_arr, response);
            //move from queued_urls to sent_urls
            urls.queued = {};
            queued_urls_arr.forEach((v) => {
                urls.sent[v] = true;
            });
        },
        onerror: function (response) {
            console.error('⛔ markers.app has errored. urls kept for next attempt.', response);
        }
    });
}


