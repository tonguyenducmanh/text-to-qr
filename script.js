let qrcode = null;
let sizeQR = 512;
document
  .getElementById("generate-btn")
  .addEventListener("click", generateQRCode);
document.getElementById("type-qr-v1").addEventListener("click", generateQRCode);
document.getElementById("type-qr-v2").addEventListener("click", generateQRCode);
document
  .getElementById("download-btn")
  .addEventListener("click", downloadQRCode);
function generateQRCode() {
  const text = document.getElementById("text-input").value.trim();
  if (!text) {
    alert("Vui lòng nhập văn bản để tạo mã QR!");
    return;
  }
  // Xóa QR code cũ nếu có
  let qrcodeDiv = document.getElementById("qrcode");
  qrcodeDiv.innerHTML = "";
  // Tạo QR code mới
  let simpleText = text.replace(/(\r\n|\n|\r)/gm, "");
  let shouldEncode = document.getElementById("encode-checkbox").checked;
  let usingQRV1 = document.getElementById("type-qr-v1").checked;
  let textBuild = shouldEncode ? btoa(simpleText) : simpleText;
  if (usingQRV1) {
    qrcode = new QRCode(qrcodeDiv, {
      text: textBuild,
      width: sizeQR,
      height: sizeQR,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  } else {
    let segs = qrcodegen.QrSegment.makeSegments(textBuild);
    qrcode = qrcodegen.QrCode.encodeSegments(segs, qrcodegen.QrCode.Ecc.LOW);
    drawCanvas(qrcode, 9, 4, "#ffffff", "#000000", appendCanvas());
  }

  // Hiện nút tải xuống
  document.getElementById("download-section").style.display = "block";
}
function drawCanvas(qr, scale, border, lightColor, darkColor, canvas) {
  if (scale <= 0 || border < 0) throw new RangeError("Value out of range");
  var width = (qr.size + border * 2) * scale;
  canvas.width = width;
  canvas.height = width;
  var ctx = canvas.getContext("2d");
  for (var y = -border; y < qr.size + border; y++) {
    for (var x = -border; x < qr.size + border; x++) {
      ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
      ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
    }
  }
}
function appendCanvas() {
  var outputElem = document.getElementById("qrcode");
  var result = document.createElement("canvas");
  outputElem.appendChild(result);
  return result;
}

function downloadQRCode() {
  if (!qrcode) {
    alert("Vui lòng tạo mã QR trước khi tải xuống!");
    return;
  }
  // Lấy ảnh QR code
  const img = document.querySelector("#qrcode img");
  if (!img) {
    alert("Không tìm thấy mã QR!");
    return;
  }
  // Tạo link tải xuống
  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = img.src;
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
