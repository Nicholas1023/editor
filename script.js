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
})