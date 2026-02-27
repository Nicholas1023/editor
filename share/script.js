function render() {
    let display = URL.createObjectURL(new Blob([document.getElementById("code").value], { type: "text/html" }));
    document.getElementById("renderer").src = display;
    URL.revokeObjectURL(display);
};

const query = new URLSearchParams(window.location.search);
let code = Uint8Array.fromBase64(query.get("code").replaceAll("-", "+").replaceAll("_", "/"));
const decoder = new TextDecoder("UTF-8");
document.getElementById("code").value = decoder.decode(code);
render();
