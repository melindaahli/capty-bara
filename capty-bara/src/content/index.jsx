console.log('Capty-Bara content script loaded!')


// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import CaptionPanel from './components/CaptionPanel'

// function mount() {
//   // Wait for YouTube's player to exist
//   const player = document.querySelector('#movie_player')
//     || document.querySelector('.html5-video-player')
//   if (!player) {
//     setTimeout(mount, 500)
//     return
//   }

//   // Don't mount twice
//   if (document.getElementById('capty-bara-root')) return

//   // Hide YouTube's native captions
//   const style = document.createElement('style')
//   style.textContent = '.ytp-caption-window-container { display: none !important; }'
//   document.head.appendChild(style)

//   // Create our panel
//   const container = document.createElement('div')
//   container.id = 'capty-bara-root'
//   container.style.cssText = 'width:100%; background:#0f0f0f; position:relative; z-index:9999;'
//   player.parentNode.insertAfter(container, player)

//   createRoot(container).render(<CaptionPanel />)
// }

// // YouTube is a SPA — wait for navigation
// const observer = new MutationObserver(mount)
// observer.observe(document.body, { childList: true, subtree: true })
// mount()

// Create the new div
// const myDiv = document.createElement('div');
// myDiv.id = 'my-custom-youtube-div';
// myDiv.innerHTML = '<h3>Hello from my Extension!</h3><p>This is a custom overlay.</p>';

// // Append the div to the body of the YouTube page
// document.body.appendChild(myDiv);


// Create the new div
const myDiv = document.createElement('div');
myDiv.id = 'my-custom-youtube-div';
myDiv.innerHTML = '<h3>Hello from my Extension!</h3><p>This is a custom overlay.</p>';

// Append the div to the body of the YouTube page
document.body.appendChild(myDiv);
(function testInjection() {
    const targetSelector = '#above-the-fold'; // Change this to your target ID
    let checkCount = 0;

    const interval = setInterval(() => {
        const target = document.querySelector(targetSelector);
        checkCount++;

        if (target) {
            clearInterval(interval);
            // Create the test div
            const testDiv = document.createElement('div');
            testDiv.id = 'dev-test-div';
            testDiv.style.cssText = 'background: #ff4500; color: white; padding: 15px; font-weight: bold; margin: 10px 0; border-radius: 8px;';
            testDiv.innerText = '🔥 DevTools Injection Successful!';

            // Inject it at the top of the target element
            target.insertAdjacentElement('afterbegin', testDiv);
            console.log('Success: Div injected after ' + checkCount + ' attempts.');
        } else if (checkCount > 10) {
            clearInterval(interval);
            console.error('Error: Target element not found after 5 seconds.');
        }
    }, 500);
})();