let qrcode = null;
let sizeQR = 436;
let colorDark = "#000000";
let colorLight = "#ffffff";

document
  .getElementById("generate-btn")
  .addEventListener("click", generateQRCode);
document.getElementById("type-qr-v1").addEventListener("click", generateQRCode);
document.getElementById("type-qr-v2").addEventListener("click", generateQRCode);

function generateQRCode() {
  const text = document.getElementById("text-input").value.trim();
  if (!text) {
    return;
  }
  // Xóa QR code cũ nếu có
  let qrcodeDiv = document.getElementById("qrcode");
  qrcodeDiv.innerHTML = "";
  // Tạo QR code mới
  let shouldEncode = document.getElementById("encode-checkbox").checked;
  let shouldRemoveEmptyChar = document.getElementById(
    "remove-empty-checkbox"
  ).checked;
  let simpleText = shouldRemoveEmptyChar
    ? text.replace(/(\r\n|\n|\r)/gm, "")
    : text;
  let usingQRLib1 = document.getElementById("type-qr-v1").checked;
  let textBuild = shouldEncode ? btoa(simpleText) : simpleText;
  if (usingQRLib1) {
    let segs = qrcodegen.QrSegment.makeSegments(textBuild);
    qrcode = qrcodegen.QrCode.encodeSegments(segs, qrcodegen.QrCode.Ecc.LOW);
    drawCanvas(qrcode, sizeQR, colorLight, colorDark, appendCanvas());
  } else {
    qrcode = new QRCode(qrcodeDiv, {
      text: textBuild,
      width: sizeQR,
      height: sizeQR,
      colorDark: colorDark,
      colorLight: colorLight,
      correctLevel: QRCode.CorrectLevel.H,
    });
  }
}
function drawCanvas(qr, sizeCanvas, lightColor, darkColor, canvas) {
  if (sizeCanvas <= 0) throw new RangeError("Value out of range");
  let sizeDot = sizeCanvas / qr.size;
  canvas.width = sizeCanvas;
  canvas.height = sizeCanvas;
  var ctx = canvas.getContext("2d");
  for (var y = 0; y < qr.size; y++) {
    for (var x = 0; x < qr.size; x++) {
      ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
      ctx.fillRect(x * sizeDot, y * sizeDot, sizeDot, sizeDot);
    }
  }
}
function appendCanvas() {
  var outputElem = document.getElementById("qrcode");
  var result = document.createElement("canvas");
  outputElem.appendChild(result);
  return result;
}
