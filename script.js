let qrcode = null;
document
  .getElementById("generate-btn")
  .addEventListener("click", generateQRCode);
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
  const qrcodeDiv = document.getElementById("qrcode");
  qrcodeDiv.innerHTML = "";
  // Tạo QR code mới
  let simpleText = text.replace(/(\r\n|\n|\r)/gm, "");
  const shouldEncode = document.getElementById("encode-checkbox").checked;
  qrcode = new QRCode(qrcodeDiv, {
    text: shouldEncode ? btoa(simpleText) : simpleText,
    width: 512,
    height: 512,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
  // Hiện nút tải xuống
  document.getElementById("download-section").style.display = "block";
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
