/**
 * Tạo QR code từ text
 */
function generateQRCode() {
  let qrcode = null;
  let sizeQR = 436;
  let colorDark = "#000000";
  let colorLight = "#ffffff";
  let qrcodeDiv = document.getElementById("qrcode");
  let qrcodegenLibElement = document.getElementById("qrcodegen-lib");

  // Lấy giá trị từ các input
  let text = getUserInput();
  if (!text) {
    return;
  }

  let textBuild = buildTextBeforeGenQR(qrcodeDiv, text);

  // kiểm tra check box có sử dụng thư viện qrcodegen hay không
  let usingQRCodeGenLib = qrcodegenLibElement.checked;
  // Nếu có thì sử dụng thư viện qrcodegen.js
  if (usingQRCodeGenLib) {
    generateQRCodeGenJS(textBuild, qrcode, sizeQR, colorLight, colorDark);
  } else {
    // Nếu không thì sử dụng thư viện qrcode.js
    generateQRCodeJS(qrcodeDiv, textBuild, sizeQR, colorLight, colorDark);
  }

  // thêm css
  qrcodeDiv.classList.add("qrcode-box");
}

/**
 * Tiền xử lý text trước khi tạo QR code
 */
function buildTextBeforeGenQR(qrcodeDiv, text) {
  let encodeElement = document.getElementById("encode-checkbox");
  let removeEmptyElement = document.getElementById("remove-empty-checkbox");

  // Xóa QR code cũ nếu có
  if (qrcodeDiv) {
    qrcodeDiv.innerHTML = "";
  }

  // kiểm tra check box có mã hóa ký tự hay không
  // Nếu có thì mã hóa text thành base64
  let shouldEncode = encodeElement ? encodeElement.checked : false;

  // kiểm tra check box có xóa ký tự trắng hay không
  let shouldRemoveEmptyChar = removeEmptyElement
    ? removeEmptyElement.checked
    : false;

  // Nếu có thì xóa ký tự trắng trong text
  let simpleText = shouldRemoveEmptyChar
    ? text.replace(/(\r\n|\n|\r)/gm, "")
    : text;

  // Nếu có thì mã hóa text thành base64
  let textBuild = shouldEncode ? btoa(simpleText) : simpleText;
  return textBuild;
}

/**
 * lấy giá trị từ input text
 * @returns {string} giá trị text từ input
 */
function getUserInput() {
  let inputElement = document.getElementById("text-input");
  let text = inputElement ? inputElement.value.trim() : null;
  return text;
}

/**
 * Tạo QR code bằng thư viện qrcodegen.js
 */
function generateQRCodeGenJS(textBuild, qrcode, sizeQR, colorLight, colorDark) {
  let segs = qrcodegen.QrSegment.makeSegments(textBuild);
  qrcode = qrcodegen.QrCode.encodeSegments(segs, qrcodegen.QrCode.Ecc.LOW);
  drawCanvasLib1(qrcode, sizeQR, colorLight, colorDark, appendCanvas());
}

/**
 * Tạo QR code bằng thư viện qrcode.js
 */
function generateQRCodeJS(qrcodeDiv, textBuild, sizeQR, colorLight, colorDark) {
  qrcode = new QRCode(qrcodeDiv, {
    text: textBuild,
    width: sizeQR,
    height: sizeQR,
    colorDark: colorDark,
    colorLight: colorLight,
    correctLevel: QRCode.CorrectLevel.H,
  });
}

/**
 * Vẽ QR code lên canvas dành cho library qrcodegen
 */
function drawCanvasLib1(qr, sizeCanvas, lightColor, darkColor, canvas) {
  if (sizeCanvas <= 0) throw new RangeError("Value out of range");
  let sizeDot = sizeCanvas / qr.size;
  canvas.width = sizeCanvas;
  canvas.height = sizeCanvas;
  let ctx = canvas.getContext("2d");
  for (let y = 0; y < qr.size; y++) {
    for (var x = 0; x < qr.size; x++) {
      ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
      ctx.fillRect(x * sizeDot, y * sizeDot, sizeDot, sizeDot);
    }
  }
}

/**
 * Tạo canvas mới và thêm vào DOM
 * @returns {HTMLCanvasElement} canvas mới tạo
 */
function appendCanvas() {
  let outputElem = document.getElementById("qrcode");
  let result = document.createElement("canvas");
  outputElem.appendChild(result);
  return result;
}

/**
 * Thêm sự kiện cho các nút
 * - Nút "Generate QR Code"
 */
function addEvent() {
  document
    .getElementById("generate-btn")
    .addEventListener("click", generateQRCode);
  document
    .getElementById("qrcodegen-lib")
    .addEventListener("click", generateQRCode);
  document
    .getElementById("qrcode-lib")
    .addEventListener("click", generateQRCode);
}

addEvent();
