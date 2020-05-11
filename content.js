function checks() {
    if (location.hostname !== 'psd.bits-pilani.ac.in') {
        alert("Open PSD WEBSITE FIRST")
        return false
    }

    if (!location.pathname.includes('StudentStationPreference.aspx')) {
        alert('GOTO PAGE WHERE YOU WILL PREFERENCE FIRST')
        return false
    }

    if (window.__PSZYSET__ === true) {
        alert('REFRESH KARO PLEASE')
        return false
    }

    return true
}

function $(selector) {
    const elems = document.querySelectorAll(selector)
    return elems.length === 1 ? elems[0] : [...elems]
}

if (checks()) {

    const styles = `
        div#__PSZY_CONTROLS__ {
            display: flex;
            margin-top: 10px;
            justify-content: center;
            align-items: center;
        }
        div#__PSZY_CONTROLS__>div {
            margin-left: 10px;
            margin-right: 10px;
            font-size: 19px;
            background: #CC6BDB;
            color: white;
            padding: 10px;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            border-radius: 50%;
            align-items: center;
            cursor: pointer;
        }

        ul#sortable_nav>li:first-child div#__PSZY_CONTROLS__ #__PSZY_MOVEUP__ {
            display: none;
        }

        ul#sortable_nav>li:first-child div#__PSZY_CONTROLS__ #__PSZY_TOP__ {
            display: none;
        }

        ul#sortable_nav>li:last-child div#__PSZY_CONTROLS__ #__PSZY_MOVEDOWN__ {
            display: none;
        }

        ul#sortable_nav>li:last-child div#__PSZY_CONTROLS__ #__PSZY_BOTTOM__ {
            display: none;
        }

        div#__PSZY_CONTROLS__ div#__PSZY_SWAP__ {
            border-radius: 10px;
            width: auto;
        }

        @keyframes bg {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                opacity: 1;
            }
        }

        .glow {
            animation: bg 0.4s linear;
        }
    `

    const styleTag = document.createElement('style')
    styleTag.innerHTML = styles

    window.__PSZYSET__ = true

    // Auto-save feature
    var time = prompt("Please enter time(in minutes) after which you want auto-save to run", "5");
    time = Number(time);
    time = time*1000*60;
    var button = document.getElementById('btnSave');
    setInterval(function(){
        button.click();
    },time);
    
    // disable default sorting library
    const script = document.createElement('script')
    script.innerHTML = `$('#sortable_nav').sortable('destroy'); $('#sortable_nav').enableSelection();`
    document.head.appendChild(script)

    // add styles
    document.head.appendChild(styleTag)


    // add controls
    const controls = `
    <div id="__PSZY_CONTROLS__">
        <div id="__PSZY_MOVEUP__" title="Move 1 up">&uarr;</div>
        <div id="__PSZY_MOVEDOWN__" title="Move 1 down">&darr;</div>
        <div id="__PSZY_TOP__" title="Send to top">&uarr;&uarr;</div>
        <div id="__PSZY_BOTTOM__" title="Send to bottom">&darr;&darr;</div>
        <div id="__PSZY_SWAP__" title="Swap">Swap</div>
    </div>`

    const lis = $('#sortable_nav > li')
    lis.forEach(li => li.innerHTML += controls)

    document.addEventListener('click', checkPSZYClicks, false)

    function checkPSZYClicks(e) {
        switch (e.target.id) {
            case '__PSZY_MOVEUP__': moveup(e.target.parentNode.parentNode); break;
            case '__PSZY_MOVEDOWN__': movedown(e.target.parentNode.parentNode); break;
            case '__PSZY_TOP__': movetotop(e.target.parentNode.parentNode); break;
            case '__PSZY_BOTTOM__': movetobottom(e.target.parentNode.parentNode); break;
            case '__PSZY_SWAP__': moveswap(e.target.parentNode.parentNode); break;
        }
    }

    function moveswap(node) {
        const nextNodeNum = parseInt(prompt('Enter station# to swap with'), 10)
        const list = $('#sortable_nav li')

        debugger
        if (isNaN(nextNodeNum) || nextNodeNum < 1) {
            return alert('Enter a valid number')
        }

        if (list.length < nextNodeNum) {
            return alert('Not enough stations. Try a smaller number')
        }


        const otherNode = list[nextNodeNum - 1]

        debugger

        if (otherNode === node) {
            return alert('Same station')
        }

        if (otherNode.nextSibling !== node) {
            const nextNode = otherNode.nextSibling
            otherNode.parentNode.insertBefore(otherNode, node)
            node.parentNode.insertBefore(node, nextNode)
            glow(node, otherNode)
        } else {
            const nextNode = node.nextSibling
            node.parentNode.insertBefore(node, otherNode)
            otherNode.parentNode.insertBefore(otherNode, nextNode)
            glow(otherNode, node)
        }

        correctRanks()
    }

    function moveup(node) {
        const prevNode = node.previousSibling
        glow(prevNode, node)
        node.parentNode.insertBefore(node, prevNode)
        correctRanks()
    }

    function movedown(node) {
        const nextNode = node.nextSibling
        glow(nextNode, node)
        node.parentNode.insertBefore(nextNode, node)
        correctRanks()
    }

    function movetotop(node) {
        const prevNode = node.parentNode.querySelector('li:first-child')
        glow(node)
        node.parentNode.insertBefore(node, prevNode)
        correctRanks()
    }

    function movetobottom(node) {
        glow(node)
        node.parentNode.appendChild(node)
        correctRanks()
    }

    function glow(...nodes) {
        nodes.forEach(node => {
            node.classList.add('glow')
            setTimeout(() => {
                node.classList.remove('glow')
            }, 400)
        })
    }

    function correctRanks() {
        $('#sortable_nav > li').forEach((li, index) => {
            li.querySelector('.sortable-number span').innerText = index + 1
        })
    }
}