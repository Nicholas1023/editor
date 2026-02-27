let template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <!-- Add body content here -->
  </body>
</html>`;

let dirty = false;
let shareURL = "";
let codeBase64 = "";

document.getElementById("code").value = template;

document.getElementById("fileSelect").addEventListener("change", function(e) {
    dirty = false;
    list = e.target
    file = e.target.files[0];
    const read = new FileReader();
    read.onload = function(f) {
        let filecontent = f.target.result;
        document.getElementById("code").value = filecontent;
    };
    read.readAsText(file);
    list.value = "";
});

function saveFile() {
    dirty = false;
    let download = URL.createObjectURL(new Blob([document.getElementById("code").value], { type: "text/html" }));
    const file = document.createElement("a")
    file.style.display = "none";
    file.href = download;
    file.id = "fileDownload";
    file.download = "index.html";
    document.getElementById("edit").appendChild(file);
    document.getElementById("fileDownload").click();
    document.getElementById("edit").removeChild(file);
    URL.revokeObjectURL(download);
};

function render() {
    let display = URL.createObjectURL(new Blob([document.getElementById("code").value], { type: "text/html" }));
    document.getElementById("renderer").src = display;
    URL.revokeObjectURL(display);
};

function check(buttonInput, action) {
    if (buttonInput == true && action == "clear") {
        document.getElementById("code").value = "";
        render();
    } else if (buttonInput == true && action == "template") {
        document.getElementById("code").value = template;
        render();
    };
    document.getElementById("clear").style.display = "none";
    document.getElementById("template").style.display = "none";
}

document.getElementById("code").addEventListener("keydown", function(e) {
    if (e.key == "Tab") {
        e.preventDefault();
        const start = this.selectionStart;
        tab = "  ";
        this.value = this.value.substring(0, start) + tab + this.value.substring(this.selectionEnd);
        this.selectionStart, this.selectionEnd = start + 2;
    };
});

document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.key == "s") {
        e.preventDefault();
        saveFile();
    } else if (e.ctrlKey && e.key == "o") {
        e.preventDefault();
        document.getElementById('fileSelect').click();
    } else if (e.ctrlKey && e.key == "h") {
        e.preventDefault();
        render();
    };
});

if (navigator.userAgent) {
    document.getElementById("userAgent").textContent = `User agent: ${navigator.userAgent}`;
} else {
    document.getElementById("userAgent").textContent = "User agent data not available.";
};

window.addEventListener("beforeunload", function(e) {
    if (dirty) {
        e.preventDefault();
        e.returnValue = "";
    }
});

document.getElementById("code").addEventListener("input", function(e) {
    dirty = true;
});

function generateShareURL() {
    const encoder = new TextEncoder("UTF-8");
    let codeBase64 = btoa(String.fromCharCode(...encoder.encode(document.getElementById("code").value))).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
    shareURL = `https://editor.nicholaslim.me/share/?code=${codeBase64}`;
    document.getElementById("copy").textContent = "Copy full URL";
    document.getElementById("copy").onclick = copyURL;
    document.getElementById("generate").textContent = "Generate embed code";
    document.getElementById("generate").onclick = embed;
    document.getElementById("shareContent").innerHTML = `Sharing URL: <code>https://editor.nicholaslim.me/share/?code=${codeBase64.slice(0, 15)}...</code>`;
    document.getElementById("copiedMessage").style.display = "none";
    document.getElementById("share").style.display = "flex";
};

function copyURL() {
    navigator.clipboard.writeText(shareURL);
    document.getElementById("copiedMessage").style.display = "block";
};

function copyHTML() {
    navigator.clipboard.writeText(`<iframe src="${shareURL}" width="649" height="350"></iframe>`);
    document.getElementById("copiedMessage").style.display = "block";
};

function embed() {
    document.getElementById("shareContent").innerHTML = `Embed code: <code>&lt;iframe src="https://editor.nicholaslim.me/share/..." width="649" height="350"&gt;&lt;/iframe&gt;</code>`;
    document.getElementById("copy").textContent = "Copy full code";
    document.getElementById("copy").onclick = copyHTML;
    document.getElementById("generate").textContent = "Generate sharing URL";
    document.getElementById("generate").onclick = generateShareURL;
    document.getElementById("copiedMessage").style.display = "none";
};
