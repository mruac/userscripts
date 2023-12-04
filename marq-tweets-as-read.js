// ==UserScript==
// @name         Mark tweets as read on scroll
// @namespace    Github.com
// @version      0.1
// @description  Mark tweets in feeds as read as they disappear off the top of screen. Does not apply to single tweet pages.
// @author       You
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @run-at document-idle
// @grant        none
// ==/UserScript==

//CONFIGS - Change here as UI changes.
const feed = `[aria-label]`; //container that holds all the tweets
const tweetSelector = `[data-testid="tweet"]`; //an individual tweet
const marqer = ".btn-marq"; //markers extension "mark as read" button
const marqed = ".marqed"; //markers extension "read tweet" indicator (should be in parent of tweetSelector)
const roots = [
    //apply this script only to these regex paths (recommended to set to stream of tweets)
    //note "home" can have different tabs such as "For you", "Following" and other pinned lists.
    "home",
    "i/lists/.*",
    "search?.*(|&)q=.*(|&).*",
    "i/bookmarks",
    "i/communities/.*",
    "i/topics/.*"
];

//LET THE CODE BEGIN
(function () {
    'use strict';

    const root_paths = roots.map((path) => {
        return new RegExp(`http(|s)://(www\.|)twitter.com/${path}`, "i");
    });

    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    window.addEventListener("resize", () => {
        viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    });

    //hook into mutation observer and match and hook into the .btn-marq class, running .click() if it scrolls off the top of the screen.
    const newtweetsadded = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes) {
                if (node.querySelector(tweetSelector)) {
                    diditgoofftopofscreen.observe(node);
                    console.debug(`🎣 new tweet added: ${node.querySelector("[href*='status']").href}`);
                }
            }
        }
    });

    const diditgoofftopofscreen = new window.IntersectionObserver(([tweet]) => {
        if (tweet.boundingClientRect.bottom < (viewportHeight / 2)) {
            if (tweet.target.querySelector(marqer)) {
                marq_read(tweet.target.querySelector(marqer));
                console.debug(`👋 off top of screen: ${tweet.target.querySelector("[href*='status']").href}`);
            }
        }
    }, {
        root: null,
        threshold: 0
    })

    window.addEventListener("load", () => {
        if (!test_root(window.location.href)) {
            console.debug(`❌ not a feed: ${window.location.href}`);
            return;
        } //if loaded on non-feed page, exit.

        console.debug("page is fully loaded. Waiting a bit for page to load tweetSelector.");
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

    function init() {
        // listeners = loadListeners();
        waitForElementToExist(tweetSelector).then(() => {
            newtweetsadded.observe(document.querySelector(tweetSelector).closest(feed), { childList: true, subtree: true });
            //apply to all loaded tweets above the screen, now
            document.querySelectorAll(tweetSelector).forEach((tweet) => {
                diditgoofftopofscreen.observe(tweet);
                console.debug(`🎣 hooked diditgoofftopofscreen to: ${tweet.querySelector("[href*='status']").href}`);
            });
            console.debug("observing for added tweets in feed");
        });

    }

    function disconnect() {
        diditgoofftopofscreen.disconnect();
        newtweetsadded.disconnect();
        console.debug("listeners disconnected successfully");
    }

    function test_root(str) {
        return root_paths.some((regex) => { return regex.test(str) });
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

    function marq_read(marker, now = false) {
        if (ismarked(marker)) {
            console.debug(`🔥 already marked: ${marker.closest(tweetSelector).querySelector("[href*='status']").href}`)
            return;
        }
        if (now) {
            click(marker);
        } else {
            setTimeout(() => {
                click(marker)
            }, 250);
        }
        return;

        function click(node) {
            node.click();
            console.debug(`💀 marked read: ${node.closest(tweetSelector).querySelector("[href*='status']").href}`)
        }
    }

    function ismarked(marker) {
        if (marker.closest(marqed)) {
            return true;
        } else {
            return false;
        }
    }

})();

