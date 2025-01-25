// إنشاء المفاتيح العامة والخاصة عند تحميل الصفحة
let publicKey, privateKey;

async function generateKeys() {
    const keyPair = await window.crypto.subtle.generateKeyPair(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: "SHA-256" }
        },
        true,
        ["encrypt", "decrypt"]
    );

    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;
    console.log("Public and private keys generated.");
}

generateKeys();

// دالة لتشفير البيانات
async function encryptData(data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey,
        encodedData
    );

    return btoa(String.fromCharCode(...new Uint8Array(encryptedData))); // تحويل البيانات إلى Base64
}

// دالة لفك تشفير البيانات
async function decryptData(encryptedData) {
    const decodedData = atob(encryptedData);
    const buffer = new Uint8Array(decodedData.split("").map(char => char.charCodeAt(0)));

    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: "RSA-OAEP",
        },
        privateKey,
        buffer
    );

    return new TextDecoder().decode(decryptedData); // تحويل البيانات إلى نص
}

// حدث عند تسجيل الدخول
document.getElementById('signinForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // تشفير البيانات
    const encryptedEmail = await encryptData(email);
    const encryptedPassword = await encryptData(password);

    console.log("Encrypted Email:", encryptedEmail);
    console.log("Encrypted Password:", encryptedPassword);

    // فك تشفير البيانات (للتجربة فقط)
    const decryptedEmail = await decryptData(encryptedEmail);
    const decryptedPassword = await decryptData(encryptedPassword);

    console.log("Decrypted Email:", decryptedEmail);
    console.log("Decrypted Password:", decryptedPassword);

    // التحقق من صحة البيانات المشفرة
    if (decryptedEmail === "test@example.com" && decryptedPassword === "123456") {
        alert('تم تسجيل الدخول بنجاح!');
        window.location.href = "mine_page.html"; // الانتقال إلى الصفحة المطلوبة
    } else {
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
});
