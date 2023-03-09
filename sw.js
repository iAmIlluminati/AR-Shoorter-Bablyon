
    const CACHE = "content-v21" // Name of the Current Cache
    const DOWNLOADS = "downloads"  // Name of the Downloads Cache - For BG Fetch API
    const OFFLINE = "/offline" // The Offline HTML Page
    
    const AVATARS = "avatars" // Name of the Image Network Cache
    
    
    const DEFAULT_AVATAR = "" // The Fallback image of the Image Network Cache

    
    const CDNS = "cdn-cache" // Name of the CDN Cache
    
    
    const AUTO_CACHE = [
        // The Necessary Files for the Service Worker to work
        OFFLINE,
        "/",
    ]
    
    const PRE_CACHE = [

        // The Assets to Pre-Cache
        "/assets/css/index.css",
        "/assets/css/menu.css",
        "/assets/css/game.css",
        "/assets/img/face1.png",
        "/assets/img/face2.png",
        "/assets/img/face3.png",
        "/assets/img/face4.png",
        "/assets/img/menu.png",
        "/assets/img/loader.png",
        "/assets/img/particle.png",
        "/assets/img/flare.png",
        "/assets/gui/play.png",
        "/assets/sounds/bgm.mp3",
        "/assets/sounds/bullet.mp3",
        "/assets/sounds/click.wav",
        "/assets/sounds/explode.wav",
        "/assets/font/8bit_wonder/8-BIT WONDER.TTF",
        "/assets/js/scene.js",
        "/assets/js/gui.js",
        "/assets/js/world.js",
        "/assets/js/sprite.js",
        "/assets/js/babylon/babylon.js",
        "/assets/js/babylon/babylon.gui.min.js",
        // The Pages to Pre-Cache 
        // "/menu.html",
        // "/game.html",
        
    ]

    let CACHE_ASSETS = [] // The Assets that will be cached in the Install Event
    
    
        
    CACHE_ASSETS = [...AUTO_CACHE, ...PRE_CACHE, ...DEFAULT_AVATAR]
        
        
    
    // The Install Event is fired when the Service Worker is first installed.
    // This is where we can set up things in the Service Worker that are required
    // The Pre-Cache is done at the install event.
    self.addEventListener("install", (event) => {
        event.waitUntil(
            caches
                .open(CACHE) // Opening the Cache
                .then((cache) => cache.addAll(CACHE_ASSETS)) // Adding the Listed Assets to the Cache
                .then(self.skipWaiting()) // The Service Worker takes control of the page immediately
        )
    })


    // The Activate Event is fired when the Service Worker is first installed.
    // This is where we can clean up old caches.
    self.addEventListener("activate", (event) => {
        event.waitUntil(
            caches
                .keys()
                .then((cacheNames) => {
                    // Remove caches that are not required anymore
                    // This filters the current cache, Image Network Cache and CDN Cache
                    return cacheNames.filter(
                        (cacheName) =>
                            CACHE !== cacheName &&
                            AVATARS !== cacheName &&
                            CDNS !== cacheName
                    )
                })
                .then((unusedCaches) => {
                    console.log("DESTROYING CACHE", unusedCaches.join(","))
                    return Promise.all(
                        unusedCaches.map((unusedCache) => {
                            return caches.delete(unusedCache)
                        })
                    )
                })
                .then(() => self.clients.claim()) // The Service Worker takes control of all pages immediately
        )
    })

    

    self.addEventListener("fetch", (event) => {
        // Requests to other domains and requests other than GET to this web app will always fetch from network
        if (
            !event.request.url.startsWith(self.location.origin) ||
            event.request.method !== "GET"
        ) {
            return void event.respondWith(
                fetch(event.request).catch((err) =>
                    console.log(err)
                ) 
            )
        }

        // Cache First Falling Back to Network Strategy for Local Assets
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    return response
                }
    
                return fetch(event.request)
                    .then(async (response) => {
                        let cache = await caches.open(CACHE)
                        cache.put(event.request, response.clone())
                        return response
                    })
                    .catch((_) => {
                        return caches.open(CACHE).then((cache) => {
                            const offlineRequest = new Request(OFFLINE)
                            return cache.match(offlineRequest)
                        })
                    })
            }) 
        )
        return
    })
    
    
    
    // ------------------------------------ Background Fetch API ---------------------------------------
    /* (*) Available Only on Chrome Browsers only after enabling the API from the command line */
    /* (*) Just try this for fun. Not to be used in production.... After all this is for fun 😏*/
    /* Steps to Setup Background Fetch
        1. Learn more about it from https://developer.chrome.com/blog/background-fetch/

       TLDR:
        1. After service worker is installed, background fetch can be used to download insanely large
            files
        2. When the user is still on the web app, you need to update the UI in the main script
        3. If the user leaves while or before the background fetch begins or is running 
            service worker events will help you manage UI and serve notifications
        4. Again Read the above link once more 
        5. This section will contain just the working boiler plate code to get background fetch 
            background events up and running. You need to change it according to your need.
    */


    // Your background fetch ran successfully
    // Now update the UI - The Browser's Native UI - You can update only once
    self.addEventListener("backgroundfetchsuccess", (event) => {
        const bgFetch = event.registration

        event.waitUntil(
            (async function () {
                // Create/open a cache.
                const cache = await caches.open(DOWNLOADS)
                // Get all the records.
                const records = await bgFetch.matchAll()
                // Copy each request/response across.
                const promises = records.map(async (record) => {
                    const response = await record.responseReady
                    await cache.put(record.request, response)
                })

                // Wait for the copying to complete.
                await Promise.all(promises)

                // Update the progress notification.
                event.updateUI({ title: "Download Complete 🥳🎉" })
            })()
        )
    })

    // One or more of the fetches failed.
    self.addEventListener("backgroundfetchfailure", (event) => {
        console.log(event)
        console.log("One or More of the Background Fetch failed...")
    })

    // Reacting to click by user on the native progress bar
    self.addEventListener("backgroundfetchclick", (event) => {
        const bgFetch = event.registration

        if (bgFetch.result === "success") {
            clients.openWindow("/successPage")
        } else {
            clients.openWindow("/otherPage-Still-Success")
        }
    })

    // ------------------------------------ ------------------------ -----------------------------------

    
    