function createSeededRNG(seed) {
    let t = seed >>> 0;
    return function () {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), t | 1);
        r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

function randomChar(rng) {
    const code = Math.floor(rng() * (126 - 32 + 1)) + 32;
    return String.fromCharCode(code);
}

function getMaxVisibleChars() {
    const charWidth = 8;
    const charHeight = 17;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const cols = Math.floor(screenWidth / charWidth);
    const rows = Math.floor(screenHeight / charHeight);

    return { total: cols * rows, cols };
}

const { total: limitchars, cols } = getMaxVisibleChars();

function search(target, startseed) {
    let seed = startseed;
    while (true) {
        const rng = createSeededRNG(seed);
        let book = "";

        for (let i = 0; i < limitchars; i++) {
            book += randomChar(rng);
            if ((i + 1) % cols === 0) book += "\n";
        }

        if (book.includes(target)) {
            console.log(`${seed} => ${book}`);
            console.log(`✓ Found book with seed ${seed} that contains "${target}"`);

            const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedTarget, 'g');

            const highlightedBook = book.replace(regex, `<span style="color:red">${target}</span>`);

            const div = document.createElement("div");
            div.style.whiteSpace = "pre";
            div.style.fontFamily = "monospace";
            div.innerHTML = highlightedBook;

            document.body.innerHTML = "";
            document.body.appendChild(div);
            return seed;
        }

        seed++;
    }
}

const target = prompt("Target: ");
const now = new Date();
const foundSeed = search(target, now.getMilliseconds());
alert(`Seed: ${foundSeed}`);
