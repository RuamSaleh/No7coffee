document.addEventListener("DOMContentLoaded", async () => {
    // توليد المفتاحين العام والخاص
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );

    // تصدير المفتاح العام للاستخدام في التشفير
    const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);

    // فك التشفير سيكون باستخدام المفتاح الخاص
    const privateKey = keyPair.privateKey;

    // عند إرسال النموذج
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // منع إعادة تحميل الصفحة

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // تحويل بيانات تسجيل الدخول إلى نص مشفر باستخدام المفتاح العام
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify({ username, password }));

        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP",
            },
            keyPair.publicKey,
            data
        );

        // عرض البيانات المشفرة في المتصفح (محاكاة إرسالها للخادم)
        const responseDiv = document.getElementById("response");
        responseDiv.innerHTML = `
            <p><strong>Encrypted Data:</strong></p>
            <textarea rows="5" cols="50">${new Uint8Array(encryptedData)}</textarea>
        `;

        // محاكاة فك التشفير على الخادم باستخدام المفتاح الخاص
        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
            },
            privateKey,
            encryptedData
        );

        const decoder = new TextDecoder();
        const originalData = decoder.decode(decryptedData);

        responseDiv.innerHTML += `
            <p><strong>Decrypted Data (on server):</strong></p>
            <textarea rows="5" cols="50">${originalData}</textarea>
        `;
    });
});